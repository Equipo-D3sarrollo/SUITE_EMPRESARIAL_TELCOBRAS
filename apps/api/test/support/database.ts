import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createDatabase, type Database } from '../../src/database/database.js';
import { organizations } from '../../src/database/schema/index.js';
import { type TenantScope, withTenant } from '../../src/database/tenant.js';

/** Conexión como app_user (sujeta a RLS), igual que la API. */
export const appDatabase = (max: number) =>
  createDatabase(z.url().parse(process.env.DATABASE_URL), max);

/** Conexión como app_owner (dueño de las tablas; FORCE RLS también lo restringe). */
export const ownerDatabase = () => createDatabase(z.url().parse(process.env.DATABASE_OWNER_URL), 1);

/** Crea una organización de prueba por el camino del onboarding: como app_user y a nombre de userId. */
export async function createOrganization(db: Database, scope: TenantScope): Promise<void> {
  await withTenant(db, scope, (tx) =>
    tx.insert(organizations).values({
      id: scope.orgId,
      name: `Prueba ${scope.orgId.slice(0, 8)}`,
      legalName: 'Organización de prueba S.A.S.',
      nit: '123456789-6',
      size: '1-10',
      createdBy: scope.userId,
    }),
  );
}

/** Borra organizaciones de prueba como app_owner; las tablas hijas caen en cascada. */
export async function dropOrganizations(owner: Database, orgIds: readonly string[]): Promise<void> {
  for (const orgId of orgIds) {
    await withTenant(owner, { orgId, userId: randomUUID() }, (tx) =>
      tx.delete(organizations).where(eq(organizations.id, orgId)),
    );
  }
}

/** Error de PostgreSQL detrás de un error de Drizzle (que lo envuelve en `cause`). */
export async function pgErrorOf(
  query: Promise<unknown>,
): Promise<{ code?: string; message: string }> {
  try {
    await query;
  } catch (error) {
    return (error as { cause?: { code?: string; message: string } }).cause ?? (error as Error);
  }
  throw new Error('Expected the query to fail');
}
