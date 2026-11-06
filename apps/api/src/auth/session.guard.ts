import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { and, eq } from 'drizzle-orm';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { RequestActor } from '../common/request-actor.js';
import type { Database } from '../database/database.js';
import { DB } from '../database/db.module.js';
import { memberships, organizations } from '../database/schema/index.js';
import { withUser } from '../database/tenant.js';
import { AUTH, type AuthInstance } from './auth.module.js';

export const ACTIVE_ORGANIZATION_COOKIE = 'active_organization_id';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(@Inject(AUTH) private readonly auth: AuthInstance) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session) throw new UnauthorizedException('Authentication required');

    const rawOrganizationId = request.cookies?.[ACTIVE_ORGANIZATION_COOKIE];
    const parsedOrganizationId = z.uuid().safeParse(rawOrganizationId);
    request.actor = {
      userId: session.user.id,
      orgId: parsedOrganizationId.success ? parsedOrganizationId.data : null,
    };
    return true;
  }
}

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(@Inject(DB) private readonly db: Database) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const actor = request.actor;
    if (!actor) throw new UnauthorizedException('Authentication required');
    if (!actor.orgId) throw new ForbiddenException('Select an organization first');
    const orgId = actor.orgId;

    const access = await withUser(this.db, actor.userId, (tx) =>
      tx
        .select({ membershipStatus: memberships.status, organizationStatus: organizations.status })
        .from(memberships)
        .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
        .where(and(eq(memberships.userId, actor.userId), eq(memberships.organizationId, orgId)))
        .limit(1),
    );
    if (access[0]?.membershipStatus !== 'active' || access[0]?.organizationStatus !== 'active') {
      throw new ForbiddenException('You do not have access to this organization');
    }
    return true;
  }
}

export function currentActor(request: FastifyRequest): RequestActor {
  if (!request.actor) throw new UnauthorizedException('Authentication required');
  return request.actor;
}
