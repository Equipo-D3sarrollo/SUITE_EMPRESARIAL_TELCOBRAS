// Prueba de RLS con Drizzle ORM (D-07). Requiere el contenedor rls-poc con schema.sql aplicado.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgSchema, uuid, text } from 'drizzle-orm/pg-core';
import { sql, eq } from 'drizzle-orm';

const app = pgSchema('app');
const companies = app.table('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: text('name').notNull(),
});

const A = '11111111-1111-1111-1111-111111111111';
const B = '22222222-2222-2222-2222-222222222222';
const url = (user, pass) => `postgres://${user}:${pass}@localhost:55432/postgres`;

// Pool de 1 conexión: obliga a reutilizar la misma conexión y así detectar fugas del tenant.
const single = new pg.Pool({ connectionString: url('app_user', 'app'), max: 1 });
const pool = new pg.Pool({ connectionString: url('app_user', 'app'), max: 5 });
const owner = new pg.Pool({ connectionString: url('app_owner', 'owner'), max: 1 });
const db1 = drizzle(single);
const db = drizzle(pool);
after(() => Promise.all([single.end(), pool.end(), owner.end()]));

// El patrón que usará la API: el tenant se fija solo dentro de la transacción (is_local = true).
const withTenant = (database, orgId, fn) =>
  database.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.org_id', ${orgId}, true)`);
    return fn(tx);
  });

test('cada organización inserta y ve solo lo suyo', async () => {
  await withTenant(db1, A, (tx) => tx.insert(companies).values({ organizationId: A, name: 'Acme' }));
  await withTenant(db1, B, (tx) => tx.insert(companies).values({ organizationId: B, name: 'Beta' }));
  const a = await withTenant(db1, A, (tx) => tx.select().from(companies));
  const b = await withTenant(db1, B, (tx) => tx.select().from(companies));
  assert.deepEqual(a.map((r) => r.name), ['Acme']);
  assert.deepEqual(b.map((r) => r.name), ['Beta']);
});

test('sin organización fijada no se ve nada (falla cerrado)', async () => {
  assert.equal((await db1.select().from(companies)).length, 0);
});

test('el tenant no se filtra a la siguiente petición en la misma conexión', async () => {
  await withTenant(db1, A, (tx) => tx.select().from(companies));
  // Misma conexión física (pool de 1), fuera de la transacción: el set_config local ya expiró.
  assert.equal((await db1.select().from(companies)).length, 0);
});

test('A no puede insertar filas a nombre de B', async () => {
  await assert.rejects(
    withTenant(db1, A, (tx) => tx.insert(companies).values({ organizationId: B, name: 'Intrusa' })),
    (e) => /row-level security/.test(e.cause?.message ?? e.message),
  );
});

test('A no puede modificar ni borrar filas de B', async () => {
  const upd = await withTenant(db1, A, (tx) =>
    tx.update(companies).set({ name: 'Hackeada' }).where(eq(companies.name, 'Beta')).returning());
  const del = await withTenant(db1, A, (tx) => tx.delete(companies).where(eq(companies.name, 'Beta')).returning());
  assert.equal(upd.length, 0);
  assert.equal(del.length, 0);
  const b = await withTenant(db1, B, (tx) => tx.select().from(companies));
  assert.deepEqual(b.map((r) => r.name), ['Beta']);
});

test('transacciones concurrentes en un pool de 5 no se mezclan', async () => {
  const runs = Array.from({ length: 40 }, (_, i) => (i % 2 ? A : B)).map((org) =>
    withTenant(db, org, async (tx) => {
      await tx.execute(sql`select pg_sleep(0.01)`);
      return { org, rows: await tx.select().from(companies) };
    }));
  for (const { org, rows } of await Promise.all(runs)) {
    assert.ok(rows.length > 0 && rows.every((r) => r.organizationId === org));
  }
});

test('el rol de la aplicación no puede saltarse RLS y el dueño también está restringido (FORCE)', async () => {
  const { rows } = await pool.query(`select rolbypassrls from pg_roles where rolname = 'app_user'`);
  assert.equal(rows[0].rolbypassrls, false);
  const ownerRows = await owner.query('select * from app.companies');
  assert.equal(ownerRows.rowCount, 0);
});
