import { PERMISSIONS, type Permission, SEED_ROLE_PERMISSIONS } from '@telcobras/contracts';
import { HttpResponse, http } from 'msw';
import { MOCK_ORG_NIT, MOCK_USER, nitWithDv } from './fixtures';

/** Perfiles de la sesión simulada (§4.4): owner, accountant y viewer. */
export const MOCK_PROFILES = {
  owner: [...PERMISSIONS],
  accountant: [...SEED_ROLE_PERMISSIONS.accountant],
  viewer: ['dashboard:view', 'documents:view', 'help:view'],
} satisfies Record<string, Permission[]>;

export type MockProfile = keyof typeof MOCK_PROFILES;

export const isMockProfile = (value: unknown): value is MockProfile =>
  typeof value === 'string' && value in MOCK_PROFILES;

/** Sesión, organización y permisos simulados: la SPA entra sin API ni Better Auth. */
export function createSessionHandlers(profile: MockProfile) {
  const nowIso = new Date().toISOString();
  return [
    http.get('*/api/auth/get-session', () =>
      HttpResponse.json({
        session: {
          id: 'mock-session',
          userId: MOCK_USER.id,
          token: 'mock',
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
          createdAt: nowIso,
          updatedAt: nowIso,
        },
        user: {
          id: MOCK_USER.id,
          name: MOCK_USER.name,
          email: 'contabilidad@organizacion.example',
          emailVerified: true,
          image: null,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
      }),
    ),
    http.get('*/api/v1/me/organizations', () =>
      HttpResponse.json({
        items: [
          {
            id: '0192f7a0-0000-7000-8000-0000000000aa',
            name: 'Organización de prueba',
            nit: nitWithDv(MOCK_ORG_NIT),
            isActive: true,
          },
        ],
        nextCursor: null,
      }),
    ),
    http.get('*/api/v1/me/permissions', () =>
      HttpResponse.json({ permissions: MOCK_PROFILES[profile] }),
    ),
    http.post('*/api/v1/me/active-organization', () => new HttpResponse(null, { status: 204 })),
  ];
}
