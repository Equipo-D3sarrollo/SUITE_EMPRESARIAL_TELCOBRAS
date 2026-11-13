import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defaultClientConditions, defineConfig, type Plugin } from 'vite';

const api = 'http://localhost:3000';

/**
 * Sirve el worker de MSW en `vite dev` directamente desde node_modules/msw: no se copia a public/,
 * así nunca llega a dist/ (mocks de DataDian, §4.4) y su versión siempre coincide con la de msw.
 */
function mswWorker(): Plugin {
  return {
    name: 'telcobras:msw-worker',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/mockServiceWorker.js', (_request, response) => {
        const require = createRequire(import.meta.url);
        const file = require.resolve('msw/mockServiceWorker.js');
        response.setHeader('Content-Type', 'application/javascript');
        response.end(readFileSync(file));
      });
    },
  };
}

export default defineConfig({
  plugins: [
    mswWorker(),
    // Debe ir antes de react(): genera el árbol de rutas y separa cada ruta en su propio chunk.
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/app/routeTree.gen.ts',
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    // Usa el código fuente de los paquetes del monorepo, sin compilarlos antes.
    conditions: ['@telcobras/source', ...defaultClientConditions],
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    strictPort: true,
    // /api cubre también /api/auth (Better Auth).
    proxy: { '/api': api },
  },
});
