import 'reflect-metadata';
import type { Env } from './config/env.js';
import { startTelemetry } from './telemetry.js';

// La telemetría arranca antes de importar la app para que pueda instrumentar sus dependencias.
const stopTelemetry = await startTelemetry();
const { createApp } = await import('./app.js');
const { ENV } = await import('./config/config.module.js');

const app = await createApp();
const { API_PORT } = app.get<Env>(ENV);
await app.listen(API_PORT, '0.0.0.0');

// Apagado ordenado: deja de aceptar conexiones, termina las peticiones en curso, cierra pools y vacía las trazas.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, async () => {
    setTimeout(() => process.exit(1), 10_000).unref();
    await app.close();
    await stopTelemetry?.();
    process.exit(0);
  });
}
