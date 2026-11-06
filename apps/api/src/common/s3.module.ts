import { S3Client } from '@aws-sdk/client-s3';
import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';

/** Cliente S3 (SeaweedFS en local, S3 gestionado en producción; ADR-009). Se inyecta por su clase. */
@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      inject: [ENV],
      useFactory: (env: Env) =>
        new S3Client({
          endpoint: env.S3_ENDPOINT,
          region: env.S3_REGION,
          forcePathStyle: env.S3_FORCE_PATH_STYLE,
          credentials: {
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
          },
        }),
    },
  ],
  exports: [S3Client],
})
export class S3Module implements OnApplicationShutdown {
  constructor(@Inject(S3Client) private readonly s3: S3Client) {}

  onApplicationShutdown(): void {
    this.s3.destroy();
  }
}
