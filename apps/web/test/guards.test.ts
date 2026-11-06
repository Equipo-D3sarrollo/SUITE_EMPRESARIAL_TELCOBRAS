import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import {
  parseRedirect,
  redirectIfSignedIn,
  requireOrganization,
  requireSession,
} from '@/app/guards';
import type { AuthSession } from '@/lib/auth-client';
import { organizationsQuery, sessionQuery } from '@/lib/queries';

const session = { user: { id: 'u1' }, session: { id: 's1' } } as AuthSession;

function clientWith(sessionData: AuthSession | null, organizationCount = 1) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(sessionQuery.queryKey, sessionData);
  queryClient.setQueryData(organizationsQuery.queryKey, {
    items: Array.from({ length: organizationCount }, (_, index) => ({
      id: `org-${index}`,
      name: `Org ${index}`,
      nit: '900123456-7',
      isActive: index === 0,
    })),
    nextCursor: null,
  });
  return queryClient;
}

async function redirectOf(promise: Promise<unknown>) {
  const error = await promise.then(
    () => undefined,
    (thrown: unknown) => thrown,
  );
  return (error as { options?: unknown } | undefined)?.options;
}

describe('guardas de ruta', () => {
  it('sin sesión manda al login recordando la ruta pedida', async () => {
    expect(await redirectOf(requireSession(clientWith(null), '/app/help/noc-support'))).toEqual(
      expect.objectContaining({
        to: '/iniciar-sesion',
        search: { redirect: '/app/help/noc-support' },
      }),
    );
  });

  it('con sesión deja pasar', async () => {
    await expect(requireSession(clientWith(session), '/app')).resolves.toBe(session);
  });

  it('sin organización manda al onboarding', async () => {
    expect(await redirectOf(requireOrganization(clientWith(session, 0)))).toEqual(
      expect.objectContaining({ to: '/onboarding' }),
    );
    await expect(requireOrganization(clientWith(session, 2))).resolves.toBeUndefined();
  });

  it('las páginas de acceso redirigen a la app si ya hay sesión', async () => {
    expect(await redirectOf(redirectIfSignedIn(clientWith(session), '/app/help/faq'))).toEqual(
      expect.objectContaining({ href: '/app/help/faq' }),
    );
    await expect(redirectIfSignedIn(clientWith(null))).resolves.toBeUndefined();
  });

  it('solo acepta redirecciones a rutas internas', () => {
    expect(parseRedirect('/app/dashboard/overview?x=1')).toBe('/app/dashboard/overview?x=1');
    expect(parseRedirect('//evil.example')).toBeUndefined();
    expect(parseRedirect('/\\evil.example')).toBeUndefined();
    expect(parseRedirect('https://evil.example')).toBeUndefined();
    expect(parseRedirect(42)).toBeUndefined();
  });
});
