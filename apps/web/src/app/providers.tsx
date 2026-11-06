import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import type { createAppRouter } from './router';

type ProvidersProps = {
  queryClient: QueryClient;
  router: ReturnType<typeof createAppRouter>;
};

/** Proveedores de toda la SPA. */
export function Providers({ queryClient, router }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
