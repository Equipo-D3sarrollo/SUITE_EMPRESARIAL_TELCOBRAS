import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module.js';
import { IdempotencyInterceptor } from './common/idempotency.interceptor.js';
import { loggerParams } from './common/logging.js';
import { ProblemDetailsFilter } from './common/problem-details.filter.js';
import { S3Module } from './common/s3.module.js';
import { ValkeyModule } from './common/valkey.module.js';
import { ConfigModule, ENV } from './config/config.module.js';
import { DbModule } from './database/db.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { InvitationsModule } from './modules/invitations/invitations.module.js';
import { OrganizationsModule } from './modules/organizations/organizations.module.js';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({ inject: [ENV], useFactory: loggerParams }),
    AuthModule,
    DbModule,
    ValkeyModule,
    S3Module,
    HealthModule,
    InvitationsModule,
    OrganizationsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
  ],
})
export class AppModule {}
