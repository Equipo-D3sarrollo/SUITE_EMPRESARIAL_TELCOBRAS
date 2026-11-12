// DataDian, subetapa 2.1 (ARQUITECTURA_DB_DATADIAN.md §9.1 y §10.2): rol app_worker de Telco, convención
// de SQLSTATE DD0xx y actor de sistema. Patrón de rls.test.ts: conexiones de un solo cliente y pgErrorOf.
import { readdirSync, readFileSync } from 'node:fs';
import { DATADIAN_SQLSTATE, isDatadianSqlState, SYSTEM_ACTOR_TELCO } from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ownerDatabase, pgErrorOf, workerDatabase } from './support/database.js';

const worker = workerDatabase(1);
const owner = ownerDatabase();

afterAll(async () => {
  await Promise.all([worker.$client.end(), owner.$client.end()]);
});

/**
 * Inventario de privilegios de app_worker sobre las tablas del esquema app. Cada migración de DataDian que
 * le otorgue algo lo agrega aquí (§9.3); cualquier otro privilegio, en cualquier tabla, hace fallar la prueba.
 */
const WORKER_TABLE_GRANTS: Record<string, string[]> = {
  co_holiday_years: ['SELECT'],
  co_holidays: ['SELECT'],
  radian_deadline_rules: ['SELECT'],
};

// Constante de la prueba, sin entrada externa: se escribe como literal de arreglo.
const TABLE_PRIVILEGES = sql.raw(
  "array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']",
);

describe('rol app_worker (2.1)', () => {
  it('los tres roles de la aplicación existen con LOGIN, sin BYPASSRLS ni superusuario', async () => {
    const { rows } = await owner.execute<{
      rolname: string;
      rolcanlogin: boolean;
      rolbypassrls: boolean;
      rolsuper: boolean;
    }>(sql`
      select rolname, rolcanlogin, rolbypassrls, rolsuper from pg_roles
      where rolname in ('app_owner', 'app_user', 'app_worker') order by rolname`);
    expect(rows).toEqual(
      ['app_owner', 'app_user', 'app_worker'].map((rolname) => ({
        rolname,
        rolcanlogin: true,
        rolbypassrls: false,
        rolsuper: false,
      })),
    );
  });

  it('DATABASE_WORKER_URL entra como app_worker, que no hereda privilegios de otro rol', async () => {
    const { rows } = await worker.execute<{
      current_user: string;
      rolcreaterole: boolean;
      rolcreatedb: boolean;
      memberships: number;
    }>(sql`
      select current_user, r.rolcreaterole, r.rolcreatedb,
        (select count(*)::int from pg_auth_members m where m.member = r.oid) as memberships
      from pg_roles r where r.rolname = current_user`);
    expect(rows[0]).toEqual({
      current_user: 'app_worker',
      rolcreaterole: false,
      rolcreatedb: false,
      memberships: 0,
    });
  });

  it('solo tiene los privilegios de tabla del inventario', async () => {
    const { rows } = await owner.execute<{ relname: string; privileges: string[] }>(sql`
      select c.relname,
        array(select p from unnest(${TABLE_PRIVILEGES}) as p
              where has_table_privilege('app_worker', c.oid, p)) as privileges
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'app' and c.relkind in ('r', 'p', 'v', 'm')
      order by c.relname`);
    expect(rows.length).toBeGreaterThan(Object.keys(WORKER_TABLE_GRANTS).length);
    for (const { relname, privileges } of rows) {
      expect(privileges, relname).toEqual(WORKER_TABLE_GRANTS[relname] ?? []);
    }
    // Tampoco privilegios por columna fuera del inventario.
    const { rows: columns } = await owner.execute<{ relname: string }>(sql`
      select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'app' and c.relkind in ('r', 'p', 'v', 'm')
        and has_any_column_privilege('app_worker', c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
      order by c.relname`);
    expect(columns.map((row) => row.relname)).toEqual(Object.keys(WORKER_TABLE_GRANTS).sort());
  });

  it('sin privilegios no lee ninguna tabla de negocio (42501)', async () => {
    const { rows } = await owner.execute<{ relname: string }>(sql`
      select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'app' and c.relkind = 'r' order by c.relname`);
    const business = rows.map((row) => row.relname).filter((name) => !WORKER_TABLE_GRANTS[name]);
    expect(business).toEqual(
      expect.arrayContaining(['organizations', 'received_documents', 'audit_logs', 'users']),
    );
    for (const table of business) {
      const error = await pgErrorOf(
        worker.execute(
          sql`select 1 from ${sql.identifier('app')}.${sql.identifier(table)} limit 1`,
        ),
      );
      expect(error, table).toMatchObject({
        code: '42501',
        message: expect.stringMatching(/permission denied/),
      });
    }
  });
});

describe('convenciones de DataDian en @telcobras/contracts (2.1)', () => {
  it('los SQLSTATE son DD001 a DD010, únicos y reconocibles', () => {
    const codes = Object.values(DATADIAN_SQLSTATE);
    expect(codes).toEqual(
      Array.from({ length: 10 }, (_, i) => `DD${String(i + 1).padStart(3, '0')}`),
    );
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.every(isDatadianSqlState)).toBe(true);
    expect(isDatadianSqlState('DD099')).toBe(false);
    expect(isDatadianSqlState('42501')).toBe(false);
  });

  it('las migraciones solo levantan SQLSTATE DD del catálogo de contracts', () => {
    const folder = new URL('../src/database/migrations/', import.meta.url);
    const raised = readdirSync(folder)
      .filter((file) => file.endsWith('.sql'))
      .flatMap((file) =>
        [...readFileSync(new URL(file, folder), 'utf8').matchAll(/ERRCODE\s*=\s*'(DD\w{3})'/g)].map(
          (match) => match[1],
        ),
      );
    expect(raised).toContain(DATADIAN_SQLSTATE.calendarNotCovered);
    for (const code of raised) expect(isDatadianSqlState(code), code).toBe(true);
  });

  it('SYSTEM_ACTOR_TELCO es un UUID fijo válido para audit_logs.actor_user_id', async () => {
    expect(z.uuid().parse(SYSTEM_ACTOR_TELCO)).toBe(SYSTEM_ACTOR_TELCO);
    const { rows } = await owner.execute<{ actor: string }>(
      sql`select ${SYSTEM_ACTOR_TELCO}::uuid::text as actor`,
    );
    expect(rows[0]?.actor).toBe(SYSTEM_ACTOR_TELCO);
  });
});
