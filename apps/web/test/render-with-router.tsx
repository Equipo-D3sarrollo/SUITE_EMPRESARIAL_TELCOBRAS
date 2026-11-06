import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';
import type { FunctionComponent } from 'react';

/** Monta un componente del shell en la ruta /app/$module/$submodule de un router en memoria. */
export function renderAtSubmodule(Component: FunctionComponent, path = '/app/dashboard/overview') {
  const rootRoute = createRootRoute({ component: Outlet });
  const submoduleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app/$module/$submodule',
    component: Component,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([submoduleRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}
