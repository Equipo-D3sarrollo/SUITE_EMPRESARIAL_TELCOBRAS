// DataDian, subetapa 2.5 (ARQUITECTURA_DB_DATADIAN.md §4, §5.6, §5.7 y §10.2): received_documents
// evolucionada, inmutabilidad de los datos de origen y received_document_taxes (migración 0013).
import { randomUUID } from 'node:crypto';
import { DATADIAN_SQLSTATE } from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { TenantScope } from '../src/database/tenant.js';
import {
  appDatabase,
  createOrganization,
  dropOrganizations,
  ownerDatabase,
  pgErrorOf,
  workerDatabase,
} from './support/database.js';
import {
  expectReversible,
  insertFile,
  insertSyncRun,
  randomCufe,
  run,
} from './support/datadian.js';

const app = appDatabase(1);
const worker = workerDatabase(1);
const owner = ownerDatabase();
const asA: TenantScope = { orgId: randomUUID(), userId: randomUUID() };
let syncRun = '';

beforeAll(async () => {
  await createOrganization(app, asA);
  syncRun = await insertSyncRun(app, asA);
});

afterAll(async () => {
  await dropOrganizations(owner, [asA.orgId]);
  await Promise.all([app.$client.end(), worker.$client.end(), owner.$client.end()]);
});

/** Telco registra una factura del listado (sin XML) y devuelve su id. */
async function ingest(): Promise<string> {
  const [row] = await run<{ id: string }>(
    worker,
    asA,
    sql`insert into app.received_documents
          (organization_id, sync_run_id, ingestion_source, cufe, issuer_nit, total, folio)
        values (${asA.orgId}, ${syncRun}, 'rpa', ${randomCufe()}, '900123456', 100.00, 'F-1')
        returning id`,
  );
  return row?.id ?? '';
}

describe('facturas con lote legado o sincronización (2.5)', () => {
  it('una factura nueva queda con las columnas nuevas en sus valores iniciales', async () => {
    const id = await ingest();
    const [row] = await run(
      app,
      asA,
      sql`select ingestion_source, validation_status, radian_status from app.received_documents
          where id = ${id}`,
    );
    expect(row).toEqual({
      ingestion_source: 'rpa',
      validation_status: 'pending_xml',
      radian_status: 'none',
    });
  });

  it('sin import_id ni sync_run_id, o con los dos, falla', async () => {
    const [batch] = await run<{ id: string }>(
      app,
      asA,
      sql`insert into app.received_document_imports (organization_id, file_name, file_sha256, total_rows,
            created_count, existing_count, rejected_count, imported_by)
          values (${asA.orgId}, 'lote', ${'0'.repeat(64)}, 1, 1, 0, 0, ${asA.userId}) returning id`,
    );
    // El lote legado entra con el default 'manual' y no puede declarar otra fuente.
    await run(
      app,
      asA,
      sql`insert into app.received_documents (organization_id, import_id, cufe)
          values (${asA.orgId}, ${batch?.id}, ${randomCufe()})`,
    );
    for (const [importId, syncRunId] of [
      [null, null],
      [batch?.id, syncRun],
    ]) {
      const error = await pgErrorOf(
        run(
          worker,
          asA,
          sql`insert into app.received_documents (organization_id, import_id, sync_run_id, cufe)
              values (${asA.orgId}, ${importId ?? null}::uuid, ${syncRunId ?? null}::uuid, ${randomCufe()})`,
        ),
      );
      expect(error).toMatchObject({
        code: '23514',
        message: expect.stringMatching(/received_documents_origin_check/),
      });
    }
  });
});

describe('inmutabilidad de los datos de origen (2.5)', () => {
  it('sin XML se corrigen; al adjuntar el XML los valores cambiados quedan en pre_xml_snapshot', async () => {
    const id = await ingest();
    await run(worker, asA, sql`update app.received_documents set total = 120.00 where id = ${id}`);
    const file = await insertFile(worker, asA);
    await run(
      worker,
      asA,
      sql`update app.received_documents set attached_document_file_id = ${file}, total = 150.00,
            folio = 'F-1', buyer_nit = '800111222', validation_status = 'valid'
          where id = ${id}`,
    );
    const [row] = await run<{ snapshot: unknown }>(
      app,
      asA,
      sql`select pre_xml_snapshot as snapshot from app.received_documents where id = ${id}`,
    );
    // buyer_nit era nulo y folio no cambió: solo queda el total del listado.
    expect(row?.snapshot).toEqual({ total: 120 });
  });

  it('con XML, cambiar total, issuer_nit o el XML falla con DD005, también como app_owner', async () => {
    const id = await ingest();
    const file = await insertFile(worker, asA);
    await run(
      worker,
      asA,
      sql`update app.received_documents set attached_document_file_id = ${file} where id = ${id}`,
    );
    const other = await insertFile(worker, asA);
    for (const change of [
      sql`total = 1`,
      sql`issuer_nit = '900999999'`,
      sql`attached_document_file_id = ${other}`,
    ]) {
      const query = sql`update app.received_documents set ${change} where id = ${id}`;
      for (const db of [worker, owner]) {
        expect(await pgErrorOf(run(db, asA, query))).toMatchObject({
          code: DATADIAN_SQLSTATE.immutableData,
        });
      }
    }
  });

  it('cambiar el CUFE falla y DELETE falla para todos', async () => {
    const id = await ingest();
    expect(
      await pgErrorOf(
        run(
          owner,
          asA,
          sql`update app.received_documents set cufe = ${randomCufe()} where id = ${id}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.immutableData });
    const remove = sql`delete from app.received_documents where id = ${id}`;
    for (const db of [app, worker]) {
      expect(await pgErrorOf(run(db, asA, remove))).toMatchObject({ code: '42501' });
    }
    await run(owner, asA, remove);
    expect(
      await run(app, asA, sql`select id from app.received_documents where id = ${id}`),
    ).toHaveLength(1);
  });

  it('app_user no puede escribir radian_status ni claim_deadline_at', async () => {
    const id = await ingest();
    for (const change of [sql`radian_status = 'claimed'`, sql`claim_deadline_at = now()`]) {
      expect(
        await pgErrorOf(
          run(app, asA, sql`update app.received_documents set ${change} where id = ${id}`),
        ),
      ).toMatchObject({ code: '42501' });
    }
  });
});

describe('received_document_taxes (2.5)', () => {
  it('Telco inserta, app_user solo lee y el mismo impuesto dos veces falla', async () => {
    const id = await ingest();
    const insert = (db: typeof app) =>
      run(
        db,
        asA,
        sql`insert into app.received_document_taxes (organization_id, received_document_id, tax_scheme_id,
              percent, taxable_amount, tax_amount, is_withholding)
            values (${asA.orgId}, ${id}, '01', 19, 100.00, 19.00, false)`,
      );
    await insert(worker);
    expect(await pgErrorOf(insert(worker))).toMatchObject({ code: '23505' });
    expect(await pgErrorOf(insert(app))).toMatchObject({ code: '42501' });
    expect(
      await run(
        app,
        asA,
        sql`select tax_amount from app.received_document_taxes where received_document_id = ${id}`,
      ),
    ).toEqual([{ tax_amount: '19.00' }]);
  });
});

describe('reverso de la 0013 (§10.1)', () => {
  it('se aplica y la 0013 se vuelve a aplicar', async () => {
    // El reverso restaura import_id NOT NULL: dentro de la transacción (que se deshace) se quitan antes las
    // facturas que entraron por una sincronización.
    await expectReversible(
      owner,
      '0013_datadian_received_documents_v2',
      ['received_document_taxes'],
      `alter table app.received_document_taxes no force row level security;
       delete from app.received_document_taxes;
       alter table app.received_documents no force row level security;
       delete from app.received_documents where import_id is null;`,
    );
  });
});
