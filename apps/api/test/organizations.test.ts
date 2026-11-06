import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { RequestActor } from '../src/common/request-actor.js';
import { OrganizationsService } from '../src/modules/organizations/organizations.service.js';
import { appDatabase, dropOrganizations, ownerDatabase } from './support/database.js';

const db = appDatabase(1);
const owner = ownerDatabase();
const service = new OrganizationsService(db);
const ownerActor: RequestActor = { userId: randomUUID(), orgId: null };
const otherActor: RequestActor = { userId: randomUUID(), orgId: null };
const organizationIds: string[] = [];

let organizationId = '';
let otherOrganizationId = '';

beforeAll(async () => {
  const organization = await service.create(ownerActor, {
    name: 'Empresa de prueba',
    legalName: 'Empresa de prueba S.A.S.',
    nit: '123456789-6',
    size: '1-10',
  });
  const otherOrganization = await service.create(otherActor, {
    name: 'Otra empresa de prueba',
    legalName: 'Otra empresa de prueba S.A.S.',
    nit: '987654321-7',
    size: '11-50',
  });
  organizationId = organization.id;
  otherOrganizationId = otherOrganization.id;
  organizationIds.push(organizationId, otherOrganizationId);
});

afterAll(async () => {
  await dropOrganizations(owner, organizationIds);
  await Promise.all([db.$client.end(), owner.$client.end()]);
});

describe('provisionamiento de organizaciones', () => {
  it('crea el tenant, la membresía propietaria y los permisos iniciales', async () => {
    const actor = { ...ownerActor, orgId: organizationId };
    const page = await service.list(actor, { limit: 100 });
    const permissions = await service.permissions(actor);

    expect(page.items).toEqual([
      expect.objectContaining({ id: organizationId, name: 'Empresa de prueba', isActive: true }),
    ]);
    expect(permissions).toContain('organization:update');
    expect(permissions).toContain('members:invite');
  });

  it('solo lista las organizaciones propias y no permite activar una ajena', async () => {
    const page = await service.list(otherActor, { limit: 100 });

    expect(page.items.map(({ id }) => id)).toEqual([otherOrganizationId]);
    await expect(service.setActive(ownerActor, otherOrganizationId)).rejects.toThrow(
      'You do not have access to this organization',
    );
  });

  it('valida la organización activa contra membresía y estado del tenant', async () => {
    await expect(service.setActive(ownerActor, organizationId)).resolves.toBeUndefined();
  });
});
