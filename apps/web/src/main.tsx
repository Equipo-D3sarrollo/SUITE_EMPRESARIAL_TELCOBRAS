import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from './app/providers';
import { createAppRouter } from './app/router';
import { createQueryClient } from './lib/query-client';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

/**
 * Mocks MSW de DataDian (ARQUITECTURA_FRONTEND_DATADIAN.md §4.4): solo en `vite dev` con
 * VITE_DATADIAN_MOCKS=1. En el build de producción `import.meta.env.DEV` es false y el import
 * dinámico se elimina: msw no entra en dist/.
 */
async function enableMocks() {
  if (import.meta.env.DEV && import.meta.env.VITE_DATADIAN_MOCKS === '1') {
    const { startDatadianMocks } = await import('./features/datadian/mocks/browser');
    await startDatadianMocks();
  }
}

enableMocks().then(() => {
  const queryClient = createQueryClient();
  const router = createAppRouter(queryClient);

  createRoot(container).render(
    <StrictMode>
      <Providers queryClient={queryClient} router={router} />
    </StrictMode>,
  );
});
