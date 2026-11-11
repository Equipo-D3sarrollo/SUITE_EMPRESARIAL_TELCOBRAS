import { randomUUID } from 'node:crypto';
import { S3Client } from '@aws-sdk/client-s3';
import { receivedDocumentDecisionSchema } from '@telcobras/contracts';
import { eq, sql } from 'drizzle-orm';
import ExcelJS from 'exceljs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { CredentialsCipher } from '../src/common/credentials-cipher.js';
import type { RequestActor } from '../src/common/request-actor.js';
import { parseEnv } from '../src/config/env.js';
import {
  membershipRoles,
  memberships,
  odooConnections,
  receivedDocuments,
  roles,
} from '../src/database/schema/index.js';
import { withTenant } from '../src/database/tenant.js';
import { parseDianListing } from '../src/modules/documents/dian-listing.parser.js';
import { cufeCandidates, findCufes } from '../src/modules/documents/dian-pdf.js';
import { DocumentsSettingsService } from '../src/modules/documents/documents-settings.service.js';
import { invoiceNumber } from '../src/modules/documents/odoo-vendor-bill.js';
import {
  MAX_LISTING_BYTES,
  MAX_PDF_BYTES,
  PDF_CONTENT_TYPE,
  XLSX_CONTENT_TYPE,
} from '../src/modules/documents/received-documents.controller.js';
import { ReceivedDocumentsService } from '../src/modules/documents/received-documents.service.js';
import { OrganizationsService } from '../src/modules/organizations/organizations.service.js';
import { appDatabase, dropOrganizations, ownerDatabase, pgErrorOf } from './support/database.js';
import { dianPdf } from './support/dian-pdf-fixture.js';
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

// NIT de las organizaciones de prueba: el PDF de la DIAN se abre con el NIT sin dígito de verificación.
const ORGANIZATION_NIT = '123456789-6';
const PDF_PASSWORD = '123456789';
const SUPPLIER_NIT = '900123456';

// Encabezados como en el listado real: los 18 que se usan, mezclados con columnas que se ignoran.
const HEADERS = [
  'Tipo de documento',
  'CUFE/CUDE',
  'Folio',
  'Prefijo',
  'Divisa',
  'Forma de Pago',
  'Medio de Pago',
  'Fecha Emisión',
  'Fecha Recepción',
  'NIT Emisor',
  'Nombre Emisor',
  'NIT Receptor',
  'IVA',
  'INC',
  'Total',
  'Estado',
  'Grupo',
  'Centro de costos',
  'TIPO',
  'Estado (Acuse de recibo)',
  'FACTURA',
  'Observaciones',
] as const;

type Header = (typeof HEADERS)[number];
type ListingRow = Partial<Record<Header, string | number | Date>>;

const cufe = (seed: string) => seed.repeat(96).slice(0, 96);

const row = (seed: string, overrides: ListingRow = {}): ListingRow => ({
  'Tipo de documento': 'Factura electrónica',
  'CUFE/CUDE': cufe(seed),
  Folio: 1172766070,
  Prefijo: 'R',
  Divisa: 'COP',
  'Medio de Pago': 1,
  'Fecha Emisión': '01/11/2026',
  'NIT Emisor': Number(SUPPLIER_NIT),
  'Nombre Emisor': 'PROVEEDOR DE PRUEBA S A S',
  'NIT Receptor': 123456789,
  IVA: 12439,
  INC: 0,
  Total: '77.901,00',
  Estado: 'Aprobado con notificación',
  Grupo: 'Recibido',
  'Centro de costos': 'PROYECTO DE PRUEBA',
  TIPO: 'CREDITO',
  FACTURA: 'FACTU/2026/11/0001',
  ...overrides,
});

async function listing(
  rows: ListingRow[],
  headers: readonly string[] = HEADERS,
  titleRows = 0,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Listado');
  for (let index = 0; index < titleRows; index++) sheet.addRow(['Reporte de documentos']);
  sheet.addRow([...headers]);
  for (const values of rows) {
    sheet.addRow(headers.map((header) => values[header as Header] ?? null));
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

const protectedPdf = (seed: string, password = PDF_PASSWORD) =>
  dianPdf(cufe(seed), env.QPDF_PATH, password);

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

describe('lectura del listado de la DIAN', () => {
  it('conserva solo los campos acordados, busca las columnas por nombre y normaliza fechas e importes', async () => {
    const parsed = parseDianListing(
      await listing(
        [
          row('a', { Observaciones: '  pago parcial  ' }),
          row('b', { 'Fecha Emisión': new Date('2026-11-03T00:00:00Z'), Total: 163487.82 }),
        ],
        HEADERS,
        2,
      ),
    );

    expect(parsed.totalRows).toBe(2);
    expect(parsed.rejected).toEqual([]);
    expect(parsed.documents[0]).toEqual({
      documentType: 'Factura electrónica',
      cufe: cufe('a'),
      folio: '1172766070',
      prefix: 'R',
      paymentMethod: '1',
      issueDate: '2026-11-01',
      receivedAt: null,
      issuerNit: SUPPLIER_NIT,
      issuerName: 'PROVEEDOR DE PRUEBA S A S',
      iva: '12439.00',
      inc: '0.00',
      total: '77901.00',
      dianStatus: 'Aprobado con notificación',
      dianGroup: 'Recibido',
      costCenter: 'PROYECTO DE PRUEBA',
      paymentType: 'CREDITO',
      acknowledgmentStatus: null,
      invoiceReference: 'FACTU/2026/11/0001',
      observations: 'pago parcial',
    });
    expect(parsed.documents[1]).toMatchObject({ issueDate: '2026-11-03', total: '163487.82' });
  });

  it('rechaza la fila con CUFE inválido, fecha inválida o CUFE repetido, sin perder las demás', async () => {
    const parsed = parseDianListing(
      await listing([
        row('a'),
        row('b', { 'CUFE/CUDE': 'no-es-un-cufe' }),
        row('c', { 'Fecha Emisión': '31/02/2026' }),
        row('a'),
        row('d', { Total: 'abc' }),
      ]),
    );

    expect(parsed.totalRows).toBe(5);
    expect(parsed.documents.map((document) => document.cufe)).toEqual([cufe('a')]);
    expect(parsed.rejected).toEqual([
      { row: 3, reason: 'CUFE/CUDE no válido' },
      { row: 4, reason: 'Fecha Emisión no válida' },
      { row: 5, reason: 'CUFE repetido dentro del archivo' },
      { row: 6, reason: 'Total no es un valor numérico' },
    ]);
  });

  it('dice qué columnas faltan y rechaza lo que no es un Excel', async () => {
    const withoutColumns = HEADERS.filter((header) => header !== 'Total' && header !== 'FACTURA');
    const withoutColumnsFile = await listing([row('a')], withoutColumns);
    // FACTURA es de la hoja de Telcobras y es opcional; Total viene de la DIAN y es obligatoria.
    expect(() => parseDianListing(withoutColumnsFile)).toThrow(
      'Al listado le faltan columnas: Total',
    );
    expect(() => parseDianListing(Buffer.from('esto no es un excel'))).toThrow(
      'El archivo no es un Excel (.xlsx) válido',
    );
  });
});

describe('PDF de la DIAN', () => {
  it('encuentra el CUFE aunque venga partido o pegado a otro texto', () => {
    const code = cufe('4f');
    expect(
      cufeCandidates(`CUFE :\n${code.slice(0, 40)}\n${code.slice(40)}\nNúmero de Factura`),
    ).toEqual([code]);
    expect(cufeCandidates(`CUFE:${code} de fecha`)).toEqual([code]);
    expect(cufeCandidates(`${code}ab`)).toEqual([]);
  });

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
  it('importa el listado y, al repetirlo, no duplica ni sobrescribe por CUFE', async () => {
    const first = await documents.importListing(
      owner,
      'noviembre.xlsx',
      await listing([row('1'), row('2'), row('3', { 'CUFE/CUDE': 'malo' })]),
    );
    expect(first).toMatchObject({ fileName: 'noviembre.xlsx', totalRows: 3, created: 2 });
    expect(first.alreadyExisting).toBe(0);
    expect(first.rejected).toEqual([{ row: 4, reason: 'CUFE/CUDE no válido' }]);

    const again = await documents.importListing(
      owner,
      'noviembre-2.xlsx',
      await listing([row('1', { Total: 1 }), row('4')]),
    );
    expect(again).toMatchObject({ totalRows: 2, created: 1, alreadyExisting: 1 });

    const page = await documents.list(owner, { limit: 50 });
    expect(page.items).toHaveLength(3);
    expect(page.items.find((document) => document.cufe === cufe('1'))).toMatchObject({
      total: '77901.00',
      status: 'imported',
      decidedBy: null,
      pdf: null,
      odoo: null,
    });
  });

  it('pagina por cursor y filtra por estado', async () => {
    const firstPage = await documents.list(owner, { limit: 2 });
    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.nextCursor).not.toBeNull();
    const secondPage = await documents.list(owner, {
      limit: 2,
      cursor: firstPage.nextCursor ?? undefined,
    });
    expect(secondPage.items).toHaveLength(1);
    expect(secondPage.nextCursor).toBeNull();
    expect((await documents.list(owner, { limit: 50, status: 'approved' })).items).toEqual([]);
  });

  it('abre el PDF protegido con el NIT, lo asocia por CUFE y guarda la copia sin clave', async () => {
    const uploaded = await documents.uploadPdf(owner, 'R1172766070.pdf', await protectedPdf('1'));
    const documentId = await idOf(owner, '1');
    expect(uploaded).toMatchObject({ documentId, cufe: cufe('1'), fileName: 'R1172766070.pdf' });

    const stored = await documents.getPdf(owner, documentId);
    expect(stored.fileName).toBe('R1172766070.pdf');
    // La copia guardada ya no tiene clave: pdf.js la lee sin contraseña.
    expect(await findCufes(stored.content)).toEqual([cufe('1')]);
    expect((await documents.get(owner, documentId)).pdf).toMatchObject({
      fileName: 'R1172766070.pdf',
    });
  });

  it('rechaza el PDF de otra empresa, uno que no corresponde a ninguna factura y lo que no es PDF', async () => {
    await expect(
      documents.uploadPdf(owner, 'otra.pdf', await protectedPdf('2', '800999999')),
    ).rejects.toThrow('El PDF no se pudo abrir con el NIT de la organización');
    await expect(
      documents.uploadPdf(owner, 'sin-factura.pdf', await protectedPdf('9')),
    ).rejects.toThrow('El PDF no corresponde a ninguna factura cargada');
    await expect(documents.uploadPdf(owner, 'x.pdf', Buffer.from('no es un pdf'))).rejects.toThrow(
      'El archivo no es un PDF',
    );
  });

  it('deja una factura en borrador y después la aprueba; la aprobación la envía a Odoo con el PDF', async () => {
    const id = await idOf(owner, '1');
    expect(await documents.decide(owner, id, { decision: 'draft' })).toMatchObject({
      status: 'draft',
    });
    // Borrador solo desde pendiente.
    await expect(documents.decide(owner, id, { decision: 'draft' })).rejects.toMatchObject({
      status: 409,
    });

    const approved = await documents.decide(owner, id, { decision: 'approved' });
    expect(approved).toMatchObject({
      status: 'approved',
      decidedBy: owner.userId,
      odoo: { status: 'sent', error: null },
    });

    const [move] = odoo.moves;
    expect(move).toMatchObject({
      move_type: 'in_invoice',
      partner_id: 7,
      invoice_date: '2026-11-01',
      ref: 'R1172766070',
    });
    expect(String(move?.narration)).toContain(cufe('1'));
    expect(approved.odoo?.moveId).toBe(move?.id);

    const [attachment] = odoo.attachments;
    expect(attachment).toMatchObject({
      name: 'R1172766070.pdf',
      type: 'binary',
      res_model: 'account.move',
      res_id: move?.id,
      mimetype: 'application/pdf',
    });
    // Lo que llega a Odoo es el PDF ya abierto, igual al que guarda la suite.
    const sentPdf = Buffer.from(String(attachment?.datas), 'base64');
    expect(sentPdf.equals((await documents.getPdf(owner, id)).content)).toBe(true);

    const history = await documents.history(owner, id);
    expect(history.map((entry) => entry.action)).toEqual([
      'received_document.import',
      'received_document.pdf_upload',
      'received_document.draft',
      'received_document.approve',
      'received_document.odoo_sent',
    ]);
  });

  it('no aprueba sin PDF y no reemplaza el PDF de una factura ya aprobada', async () => {
    const withoutPdf = await idOf(owner, '2');
    await expect(documents.decide(owner, withoutPdf, { decision: 'approved' })).rejects.toThrow(
      'Cargue el PDF de la factura antes de aprobarla',
    );
    await expect(
      documents.uploadPdf(owner, 'de-nuevo.pdf', await protectedPdf('1')),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('si Odoo falla, la factura queda aprobada con el error y el reintento no la duplica', async () => {
    const id = await idOf(owner, '4');
    await documents.uploadPdf(owner, 'F4.pdf', await protectedPdf('4'));
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
    expect(history.map((entry) => entry.action)).toEqual([
      'received_document.import',
      'received_document.reject',
    ]);
    expect(history[1]).toMatchObject({
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

  it('el tablero cuenta por estado, facturas sin PDF, fallas de envío y el valor pendiente', async () => {
    await documents.importListing(owner, 'mas.xlsx', await listing([row('5'), row('6')]));
    const summary = await documents.summary(owner);
    expect(summary).toEqual({
      byStatus: { imported: 2, draft: 0, approved: 2, rejected: 1 },
      withoutPdf: 2,
      odooFailed: 0,
      pendingTotal: '155802.00',
    });
  });

  it('exige el permiso de cada operación', async () => {
    // Usuario básico: no ve DataDian. Comercial: ve, pero no importa ni decide. Contador: importa y decide.
    const basic = await memberWithRole(owner, 'basic');
    const sales = await memberWithRole(owner, 'sales');
    const accountant = await memberWithRole(owner, 'accountant');
    const pending = await idOf(owner, '5');

    await expect(documents.list(basic, { limit: 10 })).rejects.toMatchObject({ status: 403 });
    await expect(documents.summary(basic)).rejects.toMatchObject({ status: 403 });
    expect((await documents.list(sales, { limit: 10 })).items.length).toBeGreaterThan(0);
    await expect(
      documents.importListing(sales, 'x.xlsx', await listing([row('7')])),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
      documents.uploadPdf(sales, 'x.pdf', await protectedPdf('5')),
    ).rejects.toMatchObject({ status: 403 });
    await expect(documents.decide(sales, pending, { decision: 'draft' })).rejects.toMatchObject({
      status: 403,
    });

    await expect(
      documents.importListing(accountant, 'x.xlsx', await listing([row('7')])),
    ).resolves.toMatchObject({ created: 1 });
    await expect(
      documents.decide(accountant, pending, { decision: 'draft' }),
    ).resolves.toMatchObject({ status: 'draft' });
  });

  it('sin conexión con Odoo no se puede aprobar', async () => {
    const other = await createOrganization();
    await documents.importListing(other, 'otra.xlsx', await listing([row('1')]));
    await documents.uploadPdf(other, 'R1.pdf', await protectedPdf('1'));
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

describe('endpoints de carga', () => {
  it('aceptan .xlsx y PDF como cuerpo binario, exigen sesión y limitan el tamaño', async () => {
    const app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    try {
      for (const [url, contentType, limit] of [
        ['/api/v1/documents/received/imports', XLSX_CONTENT_TYPE, MAX_LISTING_BYTES],
        ['/api/v1/documents/received/pdfs', PDF_CONTENT_TYPE, MAX_PDF_BYTES],
      ] as const) {
        const headers = { 'content-type': contentType };
        // 401 y no 415: el tipo de contenido se acepta y la petición llega hasta la guardia de sesión.
        const anonymous = await app.inject({
          method: 'POST',
          url,
          headers,
          payload: Buffer.alloc(8),
        });
        expect(anonymous.statusCode).toBe(401);
        const tooLarge = await app.inject({
          method: 'POST',
          url,
          headers,
          payload: Buffer.alloc(limit + 1),
        });
        expect(tooLarge.statusCode).toBe(413);
      }
    } finally {
      await app.close();
    }
  }, 30_000);
});
