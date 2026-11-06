import { randomUUID } from 'node:crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Mailer } from '../src/auth/auth.module.js';
import type { RequestActor } from '../src/common/request-actor.js';
import {
  invitations,
  membershipRoles,
  memberships,
  roles,
  users,
} from '../src/database/schema/index.js';
import { withTenant } from '../src/database/tenant.js';
import { InvitationsService } from '../src/modules/invitations/invitations.service.js';
import { OrganizationsService } from '../src/modules/organizations/organizations.service.js';
import { appDatabase, dropOrganizations, ownerDatabase } from './support/database.js';

const db = appDatabase(1);
const ownerDb = ownerDatabase();
const organizations = new OrganizationsService(db);
const sentMessages: Parameters<Mailer['sendMail']>[0][] = [];
const mailer: Mailer = {
  async sendMail(message) {
    sentMessages.push(message);
  },
};
const invitationsService = new InvitationsService(db, mailer, {
  WEB_ORIGIN: 'http://localhost:5173',
  MAIL_FROM: 'noreply@example.com',
});
const ownerActor: RequestActor = { userId: randomUUID(), orgId: null };
const organizationIds: string[] = [];
const userIds: string[] = [];

let organizationId = '';
let basicRoleId = '';
let managerRoleId = '';
let ownerRoleId = '';

beforeAll(async () => {
  const organization = await organizations.create(ownerActor, {
    name: 'Organización de invitaciones',
    legalName: 'Organización de invitaciones S.A.S.',
    nit: '123456789-6',
    size: '1-10',
  });
  organizationId = organization.id;
  organizationIds.push(organizationId);

  const seededRoles = await withTenant(
    db,
    { orgId: organizationId, userId: ownerActor.userId },
    (tx) =>
      tx
        .select({ id: roles.id, key: roles.key })
        .from(roles)
        .where(eq(roles.organizationId, organizationId)),
  );
  basicRoleId = roleId(seededRoles, 'basic');
  managerRoleId = roleId(seededRoles, 'manager');
  ownerRoleId = roleId(seededRoles, 'owner');
}, 30_000);

afterAll(async () => {
  await dropOrganizations(ownerDb, organizationIds);
  if (userIds.length > 0) {
    await ownerDb.delete(users).where(inArray(users.id, userIds));
  }
  await Promise.all([db.$client.end(), ownerDb.$client.end()]);
});

describe('invitaciones', () => {
  it('envía un token no persistido en claro y agrega la membresía con el rol al aceptarlo', async () => {
    const invitee = await createUser('invitado@example.com');
    const invitation = await invitationsService.create(
      { ...ownerActor, orgId: organizationId },
      { email: invitee.email, roleId: basicRoleId },
    );
    const token = tokenFrom(sentMessages.at(-1)?.text);
    const stored = await withTenant(
      db,
      { orgId: organizationId, userId: ownerActor.userId },
      (tx) =>
        tx
          .select({ tokenHash: invitations.tokenHash })
          .from(invitations)
          .where(eq(invitations.id, invitation.id)),
    );
    expect(stored[0]?.tokenHash).not.toBe(token);

    await expect(
      invitationsService.accept({ userId: invitee.id, orgId: null }, token),
    ).resolves.toEqual({ organizationId });

    const membership = await withTenant(db, { orgId: organizationId, userId: invitee.id }, (tx) =>
      tx
        .select({ roleId: membershipRoles.roleId })
        .from(memberships)
        .innerJoin(
          membershipRoles,
          and(
            eq(membershipRoles.organizationId, memberships.organizationId),
            eq(membershipRoles.membershipId, memberships.id),
          ),
        )
        .where(
          and(eq(memberships.organizationId, organizationId), eq(memberships.userId, invitee.id)),
        ),
    );
    expect(membership).toEqual([{ roleId: basicRoleId }]);
    await expect(
      invitationsService.accept({ userId: invitee.id, orgId: null }, token),
    ).rejects.toThrow('already accepted');
  });

  it('solo permite aceptar con una cuenta verificada que coincide con el correo invitado', async () => {
    const invitee = await createUser('persona-correcta@example.com');
    const wrongEmailUser = await createUser('otra-persona@example.com');
    const invitation = await invitationsService.create(
      { ...ownerActor, orgId: organizationId },
      { email: invitee.email, roleId: basicRoleId },
    );
    const token = tokenFrom(sentMessages.at(-1)?.text);

    await expect(
      invitationsService.accept({ userId: wrongEmailUser.id, orgId: null }, token),
    ).rejects.toThrow('verified account with the invited email');

    const unverifiedInvitee = await createUser('sin-verificar@example.com', false);
    const unverifiedInvitation = await invitationsService.create(
      { ...ownerActor, orgId: organizationId },
      { email: unverifiedInvitee.email, roleId: basicRoleId },
    );
    const unverifiedToken = tokenFrom(sentMessages.at(-1)?.text);
    await expect(
      invitationsService.accept({ userId: unverifiedInvitee.id, orgId: null }, unverifiedToken),
    ).rejects.toThrow('verified account with the invited email');

    const pending = await withTenant(
      db,
      { orgId: organizationId, userId: ownerActor.userId },
      (tx) =>
        tx
          .select({ acceptedAt: invitations.acceptedAt })
          .from(invitations)
          .where(inArray(invitations.id, [invitation.id, unverifiedInvitation.id])),
    );
    expect(pending.map(({ acceptedAt }) => acceptedAt)).toEqual([null, null]);
  });

  it('no permite invitar sin permiso ni asignar permisos que el invitador no tiene', async () => {
    const basicActor = await createMember(basicRoleId);
    await expect(
      invitationsService.create(basicActor, {
        email: 'sin-permiso@example.com',
        roleId: basicRoleId,
      }),
    ).rejects.toThrow('permission to invite members');

    const managerActor = await createMember(managerRoleId);
    await expect(
      invitationsService.create(managerActor, {
        email: 'escalamiento@example.com',
        roleId: ownerRoleId,
      }),
    ).rejects.toThrow('permissions you do not have');
  });

  it('rechaza tokens mal formados antes de consultar la base', async () => {
    await expect(
      invitationsService.accept({ userId: randomUUID(), orgId: null }, 'token-invalido'),
    ).rejects.toThrow('Invitation not found');
  });
});

async function createUser(
  email: string,
  emailVerified = true,
): Promise<{ id: string; email: string }> {
  const id = randomUUID();
  userIds.push(id);
  await db.insert(users).values({ id, name: email, email, emailVerified });
  return { id, email };
}

async function createMember(roleId: string): Promise<RequestActor> {
  const actor = { userId: randomUUID(), orgId: organizationId };
  await withTenant(db, { orgId: organizationId, userId: actor.userId }, async (tx) => {
    const [membership] = await tx
      .insert(memberships)
      .values({ organizationId, userId: actor.userId })
      .returning({ id: memberships.id });
    if (!membership) throw new Error('Membership insert returned no row');
    await tx.insert(membershipRoles).values({
      organizationId,
      membershipId: membership.id,
      roleId,
    });
  });
  return actor;
}

function roleId(rows: { id: string; key: string }[], key: string): string {
  const role = rows.find((row) => row.key === key);
  if (!role) throw new Error(`Seed role ${key} was not created`);
  return role.id;
}

function tokenFrom(message: string | undefined): string {
  const token = message?.match(/\/invitacion\/([^\s]+)/)?.[1];
  if (!token) throw new Error('Invitation email did not contain a token link');
  return token;
}
