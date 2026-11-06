import { z } from 'zod';
import { runMigrations } from '../src/database/migrate.js';

// Deja el esquema al día antes de correr las pruebas (en local y en la CI).
export default async function setup(): Promise<void> {
  await runMigrations(z.url().parse(process.env.DATABASE_OWNER_URL));
}
