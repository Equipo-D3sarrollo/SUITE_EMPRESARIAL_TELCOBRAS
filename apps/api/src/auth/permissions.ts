import { ForbiddenException } from '@nestjs/common';
import type { Permission } from '@telcobras/contracts';
import { and, eq } from 'drizzle-orm';
import { membershipRoles, memberships, rolePermissions } from '../database/schema/index.js';
import type { Transaction } from '../database/tenant.js';

/**
 * Exige que el usuario tenga el permiso en la organización de la transacción (withTenant).
 * Va dentro de la misma transacción que la operación, para que el permiso y el cambio se lean juntos.
 */
export async function assertPermission(
  tx: Transaction,
  userId: string,
  permission: Permission,
): Promise<void> {
  const [granted] = await tx
    .select({ key: rolePermissions.permissionKey })
    .from(memberships)
    .innerJoin(
      membershipRoles,
      and(
        eq(membershipRoles.organizationId, memberships.organizationId),
        eq(membershipRoles.membershipId, memberships.id),
      ),
    )
    .innerJoin(
      rolePermissions,
      and(
        eq(rolePermissions.organizationId, membershipRoles.organizationId),
        eq(rolePermissions.roleId, membershipRoles.roleId),
      ),
    )
    .where(
      and(
        eq(memberships.userId, userId),
        eq(memberships.status, 'active'),
        eq(rolePermissions.permissionKey, permission),
      ),
    )
    .limit(1);
  if (!granted) throw new ForbiddenException(`Missing permission: ${permission}`);
}
