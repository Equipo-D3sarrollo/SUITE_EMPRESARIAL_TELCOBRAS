import { Global, Module } from '@nestjs/common';
import { parseEnv } from './env.js';

/** Token de inyección de la configuración validada: @Inject(ENV) env: Env. */
export const ENV = Symbol('ENV');

@Global()
@Module({
  providers: [{ provide: ENV, useFactory: () => parseEnv(process.env) }],
  exports: [ENV],
})
export class ConfigModule {}
