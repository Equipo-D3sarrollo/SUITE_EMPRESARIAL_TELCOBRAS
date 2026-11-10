// Una cuenta con varias organizaciones (modelo Slack/Notion), contra la API real y con una sesión de Better Auth:
// crear otra organización sin volver a iniciar sesión, listarlas todas sin filtrar por rol y cambiar la activa.
// Las pruebas comparten la cuenta y corren en orden: cada una parte de las organizaciones de la anterior.
import { randomUUID } from 'node:crypto';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { OWNER_ROLE_KEY, SEED_ROLE_PERMISSIONS, type SeedRoleKey } from '@telcobras/contracts';
import { and, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { MAILER, type Mailer } from '../src/auth/auth.module.js';
import { ACTIVE_ORGANIZATION_COOKIE } from '../src/auth/session.guard.js';
import type { RequestActor } from '../src/common/request-actor.js';
import { membershipRoles, memberships, roles, users } from '../src/database/schema/index.js';
import { withTenant } from '../src/database/tenant.js';
import { InvitationsService } from '../src/modules/invitations/invitations.service.js';
import { OrganizationsService } from '../src/modules/organizations/organizations.service.js';
import { appDatabase, dropOrganizations, ownerDatabase } from './support/database.js';

type SentMessage = Parameters<Mailer['sendMail']>[0];
type OrganizationItem = { id: string; name: string; nit: string; isActive: boolean };

const db = appDatabase(1);
const ownerDb = ownerDatabase();
const sentMessages: SentMessage[] = [];
const organizationIds: string[] = [];
const email = `varias-org-${randomUUID().slice(0, 8)}@example.test`;
/** Cookies del navegador simulado: la de sesión de Better Auth y la de organización activa. */
const cookies = new Map<string, string>();

let app: NestFastifyApplication | undefined;
let userId = '';
let firstOrganizationId = '';
let secondOrganizationId = '';
let invitedOrganizationId = '';

beforeAll(async () => {
  app = await createApp();
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  // Better Auth y las invitaciones llaman a mailer.sendMail: se intercepta en lugar de mandar el correo por SMTP.
  vi.spyOn(app.get<Mailer>(MAILER), 'sendMail').mockImplementation(async (message) => {
    sentMessages.push(message);
  });

  // Cuenta nueva por el camino de /registro: código al correo y nombre.
  await request('POST', '/api/auth/email-otp/send-verification-otp', { email, type: 'sign-in' });
  const signIn = await request('POST', '/api/auth/sign-in/email-otp', {
    email,
    otp: codeFrom(lastMessageTo(email)),
    name: 'Persona con varias empresas',
  });
  if (signIn.statusCode !== 200) throw new Error(`No se abrió la sesión: ${signIn.statusCode}`);
  userId = signIn.json<{ user: { id: string } }>().user.id;
}, 30_000);

afterAll(async () => {
  // Cierra la sesión (vive en Valkey) y borra lo creado: las organizaciones en cascada y la cuenta de prueba.
  if (app && cookies.size > 0) {
    await request('POST', '/api/auth/sign-out', {}).catch(() => undefined);
  }
  await dropOrganizations(ownerDb, organizationIds);
  await ownerDb.delete(users).where(eq(users.email, email));
  await Promise.all([app?.close(), db.$client.end(), ownerDb.$client.end()]);
});

describe('una cuenta con varias organizaciones', () => {
  it('una cuenta nueva no tiene organizaciones: el onboarding de primera vez no cambia', async () => {
    expect(await myOrganizations()).toEqual([]);
    expect(cookies.has(ACTIVE_ORGANIZATION_COOKIE)).toBe(false);
  });

  it('quien ya es propietaria crea otra organización con la misma sesión, la ve junto a la primera y la activa', async () => {
    firstOrganizationId = await createOrganization('Primera empresa');
    expect((await activate(firstOrganizationId)).statusCode).toBe(204);
    expect(activeByOrganization(await myOrganizations())).toEqual({ [firstOrganizationId]: true });

    // «Registrar otra organización»: la misma sesión, sin volver a iniciar sesión.
    secondOrganizationId = await createOrganization('Segunda empresa');
    expect(activeByOrganization(await myOrganizations())).toEqual({
      [firstOrganizationId]: true,
      [secondOrganizationId]: false,
    });

    const switched = await activate(secondOrganizationId);
    expect(switched.statusCode).toBe(204);
    expect(cookies.get(ACTIVE_ORGANIZATION_COOKIE)).toBe(secondOrganizationId);
    expect(activeByOrganization(await myOrganizations())).toEqual({
      [firstOrganizationId]: false,
      [secondOrganizationId]: true,
    });

    // Queda como propietaria de la nueva, con sus permisos en la organización activa.
    expect(await roleKeysInOrganization(secondOrganizationId)).toEqual([OWNER_ROLE_KEY]);
    const permissions = await myPermissions();
    expect(permissions).toContain('organization:update');
    expect(permissions).toContain('members:invite');
  });

  it('lista también las organizaciones donde la cuenta tiene otro rol, sin filtrar por rol', async () => {
    const inviting = await foreignOrganization('Empresa que invita');
    await api()
      .get(InvitationsService)
      .create(inviting.owner, {
        email,
        roleId: await roleIdInOrganization(inviting.id, 'basic'),
      });
    const accepted = await request(
      'POST',
      `/api/v1/invitations/${tokenFrom(lastMessageTo(email))}/accept`,
      {},
    );
    expect(accepted.statusCode).toBe(200);
    invitedOrganizationId = inviting.id;
    expect(await roleKeysInOrganization(invitedOrganizationId)).toEqual(['basic']);

    // Aceptar la invitación no cambia la organización activa.
    expect(activeByOrganization(await myOrganizations())).toEqual({
      [firstOrganizationId]: false,
      [secondOrganizationId]: true,
      [invitedOrganizationId]: false,
    });

    expect((await activate(invitedOrganizationId)).statusCode).toBe(204);
    expect(activeByOrganization(await myOrganizations())).toEqual({
      [firstOrganizationId]: false,
      [secondOrganizationId]: false,
      [invitedOrganizationId]: true,
    });
    expect((await myPermissions()).sort()).toEqual([...SEED_ROLE_PERMISSIONS.basic].sort());
  });

  it('no lista ni deja activar organizaciones ajenas ni membresías suspendidas', async () => {
    // La regla del servicio para una organización ajena ya la cubre organizations.test.ts; aquí se comprueba por
    // HTTP, junto con la cookie de organización activa.
    const foreign = await foreignOrganization('Empresa ajena');
    const suspended = await foreignOrganization('Empresa con membresía suspendida');
    await addSuspendedMembership(suspended.id, await roleIdInOrganization(suspended.id, 'basic'));
    const activeBefore = cookies.get(ACTIVE_ORGANIZATION_COOKIE);

    const listed = (await myOrganizations()).map(({ id }) => id);
    expect(listed.sort()).toEqual(
      [firstOrganizationId, secondOrganizationId, invitedOrganizationId].sort(),
    );

    for (const organizationId of [foreign.id, suspended.id]) {
      const response = await activate(organizationId);
      expect(response.statusCode).toBe(403);
      expect(String(response.headers['set-cookie'] ?? '')).not.toContain(
        ACTIVE_ORGANIZATION_COOKIE,
      );
    }
    expect(cookies.get(ACTIVE_ORGANIZATION_COOKIE)).toBe(activeBefore);
    expect(activeByOrganization(await myOrganizations())).toEqual({
      [firstOrganizationId]: false,
      [secondOrganizationId]: false,
      [invitedOrganizationId]: true,
    });
  });
});

function api(): NestFastifyApplication {
  if (!app) throw new Error('La API de prueba no arrancó');
  return app;
}

/** Petición como la SPA: mismo origen y con las cookies guardadas; guarda las que devuelva la respuesta. */
async function request(method: 'GET' | 'POST', url: string, payload?: Record<string, unknown>) {
  const cookie = [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
  const response = await api().inject({
    method,
    url,
    headers: { origin: process.env.WEB_ORIGIN ?? '', ...(cookie ? { cookie } : {}) },
    ...(payload ? { payload } : {}),
  });
  storeCookies(response.headers['set-cookie']);
  return response;
}

function storeCookies(setCookie: string | string[] | undefined): void {
  const received = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  for (const header of received) {
    const [pair = '', ...attributes] = header.split(';');
    const separator = pair.indexOf('=');
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    const expired = attributes.some((attribute) => /^\s*max-age=0\s*$/i.test(attribute));
    if (!value || expired) cookies.delete(name);
    else cookies.set(name, value);
  }
}

async function createOrganization(name: string): Promise<string> {
  const response = await request('POST', '/api/v1/organizations', {
    name,
    legalName: `${name} S.A.S.`,
    nit: '123456789-6',
    size: '1-10',
  });
  expect(response.statusCode).toBe(201);
  const { id } = response.json<{ id: string }>();
  organizationIds.push(id);
  return id;
}

function activate(organizationId: string) {
  return request('POST', '/api/v1/me/active-organization', { organizationId });
}

async function myOrganizations(): Promise<OrganizationItem[]> {
  const response = await request('GET', '/api/v1/me/organizations');
  expect(response.statusCode).toBe(200);
  return response.json<{ items: OrganizationItem[] }>().items;
}

async function myPermissions(): Promise<string[]> {
  const response = await request('GET', '/api/v1/me/permissions');
  expect(response.statusCode).toBe(200);
  return response.json<{ permissions: string[] }>().permissions;
}

function activeByOrganization(items: OrganizationItem[]): Record<string, boolean> {
  return Object.fromEntries(items.map(({ id, isActive }) => [id, isActive]));
}

/** Organización de otra persona (sin cuenta de prueba: memberships.user_id no exige un usuario). */
async function foreignOrganization(name: string): Promise<{ id: string; owner: RequestActor }> {
  const ownerUserId = randomUUID();
  const { id } = await api()
    .get(OrganizationsService)
    .create(
      { userId: ownerUserId, orgId: null },
      { name, legalName: `${name} S.A.S.`, nit: '987654321-7', size: '11-50' },
    );
  organizationIds.push(id);
  return { id, owner: { userId: ownerUserId, orgId: id } };
}

async function roleIdInOrganization(organizationId: string, key: SeedRoleKey): Promise<string> {
  const [role] = await withTenant(db, { orgId: organizationId, userId }, (tx) =>
    tx
      .select({ id: roles.id })
      .from(roles)
      .where(and(eq(roles.organizationId, organizationId), eq(roles.key, key)))
      .limit(1),
  );
  if (!role) throw new Error(`No existe el rol semilla ${key}`);
  return role.id;
}

async function roleKeysInOrganization(organizationId: string): Promise<string[]> {
  const rows = await withTenant(db, { orgId: organizationId, userId }, (tx) =>
    tx
      .select({ key: roles.key })
      .from(memberships)
      .innerJoin(
        membershipRoles,
        and(
          eq(membershipRoles.organizationId, memberships.organizationId),
          eq(membershipRoles.membershipId, memberships.id),
        ),
      )
      .innerJoin(
        roles,
        and(
          eq(roles.organizationId, membershipRoles.organizationId),
          eq(roles.id, membershipRoles.roleId),
        ),
      )
      .where(and(eq(memberships.organizationId, organizationId), eq(memberships.userId, userId))),
  );
  return rows.map(({ key }) => key);
}

async function addSuspendedMembership(organizationId: string, roleId: string): Promise<void> {
  await withTenant(db, { orgId: organizationId, userId }, async (tx) => {
    const [membership] = await tx
      .insert(memberships)
      .values({ organizationId, userId, status: 'suspended' })
      .returning({ id: memberships.id });
    if (!membership) throw new Error('Membership insert returned no row');
    await tx
      .insert(membershipRoles)
      .values({ organizationId, membershipId: membership.id, roleId });
  });
}

function lastMessageTo(to: string): SentMessage {
  const message = sentMessages.findLast((sent) => sent.to === to);
  if (!message) throw new Error(`No se envió ningún correo a ${to}`);
  return message;
}

function codeFrom(message: SentMessage): string {
  const otp = /\b(\d{6})\b/.exec(message.text)?.[1];
  if (!otp) throw new Error('El correo no trae un código de 6 dígitos');
  return otp;
}

function tokenFrom(message: SentMessage): string {
  const token = message.text.match(/\/invitacion\/([^\s]+)/)?.[1];
  if (!token) throw new Error('El correo de invitación no trae el enlace con el token');
  return token;
}
