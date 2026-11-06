import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { Redis } from 'ioredis';
import { z } from 'zod';
import { ENV } from '../../config/config.module.js';
import type { Env } from '../../config/env.js';
import type { Database } from '../../database/database.js';
import { DB } from '../../database/db.module.js';

const CHECK_TIMEOUT_MS = 2_000;

const checkStatus = z.enum(['up', 'down']);

export const healthReportSchema = z.object({
  status: z.enum(['ok', 'error']),
  checks: z.object({ postgres: checkStatus, valkey: checkStatus, s3: checkStatus }),
});

export type HealthReport = z.infer<typeof healthReportSchema>;

/** Verifica las dependencias de la API. Solo responde up/down: los errores van al log, no a la respuesta. */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @Inject(ENV) private readonly env: Env,
    @Inject(DB) private readonly db: Database,
    @Inject(Redis) private readonly valkey: Redis,
    @Inject(S3Client) private readonly s3: S3Client,
  ) {}

  async check(): Promise<HealthReport> {
    const [postgres, valkey, s3] = await Promise.all([
      this.probe('postgres', () => this.db.execute(sql`select 1`)),
      this.probe('valkey', () => this.valkey.ping()),
      this.probe('s3', (signal) =>
        this.s3.send(new HeadBucketCommand({ Bucket: this.env.S3_BUCKET }), {
          abortSignal: signal,
        }),
      ),
    ]);
    const checks = { postgres, valkey, s3 };
    const healthy = Object.values(checks).every((status) => status === 'up');
    return { status: healthy ? 'ok' : 'error', checks };
  }

  private async probe(
    name: string,
    run: (signal: AbortSignal) => Promise<unknown>,
  ): Promise<z.infer<typeof checkStatus>> {
    const signal = AbortSignal.timeout(CHECK_TIMEOUT_MS);
    const timedOut = new Promise<never>((_, reject) =>
      signal.addEventListener('abort', () => reject(signal.reason), { once: true }),
    );
    try {
      await Promise.race([run(signal), timedOut]);
      return 'up';
    } catch (error) {
      this.logger.warn({ err: error, check: name }, 'Health check failed');
      return 'down';
    }
  }
}
