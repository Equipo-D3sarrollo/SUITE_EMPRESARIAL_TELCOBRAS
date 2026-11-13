// Ayudas de las pruebas de base de datos de DataDian (subetapas 2.4 a 2.9).
import { randomBytes, randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { type SQL, sql } from 'drizzle-orm';
import type { PoolClient } from 'pg';
import { expect } from 'vitest';
import type { Database } from '../../src/database/database.js';
import { type TenantScope, withTenant } from '../../src/database/tenant.js';
import type { ownerDatabase } from './database.js';

/** Ejecuta SQL dentro del contexto de una organización y devuelve las filas. */
export const run = async <T extends Record<string, unknown>>(
  db: Database,
  scope: TenantScope,
  query: SQL,
) => (await withTenant(db, scope, (tx) => tx.execute<T>(query))).rows;

/** Hash SHA-256 aleatorio en hexadecimal en minúsculas. */
export const randomSha256 = () => randomBytes(32).toString('hex');

/** CUFE o CUDE aleatorio (SHA-384 en hexadecimal). */
export const randomCufe = () => randomBytes(48).toString('hex');

/** Registra un archivo en dian_files y devuelve su id. */
export async function insertFile(db: Database, scope: TenantScope, kind = 'attached_document') {
  const [row] = await run<{ id: string }>(
    db,
    scope,
    sql`insert into app.dian_files (organization_id, kind, storage_key, sha256, size_bytes, content_type)
        values (${scope.orgId}, ${kind}, ${`dian/${randomUUID()}`}, ${randomSha256()}, 1024, 'application/xml')
        returning id`,
  );
  return row?.id ?? '';
}

/** Crea una ejecución de sincronización manual y devuelve su id. */
export async function insertSyncRun(db: Database, scope: TenantScope) {
  const [row] = await run<{ id: string }>(
    db,
    scope,
    sql`insert into app.dian_sync_runs (organization_id, channel, trigger)
        values (${scope.orgId}, 'manual', 'system') returning id`,
  );
  return row?.id ?? '';
}

/**
 * Aplica el reverso de una migración (§10.1), antes los de las migraciones de DataDian posteriores en orden
 * inverso, comprueba que las relaciones desaparecen y vuelve a aplicar todo hacia adelante. Corre en una
 * transacción que se deshace.
 */
export async function expectReversible(
  owner: ReturnType<typeof ownerDatabase>,
  migration: string,
  relations: readonly string[],
  /** SQL que corre justo antes del reverso de esta migración (por ejemplo, quitar filas que lo impiden). */
  prepare?: string,
  /** Comprobación adicional con el cliente de la transacción, después de volver a aplicar. */
  verify?: (client: PoolClient) => Promise<void>,
) {
  const folder = new URL('../../src/database/migrations/', import.meta.url);
  const chain = readdirSync(folder)
    .filter((file) => file.endsWith('.reverse.sql'))
    .map((file) => file.replace(/\.reverse\.sql$/, ''))
    .filter((name) => name >= migration)
    .sort();
  const read = (file: string) => readFileSync(new URL(file, folder), 'utf8');
  const count = {
    text: `select count(*)::int as n from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'app' and c.relname = any($1)`,
    values: [relations],
  };
  const client = await owner.$client.connect();
  try {
    await client.query('begin');
    for (const name of [...chain].reverse()) {
      if (name === migration && prepare) await client.query(prepare);
      await client.query(read(`${name}.reverse.sql`));
    }
    expect((await client.query(count)).rows[0]).toEqual({ n: 0 });
    for (const name of chain) await client.query(read(`${name}.sql`));
    expect((await client.query(count)).rows[0]).toEqual({ n: relations.length });
    await verify?.(client);
  } finally {
    await client.query('rollback');
    client.release();
  }
}
