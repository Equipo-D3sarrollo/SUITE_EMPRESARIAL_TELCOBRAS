import { Global, Inject, Logger, Module, type OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';

const logger = new Logger('Valkey');

/** Cliente de Valkey (caché, idempotencia, almacenamiento secundario de Better Auth). Se inyecta por su clase. */
@Global()
@Module({
  providers: [
    {
      provide: Redis,
      inject: [ENV],
      useFactory: (env: Env) => {
        // lazyConnect: conecta en el primer comando, así crear la app (p. ej. para exportar OpenAPI) no exige Valkey.
        const client = new Redis(env.VALKEY_URL, { lazyConnect: true, maxRetriesPerRequest: 2 });
        client.on('error', (error) => logger.warn(error.message));
        return client;
      },
    },
  ],
  exports: [Redis],
})
export class ValkeyModule implements OnApplicationShutdown {
  constructor(@Inject(Redis) private readonly valkey: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    if (this.valkey.status !== 'wait' && this.valkey.status !== 'end') await this.valkey.quit();
  }
}
