// DataDian, subetapa 2.3 (ARQUITECTURA_DB_DATADIAN.md §5.1 a §5.3, §9 y §10.2): configuración DIAN,
// certificados y buzones (migración 0011). Patrón de rls.test.ts: dos organizaciones, pools de una conexión
// y pgErrorOf para leer el SQLSTATE.
import { randomInt, randomUUID } from 'node:crypto';
import { DATADIAN_SQLSTATE } from '@telcobras/contracts';
import { type SQL, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Database } from '../src/database/database.js';
import { type TenantScope, withTenant } from '../src/database/tenant.js';
import {
  appDatabase,
  createOrganization,
  dropOrganizations,
  ownerDatabase,
  pgErrorOf,
  workerDatabase,
} from './support/database.js';
import { expectReversible } from './support/datadian.js';

const app = appDatabase(1);
const worker = workerDatabase(1);
const owner = ownerDatabase();

const asA: TenantScope = { orgId: randomUUID(), userId: randomUUID() };
const asB: TenantScope = { orgId: randomUUID(), userId: randomUUID() };
// NIT únicos por corrida: la clave es global entre organizaciones.
const nitA = String(randomInt(100_000_000, 999_999_999));
const nitB = String(Number(nitA) + 1);
const secret = { v: 1, key: 'a2V5', data: 'ZGF0YQ==' };

/** Ejecuta SQL dentro del contexto de una organización y devuelve las filas. */
const run = async <T extends Record<string, unknown>>(
  db: Database,
  scope: TenantScope,
  query: SQL,
) => (await withTenant(db, scope, (tx) => tx.execute<T>(query))).rows;

/** Inserta un certificado pending_validation como app_user y devuelve su id. */
async function upload(scope: TenantScope): Promise<string> {
  const [row] = await run<{ id: string }>(
    app,
    scope,
    sql`insert into app.dian_certificates
          (organization_id, storage_key, pfx_data_key, pfx_sha256, pfx_size_bytes, password, uploaded_by)
        values (${scope.orgId}, ${`pfx/${randomUUID()}`}, '"a2V5"', ${randomUUID().replaceAll('-', '').repeat(2)},
                2048, ${JSON.stringify(secret)}::jsonb, ${scope.userId})
        returning id`,
  );
  return row?.id ?? '';
}

/** Telco valida el certificado con el NIT y la vigencia dados. */
const validate = (scope: TenantScope, id: string, subjectNit: string, notAfter: string) =>
  run(
    worker,
    scope,
    sql`update app.dian_certificates set status = 'valid', serial_number = '01AB',
          subject_nit = ${subjectNit}, subject_dn = 'CN=Prueba', issuer_dn = 'CN=CA',
          not_before = '2020-01-01T00:00:00Z', not_after = ${notAfter}::timestamptz,
          signature_algorithm = 'sha256WithRSAEncryption', key_usage_ok = true, chain_ok = true,
          validated_at = now()
        where id = ${id}`,
  );

const activate = (db: Database, scope: TenantScope, id: string) =>
  run(
    db,
    scope,
    sql`update app.dian_settings set active_certificate_id = ${id} where organization_id = ${scope.orgId}`,
  );

let certA = '';

beforeAll(async () => {
  await createOrganization(app, asA);
  await createOrganization(app, asB);
  for (const [scope, nit] of [
    [asA, nitA],
    [asB, nitB],
  ] as const) {
    await run(
      app,
      scope,
      sql`insert into app.dian_settings (organization_id, nit, software_id, software_pin, updated_by)
          values (${scope.orgId}, ${nit}, ${randomUUID()}, ${JSON.stringify(secret)}::jsonb, ${scope.userId})`,
    );
    await run(
      app,
      scope,
      sql`insert into app.imap_mailboxes (organization_id, host, username, secret, updated_by)
          values (${scope.orgId}, 'imap.example.co', 'facturas', ${JSON.stringify(secret)}::jsonb, ${scope.userId})`,
    );
  }
  certA = await upload(asA);
});

afterAll(async () => {
  await dropOrganizations(owner, [asA.orgId, asB.orgId]);
  await Promise.all([app.$client.end(), worker.$client.end(), owner.$client.end()]);
});

const TABLES = ['dian_settings', 'dian_certificates', 'imap_mailboxes'] as const;
const table = (name: string) => sql`${sql.identifier('app')}.${sql.identifier(name)}`;

describe('RLS de la configuración DIAN (2.3)', () => {
  it('A no ve lo de B y sin contexto no hay filas', async () => {
    for (const name of TABLES) {
      const own = await run<{ org: string }>(
        app,
        asA,
        sql`select organization_id::text as org from ${table(name)}`,
      );
      expect(own.length, name).toBeGreaterThan(0);
      expect(new Set(own.map((row) => row.org)), name).toEqual(new Set([asA.orgId]));
      const { rows } = await app.execute(sql`select organization_id from ${table(name)}`);
      expect(rows, `${name} sin contexto`).toEqual([]);
    }
  });

  it('A no actualiza ni inserta filas de B', async () => {
    const updated = await run<{ nit: string }>(
      app,
      asA,
      sql`update app.dian_settings set sync_lookback_days = 10 where organization_id = ${asB.orgId}
          returning nit`,
    );
    expect(updated).toEqual([]);
    const error = await pgErrorOf(
      run(
        app,
        asA,
        sql`insert into app.imap_mailboxes (organization_id, host, username, secret, updated_by)
            values (${asB.orgId}, 'otro.example.co', 'x', ${JSON.stringify(secret)}::jsonb, ${asA.userId})`,
      ),
    );
    expect(error).toMatchObject({
      code: '42501',
      message: expect.stringMatching(/row-level security/),
    });
  });
});

describe('columnas secretas (2.3)', () => {
  const SECRETS = [
    ['dian_settings', 'software_pin'],
    ['dian_certificates', 'password'],
    ['dian_certificates', 'pfx_data_key'],
    ['imap_mailboxes', 'secret'],
  ] as const;

  it('app_user falla con 42501 al leerlas; app_worker las lee', async () => {
    for (const [name, column] of SECRETS) {
      const query = sql`select ${sql.identifier(column)} as value from ${table(name)}`;
      expect(await pgErrorOf(run(app, asA, query)), column).toMatchObject({ code: '42501' });
      const rows = await run<{ value: unknown }>(worker, asA, query);
      expect(rows.length, column).toBeGreaterThan(0);
      expect(rows[0]?.value, column).not.toBeNull();
    }
  });
});

describe('certificados (2.3)', () => {
  it('activar un certificado pending_validation, vencido o de otro NIT falla con DD010', async () => {
    const pending = await upload(asA);
    const expired = await upload(asA);
    await validate(asA, expired, nitA, '2021-01-01T00:00:00Z');
    const otherNit = await upload(asA);
    await validate(asA, otherNit, nitB, '2099-01-01T00:00:00Z');
    for (const id of [pending, expired, otherNit]) {
      expect(await pgErrorOf(activate(app, asA, id))).toMatchObject({
        code: DATADIAN_SQLSTATE.invalidActiveCertificate,
      });
    }
  });

  it('un certificado válido del mismo NIT se activa, y entonces el NIT no se puede cambiar', async () => {
    await validate(asA, certA, nitA, '2099-01-01T00:00:00Z');
    await activate(app, asA, certA);
    const error = await pgErrorOf(
      run(
        app,
        asA,
        sql`update app.dian_settings set nit = '900000001' where organization_id = ${asA.orgId}`,
      ),
    );
    expect(error).toMatchObject({ code: DATADIAN_SQLSTATE.invalidActiveCertificate });
  });

  it('no se activa el certificado de otra organización (FK compuesta)', async () => {
    const certB = await upload(asB);
    await validate(asB, certB, nitA, '2099-01-01T00:00:00Z');
    expect(await pgErrorOf(activate(app, asA, certB))).toMatchObject({
      code: expect.stringMatching(/^(23503|DD010)$/),
    });
  });

  it('el mismo NIT en dos organizaciones falla por la clave única', async () => {
    const error = await pgErrorOf(
      run(
        app,
        asB,
        sql`update app.dian_settings set nit = ${nitA} where organization_id = ${asB.orgId}`,
      ),
    );
    expect(error).toMatchObject({
      code: '23505',
      message: expect.stringMatching(/dian_settings_nit_key/),
    });
  });

  it('cambiar storage_key o password falla con DD005, también como app_owner', async () => {
    for (const change of [
      sql`storage_key = 'pfx/otro'`,
      sql`password = ${JSON.stringify({ ...secret, data: 'b3Rybw==' })}::jsonb`,
    ]) {
      const query = sql`update app.dian_certificates set ${change} where id = ${certA}`;
      expect(await pgErrorOf(run(owner, asA, query))).toMatchObject({
        code: DATADIAN_SQLSTATE.immutableData,
      });
      expect(await pgErrorOf(run(app, asA, query))).toMatchObject({ code: '42501' });
    }
  });

  it('los metadatos se congelan al validar y app_user solo puede retirar', async () => {
    expect(
      await pgErrorOf(
        run(
          worker,
          asA,
          sql`update app.dian_certificates set subject_nit = '1' where id = ${certA}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.immutableData });
    const pending = await upload(asA);
    expect(
      await pgErrorOf(
        run(
          app,
          asA,
          sql`update app.dian_certificates set status = 'invalid' where id = ${pending}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.transitionNotAllowed });
    await run(
      app,
      asA,
      sql`update app.dian_certificates set status = 'retired', retired_at = now() where id = ${pending}`,
    );
    expect(
      await pgErrorOf(
        run(
          worker,
          asA,
          sql`update app.dian_certificates set status = 'valid' where id = ${pending}`,
        ),
      ),
    ).toMatchObject({ code: DATADIAN_SQLSTATE.transitionNotAllowed });
  });

  it('nadie puede borrar un certificado', async () => {
    const query = sql`delete from app.dian_certificates where id = ${certA}`;
    for (const db of [app, worker]) {
      expect(await pgErrorOf(run(db, asA, query))).toMatchObject({ code: '42501' });
    }
    // app_owner tiene el privilegio, pero sin política de DELETE la RLS forzada no le deja ninguna fila.
    await run(owner, asA, query);
    const rows = await run(app, asA, sql`select id from app.dian_certificates where id = ${certA}`);
    expect(rows).toHaveLength(1);
  });
});

describe('reverso de la 0011 (§10.1)', () => {
  it('se aplica, deja la base sin las tablas y la 0011 se vuelve a aplicar', async () => {
    await expectReversible(owner, '0011_datadian_settings', TABLES);
  });
});
