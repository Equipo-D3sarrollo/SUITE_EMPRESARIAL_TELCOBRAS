import { queryOptions } from '@tanstack/react-query';
import { MAX_PAGE_SIZE } from '@telcobras/contracts';
import { ApiError, api, unwrap } from './api-client';
import type { AuthSession } from './auth-client';

// staleTime por recurso (documento madre §19.2): la sesión y las organizaciones cambian poco; los permisos, más.

export const sessionQuery = queryOptions({
  queryKey: ['session'],
  // fetch directo a Better Auth: así su cliente completo no entra en el bundle inicial (documento madre §19.4).
  queryFn: async (): Promise<AuthSession | null> => {
    const response = await fetch('/api/auth/get-session');
    if (!response.ok) throw new ApiError(response.status, undefined);
    return response.json();
  },
  staleTime: 5 * 60_000,
});

export const organizationsQuery = queryOptions({
  queryKey: ['me', 'organizations'],
  // Un usuario pertenece a pocas organizaciones: una página de 100 las trae todas.
  queryFn: () =>
    unwrap(api.GET('/api/v1/me/organizations', { params: { query: { limit: MAX_PAGE_SIZE } } })),
  staleTime: 5 * 60_000,
});

export const permissionsQuery = queryOptions({
  queryKey: ['me', 'permissions'],
  queryFn: () => unwrap(api.GET('/api/v1/me/permissions')),
  staleTime: 60_000,
});
