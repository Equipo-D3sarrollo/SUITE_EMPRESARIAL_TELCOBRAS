import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from './app/providers';
import { createAppRouter } from './app/router';
import { createQueryClient } from './lib/query-client';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

const queryClient = createQueryClient();
const router = createAppRouter(queryClient);

createRoot(container).render(
  <StrictMode>
    <Providers queryClient={queryClient} router={router} />
  </StrictMode>,
);
