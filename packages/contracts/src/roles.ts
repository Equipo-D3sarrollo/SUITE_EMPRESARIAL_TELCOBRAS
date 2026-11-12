import { PERMISSIONS, type Permission } from './permissions.js';

// Roles semilla de cada organización (PDF §4.4). Son datos iniciales: cada organización los edita sin migraciones.
// El Superadministrador Telcobras no es un rol de organización (Panel Global, etapa 12).
export const SEED_ROLE_KEYS = [
  'owner',
  'manager',
  'sales',
  'admin_staff',
  'accountant',
  'operator',
  'basic',
] as const;

export type SeedRoleKey = (typeof SEED_ROLE_KEYS)[number];

// Rol que recibe quien crea la organización. Conserva todos los permisos para que nadie quede sin acceso a la administración.
export const OWNER_ROLE_KEY = 'owner' satisfies SeedRoleKey;

export const SEED_ROLE_PERMISSIONS: Readonly<Record<SeedRoleKey, readonly Permission[]>> = {
  owner: PERMISSIONS,
  manager: [
    'dashboard:view',
    'commercial:view',
    'leadgen:view',
    'documents:view',
    'integrations:view',
    'automation:view',
    'ai:view',
    'analytics:view',
    'administration:view',
    'help:view',
    'organization:read',
    'members:read',
    'members:invite',
    'roles:read',
    'audit:read',
  ],
  sales: ['dashboard:view', 'commercial:view', 'leadgen:view', 'documents:view', 'help:view'],
  admin_staff: [
    'dashboard:view',
    'commercial:view',
    'documents:view',
    'analytics:view',
    'administration:view',
    'help:view',
    'organization:read',
    'members:read',
    'roles:read',
  ],
  accountant: [
    'dashboard:view',
    'documents:view',
    'documents:decide',
    'integrations:view',
    'analytics:view',
    'help:view',
  ],
  operator: [
    'dashboard:view',
    'documents:view',
    'integrations:view',
    'automation:view',
    'help:view',
  ],
  basic: ['dashboard:view', 'help:view'],
};
