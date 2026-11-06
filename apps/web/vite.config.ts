import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defaultClientConditions, defineConfig } from 'vite';

const api = 'http://localhost:3000';

export default defineConfig({
  plugins: [
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
