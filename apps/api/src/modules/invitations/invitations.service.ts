import { createHash, randomBytes } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type InvitationCreate } from '@telcobras/contracts';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { MAILER, type Mailer } from '../../auth/auth.module.js';
import type { RequestActor } from '../../common/request-actor.js';
import { ENV } from '../../config/config.module.js';
import type { Env } from '../../config/env.js';
import type { Database } from '../../database/database.js';
import { DB } from '../../database/db.module.js';
import {
  auditLogs,
  invitations,
  membershipRoles,
  memberships,
  organizations,
  rolePermissions,
  roles,
  users,
} from '../../database/schema/index.js';
import { withTenant } from '../../database/tenant.js';

const INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class InvitationsService {
  constructor(
    @Inject(DB) private readonly db: Database,
    @Inject(MAILER) private readonly mailer: Mailer,
    @Inject(ENV) private readonly env: Pick<Env, 'WEB_ORIGIN' | 'MAIL_FROM'>,
  ) {}

  async create(
    actor: RequestActor,
    input: InvitationCreate,
  ): Promise<{ id: string; email: string; roleId: string; expiresAt: Date }> {
    if (!actor.orgId) throw new ForbiddenException('Select an organization first');

    const organizationId = actor.orgId;
    const token = `${organizationId}.${randomBytes(32).toString('base64url')}`;
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + INVITATION_LIFETIME_MS);

    return withTenant(this.db, { orgId: organizationId, userId: actor.userId }, async (tx) => {
      const inviterPermissions = await tx
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
        .where(and(eq(memberships.userId, actor.userId), eq(memberships.status, 'active')));
      const inviterPermissionKeys = new Set(inviterPermissions.map(({ key }) => key));
      if (!inviterPermissionKeys.has('members:invite')) {
        throw new ForbiddenException('You do not have permission to invite members');
      }

      const [targetRole] = await tx
        .select({ id: roles.id })
        .from(roles)
        .where(and(eq(roles.organizationId, organizationId), eq(roles.id, input.roleId)))
        .limit(1);
      if (!targetRole) throw new NotFoundException('Role not found');
      const targetPermissions = await tx
        .select({ key: rolePermissions.permissionKey })
        .from(rolePermissions)
        .where(
          and(
            eq(rolePermissions.organizationId, organizationId),
            eq(rolePermissions.roleId, targetRole.id),
          ),
        );
      if (targetPermissions.some(({ key }) => !inviterPermissionKeys.has(key))) {
        throw new ForbiddenException('You cannot assign a role with permissions you do not have');
      }

      const [existingUser] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
      if (existingUser) {
        const [existingMembership] = await tx
          .select({ id: memberships.id })
          .from(memberships)
          .where(
            and(
              eq(memberships.organizationId, organizationId),
              eq(memberships.userId, existingUser.id),
            ),
          )
          .limit(1);
        if (existingMembership) throw new ConflictException('User is already a member');
      }

      const [invitation] = await tx
        .insert(invitations)
        .values({
          organizationId,
          email: input.email,
          roleId: input.roleId,
          tokenHash,
          expiresAt,
          invitedBy: actor.userId,
        })
        .returning({
          id: invitations.id,
          email: invitations.email,
          roleId: invitations.roleId,
          expiresAt: invitations.expiresAt,
        });
      if (!invitation) throw new Error('Invitation insert returned no row');

      await tx.insert(auditLogs).values({
        organizationId,
        actorUserId: actor.userId,
        action: 'invitation.create',
        resourceType: 'invitation',
        resourceId: invitation.id,
        result: 'success',
      });

      const invitationUrl = new URL(`/invitacion/${token}`, this.env.WEB_ORIGIN).toString();
      await this.mailer.sendMail({
        from: this.env.MAIL_FROM,
        to: invitation.email,
        subject: 'Te invitaron a OrveX.IA',
        text: `Acepta la invitación a la organización desde este enlace: ${invitationUrl}\n\nEl enlace vence el ${invitation.expiresAt.toLocaleString('es-CO', { timeZone: 'America/Bogota' })}.`,
      });

      return invitation;
    });
  }

  async accept(actor: RequestActor, token: string): Promise<{ organizationId: string }> {
    const parsedToken = parseToken(token);
    if (!parsedToken) throw new NotFoundException('Invitation not found');
    const { organizationId, tokenHash } = parsedToken;

    return withTenant(this.db, { orgId: organizationId, userId: actor.userId }, async (tx) => {
      const [invitation] = await tx
        .select({
          id: invitations.id,
          email: invitations.email,
          roleId: invitations.roleId,
          expiresAt: invitations.expiresAt,
          acceptedAt: invitations.acceptedAt,
          organizationStatus: organizations.status,
        })
        .from(invitations)
        .innerJoin(organizations, eq(organizations.id, invitations.organizationId))
        .where(eq(invitations.tokenHash, tokenHash))
        .limit(1);
      if (!invitation) throw new NotFoundException('Invitation not found');
      if (invitation.acceptedAt || invitation.expiresAt <= new Date()) {
        throw new GoneException('Invitation has expired or was already accepted');
      }
      if (invitation.organizationStatus !== 'active') {
        throw new GoneException('Organization is not active');
      }

      const [user] = await tx
        .select({ email: users.email, emailVerified: users.emailVerified })
        .from(users)
        .where(eq(users.id, actor.userId))
        .limit(1);
      if (!user?.emailVerified || user.email.trim().toLowerCase() !== invitation.email) {
        throw new ForbiddenException('Use a verified account with the invited email address');
      }

      const [existingMembership] = await tx
        .select({ id: memberships.id })
        .from(memberships)
        .where(
          and(eq(memberships.organizationId, organizationId), eq(memberships.userId, actor.userId)),
        )
        .limit(1);
      if (existingMembership) throw new ConflictException('User is already a member');

      const [claimed] = await tx
        .update(invitations)
        .set({ acceptedAt: new Date() })
        .where(
          and(
            eq(invitations.id, invitation.id),
            isNull(invitations.acceptedAt),
            gt(invitations.expiresAt, new Date()),
          ),
        )
        .returning({ id: invitations.id });
      if (!claimed) throw new GoneException('Invitation has expired or was already accepted');

      const [membership] = await tx
        .insert(memberships)
        .values({ organizationId, userId: actor.userId })
        .returning({ id: memberships.id });
      if (!membership) throw new Error('Membership insert returned no row');

      await tx.insert(membershipRoles).values({
        organizationId,
        membershipId: membership.id,
        roleId: invitation.roleId,
      });
      await tx.insert(auditLogs).values({
        organizationId,
        actorUserId: actor.userId,
        action: 'invitation.accept',
        resourceType: 'invitation',
        resourceId: invitation.id,
        result: 'success',
      });

      return { organizationId };
    });
  }
}

function parseToken(token: string): { organizationId: string; tokenHash: string } | null {
  const [rawOrganizationId, secret, ...extra] = token.split('.');
  const parsedOrganizationId = z.uuid().safeParse(rawOrganizationId);
  if (
    !parsedOrganizationId.success ||
    !secret ||
    extra.length > 0 ||
    !/^[A-Za-z0-9_-]{43}$/.test(secret)
  ) {
    return null;
  }
  return {
    organizationId: parsedOrganizationId.data,
    tokenHash: createHash('sha256').update(token).digest('hex'),
  };
}
