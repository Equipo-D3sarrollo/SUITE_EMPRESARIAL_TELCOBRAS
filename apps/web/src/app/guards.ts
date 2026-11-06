import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { organizationsQuery, sessionQuery } from '@/lib/queries';

/**
 * A dónde volver después de entrar. Solo rutas internas ("/app/..."): evita redirecciones abiertas
 * a otros dominios ("//evil.com"). Sin zod a propósito: las guardas van en el bundle inicial.
 */
export function parseRedirect(value: unknown): string | undefined {
  return typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : undefined;
}

/** Sin sesión → login, recordando a dónde quería ir el usuario. */
export async function requireSession(queryClient: QueryClient, href: string) {
  const session = await queryClient.ensureQueryData(sessionQuery);
  if (!session) throw redirect({ to: '/iniciar-sesion', search: { redirect: href } });
  return session;
}

/** Sin organización → onboarding. */
export async function requireOrganization(queryClient: QueryClient) {
  const organizations = await queryClient.ensureQueryData(organizationsQuery);
  if (organizations.items.length === 0) throw redirect({ to: '/onboarding' });
}

/** Las páginas de acceso no tienen sentido con una sesión abierta. */
export async function redirectIfSignedIn(queryClient: QueryClient, target = '/app') {
  const session = await queryClient.ensureQueryData(sessionQuery);
  if (session) throw redirect({ href: target });
}
