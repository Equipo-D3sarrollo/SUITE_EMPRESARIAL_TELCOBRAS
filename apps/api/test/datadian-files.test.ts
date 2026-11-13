// DataDian, subetapa 2.4 (ARQUITECTURA_DB_DATADIAN.md §5.4, §5.5 y §10.2): archivos con su hash y
// ejecuciones de sincronización (migración 0012).
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
import { expectReversible, insertFile, randomSha256, run } from './support/datadian.js';

const app = appDatabase(1);
const worker = workerDatabase(1);
const owner = ownerDatabase();
const asA: TenantScope = { orgId: randomUUID(), userId: randomUUID() };
const asB: TenantScope = { orgId: randomUUID(), userId: randomUUID() };

beforeAll(async () => {
  await createOrganization(app, asA);
  await createOrganization(app, asB);
});

afterAll(async () => {
  await dropOrganizations(owner, [asA.orgId, asB.orgId]);
  await Promise.all([app.$client.end(), worker.$client.end(), owner.$client.end()]);
});

const fileInsert = (sha256: string, size: number) =>
  sql`insert into app.dian_files (organization_id, kind, storage_key, sha256, size_bytes, content_type)
      values (${asA.orgId}, 'invoice_pdf', ${`dian/${randomUUID()}`}, ${sha256}, ${size}, 'application/pdf')`;

describe('dian_files (2.4)', () => {
  it('un hash inválido o un tamaño 0 fallan', async () => {
    for (const [sha256, size] of [
      ['A'.repeat(64), 10],
      ['abc', 10],
      [randomSha256(), 0],
    ] as const) {
      expect(await pgErrorOf(run(app, asA, fileInsert(sha256, size)))).toMatchObject({
        code: '23514',
      });
    }
  });

  it('el mismo archivo dos veces falla por la clave única', async () => {
    const sha256 = randomSha256();
    await run(app, asA, fileInsert(sha256, 10));
    expect(await pgErrorOf(run(worker, asA, fileInsert(sha256, 10)))).toMatchObject({
      code: '23505',
    });
  });

  it('UPDATE y DELETE fallan para todos los roles', async () => {
    const id = await insertFile(app, asA);
    for (const db of [app, worker]) {
      for (const query of [
        sql`update app.dian_files set original_name = 'x' where id = ${id}`,
        sql`delete from app.dian_files where id = ${id}`,
      ]) {
        expect(await pgErrorOf(run(db, asA, query))).toMatchObject({ code: '42501' });
      }
    }
    for (const query of [
      sql`update app.dian_files set original_name = 'x' where id = ${id}`,
      sql`delete from app.dian_files where id = ${id}`,
    ]) {
      expect(await pgErrorOf(run(owner, asA, query))).toMatchObject({
        code: DATADIAN_SQLSTATE.immutableData,
      });
    }
  });

  it('B no ve los archivos de A y sin contexto no hay filas', async () => {
    await insertFile(app, asA);
    expect(await run(app, asB, sql`select id from app.dian_files`)).toEqual([]);
    expect((await app.execute(sql`select id from app.dian_files`)).rows).toEqual([]);
  });
});

describe('dian_sync_runs (2.4)', () => {
  it('un succeeded sin finished_at falla; con finished_at pasa', async () => {
    const [run1] = await run<{ id: string }>(
      app,
      asA,
      sql`insert into app.dian_sync_runs (organization_id, channel, trigger, requested_by)
          values (${asA.orgId}, 'rpa', 'user', ${asA.userId}) returning id`,
    );
    const finish = (finishedAt: boolean) =>
      run(
        worker,
        asA,
        sql`update app.dian_sync_runs set status = 'succeeded',
              finished_at = ${finishedAt ? sql`now()` : sql`null`} where id = ${run1?.id}`,
      );
    expect(await pgErrorOf(finish(false))).toMatchObject({
      code: '23514',
      message: expect.stringMatching(/dian_sync_runs_finished_check/),
    });
    await finish(true);
    // app_user no actualiza ejecuciones: solo Telco.
    expect(
      await pgErrorOf(
        run(app, asA, sql`update app.dian_sync_runs set status = 'failed' where id = ${run1?.id}`),
      ),
    ).toMatchObject({ code: '42501' });
  });

  it('una ejecución imap sin buzón falla, y un trigger user sin usuario también', async () => {
    for (const [channel, trigger] of [
      ['imap', 'system'],
      ['manual', 'user'],
    ] as const) {
      const error = await pgErrorOf(
        run(
          app,
          asA,
          sql`insert into app.dian_sync_runs (organization_id, channel, trigger)
              values (${asA.orgId}, ${channel}, ${trigger})`,
        ),
      );
      expect(error, channel).toMatchObject({ code: '23514' });
    }
  });
});

describe('reverso de la 0012 (§10.1)', () => {
  it('se aplica y la 0012 se vuelve a aplicar', async () => {
    await expectReversible(owner, '0012_datadian_files_sync', ['dian_files', 'dian_sync_runs']);
  });
});
