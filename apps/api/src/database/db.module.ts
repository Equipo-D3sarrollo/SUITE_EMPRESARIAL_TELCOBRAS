import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import { createDatabase, type Database } from './database.js';

/** Token del cliente Drizzle como app_user: @Inject(DB) db: Database, y toda consulta dentro de withTenant. */
export const DB = Symbol('DB');

@Global()
@Module({
  providers: [
    { provide: DB, inject: [ENV], useFactory: (env: Env) => createDatabase(env.DATABASE_URL) },
  ],
  exports: [DB],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(DB) private readonly db: Database) {}

  async onApplicationShutdown(): Promise<void> {
    await this.db.$client.end();
  }
}
