import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { z } from 'zod';

// En el build, nest-cli copia las migraciones a dist/database/migrations (ver nest-cli.json).
const migrationsFolder = fileURLToPath(new URL('./migrations', import.meta.url));

/** Aplica las migraciones pendientes en una sola transacción. Debe correr como app_owner. */
export async function runMigrations(ownerUrl: string): Promise<void> {
  const db = drizzle({ connection: { connectionString: ownerUrl, max: 1 } });
  try {
    await migrate(db, { migrationsFolder });
  } finally {
    await db.$client.end();
  }
}

if (import.meta.main) {
  await runMigrations(z.url().parse(process.env.DATABASE_OWNER_URL));
}
