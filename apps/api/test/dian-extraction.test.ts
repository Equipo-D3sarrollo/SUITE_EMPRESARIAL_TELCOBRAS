import { randomUUID } from 'node:crypto';
import { S3Client } from '@aws-sdk/client-s3';
import { dianTokenLinkSchema } from '@telcobras/contracts';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CredentialsCipher } from '../src/common/credentials-cipher.js';
import type { RequestActor } from '../src/common/request-actor.js';
import { parseEnv } from '../src/config/env.js';
import { dianSessions, membershipRoles, memberships, roles } from '../src/database/schema/index.js';
import { withTenant } from '../src/database/tenant.js';
import { DianExtractionService } from '../src/modules/documents/dian-extraction.service.js';
import { parseDianListing } from '../src/modules/documents/dian-listing.parser.js';
import { DocumentsSettingsService } from '../src/modules/documents/documents-settings.service.js';
import { ReceivedDocumentsService } from '../src/modules/documents/received-documents.service.js';
import { OrganizationsService } from '../src/modules/organizations/organizations.service.js';
import { appDatabase, dropOrganizations, ownerDatabase } from './support/database.js';
import { dianXlsx, type FakeDianDocument, startFakeDianPortal } from './support/fake-dian-portal.js';

const env = parseEnv(process.env);
const db = appDatabase(2);
const ownerDb = ownerDatabase();
const s3 = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  forcePathStyle: env.S3_FORCE_PATH_STYLE,
  credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
});
const organizations = new OrganizationsService(db);
const cipher = new CredentialsCipher(env);
const settings = new DocumentsSettingsService(db, cipher, env);
const documents = new ReceivedDocumentsService(db, s3, env, settings);
// Sondeo rápido: el ritmo real (10 a 30 s) es solo para el portal de verdad.
const dian = new DianExtractionService(db, cipher, documents, {
  pollIntervalMs: () => 20,
  maxWaitMs: 5_000,
});
const organizationIds: string[] = [];

const NIT = '123456789';
const cufe = (seed: string) => seed.repeat(96).slice(0, 96);
const document = (seed: string, folio: string): FakeDianDocument => ({
  cufe: cufe(seed),
  folio,
  prefix: 'ECA',
  issueDate: '11-11-2026',
  receivedAt: '2026-11-11T16:03:55',
  issuerNit: '890304345',
  issuerName: 'PROVEEDOR DE PRUEBA S.A.S.',
  receiverNit: NIT,
  iva: 59036.8,
  total: 369757,
});

async function createOrganization(nit = `${NIT}-6`): Promise<RequestActor> {
  const userId = randomUUID();
  const organization = await organizations.create(
    { userId, orgId: null },
    { name: 'Organización DIAN', legalName: 'Organización DIAN S.A.S.', nit, size: '1-10' },
  );
  organizationIds.push(organization.id);
  return { userId, orgId: organization.id };
}

async function memberWithRole(owner: RequestActor, roleKey: string): Promise<RequestActor> {
  const orgId = owner.orgId as string;
  const userId = randomUUID();
  await withTenant(db, { orgId, userId: owner.userId }, async (tx) => {
    const [role] = await tx.select({ id: roles.id }).from(roles).where(eq(roles.key, roleKey));
    const [membership] = await tx
      .insert(memberships)
      .values({ organizationId: orgId, userId })
      .returning({ id: memberships.id });
    if (!role || !membership) throw new Error('Could not create the test member');
    await tx
      .insert(membershipRoles)
      .values({ organizationId: orgId, membershipId: membership.id, roleId: role.id });
  });
  return { userId, orgId };
}

async function finished(actor: RequestActor, id: string) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const job = await dian.getJob(actor, id);
    if (job.status === 'done' || job.status === 'error') return job;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('La extracción no terminó a tiempo');
}

let owner: RequestActor;
let portal: Awaited<ReturnType<typeof startFakeDianPortal>>;

beforeAll(async () => {
  owner = await createOrganization();
  portal = await startFakeDianPortal({
    nit: NIT,
    documents: (startDate) =>
      startDate === '2026-11-10' ? [document('a', '96568'), document('b', '21533')] : [document('c', '6191')],
  });
}, 30_000);

afterAll(async () => {
  await dropOrganizations(ownerDb, organizationIds);
  await Promise.all([db.$client.end(), ownerDb.$client.end(), portal.close()]);
  s3.destroy();
});

describe('listado exportado por la DIAN', () => {
  it('se lee con el formato real del exportador (etiquetas x:) y conserva la fecha de recepción', () => {
    const listing = parseDianListing(Buffer.from(dianXlsx([document('a', '96568')])));
    expect(listing.rejected).toEqual([]);
    expect(listing.documents[0]).toMatchObject({
      documentType: 'Factura electrónica',
      cufe: cufe('a'),
      folio: '96568',
      prefix: 'ECA',
      paymentMethod: '47',
      issueDate: '2026-11-11',
      receivedAt: '2026-11-11T16:03:55-05:00',
      issuerNit: '890304345',
      iva: '59036.80',
      inc: '0.00',
      total: '369757.00',
      dianStatus: 'Aprobado con notificación',
      dianGroup: 'Recibido',
      // Columnas de la hoja de trabajo de Telcobras: la DIAN no las exporta.
      costCenter: null,
      invoiceReference: null,
    });
  });

  it('el enlace del token tiene que ser del catálogo de la DIAN', () => {
    expect(dianTokenLinkSchema.safeParse({ tokenLink: 'https://evil.example/User/AuthToken?token=x' }).success).toBe(false);
    expect(dianTokenLinkSchema.safeParse({ tokenLink: 'https://catalogo-vpfe.dian.gov.co/Document/Received' }).success).toBe(false);
    expect(
      dianTokenLinkSchema.safeParse({
        tokenLink: ' https://catalogo-vpfe.dian.gov.co/User/AuthToken?pk=1%7C2&rk=900281488&token=abc ',
      }).success,
    ).toBe(true);
  });
});

describe('sesión con la DIAN', () => {
  it('rechaza un enlace de otro NIT y un token que la DIAN no acepta; conecta con el válido', async () => {
    expect(await dian.session(owner)).toMatchObject({ connected: false });
    await expect(dian.connect(owner, { tokenLink: portal.tokenLink('800999999') })).rejects.toThrow(
      'El enlace es de otro NIT',
    );
    await expect(dian.connect(owner, { tokenLink: portal.tokenLink(NIT, 'tok-malo') })).rejects.toThrow(
      'La DIAN no aceptó el enlace',
    );

    const session = await dian.connect(owner, { tokenLink: portal.tokenLink() });
    expect(session).toMatchObject({ connected: true, nit: NIT });
    expect(session.expiresAt).not.toBeNull();

    // Las cookies quedan cifradas: el valor de la cookie del portal no aparece en claro.
    const [stored] = await withTenant(db, { orgId: owner.orgId as string, userId: owner.userId }, (tx) =>
      tx.select().from(dianSessions),
    );
    expect(JSON.stringify(stored)).not.toContain('.AspNet.ApplicationCookie=');
    expect(JSON.stringify(stored?.cookies)).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}/);
  });

  it('solo quien importa puede conectar o extraer', async () => {
    const sales = await memberWithRole(owner, 'sales');
    await expect(dian.connect(sales, { tokenLink: portal.tokenLink() })).rejects.toMatchObject({ status: 403 });
    await expect(
      dian.startExtraction(sales, { startDate: '2026-11-10', endDate: '2026-11-11' }),
    ).rejects.toMatchObject({ status: 403 });
    expect((await dian.session(sales)).connected).toBe(true);
  });
});

describe('extracción del listado', () => {
  it('pide la exportación, espera el ZIP, importa las facturas y deja el trabajo en done', async () => {
    const started = await dian.startExtraction(owner, { startDate: '2026-11-10', endDate: '2026-11-11' });
    expect(started).toMatchObject({ status: 'queued', stage: 'connecting' });
    await expect(
      dian.startExtraction(owner, { startDate: '2026-11-10', endDate: '2026-11-11' }),
    ).rejects.toMatchObject({ status: 409 });

    const job = await finished(owner, started.id);
    expect(job).toMatchObject({
      status: 'done',
      stage: 'done',
      portalTotal: 2,
      created: 2,
      alreadyExisting: 0,
      rejected: 0,
      message: null,
    });
    expect(job.importId).not.toBeNull();

    const page = await documents.list(owner, { limit: 10 });
    expect(page.items.map((item) => item.folio).sort()).toEqual(['21533', '96568']);
    expect(page.items[0]?.receivedAt).toBe('2026-11-11T21:03:55.000Z');
    expect(portal.calls).toEqual(
      expect.arrayContaining(['POST /Document/Export', 'POST /Document/TasksPartial', 'GET /Document/DownloadExportedZipFile']),
    );
  });

  it('repetir el rango no duplica facturas y la lista de trabajos va de la más nueva a la más antigua', async () => {
    const again = await finished(
      owner,
      (await dian.startExtraction(owner, { startDate: '2026-11-10', endDate: '2026-11-11' })).id,
    );
    expect(again).toMatchObject({ status: 'done', created: 0, alreadyExisting: 2 });
    const jobs = await dian.listJobs(owner, { limit: 10 });
    expect(jobs.items.map((item) => item.id)[0]).toBe(again.id);
    expect(jobs.items).toHaveLength(2);
  });

  it('si la DIAN bloquea la consulta, el trabajo lo dice y la sesión sigue', async () => {
    portal.blockNextRequest();
    const job = await finished(
      owner,
      (await dian.startExtraction(owner, { startDate: '2026-11-01', endDate: '2026-11-02' })).id,
    );
    expect(job.status).toBe('error');
    expect(job.message).toContain('bloqueó');
    expect((await dian.session(owner)).connected).toBe(true);
  });

  it('si la sesión venció, el trabajo falla con el aviso y hay que pegar un token nuevo', async () => {
    portal.expireSessions();
    const job = await finished(
      owner,
      (await dian.startExtraction(owner, { startDate: '2026-11-01', endDate: '2026-11-02' })).id,
    );
    expect(job.status).toBe('error');
    expect(job.message).toContain('venció');
    expect((await dian.session(owner)).connected).toBe(false);
    await expect(
      dian.startExtraction(owner, { startDate: '2026-11-01', endDate: '2026-11-02' }),
    ).rejects.toThrow('Conecte primero la sesión con la DIAN');
  });

  it('otra organización no ve la sesión ni los trabajos', async () => {
    const other = await createOrganization('987654321-7');
    expect((await dian.session(other)).connected).toBe(false);
    expect((await dian.listJobs(other, { limit: 10 })).items).toEqual([]);
    const [job] = (await dian.listJobs(owner, { limit: 1 })).items;
    await expect(dian.getJob(other, job?.id ?? randomUUID())).rejects.toMatchObject({ status: 404 });
  });
});
