import { Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.js';

const logger = new Logger('Database');

/** Cliente Drizzle sobre un pool de pg. La API usa DATABASE_URL (app_user); migraciones y semillas, app_owner. */
export function createDatabase(connectionString: string, max = 10) {
  const pool = new pg.Pool({ connectionString, max, connectionTimeoutMillis: 5_000 });
  // Sin este manejador, un cliente inactivo que pierde la conexión tumba el proceso.
  pool.on('error', (error) => logger.error(error, 'Idle PostgreSQL client error'));
  return drizzle({ client: pool, schema });
}

export type Database = ReturnType<typeof createDatabase>;
