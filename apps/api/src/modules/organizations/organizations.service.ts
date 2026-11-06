import { randomUUID } from 'node:crypto';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  type CursorPage,
  type CursorPageQuery,
  type OrganizationCreate,
  OWNER_ROLE_KEY,
  PERMISSIONS,
  type Permission,
  permissionSchema,
} from '@telcobras/contracts';
import { and, eq, inArray } from 'drizzle-orm';
import { afterCursor, encodeCursor, newestFirst } from '../../common/pagination.js';
import type { RequestActor } from '../../common/request-actor.js';
import type { Database } from '../../database/database.js';
import { DB } from '../../database/db.module.js';
import {
  auditLogs,
  membershipRoles,
  memberships,
  organizations,
  rolePermissions,
  roles,
} from '../../database/schema/index.js';
import { insertSeedRoles } from '../../database/seed-roles.js';
import { withTenant, withUser } from '../../database/tenant.js';

export type OrganizationSummary = {
  id: string;
  name: string;
  nit: string;
  isActive: boolean;
};

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DB) private readonly db: Database) {}

  async create(
    actor: RequestActor,
    input: OrganizationCreate,
  ): Promise<Omit<OrganizationSummary, 'isActive'>> {
    const organizationId = randomUUID();
    return withTenant(this.db, { orgId: organizationId, userId: actor.userId }, async (tx) => {
      const [organization] = await tx
        .insert(organizations)
        .values({
          id: organizationId,
          ...input,
          createdBy: actor.userId,
        })
        .returning({
          id: organizations.id,
          name: organizations.name,
          nit: organizations.nit,
        });
      if (!organization) throw new Error('Organization insert returned no row');

      const [membership] = await tx
        .insert(memberships)
        .values({ organizationId, userId: actor.userId })
        .returning({ id: memberships.id });
      if (!membership) throw new Error('Membership insert returned no row');

      await insertSeedRoles(tx, organizationId);
      const [ownerRole] = await tx
        .select({ id: roles.id })
        .from(roles)
        .where(and(eq(roles.organizationId, organizationId), eq(roles.key, OWNER_ROLE_KEY)))
        .limit(1);
      if (!ownerRole) throw new Error('Seed owner role was not created');

      await tx.insert(membershipRoles).values({
        organizationId,
        membershipId: membership.id,
        roleId: ownerRole.id,
      });
      await tx.insert(auditLogs).values({
        organizationId,
        actorUserId: actor.userId,
        action: 'organization.create',
        resourceType: 'organization',
        resourceId: organizationId,
        result: 'success',
      });

      return organization;
    });
  }

  async list(
    actor: RequestActor,
    { cursor, limit }: CursorPageQuery,
  ): Promise<CursorPage<OrganizationSummary>> {
    const rows = await withUser(this.db, actor.userId, (tx) =>
      tx
        .select({
          membershipId: memberships.id,
          createdAt: memberships.createdAt,
          id: organizations.id,
          name: organizations.name,
          nit: organizations.nit,
        })
        .from(memberships)
        .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
        .where(
          and(
            eq(memberships.userId, actor.userId),
            eq(memberships.status, 'active'),
            afterCursor(memberships, cursor),
          ),
        )
        .orderBy(...newestFirst(memberships))
        .limit(limit + 1),
    );
    const pageRows = rows.slice(0, limit);
    const last = pageRows.at(-1);
    return {
      items: pageRows.map(({ id, name, nit }) => ({
        id,
        name,
        nit,
        isActive: id === actor.orgId,
      })),
      nextCursor:
        rows.length > limit && last
          ? encodeCursor({ createdAt: last.createdAt, id: last.membershipId })
          : null,
    };
  }

  async setActive(actor: RequestActor, organizationId: string): Promise<void> {
    const access = await withUser(this.db, actor.userId, (tx) =>
      tx
        .select({ status: memberships.status, organizationStatus: organizations.status })
        .from(memberships)
        .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
        .where(
          and(eq(memberships.userId, actor.userId), eq(memberships.organizationId, organizationId)),
        )
        .limit(1),
    );
    if (access[0]?.status !== 'active' || access[0]?.organizationStatus !== 'active') {
      throw new ForbiddenException('You do not have access to this organization');
    }
  }

  async permissions(actor: RequestActor): Promise<Permission[]> {
    if (!actor.orgId) throw new ForbiddenException('Select an organization first');
    const rows = await withTenant(this.db, { orgId: actor.orgId, userId: actor.userId }, (tx) =>
      tx
        .select({ key: rolePermissions.permissionKey })
        .from(membershipRoles)
        .innerJoin(
          rolePermissions,
          and(
            eq(rolePermissions.organizationId, membershipRoles.organizationId),
            eq(rolePermissions.roleId, membershipRoles.roleId),
          ),
        )
        .innerJoin(
          memberships,
          and(
            eq(memberships.organizationId, membershipRoles.organizationId),
            eq(memberships.id, membershipRoles.membershipId),
          ),
        )
        .where(
          and(
            eq(memberships.userId, actor.userId),
            eq(memberships.status, 'active'),
            inArray(rolePermissions.permissionKey, [...PERMISSIONS]),
          ),
        ),
    );
    return [...new Set(rows.map(({ key }) => permissionSchema.parse(key)))];
  }
}
