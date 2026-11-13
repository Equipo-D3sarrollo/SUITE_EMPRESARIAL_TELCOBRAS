// Genera openapi/datadian.openapi.json desde el catálogo de rutas de DataDian (§3.1).
// Se ejecuta sobre dist/: `pnpm --filter @telcobras/contracts openapi:datadian` compila antes.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildDatadianOpenApi } from '../dist/index.js';

const target = new URL('../openapi/datadian.openapi.json', import.meta.url);
writeFileSync(target, `${JSON.stringify(buildDatadianOpenApi(), null, 2)}\n`);
console.log(`OpenAPI de DataDian escrito en ${fileURLToPath(target)}`);
