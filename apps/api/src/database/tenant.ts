import { sql } from 'drizzle-orm';
import type { Database } from './database.js';

export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export interface TenantScope {
  orgId: string;
  userId: string;
}

/**
 * Corre fn en una transacción con la organización y el usuario fijados para RLS.
 * set_config(..., true) es local a la transacción: al terminar, la conexión vuelve al pool sin contexto.
 * Toda consulta de negocio pasa por aquí; fuera de ella, RLS devuelve 0 filas.
 */
export function withTenant<T>(
  db: Database,
  { orgId, userId }: TenantScope,
  fn: (tx: Transaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.org_id', ${orgId}, true), set_config('app.user_id', ${userId}, true)`,
    );
    return fn(tx);
  });
}

/**
 * Como withTenant, pero solo con el usuario: para lo previo a elegir organización
 * (listar "mis organizaciones", crear una en el onboarding).
 */
export function withUser<T>(
  db: Database,
  userId: string,
  fn: (tx: Transaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
    return fn(tx);
  });
}
