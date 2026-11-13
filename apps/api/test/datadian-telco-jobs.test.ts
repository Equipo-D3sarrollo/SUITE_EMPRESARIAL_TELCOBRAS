// DataDian, subetapa 2.7 (ARQUITECTURA_DB_DATADIAN.md §7.6 y §10.2): cola de trabajos de Telco
// (migración 0015). Versión reducida de la prueba de concurrencia (4 conexiones y 60 trabajos en lugar de
// 8 y 1 000), por decisión del usuario del 13-nov-2026.
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
import { expectReversible, run } from './support/datadian.js';

const app = appDatabase(1);
const workers = Array.from({ length: 4 }, () => workerDatabase(1));
const [worker] = workers as [Database, ...Database[]];
const owner = ownerDatabase();
const orgs: TenantScope[] = Array.from({ length: 3 }, () => ({
  orgId: randomUUID(),
  userId: randomUUID(),
}));
const [asA, asB] = orgs as [TenantScope, TenantScope, TenantScope];
const orgIds = sql.raw(`array[${orgs.map((o) => `'${o.orgId}'`).join(', ')}]::uuid[]`);

beforeAll(async () => {
  for (const scope of orgs) await createOrganization(app, scope);
});

afterAll(async () => {
  await dropOrganizations(
    owner,
    orgs.map((o) => o.orgId),
  );
  await Promise.all([app, owner, ...workers].map((db) => db.$client.end()));
});

/** app_user encola un trabajo y devuelve su id. */
async function enqueue(scope: TenantScope, dedupeKey: string | null = null): Promise<string> {
  const [row] = await run<{ id: string }>(
    app,
    scope,
    sql`insert into app.telco_jobs (organization_id, kind, created_by, dedupe_key)
        values (${scope.orgId}, 'certificate_check', ${scope.userId}, ${dedupeKey}) returning id`,
  );
  return row?.id ?? '';
}

/** Reclamación de §7.6.1, limitada a las organizaciones de la prueba. */
const claim = (db: Database, owner: string, limit: number) =>
  db.execute<{ id: string; attempts: number }>(sql`
    with next as (
      select id from app.telco_jobs
       where status = 'queued' and run_at <= now() and organization_id = any(${orgIds})
       order by priority, run_at, id
       for update skip locked
       limit ${limit}
    )
    update app.telco_jobs j
       set status = 'running', attempts = j.attempts + 1, lease_owner = ${owner},
           leased_at = now(), lease_expires_at = now() + interval '5 minutes', updated_at = now()
      from next where j.id = next.id
    returning j.id, j.attempts`);

describe('cola de Telco (2.7)', () => {
  it('concurrencia: 4 conexiones reclaman 60 trabajos de 3 organizaciones, cada uno exactamente una vez', async () => {
    for (const scope of orgs) {
      await run(
        app,
        scope,
        sql`insert into app.telco_jobs (organization_id, kind)
            select ${scope.orgId}, 'xml_fetch' from generate_series(1, 20)`,
      );
    }
    const claimed: string[] = [];
    await Promise.all(
      workers.map(async (db, index) => {
        for (;;) {
          const { rows } = await claim(db, `telco-${index}`, 3);
          if (rows.length === 0) return;
          claimed.push(...rows.map((row) => row.id));
        }
      }),
    );
    expect(claimed).toHaveLength(60);
    expect(new Set(claimed).size).toBe(60);
    const { rows } = await worker.execute<{ n: number }>(
      sql`select count(*)::int as n from app.telco_jobs where status = 'queued' and organization_id = any(${orgIds})`,
    );
    expect(rows[0]?.n).toBe(0);
  });

  it('recuperación: un arrendamiento vencido vuelve a queued con run_at futuro, y a dead al agotar intentos', async () => {
    const recover = sql`
      update app.telco_jobs set status = case when attempts >= max_attempts then 'dead' else 'queued' end,
             run_at = now() + app.telco_backoff(attempts, backoff_base_seconds, backoff_max_seconds),
             lease_owner = null, leased_at = null, lease_expires_at = null,
             last_error = 'lease expired', last_error_at = now(),
             finished_at = case when attempts >= max_attempts then now() end
       where id in (select id from app.telco_jobs
                     where status = 'running' and lease_expires_at < now()
                       and organization_id = any(${orgIds})
                     for update skip locked)
      returning id, status, run_at > now() as future`;
    for (const [maxAttempts, status] of [
      [8, 'queued'],
      [1, 'dead'],
    ] as const) {
      const [job] = await run<{ id: string }>(
        worker,
        asA,
        sql`insert into app.telco_jobs (organization_id, kind, status, attempts, max_attempts, lease_owner,
              leased_at, lease_expires_at)
            values (${asA.orgId}, 'rpa_sync', 'running', 1, ${maxAttempts}, 'telco-caida',
                    now() - interval '1 hour', now() - interval '1 minute')
            returning id`,
      );
      const { rows } = await worker.execute<{ id: string; status: string; future: boolean }>(
        recover,
      );
      expect(rows.find((row) => row.id === job?.id)).toEqual({
        id: job?.id,
        status,
        future: true,
      });
    }
  });

  it('exclusión: cerrar con un attempts viejo afecta 0 filas', async () => {
    const id = await enqueue(asB);
    await run(
      worker,
      asB,
      sql`update app.telco_jobs set status = 'running', attempts = 1,
      lease_owner = 'telco-1', leased_at = now(), lease_expires_at = now() + interval '1 minute' where id = ${id}`,
    );
    const finish = (attempts: number) =>
      worker.execute(sql`update app.telco_jobs set status = 'succeeded', finished_at = now(),
        lease_owner = null, leased_at = null, lease_expires_at = null
        where id = ${id} and status = 'running' and lease_owner = 'telco-1' and attempts = ${attempts}`);
    expect((await finish(0)).rowCount).toBe(0);
    expect((await finish(1)).rowCount).toBe(1);
  });

  it('la espera crece de forma exponencial dentro de los límites, con jitter', async () => {
    const { rows } = await app.execute<{ attempts: number; seconds: number }>(sql`
      select a as attempts, extract(epoch from app.telco_backoff(a, 30, 3600))::float8 as seconds
      from generate_series(1, 9) as a, generate_series(1, 5)`);
    for (const { attempts, seconds } of rows) {
      const ceiling = Math.min(3600, 30 * 2 ** (attempts - 1));
      expect(seconds, String(attempts)).toBeGreaterThanOrEqual(ceiling * 0.5);
      expect(seconds, String(attempts)).toBeLessThanOrEqual(ceiling);
    }
    expect(new Set(rows.map((row) => row.seconds)).size).toBeGreaterThan(9);
  });

  it('un segundo trabajo recurrente con la misma dedupe_key falla', async () => {
    await enqueue(asA, 'recurring');
    expect(await pgErrorOf(enqueue(asA, 'recurring'))).toMatchObject({ code: '23505' });
  });

  it('app_user solo ve lo suyo y solo cancela un queued o reencola un dead', async () => {
    const own = await enqueue(asA);
    const other = await enqueue(asB);
    const visible = await run<{ id: string }>(
      app,
      asA,
      sql`select id from app.telco_jobs where id in (${own}, ${other})`,
    );
    expect(visible.map((row) => row.id)).toEqual([own]);
    expect(
      await pgErrorOf(
        run(
          app,
          asA,
          sql`update app.telco_jobs set status = 'succeeded', finished_at = now() where id = ${own}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.transitionNotAllowed });
    await run(
      app,
      asA,
      sql`update app.telco_jobs set status = 'cancelled', finished_at = now() where id = ${own}`,
    );
    const [dead] = await run<{ id: string }>(
      worker,
      asA,
      sql`insert into app.telco_jobs (organization_id, kind, status, attempts, max_attempts, finished_at)
          values (${asA.orgId}, 'odoo_push', 'dead', 8, 8, now()) returning id`,
    );
    await run(
      app,
      asA,
      sql`update app.telco_jobs set status = 'queued', attempts = 0, finished_at = null, run_at = now()
          where id = ${dead?.id}`,
    );
    // Encolar ya en ejecución no se permite (política de INSERT).
    expect(
      await pgErrorOf(
        run(
          app,
          asA,
          sql`insert into app.telco_jobs (organization_id, kind, status, lease_owner, lease_expires_at)
          values (${asA.orgId}, 'rpa_sync', 'running', 'x', now())`,
        ),
      ),
    ).toMatchObject({ code: '42501' });
  });

  it('app_worker solo purga trabajos terminados hace más de 30 días', async () => {
    const insert = (status: string, age: string) =>
      run<{ id: string }>(
        worker,
        asA,
        sql`insert into app.telco_jobs (organization_id, kind, status, finished_at)
            values (${asA.orgId}, 'xml_ingest', ${status}, now() - ${age}::interval) returning id`,
      );
    const [old] = await insert('succeeded', '31 days');
    const [recent] = await insert('succeeded', '1 day');
    const [dead] = await insert('dead', '60 days');
    const { rowCount } = await worker.execute(
      sql`delete from app.telco_jobs where id in (${old?.id}, ${recent?.id}, ${dead?.id})`,
    );
    expect(rowCount).toBe(1);
    expect(
      await pgErrorOf(run(app, asA, sql`delete from app.telco_jobs where id = ${recent?.id}`)),
    ).toMatchObject({
      code: '42501',
    });
  });
});

describe('reverso de la 0015 (§10.1)', () => {
  it('se aplica y la 0015 se vuelve a aplicar', async () => {
    await expectReversible(owner, '0015_datadian_telco_jobs', ['telco_jobs']);
  });
});
