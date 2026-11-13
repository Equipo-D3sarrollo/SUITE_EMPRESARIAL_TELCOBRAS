import { setupWorker } from 'msw/browser';
import { createDatadianMocks } from './handlers';
import { createSessionHandlers, isMockProfile } from './session';

/**
 * Arranca MSW en el navegador (modo desarrollo con VITE_DATADIAN_MOCKS=1). `main.tsx` lo importa de
 * forma dinámica solo con `import.meta.env.DEV`, así que no entra en el bundle de producción. El
 * worker lo sirve Vite en desarrollo desde node_modules/msw (plugin de vite.config.ts).
 */
export async function startDatadianMocks() {
  const profile = import.meta.env.VITE_DATADIAN_MOCK_PROFILE;
  const { db, handlers } = createDatadianMocks();
  const worker = setupWorker(
    ...createSessionHandlers(isMockProfile(profile) ? profile : 'owner'),
    ...handlers,
  );
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
  // Para mover el reloj desde la consola: __datadianMocks.advance(3_600_000).
  Object.assign(window, { __datadianMocks: db });
}
