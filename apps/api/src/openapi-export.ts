// Escribe el contrato OpenAPI en packages/contracts/openapi/openapi.json, de donde
// `pnpm --filter @telcobras/contracts generate:api` genera los tipos del cliente HTTP de la web.
// No abre el puerto ni necesita Valkey ni S3 encendidos (la configuración sí tiene que ser válida).
import 'reflect-metadata';
import { mkdir, writeFile } from 'node:fs/promises';
import { createApp } from './app.js';
import { buildOpenApiDocument } from './openapi.js';

const target = new URL('../../../packages/contracts/openapi/openapi.json', import.meta.url);

const app = await createApp();
try {
  await mkdir(new URL('.', target), { recursive: true });
  await writeFile(target, `${JSON.stringify(buildOpenApiDocument(app), null, 2)}\n`);
} finally {
  await app.close();
}
