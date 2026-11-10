import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { FunctionComponent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { routeTree } from '@/app/routeTree.gen';
import { NewOrganizationPage } from '@/features/onboarding/new-organization-page';
import { OnboardingPage } from '@/features/onboarding/onboarding-page';
import type { AuthSession } from '@/lib/auth-client';
import { organizationsQuery, permissionsQuery, sessionQuery } from '@/lib/queries';
import { UserMenu } from '@/shell/zone0-topbar/user-menu';

const post = vi.hoisted(() => vi.fn());

// Sin red: las mutaciones van a este doble; las consultas ya están en caché en cada prueba.
vi.mock('@/lib/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api-client')>();
  return { ...actual, api: { POST: post, GET: vi.fn() } };
});

vi.mock('@/lib/auth-client', () => ({ googleEnabled: false, authClient: {} }));

const session = {
  user: { id: 'u1', name: 'Ana Gómez', email: 'ana@empresa.com', image: null },
  session: { id: 's1' },
} as unknown as AuthSession;

/** Caché como la deja el shell: sesión, organizaciones del usuario y permisos de la activa. */
function clientWith(sessionData: AuthSession | null, organizationCount: number) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(sessionQuery.queryKey, sessionData);
  queryClient.setQueryData(organizationsQuery.queryKey, {
    items: Array.from({ length: organizationCount }, (_, index) => ({
      id: `org-${index}`,
      name: `Org ${index}`,
      nit: '900123456-8',
      isActive: index === 0,
    })),
    nextCursor: null,
  });
  queryClient.setQueryData(permissionsQuery.queryKey, { permissions: [] });
  return queryClient;
}

/** El árbol de rutas real (routeTree.gen), sin pintar: solo corre guardas y cargadores. */
async function loadRealRoute(path: string, queryClient: QueryClient) {
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  return router;
}

/** Monta las páginas en un router en memoria; /app es un destino vacío salvo que se pase el shell. */
function renderAt(path: string, queryClient: QueryClient, App: FunctionComponent = () => null) {
  const rootRoute = createRootRoute({ component: Outlet });
  const routes = [
    createRoute({ getParentRoute: () => rootRoute, path: '/app', component: App }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/onboarding',
      component: OnboardingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/organizaciones/nueva',
      component: NewOrganizationPage,
    }),
  ];
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

beforeEach(() => {
  post.mockReset();
  // useEnterApp limpia la caché: si algo vuelve a pedir la sesión, que no salga a la red.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => null })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Guardas de /organizaciones/nueva y /onboarding', () => {
  it('/organizaciones/nueva abre aunque el usuario ya tenga organizaciones', async () => {
    const router = await loadRealRoute('/organizaciones/nueva', clientWith(session, 2));
    expect(router.state.location.pathname).toBe('/organizaciones/nueva');
    expect(router.state.matches.at(-1)?.routeId).toBe('/organizaciones/nueva');
  });

  it('/organizaciones/nueva sin organizaciones lleva al onboarding de primera vez', async () => {
    const router = await loadRealRoute('/organizaciones/nueva', clientWith(session, 0));
    await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding'));
  });

  it('/organizaciones/nueva exige sesión y recuerda a dónde volver', async () => {
    const router = await loadRealRoute('/organizaciones/nueva', clientWith(null, 0));
    await waitFor(() => expect(router.state.location.pathname).toBe('/iniciar-sesion'));
    expect(router.state.location.search).toEqual({ redirect: '/organizaciones/nueva' });
  });

  it('/onboarding sigue devolviendo al panel si ya hay organizaciones', async () => {
    const router = await loadRealRoute('/onboarding', clientWith(session, 1));
    await waitFor(() => expect(router.state.location.pathname).toBe('/app'));
  });

  it('/onboarding sigue abriendo cuando aún no hay organizaciones', async () => {
    const router = await loadRealRoute('/onboarding', clientWith(session, 0));
    expect(router.state.location.pathname).toBe('/onboarding');
  });
});

describe('Registrar otra organización', () => {
  it('el menú de usuario abre el formulario con la cuenta actual', async () => {
    const router = renderAt('/app', clientWith(session, 1), UserMenu);

    fireEvent.keyDown(await screen.findByRole('button', { name: 'Menú de usuario' }), {
      key: 'Enter',
    });
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Registrar otra organización' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/organizaciones/nueva'));
    expect(
      await screen.findByRole('heading', { name: 'Registrar otra organización' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Cuenta: ana@empresa.com')).toBeInTheDocument();
  });

  it('crea la organización, la activa con el id nuevo y entra al panel', async () => {
    post.mockImplementation(async (path: string) =>
      path === '/api/v1/organizations'
        ? {
            data: { id: 'org-nueva', name: 'Redes del Sur', nit: '900123456-8' },
            response: { ok: true },
          }
        : { data: undefined, response: { ok: true } },
    );
    const router = renderAt('/organizaciones/nueva', clientWith(session, 1));

    fireEvent.change(await screen.findByLabelText('Nombre de la empresa'), {
      target: { value: 'Redes del Sur' },
    });
    fireEvent.change(screen.getByLabelText('Razón social'), {
      target: { value: 'Redes del Sur S.A.S.' },
    });
    fireEvent.change(screen.getByLabelText('NIT'), { target: { value: '900.123.456-8' } });
    fireEvent.click(screen.getByLabelText('11 - 50'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar y entrar al panel' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app'));
    expect(post.mock.calls).toEqual([
      [
        '/api/v1/organizations',
        {
          body: {
            name: 'Redes del Sur',
            legalName: 'Redes del Sur S.A.S.',
            nit: '900123456-8',
            size: '11-50',
          },
        },
      ],
      ['/api/v1/me/active-organization', { body: { organizationId: 'org-nueva' } }],
    ]);
  });

  it('si la API rechaza la organización no la activa ni sale del formulario', async () => {
    post.mockResolvedValue({
      data: undefined,
      error: undefined,
      response: { ok: false, status: 409 },
    });
    const router = renderAt('/organizaciones/nueva', clientWith(session, 1));

    fireEvent.change(await screen.findByLabelText('Nombre de la empresa'), {
      target: { value: 'Redes del Sur' },
    });
    fireEvent.change(screen.getByLabelText('Razón social'), {
      target: { value: 'Redes del Sur S.A.S.' },
    });
    fireEvent.change(screen.getByLabelText('NIT'), { target: { value: '900123456-8' } });
    fireEvent.click(screen.getByLabelText('1 - 10'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar y entrar al panel' }));

    expect(await screen.findByText(/No pudimos crear la organización/)).toBeInTheDocument();
    expect(post).toHaveBeenCalledTimes(1);
    expect(router.state.location.pathname).toBe('/organizaciones/nueva');
  });

  it('ofrece volver al panel', async () => {
    renderAt('/organizaciones/nueva', clientWith(session, 1));
    expect(await screen.findByRole('link', { name: 'Volver al panel' })).toHaveAttribute(
      'href',
      '/app',
    );
  });

  it('el onboarding conserva sus textos y el mismo formulario', async () => {
    renderAt('/onboarding', clientWith(session, 0));
    expect(
      await screen.findByRole('heading', { name: 'Personaliza tu espacio de trabajo' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre de la empresa')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar y entrar al panel' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Volver al panel' })).not.toBeInTheDocument();
  });
});
