import type { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { ErrorView, NotFoundView, PageSkeleton } from './route-states';
import { routeTree } from './routeTree.gen';

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    // TanStack Query ya decide cuándo los datos están viejos: el router no cachea los loaders.
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: PageSkeleton,
    defaultErrorComponent: ErrorView,
    defaultNotFoundComponent: NotFoundView,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
