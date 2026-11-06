import { SEED_ROLE_KEYS, SEED_ROLE_PERMISSIONS, type SeedRoleKey } from '@telcobras/contracts';
import { and, eq, inArray } from 'drizzle-orm';
import { rolePermissions, roles } from './schema/index.js';
import type { Transaction } from './tenant.js';

// Nombres iniciales de los roles semilla (PDF §4.4). Son datos de cada organización: se editan en Administración.
const SEED_ROLE_NAMES: Readonly<Record<SeedRoleKey, string>> = {
  owner: 'Administrador de empresa',
  manager: 'Gerente',
  sales: 'Comercial',
  admin_staff: 'Administrativo',
  accountant: 'Contador',
  operator: 'Operador',
  basic: 'Usuario básico',
};

/**
 * Crea los roles semilla de una organización con sus permisos; si ya existen, no cambia nada.
 * Corre dentro de withTenant de esa organización (seed y onboarding).
 */
export async function insertSeedRoles(tx: Transaction, organizationId: string): Promise<void> {
  await tx
    .insert(roles)
    .values(
      SEED_ROLE_KEYS.map((key) => ({
        organizationId,
        key,
        name: SEED_ROLE_NAMES[key],
        isSystem: true,
      })),
    )
    .onConflictDoNothing();

  const seeded = await tx
    .select({ id: roles.id, key: roles.key })
    .from(roles)
    .where(and(eq(roles.organizationId, organizationId), inArray(roles.key, SEED_ROLE_KEYS)));

  await tx
    .insert(rolePermissions)
    .values(
      seeded.flatMap(({ id, key }) =>
        SEED_ROLE_PERMISSIONS[key as SeedRoleKey].map((permissionKey) => ({
          organizationId,
          roleId: id,
          permissionKey,
        })),
      ),
    )
    .onConflictDoNothing();
}
