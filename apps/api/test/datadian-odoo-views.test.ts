// DataDian, subetapas 2.8 y 2.9 (ARQUITECTURA_DB_DATADIAN.md §7.7, §7.8, §8.2, §9.4 y §10.2): vínculo con
// Odoo, privilegios de Telco sobre audit_logs, vistas security_invoker y permisos (migraciones 0016 y 0017).
import { randomUUID } from 'node:crypto';
import { SYSTEM_ACTOR_TELCO } from '@telcobras/contracts';
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
const asB: TenantScope = { orgId: randomUUID(), userId: randomUUID() };
const secret = JSON.stringify({ v: 1, key: 'a2V5', data: 'ZGF0YQ==' });
const docs: string[] = [];

beforeAll(async () => {
  await createOrganization(app, asA);
  await createOrganization(app, asB);
  await run(
    app,
    asA,
    sql`insert into app.odoo_connections (organization_id, base_url, database, api_key, updated_by)
        values (${asA.orgId}, 'https://odoo.example.co', 'telcobras', ${secret}::jsonb, ${asA.userId})`,
  );
  const [batch] = await run<{ id: string }>(
    app,
    asA,
    sql`insert into app.received_document_imports (organization_id, file_name, file_sha256, total_rows,
          created_count, existing_count, rejected_count, imported_by)
        values (${asA.orgId}, 'lote', ${'0'.repeat(64)}, 3, 3, 0, 0, ${asA.userId}) returning id`,
  );
  for (const moveId of [101, 102, null]) {
    const [doc] = await run<{ id: string }>(
      app,
      asA,
      sql`insert into app.received_documents (organization_id, import_id, cufe, odoo_move_id)
          values (${asA.orgId}, ${batch?.id}, ${randomCufe()}, ${moveId}) returning id`,
    );
    docs.push(doc?.id ?? '');
  }
});

afterAll(async () => {
  await dropOrganizations(owner, [asA.orgId, asB.orgId]);
  await Promise.all([app.$client.end(), worker.$client.end(), owner.$client.end()]);
});

describe('odoo_document_links (2.8)', () => {
  it('la copia de la 0016 crea un vínculo por cada factura con odoo_move_id', async () => {
    await expectReversible(
      owner,
      '0016_datadian_odoo_links',
      ['odoo_document_links'],
      undefined,
      async (client) => {
        await client.query(`select set_config('app.org_id', $1, true)`, [asA.orgId]);
        const { rows } = await client.query(
          `select move_id, state, odoo_database from app.odoo_document_links order by move_id`,
        );
        expect(rows).toEqual([
          { move_id: 101, state: 'created', odoo_database: 'telcobras' },
          { move_id: 102, state: 'created', odoo_database: 'telcobras' },
        ]);
      },
    );
  });

  it('dos vínculos para la misma factura y la misma base de Odoo fallan', async () => {
    const insert = () =>
      run(
        worker,
        asA,
        sql`insert into app.odoo_document_links (organization_id, received_document_id, odoo_base_url,
              odoo_database, state)
            values (${asA.orgId}, ${docs[2]}, 'https://odoo.example.co', 'otra', 'pending')`,
      );
    await insert();
    expect(await pgErrorOf(insert())).toMatchObject({ code: '23505' });
    expect(
      await pgErrorOf(
        run(
          app,
          asA,
          sql`update app.odoo_document_links set state = 'failed' where organization_id = ${asA.orgId}`,
        ),
      ),
    ).toMatchObject({ code: '42501' });
  });

  it('app_worker inserta en audit_logs dentro de withTenant y no puede actualizarlos ni borrarlos', async () => {
    const [row] = await run<{ id: string }>(
      worker,
      asA,
      sql`insert into app.audit_logs (organization_id, actor_user_id, action, resource_type, result, metadata)
          values (${asA.orgId}, ${SYSTEM_ACTOR_TELCO}, 'datadian.sync.finish', 'dian_sync_run', 'success',
                  '{"actor": "telco"}') returning id`,
    );
    expect(row?.id).toBeDefined();
    for (const query of [
      sql`update app.audit_logs set action = 'x' where id = ${row?.id}`,
      sql`delete from app.audit_logs where id = ${row?.id}`,
    ]) {
      expect(await pgErrorOf(run(worker, asA, query))).toMatchObject({ code: '42501' });
    }
    // Fuera de su organización, la política de audit_logs lo frena.
    expect(
      await pgErrorOf(
        run(
          worker,
          asB,
          sql`insert into app.audit_logs (organization_id, actor_user_id, action, resource_type, result)
              values (${asA.orgId}, ${SYSTEM_ACTOR_TELCO}, 'datadian.sync.finish', 'dian_sync_run', 'success')`,
        ),
      ),
    ).toMatchObject({ code: '42501' });
  });
});

describe('vistas security_invoker (2.9)', () => {
  it('devuelven solo filas de la organización activa y 0 filas sin contexto', async () => {
    for (const view of ['received_documents_radian', 'dian_certificate_status']) {
      const relation = sql`${sql.identifier('app')}.${sql.identifier(view)}`;
      const own = await run<{ org: string }>(
        app,
        asA,
        sql`select organization_id::text as org from ${relation}`,
      );
      expect(
        own.every((row) => row.org === asA.orgId),
        view,
      ).toBe(true);
      expect(
        await run(app, asB, sql`select 1 from ${relation} where organization_id = ${asA.orgId}`),
      ).toEqual([]);
      expect((await app.execute(sql`select 1 from ${relation}`)).rows, view).toEqual([]);
    }
    expect(await run(app, asA, sql`select id from app.received_documents_radian`)).toHaveLength(3);
  });

  it('deadline_state pasa de open a due_soon y a expired al mover el plazo frente al reloj', async () => {
    const syncRun = await insertSyncRun(worker, asA);
    const file = await insertFile(worker, asA);
    const [doc] = await run<{ id: string }>(
      worker,
      asA,
      sql`insert into app.received_documents (organization_id, sync_run_id, ingestion_source, cufe,
            attached_document_file_id, validation_status, payment_form)
          values (${asA.orgId}, ${syncRun}, 'imap', ${randomCufe()}, ${file}, 'valid', '2') returning id`,
    );
    // La caché la escriben los disparadores; la prueba la fija como app_owner.
    const states: string[] = [];
    for (const offset of ['3 days', '2 hours', '-1 hour']) {
      await run(
        owner,
        asA,
        sql`update app.received_documents set radian_status = 'goods_received',
              claim_deadline_at = now() + ${offset}::interval where id = ${doc?.id}`,
      );
      const [row] = await run<{ deadline_state: string; events_expected: boolean }>(
        app,
        asA,
        sql`select deadline_state, events_expected from app.received_documents_radian where id = ${doc?.id}`,
      );
      states.push(row?.deadline_state ?? '');
      expect(row?.events_expected).toBe(true);
    }
    expect(states).toEqual(['open', 'due_soon', 'expired']);
  });

  it('un certificado a 89 días sale due_soon y uno a 91, ok', async () => {
    const states: Record<string, string> = {};
    for (const days of [89, 91, -1]) {
      const [cert] = await run<{ id: string }>(
        app,
        asA,
        sql`insert into app.dian_certificates (organization_id, storage_key, pfx_data_key, pfx_sha256,
              pfx_size_bytes, password, uploaded_by)
            values (${asA.orgId}, ${`pfx/${randomUUID()}`}, '"a2V5"', ${randomUUID().replaceAll('-', '').repeat(2)},
                    100, ${secret}::jsonb, ${asA.userId}) returning id`,
      );
      await run(
        worker,
        asA,
        sql`update app.dian_certificates set status = 'valid', serial_number = '1', subject_nit = '900000000',
              not_before = now() - interval '1 year', not_after = now() + ${`${days} days`}::interval
              + interval '1 hour', key_usage_ok = true, chain_ok = true where id = ${cert?.id}`,
      );
      const [row] = await run<{ expiry_state: string }>(
        app,
        asA,
        sql`select expiry_state from app.dian_certificate_status where id = ${cert?.id}`,
      );
      states[days] = row?.expiry_state ?? '';
    }
    expect(states).toEqual({ '89': 'due_soon', '91': 'ok', '-1': 'expired' });
  });
});

describe('permisos de DataDian (2.9)', () => {
  it('documents:events y documents:sync están en el catálogo', async () => {
    const { rows } = await app.execute<{ key: string }>(
      sql`select key from app.permissions where key in ('documents:events', 'documents:sync') order by key`,
    );
    expect(rows.map((row) => row.key)).toEqual(['documents:events', 'documents:sync']);
  });

  it('el reverso de la 0017 se aplica y la 0017 se vuelve a aplicar', async () => {
    await expectReversible(owner, '0017_datadian_views_permissions', [
      'received_documents_radian',
      'dian_certificate_status',
    ]);
  });
});
