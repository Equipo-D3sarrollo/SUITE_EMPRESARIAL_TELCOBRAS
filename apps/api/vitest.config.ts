import { existsSync } from 'node:fs';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// Las pruebas usan PostgreSQL, Valkey y S3 de Compose con el .env de la raíz (cp .env.example .env).
// Las variables que ya existan en el entorno (CI) tienen prioridad.
const rootEnv = new URL('../../.env', import.meta.url);
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

export default defineConfig({
  // SWC en lugar de Oxc: Nest necesita los metadatos de los decoradores para la inyección de dependencias.
  plugins: [swc.vite()],
  // Las pruebas leen @telcobras/contracts desde su código fuente, sin compilarlo antes. Sin la condición
  // "module" de Vite: elige builds para bundlers (p. ej. dist-es de @aws-sdk) que Node no puede cargar.
  ssr: { resolve: { conditions: ['@telcobras/source', 'node', 'development|production'] } },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    globalSetup: ['test/global-setup.ts'],
    env: { LOG_LEVEL: 'silent' },
  },
});
