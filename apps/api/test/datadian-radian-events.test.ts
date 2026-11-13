// DataDian, subetapa 2.6 (ARQUITECTURA_DB_DATADIAN.md §6, §7.1 a §7.4 y §10.2): eventos RADIAN, secuencia,
// estados, caché de la factura y vencimiento del plazo (migración 0014). Versión reducida de la prueba de
// concurrencia (3 repeticiones en lugar de 50), por decisión del usuario del 13-nov-2026.
import { randomUUID } from 'node:crypto';
import { DATADIAN_SQLSTATE } from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Database } from '../src/database/database.js';
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
const app2 = appDatabase(1);
const worker = workerDatabase(1);
const worker2 = workerDatabase(1);
const owner = ownerDatabase();
const asA: TenantScope = { orgId: randomUUID(), userId: randomUUID() };
let syncRun = '';

beforeAll(async () => {
  await createOrganization(app, asA);
  syncRun = await insertSyncRun(app, asA);
  await run(
    app,
    asA,
    sql`insert into app.dian_settings (organization_id, nit, environment, updated_by)
        values (${asA.orgId}, ${String(Date.now()).slice(-10)}, '2', ${asA.userId})`,
  );
});

afterAll(async () => {
  await dropOrganizations(owner, [asA.orgId]);
  await Promise.all([app, app2, worker, worker2, owner].map((db) => db.$client.end()));
});

/** Factura con XML válido, lista para eventos. */
async function invoice(): Promise<string> {
  const file = await insertFile(worker, asA);
  const [row] = await run<{ id: string }>(
    worker,
    asA,
    sql`insert into app.received_documents (organization_id, sync_run_id, ingestion_source, cufe,
          attached_document_file_id, validation_status)
        values (${asA.orgId}, ${syncRun}, 'rpa', ${randomCufe()}, ${file}, 'valid') returning id`,
  );
  return row?.id ?? '';
}

/** Pide un evento como app_user (o con otra conexión) y devuelve su id. */
async function request(doc: string, code: string, db: Database = app): Promise<string> {
  const [row] = await run<{ id: string }>(
    db,
    asA,
    sql`insert into app.radian_events (organization_id, received_document_id, event_code, actor, origin,
          environment, claim_code, idempotency_key, requested_by)
        values (${asA.orgId}, ${doc}, ${code}, 'buyer', 'suite', '2', ${code === '031' ? '02' : null},
                ${randomUUID()}, ${asA.userId})
        returning id`,
  );
  return row?.id ?? '';
}

/** Telco registra la aceptación de la DIAN. */
const accept = (id: string, at: string, db: Database = worker) =>
  run(
    db,
    asA,
    sql`update app.radian_events set status = 'accepted', cude = ${randomCufe()},
          generated_at = ${at}::timestamptz, dian_registered_at = ${at}::timestamptz
        where id = ${id}`,
  );

/** Telco registra un evento observado en la DIAN (origin = 'dian'), ya aceptado. */
async function observe(doc: string, code: string, at = '2026-11-10T10:00:00-05:00') {
  const cude = randomCufe();
  await run(
    worker,
    asA,
    sql`insert into app.radian_events (organization_id, received_document_id, event_code, actor, origin,
          environment, status, cude, generated_at, dian_registered_at, idempotency_key)
        values (${asA.orgId}, ${doc}, ${code}, ${code === '034' ? 'issuer' : 'buyer'}, 'dian', '2',
                'accepted', ${cude}, ${at}::timestamptz, ${at}::timestamptz, ${`dian:${cude}`})`,
  );
}

// Tabla de §6.1, escrita aparte de la semilla de la migración.
const RULES: Record<string, { requires: string[]; blockedBy: string[] }> = {
  '030': { requires: [], blockedBy: [] },
  '031': { requires: ['032'], blockedBy: ['033', '034'] },
  '032': { requires: ['030'], blockedBy: [] },
  '033': { requires: ['032'], blockedBy: ['031', '034'] },
};
const TERMINAL = ['031', '033', '034'];

function expected(code: string, accepted: string[]): string {
  const rule = RULES[code];
  if (!rule) throw new Error(code);
  if (rule.blockedBy.some((c) => accepted.includes(c))) return DATADIAN_SQLSTATE.eventBlocked;
  if (accepted.some((c) => TERMINAL.includes(c))) return DATADIAN_SQLSTATE.invoiceTerminal;
  if (!rule.requires.every((c) => accepted.includes(c)))
    return DATADIAN_SQLSTATE.eventOutOfSequence;
  if (accepted.includes(code)) return '23505'; // un solo evento vivo por código (§7.2)
  return 'ok';
}

describe('secuencia de eventos (2.6)', () => {
  it('matriz: cada código contra cada combinación de eventos aceptados coincide con §6.1', async () => {
    const combinations = [
      [],
      ['030'],
      ['030', '032'],
      ['030', '032', '031'],
      ['030', '032', '033'],
      ['030', '032', '034'],
    ];
    for (const accepted of combinations) {
      const doc = await invoice();
      for (const code of accepted) await observe(doc, code);
      for (const code of Object.keys(RULES)) {
        const result = await request(doc, code).then(
          () => 'ok',
          (error: { cause?: { code?: string } }) => error.cause?.code ?? 'unknown',
        );
        expect(result, `${code} con [${accepted.join(', ')}]`).toBe(expected(code, accepted));
      }
    }
    // Recorre todas las combinaciones contra la BD: ~5 s en local, más bajo carga.
  }, 30_000);

  it('dos 030 pending para la misma factura fallan por la clave única', async () => {
    const doc = await invoice();
    await request(doc, '030');
    expect(await pgErrorOf(request(doc, '030'))).toMatchObject({
      code: '23505',
      message: expect.stringMatching(/radian_events_one_live_per_code/),
    });
  });

  it('sin XML válido falla con DD007; un evento observado se registra aunque rompa la secuencia', async () => {
    const [doc] = await run<{ id: string }>(
      worker,
      asA,
      sql`insert into app.received_documents (organization_id, sync_run_id, ingestion_source, cufe)
          values (${asA.orgId}, ${syncRun}, 'rpa', ${randomCufe()}) returning id`,
    );
    expect(await pgErrorOf(request(doc?.id ?? '', '030'))).toMatchObject({
      code: DATADIAN_SQLSTATE.invoiceWithoutValidXml,
    });
    const valid = await invoice();
    await observe(valid, '033');
    const [row] = await run(
      app,
      asA,
      sql`select radian_status from app.received_documents where id = ${valid}`,
    );
    expect(row).toEqual({ radian_status: 'accepted_express' });
  });

  it('concurrencia: 031 y 033 pedidos a la vez con el 032 aceptado; nunca quedan los dos aceptados', async () => {
    for (let round = 0; round < 3; round += 1) {
      const doc = await invoice();
      await observe(doc, '030');
      await observe(doc, '032');
      const [claim, acceptance] = await Promise.all([
        request(doc, '031', app),
        request(doc, '033', app2),
      ]);
      const results = await Promise.allSettled([
        accept(claim ?? '', '2026-11-12T10:00:00-05:00', worker),
        accept(acceptance ?? '', '2026-11-12T10:00:00-05:00', worker2),
      ]);
      expect(
        results.filter((r) => r.status === 'fulfilled'),
        `ronda ${round}`,
      ).toHaveLength(1);
      const [rejected] = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
      expect(rejected?.reason.cause?.code).toBe(DATADIAN_SQLSTATE.eventBlocked);
      const accepted = await run<{ event_code: string }>(
        app,
        asA,
        sql`select event_code from app.radian_events
            where received_document_id = ${doc} and status = 'accepted' and event_code in ('031', '033')`,
      );
      expect(accepted).toHaveLength(1);
      // Un pedido posterior de cualquiera de los dos falla.
      for (const code of ['031', '033']) {
        expect((await pgErrorOf(request(doc, code))).code).toMatch(/^DD00[23]$/);
      }
    }
  });
});

describe('estados e inmutabilidad (2.6)', () => {
  it('accepted -> pending y rejected -> accepted fallan con DD004; cambiar el CUDE falla con DD005', async () => {
    const doc = await invoice();
    const ack = await request(doc, '030');
    await accept(ack, '2026-11-10T10:00:00-05:00');
    expect(
      await pgErrorOf(
        run(worker, asA, sql`update app.radian_events set status = 'pending' where id = ${ack}`),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.transitionNotAllowed });
    expect(
      await pgErrorOf(
        run(
          worker,
          asA,
          sql`update app.radian_events set cude = ${randomCufe()} where id = ${ack}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.immutableData });

    const receipt = await request(doc, '032');
    const response = await insertFile(worker, asA, 'event_response');
    await run(
      worker,
      asA,
      sql`update app.radian_events set status = 'rejected', response_file_id = ${response} where id = ${receipt}`,
    );
    expect(
      await pgErrorOf(
        run(
          worker,
          asA,
          sql`update app.radian_events set status = 'accepted' where id = ${receipt}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.transitionNotAllowed });
  });

  it('un 032 con fecha anterior a la del 030 falla (orden temporal)', async () => {
    const doc = await invoice();
    await accept(await request(doc, '030'), '2026-11-10T10:00:00-05:00');
    const receipt = await request(doc, '032');
    expect(await pgErrorOf(accept(receipt, '2026-11-09T10:00:00-05:00'))).toMatchObject({
      code: DATADIAN_SQLSTATE.eventOutOfSequence,
    });
  });

  it('app_user no puede insertar un evento accepted ni con origin = dian (política)', async () => {
    const doc = await invoice();
    const cude = randomCufe();
    for (const values of [
      sql`'buyer', 'suite', 'accepted', ${cude}, now()`,
      sql`'buyer', 'dian', 'pending', null, null`,
    ]) {
      const error = await pgErrorOf(
        run(
          app,
          asA,
          sql`insert into app.radian_events (organization_id, received_document_id, event_code, actor,
                origin, status, cude, dian_registered_at, environment, idempotency_key, requested_by)
              values (${asA.orgId}, ${doc}, '030', ${values}, '2', ${randomUUID()}, ${asA.userId})`,
        ),
      );
      expect(error).toMatchObject({
        code: '42501',
        message: expect.stringMatching(/row-level security/),
      });
    }
  });
});

describe('caché de la factura y vencimiento del plazo (2.6, §7.4)', () => {
  it('un 032 aceptado fija claim_deadline_at; con la versión 2 y radian_recompute_deadlines cambia', async () => {
    const doc = await invoice();
    await accept(await request(doc, '030'), '2026-11-12T10:00:00-05:00');
    await accept(await request(doc, '032'), '2026-11-13T10:00:00-05:00');
    const state = sql`select radian_status, deadline_rule_version as version,
                        (extract(epoch from claim_deadline_at) * 1000)::float8 as at
                      from app.received_documents where id = ${doc}`;
    const [row] = await run<{ radian_status: string; version: number; at: number }>(
      app,
      asA,
      state,
    );
    expect(row).toEqual({
      radian_status: 'goods_received',
      version: 1,
      at: new Date('2026-11-19T23:59:59.999-05:00').getTime(),
    });

    // Activar la versión 2 es global: se prueba en una transacción que se deshace.
    const client = await owner.$client.connect();
    try {
      await client.query('begin');
      await client.query(`select set_config('app.org_id', $1, true)`, [asA.orgId]);
      await client.query(
        `update app.radian_deadline_rules set active = false where key = 'claim_window'`,
      );
      await client.query(
        `update app.radian_deadline_rules set active = true where key = 'claim_window' and version = 2`,
      );
      const recomputed = await client.query(`select app.radian_recompute_deadlines() as n`);
      expect(recomputed.rows[0].n).toBeGreaterThanOrEqual(1);
      const after = await client.query(
        `select deadline_rule_version as version, (extract(epoch from claim_deadline_at) * 1000)::float8 as at
         from app.received_documents where id = $1`,
        [doc],
      );
      expect(after.rows[0]).toEqual({
        version: 2,
        at: new Date('2026-11-19T10:00:00-05:00').getTime(),
      });
    } finally {
      await client.query('rollback');
      client.release();
    }
  });
});

describe('reverso de la 0014 (§10.1)', () => {
  it('se aplica y la 0014 se vuelve a aplicar', async () => {
    await expectReversible(owner, '0014_datadian_radian_events', [
      'radian_event_rules',
      'radian_events',
      'radian_event_attempts',
    ]);
  });
});
