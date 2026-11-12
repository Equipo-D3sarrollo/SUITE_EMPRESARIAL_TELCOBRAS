import { createHash, randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { receivedDocumentDecisionSchema } from '@telcobras/contracts';
import { eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CredentialsCipher } from '../src/common/credentials-cipher.js';
import type { RequestActor } from '../src/common/request-actor.js';
import { parseEnv } from '../src/config/env.js';
import {
  membershipRoles,
  memberships,
  odooConnections,
  receivedDocumentImports,
  receivedDocuments,
  roles,
} from '../src/database/schema/index.js';
import { withTenant } from '../src/database/tenant.js';
import { DocumentsSettingsService } from '../src/modules/documents/documents-settings.service.js';
import { invoiceNumber } from '../src/modules/documents/odoo-vendor-bill.js';
import { ReceivedDocumentsService } from '../src/modules/documents/received-documents.service.js';
import { OrganizationsService } from '../src/modules/organizations/organizations.service.js';
import { appDatabase, dropOrganizations, ownerDatabase, pgErrorOf } from './support/database.js';
import { FAKE_ODOO_API_KEY, startFakeOdoo } from './support/fake-odoo.js';

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
const settings = new DocumentsSettingsService(db, new CredentialsCipher(env), env);
const documents = new ReceivedDocumentsService(db, s3, env, settings);
const organizationIds: string[] = [];

const ORGANIZATION_NIT = '123456789-6';
const SUPPLIER_NIT = '900123456';
const PDF = Buffer.from('%PDF-1.7\n% Factura de prueba\n%%EOF\n');

const cufe = (seed: string) => seed.repeat(96).slice(0, 96);

/** Datos de una factura recibida de prueba. */
const invoice = (seed: string) => ({
  documentType: 'Factura electrónica',
  cufe: cufe(seed),
  folio: '1172766070',
  prefix: 'R',
  paymentMethod: '1',
  issueDate: '2026-11-01',
  receivedAt: new Date('2026-11-01T15:00:00.000Z'),
  issuerNit: SUPPLIER_NIT,
  issuerName: 'PROVEEDOR DE PRUEBA S A S',
  iva: '12439.00',
  inc: '0.00',
  total: '77901.00',
  dianStatus: 'Aprobado con notificación',
  dianGroup: 'Recibido',
  costCenter: 'PROYECTO DE PRUEBA',
  paymentType: 'CREDITO',
  invoiceReference: 'FACTU/2026/11/0001',
});

async function createOrganization(): Promise<RequestActor> {
  const userId = randomUUID();
  const organization = await organizations.create(
    { userId, orgId: null },
    {
      name: 'Organización DataDian',
      legalName: 'Organización DataDian S.A.S.',
      nit: ORGANIZATION_NIT,
      size: '1-10',
    },
  );
  organizationIds.push(organization.id);
  return { userId, orgId: organization.id };
}

/** Registra facturas recibidas de prueba en un lote, como app_user y dentro de su organización. */
async function seedDocuments(actor: RequestActor, seeds: readonly string[]): Promise<void> {
  const orgId = actor.orgId as string;
  await withTenant(db, { orgId, userId: actor.userId }, async (tx) => {
    const [batch] = await tx
      .insert(receivedDocumentImports)
      .values({
        organizationId: orgId,
        fileName: 'lote-de-prueba',
        fileSha256: '0'.repeat(64),
        totalRows: seeds.length,
        createdCount: seeds.length,
        existingCount: 0,
        rejectedCount: 0,
        importedBy: actor.userId,
      })
      .returning({ id: receivedDocumentImports.id });
    if (!batch) throw new Error('Could not create the test batch');
    await tx
      .insert(receivedDocuments)
      .values(
        seeds.map((seed) => ({ ...invoice(seed), organizationId: orgId, importId: batch.id })),
      );
  });
}

/** Guarda en S3 un PDF para la factura y lo registra en sus columnas del PDF. */
async function storePdf(actor: RequestActor, seed: string, fileName: string): Promise<string> {
  const orgId = actor.orgId as string;
  const id = await idOf(actor, seed);
  const objectKey = `organizations/${orgId}/datadian/received/${id}.pdf`;
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: objectKey,
      Body: PDF,
      ContentType: 'application/pdf',
    }),
  );
  await withTenant(db, { orgId, userId: actor.userId }, (tx) =>
    tx
      .update(receivedDocuments)
      .set({
        pdfObjectKey: objectKey,
        pdfFileName: fileName,
        pdfSha256: createHash('sha256').update(PDF).digest('hex'),
        pdfSizeBytes: PDF.length,
        pdfUploadedBy: actor.userId,
        pdfUploadedAt: new Date(),
      })
      .where(eq(receivedDocuments.id, id)),
  );
  return id;
}

/** Agrega a la organización un miembro con un rol semilla. */
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

async function idOf(actor: RequestActor, seed: string): Promise<string> {
  const page = await documents.list(actor, { limit: 100 });
  const document = page.items.find((item) => item.cufe === cufe(seed));
  if (!document) throw new Error(`Document ${seed} not found`);
  return document.id;
}

let owner: RequestActor;
let odoo: Awaited<ReturnType<typeof startFakeOdoo>>;

beforeAll(async () => {
  owner = await createOrganization();
  odoo = await startFakeOdoo({ [SUPPLIER_NIT]: 7 });
}, 30_000);

afterAll(async () => {
  // received_documents no tiene DELETE para app_user: la limpieza corre como app_owner, por cascada.
  await dropOrganizations(ownerDb, organizationIds);
  await Promise.all([db.$client.end(), ownerDb.$client.end(), odoo.close()]);
  s3.destroy();
});

describe('factura de proveedor en Odoo', () => {
  it('arma el número de la factura sin repetir el prefijo', () => {
    expect(invoiceNumber({ prefix: 'R', folio: '1172766070' })).toBe('R1172766070');
    expect(invoiceNumber({ prefix: 'F306', folio: 'F30654994' })).toBe('F30654994');
    expect(invoiceNumber({ prefix: null, folio: '565' })).toBe('565');
  });
});

describe('configuración de Odoo', () => {
  it('no guarda una conexión que Odoo rechaza y guarda la API key cifrada', async () => {
    await expect(
      settings.saveOdoo(owner, {
        baseUrl: odoo.baseUrl,
        database: 'telcobras',
        apiKey: 'clave-equivocada-0123456789',
      }),
    ).rejects.toMatchObject({ status: 422 });
    expect((await settings.get(owner)).odoo).toBeNull();

    const saved = await settings.saveOdoo(owner, {
      baseUrl: odoo.baseUrl,
      database: 'telcobras',
      apiKey: FAKE_ODOO_API_KEY,
    });
    expect(saved.odoo).toMatchObject({ baseUrl: odoo.baseUrl, database: 'telcobras' });
    expect(JSON.stringify(saved)).not.toContain(FAKE_ODOO_API_KEY);
    await expect(settings.testOdoo(owner)).resolves.toEqual({ ok: true });

    const [stored] = await withTenant(
      db,
      { orgId: owner.orgId as string, userId: owner.userId },
      (tx) => tx.select().from(odooConnections),
    );
    expect(JSON.stringify(stored)).not.toContain(FAKE_ODOO_API_KEY);
  });

  it('solo quien tiene documents:configure la cambia', async () => {
    const accountant = await memberWithRole(owner, 'accountant');
    await expect(
      settings.saveOdoo(accountant, {
        baseUrl: odoo.baseUrl,
        database: 'telcobras',
        apiKey: FAKE_ODOO_API_KEY,
      }),
    ).rejects.toMatchObject({ status: 403 });
    expect((await settings.get(accountant)).odoo).not.toBeNull();
  });
});

describe('facturas recibidas', () => {
  beforeAll(() => seedDocuments(owner, ['1', '2', '3', '4']));

  it('lista las facturas con sus datos, pagina por cursor y filtra por estado', async () => {
    const all = await documents.list(owner, { limit: 50 });
    expect(all.items).toHaveLength(4);
    expect(all.items.find((document) => document.cufe === cufe('1'))).toMatchObject({
      total: '77901.00',
      receivedAt: '2026-11-01T15:00:00.000Z',
      status: 'imported',
      decidedBy: null,
      pdf: null,
      odoo: null,
    });

    const firstPage = await documents.list(owner, { limit: 3 });
    expect(firstPage.items).toHaveLength(3);
    expect(firstPage.nextCursor).not.toBeNull();
    const secondPage = await documents.list(owner, {
      limit: 3,
      cursor: firstPage.nextCursor ?? undefined,
    });
    expect(secondPage.items).toHaveLength(1);
    expect(secondPage.nextCursor).toBeNull();
    expect((await documents.list(owner, { limit: 50, status: 'approved' })).items).toEqual([]);
  });

  it('deja una factura en borrador y después la aprueba; sin PDF, Odoo recibe la factura sin adjunto', async () => {
    const id = await idOf(owner, '1');
    expect(await documents.decide(owner, id, { decision: 'draft' })).toMatchObject({
      status: 'draft',
    });
    // Borrador solo desde pendiente.
    await expect(documents.decide(owner, id, { decision: 'draft' })).rejects.toMatchObject({
      status: 409,
    });

    const attachmentsBefore = odoo.attachments.length;
    const approved = await documents.decide(owner, id, { decision: 'approved' });
    expect(approved).toMatchObject({
      status: 'approved',
      decidedBy: owner.userId,
      pdf: null,
      odoo: { status: 'sent', error: null },
    });

    const move = odoo.moves.find((item) => item.id === approved.odoo?.moveId);
    expect(move).toMatchObject({
      move_type: 'in_invoice',
      partner_id: 7,
      invoice_date: '2026-11-01',
      ref: 'R1172766070',
    });
    expect(String(move?.narration)).toContain(cufe('1'));
    expect(odoo.attachments.length).toBe(attachmentsBefore);

    const history = await documents.history(owner, id);
    expect(history.map((entry) => entry.action)).toEqual([
      'received_document.draft',
      'received_document.approve',
      'received_document.odoo_sent',
    ]);
  });

  it('si la factura tiene PDF guardado, se puede ver y la aprobación lo adjunta en Odoo', async () => {
    const id = await storePdf(owner, '3', 'R1172766070.pdf');
    const stored = await documents.getPdf(owner, id);
    expect(stored.fileName).toBe('R1172766070.pdf');
    expect(stored.content.equals(PDF)).toBe(true);
    expect((await documents.get(owner, id)).pdf).toMatchObject({
      fileName: 'R1172766070.pdf',
      sizeBytes: PDF.length,
    });

    const approved = await documents.decide(owner, id, { decision: 'approved' });
    expect(approved.odoo).toMatchObject({ status: 'sent', error: null });
    const attachment = odoo.attachments.find((item) => item.res_id === approved.odoo?.moveId);
    expect(attachment).toMatchObject({
      name: 'R1172766070.pdf',
      type: 'binary',
      res_model: 'account.move',
      mimetype: 'application/pdf',
    });
    expect(Buffer.from(String(attachment?.datas), 'base64').equals(PDF)).toBe(true);
  });

  it('si Odoo falla, la factura queda aprobada con el error y el reintento no la duplica', async () => {
    const id = await storePdf(owner, '4', 'F4.pdf');
    const movesBefore = odoo.moves.length;
    odoo.failNext('ir.attachment/create');

    const failed = await documents.decide(owner, id, { decision: 'approved' });
    expect(failed).toMatchObject({ status: 'approved', odoo: { status: 'failed' } });
    expect(failed.odoo?.error).toContain('Falla forzada en ir.attachment/create');
    expect((await documents.summary(owner)).odooFailed).toBe(1);

    const retried = await documents.retryOdoo(owner, id);
    expect(retried.odoo).toMatchObject({ status: 'sent', error: null });
    // La factura se creó en el primer intento: el reintento la encontró por su CUFE y no creó otra.
    expect(odoo.moves.length).toBe(movesBefore + 1);
    await expect(documents.retryOdoo(owner, id)).rejects.toMatchObject({ status: 409 });
  });

  it('rechaza con motivo, una sola vez', async () => {
    const id = await idOf(owner, '2');
    // El contrato exige el motivo de reclamo DIAN al rechazar, y solo al rechazar.
    expect(receivedDocumentDecisionSchema.safeParse({ decision: 'rejected' }).success).toBe(false);
    expect(
      receivedDocumentDecisionSchema.safeParse({ decision: 'approved', rejectionCode: '01' })
        .success,
    ).toBe(false);
    const rejected = await documents.decide(owner, id, {
      decision: 'rejected',
      rejectionCode: '02',
      reason: 'No corresponde a un pedido',
    });
    expect(rejected).toMatchObject({
      status: 'rejected',
      rejectionCode: '02',
      decisionReason: 'No corresponde a un pedido',
    });
    const history = await documents.history(owner, id);
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      action: 'received_document.reject',
      metadata: { cufe: cufe('2'), rejectionCode: '02', reason: 'No corresponde a un pedido' },
    });
    await expect(documents.decide(owner, id, { decision: 'approved' })).rejects.toMatchObject({
      status: 409,
    });
    await expect(
      documents.decide(owner, randomUUID(), { decision: 'draft' }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('el tablero cuenta por estado, fallas de envío y el valor pendiente', async () => {
    await seedDocuments(owner, ['5', '6']);
    const summary = await documents.summary(owner);
    expect(summary).toEqual({
      byStatus: { imported: 2, draft: 0, approved: 3, rejected: 1 },
      odooFailed: 0,
      pendingTotal: '155802.00',
    });
  });

  it('exige el permiso de cada operación', async () => {
    // Usuario básico: no ve DataDian. Comercial: ve, pero no decide. Contador: decide.
    const basic = await memberWithRole(owner, 'basic');
    const sales = await memberWithRole(owner, 'sales');
    const accountant = await memberWithRole(owner, 'accountant');
    const pending = await idOf(owner, '5');

    await expect(documents.list(basic, { limit: 10 })).rejects.toMatchObject({ status: 403 });
    await expect(documents.summary(basic)).rejects.toMatchObject({ status: 403 });
    expect((await documents.list(sales, { limit: 10 })).items.length).toBeGreaterThan(0);
    await expect(documents.decide(sales, pending, { decision: 'draft' })).rejects.toMatchObject({
      status: 403,
    });

    await expect(
      documents.decide(accountant, pending, { decision: 'draft' }),
    ).resolves.toMatchObject({ status: 'draft' });
  });

  it('sin conexión con Odoo no se puede aprobar', async () => {
    const other = await createOrganization();
    await seedDocuments(other, ['1']);
    await expect(
      documents.decide(other, await idOf(other, '1'), { decision: 'approved' }),
    ).rejects.toThrow('Configure la conexión con Odoo antes de aprobar facturas');
  });

  it('aísla las facturas entre organizaciones', async () => {
    const other = await createOrganization();
    const ownerDocument = await idOf(owner, '1');
    expect((await documents.list(other, { limit: 10 })).items).toEqual([]);
    expect((await settings.get(other)).odoo).toBeNull();
    await expect(documents.get(other, ownerDocument)).rejects.toMatchObject({ status: 404 });
    await expect(documents.getPdf(other, ownerDocument)).rejects.toMatchObject({ status: 404 });
    await expect(
      documents.decide(other, ownerDocument, { decision: 'draft' }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('la base de datos no deja cambiar los datos de la DIAN ni borrar facturas', async () => {
    const id = await idOf(owner, '1');
    const scope = { orgId: owner.orgId as string, userId: owner.userId };
    const changeTotal = withTenant(db, scope, (tx) =>
      tx.execute(sql`update app.received_documents set total = 1 where id = ${id}`),
    );
    expect((await pgErrorOf(changeTotal)).code).toBe('42501');

    const remove = withTenant(db, scope, (tx) =>
      tx.delete(receivedDocuments).where(eq(receivedDocuments.id, id)),
    );
    expect((await pgErrorOf(remove)).code).toBe('42501');
  });
});
