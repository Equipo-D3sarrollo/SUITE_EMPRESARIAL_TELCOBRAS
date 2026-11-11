import { createHash } from 'node:crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type {
  CursorPage,
  ReceivedDocument,
  ReceivedDocumentDecision,
  ReceivedDocumentHistoryEntry,
  ReceivedDocumentImportSummary,
  ReceivedDocumentListQuery,
  ReceivedDocumentPdfUpload,
  ReceivedDocumentStatus,
  ReceivedDocumentSummary,
} from '@telcobras/contracts';
import { RECEIVED_DOCUMENT_STATUSES } from '@telcobras/contracts';
import { and, asc, count, eq, inArray, isNull, sql, sum } from 'drizzle-orm';
import { assertPermission } from '../../auth/permissions.js';
import { afterCursor, newestFirst, toCursorPage } from '../../common/pagination.js';
import type { RequestActor } from '../../common/request-actor.js';
import { ENV } from '../../config/config.module.js';
import type { Env } from '../../config/env.js';
import type { Database } from '../../database/database.js';
import { DB } from '../../database/db.module.js';
import {
  auditLogs,
  organizations,
  receivedDocumentImports,
  receivedDocuments,
} from '../../database/schema/index.js';
import { type TenantScope, type Transaction, withTenant } from '../../database/tenant.js';
import { parseDianListing } from './dian-listing.parser.js';
import { findCufes, nitPasswords, openDianPdf } from './dian-pdf.js';
import { DocumentsSettingsService } from './documents-settings.service.js';
import { OdooClient, OdooError } from './odoo.client.js';
import { pushVendorBill } from './odoo-vendor-bill.js';

const INSERT_BATCH = 500;
const MAX_REJECTED_IN_RESPONSE = 100;
const MAX_HISTORY_ENTRIES = 200;
const RESOURCE_TYPE = 'received_document';
/** Estados en los que la factura todavía espera decisión. */
const OPEN_STATUSES = ['imported', 'draft'] as const satisfies readonly ReceivedDocumentStatus[];

type Row = typeof receivedDocuments.$inferSelect;

/**
 * Facturas recibidas de DataDian: carga del listado de la DIAN y de los PDF, tablero, decisión
 * (borrador, aprobación con envío a Odoo o rechazo) e historial.
 * Los datos de la DIAN no se modifican después de importar; el identificador de negocio es el CUFE.
 */
@Injectable()
export class ReceivedDocumentsService {
  constructor(
    @Inject(DB) private readonly db: Database,
    @Inject(S3Client) private readonly s3: S3Client,
    @Inject(ENV) private readonly env: Pick<Env, 'S3_BUCKET' | 'QPDF_PATH'>,
    @Inject(DocumentsSettingsService) private readonly settings: DocumentsSettingsService,
  ) {}

  /**
   * Importa el listado. Un CUFE que ya existe en la organización no se duplica ni se sobrescribe:
   * se cuenta como ya existente.
   */
  async importListing(
    actor: RequestActor,
    fileName: string,
    file: Buffer,
  ): Promise<ReceivedDocumentImportSummary> {
    const scope = tenantScope(actor);
    // El permiso se comprueba antes de leer el archivo: sin él no se gasta trabajo en analizarlo.
    await withTenant(this.db, scope, (tx) =>
      assertPermission(tx, actor.userId, 'documents:import'),
    );
    const listing = parseDianListing(file);
    const fileSha256 = sha256(file);

    return withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:import');
      // Dos cargas simultáneas de la misma organización se serializan: los contadores quedan exactos.
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`received_documents:${scope.orgId}`}, 0))`,
      );

      const existing = new Set<string>();
      for (const batch of chunks(listing.documents, INSERT_BATCH)) {
        const rows = await tx
          .select({ cufe: receivedDocuments.cufe })
          .from(receivedDocuments)
          .where(
            inArray(
              receivedDocuments.cufe,
              batch.map(({ cufe }) => cufe),
            ),
          );
        for (const { cufe } of rows) existing.add(cufe);
      }
      const fresh = listing.documents.filter(({ cufe }) => !existing.has(cufe));

      const [imported] = await tx
        .insert(receivedDocumentImports)
        .values({
          organizationId: scope.orgId,
          fileName,
          fileSha256,
          totalRows: listing.totalRows,
          createdCount: fresh.length,
          existingCount: existing.size,
          rejectedCount: listing.rejected.length,
          importedBy: actor.userId,
        })
        .returning({ id: receivedDocumentImports.id });
      if (!imported) throw new Error('Import insert returned no row');

      for (const batch of chunks(fresh, INSERT_BATCH)) {
        const created = await tx
          .insert(receivedDocuments)
          .values(
            batch.map((document) => ({
              ...document,
              receivedAt: document.receivedAt ? new Date(document.receivedAt) : null,
              organizationId: scope.orgId,
              importId: imported.id,
            })),
          )
          .returning({ id: receivedDocuments.id });
        await tx.insert(auditLogs).values(
          created.map(({ id }) => ({
            organizationId: scope.orgId,
            actorUserId: actor.userId,
            action: 'received_document.import',
            resourceType: RESOURCE_TYPE,
            resourceId: id,
            result: 'success' as const,
            metadata: { importId: imported.id, fileName },
          })),
        );
      }

      await tx.insert(auditLogs).values({
        organizationId: scope.orgId,
        actorUserId: actor.userId,
        action: 'received_document_import.create',
        resourceType: 'received_document_import',
        resourceId: imported.id,
        result: 'success',
        metadata: {
          fileName,
          fileSha256,
          totalRows: listing.totalRows,
          created: fresh.length,
          alreadyExisting: existing.size,
          rejected: listing.rejected.length,
        },
      });

      return {
        importId: imported.id,
        fileName,
        totalRows: listing.totalRows,
        created: fresh.length,
        alreadyExisting: existing.size,
        rejected: listing.rejected.slice(0, MAX_REJECTED_IN_RESPONSE),
      };
    });
  }

  /**
   * Carga el PDF de la DIAN: lo abre con el NIT de la organización, lee el CUFE impreso y lo asocia
   * con su factura. Se guarda la copia sin clave, que es la que se envía a Odoo.
   */
  async uploadPdf(
    actor: RequestActor,
    fileName: string,
    file: Buffer,
  ): Promise<ReceivedDocumentPdfUpload> {
    const scope = tenantScope(actor);
    const nit = await withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:import');
      const [organization] = await tx
        .select({ nit: organizations.nit })
        .from(organizations)
        .where(eq(organizations.id, scope.orgId))
        .limit(1);
      if (!organization) throw new NotFoundException('Organization not found');
      return organization.nit;
    });

    const opened = await openDianPdf(file, nitPasswords(nit), this.env.QPDF_PATH);
    const cufes = await findCufes(opened);
    if (cufes.length === 0) {
      throw new UnprocessableEntityException('No se encontró un CUFE en el PDF');
    }

    return withTenant(this.db, scope, async (tx) => {
      const matches = await tx
        .select({
          id: receivedDocuments.id,
          cufe: receivedDocuments.cufe,
          status: receivedDocuments.status,
        })
        .from(receivedDocuments)
        .where(inArray(receivedDocuments.cufe, cufes));
      const [document] = matches;
      if (!document) {
        throw new UnprocessableEntityException(
          'El PDF no corresponde a ninguna factura cargada. Importe primero el listado de la DIAN',
        );
      }
      if (matches.length > 1) {
        throw new UnprocessableEntityException('El PDF trae el CUFE de más de una factura');
      }
      if (document.status === 'approved' || document.status === 'rejected') {
        throw new ConflictException(`Document was already ${document.status}`);
      }

      const objectKey = `organizations/${scope.orgId}/datadian/received/${document.id}.pdf`;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.env.S3_BUCKET,
          Key: objectKey,
          Body: opened,
          ContentType: 'application/pdf',
        }),
      );
      const pdfSha256 = sha256(opened);
      await tx
        .update(receivedDocuments)
        .set({
          pdfObjectKey: objectKey,
          pdfFileName: fileName,
          pdfSha256,
          pdfSizeBytes: opened.length,
          pdfUploadedBy: actor.userId,
          pdfUploadedAt: new Date(),
        })
        .where(eq(receivedDocuments.id, document.id));
      await this.audit(tx, actor, scope, 'received_document.pdf_upload', document.id, {
        fileName,
        sha256: pdfSha256,
        sizeBytes: opened.length,
      });
      return { documentId: document.id, cufe: document.cufe, fileName, sizeBytes: opened.length };
    });
  }

  /** PDF ya abierto de una factura. */
  async getPdf(actor: RequestActor, id: string): Promise<{ fileName: string; content: Buffer }> {
    const document = await withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      return this.findOrThrow(tx, id);
    });
    if (!document.pdfObjectKey || !document.pdfFileName) {
      throw new NotFoundException('Document has no PDF');
    }
    return { fileName: document.pdfFileName, content: await this.readPdf(document.pdfObjectKey) };
  }

  async list(
    actor: RequestActor,
    { cursor, limit, status, importId }: ReceivedDocumentListQuery,
  ): Promise<CursorPage<ReceivedDocument>> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      const rows = await tx
        .select()
        .from(receivedDocuments)
        .where(
          and(
            status ? eq(receivedDocuments.status, status) : undefined,
            importId ? eq(receivedDocuments.importId, importId) : undefined,
            afterCursor(receivedDocuments, cursor),
          ),
        )
        .orderBy(...newestFirst(receivedDocuments))
        .limit(limit + 1);
      const page = toCursorPage(rows, limit);
      return { items: page.items.map(toContract), nextCursor: page.nextCursor };
    });
  }

  /** Cifras del tablero. */
  async summary(actor: RequestActor): Promise<ReceivedDocumentSummary> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      const byStatusRows = await tx
        .select({ status: receivedDocuments.status, total: count() })
        .from(receivedDocuments)
        .groupBy(receivedDocuments.status);
      const [open] = await tx
        .select({ amount: sum(receivedDocuments.total) })
        .from(receivedDocuments)
        .where(inArray(receivedDocuments.status, OPEN_STATUSES));
      const [withoutPdf] = await tx
        .select({ total: count() })
        .from(receivedDocuments)
        .where(
          and(
            inArray(receivedDocuments.status, OPEN_STATUSES),
            isNull(receivedDocuments.pdfObjectKey),
          ),
        );
      const [odooFailed] = await tx
        .select({ total: count() })
        .from(receivedDocuments)
        .where(eq(receivedDocuments.odooStatus, 'failed'));

      const byStatus = Object.fromEntries(
        RECEIVED_DOCUMENT_STATUSES.map((status) => [
          status,
          byStatusRows.find((row) => row.status === status)?.total ?? 0,
        ]),
      ) as ReceivedDocumentSummary['byStatus'];
      return {
        byStatus,
        withoutPdf: withoutPdf?.total ?? 0,
        odooFailed: odooFailed?.total ?? 0,
        pendingTotal: Number(open?.amount ?? 0).toFixed(2),
      };
    });
  }

  async get(actor: RequestActor, id: string): Promise<ReceivedDocument> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      return toContract(await this.findOrThrow(tx, id));
    });
  }

  /**
   * Decide sobre una factura pendiente o en borrador:
   * - draft: queda guardada para aprobarla después;
   * - approved: exige el PDF y la conexión con Odoo, y se envía a Odoo como borrador de factura de proveedor;
   * - rejected: exige motivo y es definitiva.
   */
  async decide(
    actor: RequestActor,
    id: string,
    { decision, reason, rejectionCode }: ReceivedDocumentDecision,
  ): Promise<ReceivedDocument> {
    const scope = tenantScope(actor);
    const decided = await withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:decide');
      const allowedFrom: readonly ReceivedDocumentStatus[] =
        decision === 'draft' ? ['imported'] : OPEN_STATUSES;

      if (decision === 'approved') {
        const current = await this.findOrThrow(tx, id);
        if (allowedFrom.includes(current.status)) {
          if (!current.pdfObjectKey) {
            throw new UnprocessableEntityException(
              'Cargue el PDF de la factura antes de aprobarla',
            );
          }
          if (!(await this.settings.hasOdooConnection(tx))) {
            throw new UnprocessableEntityException(
              'Configure la conexión con Odoo antes de aprobar facturas',
            );
          }
        }
      }

      const [row] = await tx
        .update(receivedDocuments)
        .set({
          status: decision,
          decidedBy: actor.userId,
          decidedAt: new Date(),
          decisionReason: reason ?? null,
          rejectionCode: rejectionCode ?? null,
          ...(decision === 'approved' ? { odooStatus: 'pending' as const, odooError: null } : {}),
        })
        .where(and(eq(receivedDocuments.id, id), inArray(receivedDocuments.status, allowedFrom)))
        .returning();
      if (!row) {
        const current = await this.findOrThrow(tx, id);
        throw new ConflictException(`Document is ${current.status}`);
      }
      const action = {
        draft: 'received_document.draft',
        approved: 'received_document.approve',
        rejected: 'received_document.reject',
      }[decision];
      await this.audit(tx, actor, scope, action, row.id, {
        cufe: row.cufe,
        ...(rejectionCode ? { rejectionCode } : {}),
        ...(reason ? { reason } : {}),
      });
      return row;
    });

    if (decision !== 'approved') return toContract(decided);
    return this.sendToOdoo(actor, id);
  }

  /** Reintenta el envío a Odoo de una factura aprobada cuyo envío falló o quedó a medias. */
  async retryOdoo(actor: RequestActor, id: string): Promise<ReceivedDocument> {
    await withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:decide');
      const current = await this.findOrThrow(tx, id);
      if (current.status !== 'approved' || current.odooStatus === 'sent') {
        throw new ConflictException('Only approved documents not yet sent to Odoo can be retried');
      }
    });
    return this.sendToOdoo(actor, id);
  }

  /** Historial de una factura, del más antiguo al más reciente. */
  async history(actor: RequestActor, id: string): Promise<ReceivedDocumentHistoryEntry[]> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      await this.findOrThrow(tx, id);
      const entries = await tx
        .select({
          id: auditLogs.id,
          action: auditLogs.action,
          actorUserId: auditLogs.actorUserId,
          result: auditLogs.result,
          metadata: auditLogs.metadata,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .where(and(eq(auditLogs.resourceType, RESOURCE_TYPE), eq(auditLogs.resourceId, id)))
        .orderBy(asc(auditLogs.createdAt), asc(auditLogs.id))
        .limit(MAX_HISTORY_ENTRIES);
      return entries.map((entry) => ({ ...entry, createdAt: entry.createdAt.toISOString() }));
    });
  }

  /**
   * Envía a Odoo la factura aprobada. Corre en una transacción con un candado por factura, así dos
   * envíos simultáneos no la crean dos veces; el resultado, bueno o malo, queda en la factura y en
   * el historial.
   */
  private async sendToOdoo(actor: RequestActor, id: string): Promise<ReceivedDocument> {
    const scope = tenantScope(actor);
    return withTenant(this.db, scope, async (tx) => {
      const [{ locked } = { locked: false }] = await tx
        .execute<{ locked: boolean }>(
          sql`select pg_try_advisory_xact_lock(hashtextextended(${`odoo_sync:${id}`}, 0)) as locked`,
        )
        .then((result) => result.rows);
      if (!locked) throw new ConflictException('The document is already being sent to Odoo');

      const document = await this.findOrThrow(tx, id);
      if (document.odooStatus === 'sent') return toContract(document);

      try {
        const config = await this.settings.odooConfig(tx);
        if (!config) throw new OdooError('No hay conexión con Odoo configurada', null);
        if (!document.pdfObjectKey || !document.pdfFileName) {
          throw new OdooError('La factura no tiene PDF', null);
        }
        const result = await pushVendorBill(new OdooClient(config), document, {
          fileName: document.pdfFileName,
          content: await this.readPdf(document.pdfObjectKey),
        });
        const [sent] = await tx
          .update(receivedDocuments)
          .set({
            odooStatus: 'sent',
            odooMoveId: result.moveId,
            odooAttachmentId: result.attachmentId,
            odooError: null,
            odooSentAt: new Date(),
          })
          .where(eq(receivedDocuments.id, id))
          .returning();
        await this.audit(tx, actor, scope, 'received_document.odoo_sent', id, {
          cufe: document.cufe,
          odooMoveId: result.moveId,
          odooAttachmentId: result.attachmentId,
          partnerFound: result.partnerFound,
        });
        return toContract(sent ?? document);
      } catch (error) {
        if (!(error instanceof OdooError)) throw error;
        const [failed] = await tx
          .update(receivedDocuments)
          .set({ odooStatus: 'failed', odooError: error.message })
          .where(eq(receivedDocuments.id, id))
          .returning();
        await this.audit(
          tx,
          actor,
          scope,
          'received_document.odoo_sent',
          id,
          {
            cufe: document.cufe,
            error: error.message,
          },
          'failure',
        );
        return toContract(failed ?? document);
      }
    });
  }

  private async findOrThrow(tx: Transaction, id: string): Promise<Row> {
    const [row] = await tx
      .select()
      .from(receivedDocuments)
      .where(eq(receivedDocuments.id, id))
      .limit(1);
    if (!row) throw new NotFoundException('Document not found');
    return row;
  }

  private async readPdf(objectKey: string): Promise<Buffer> {
    const object = await this.s3.send(
      new GetObjectCommand({ Bucket: this.env.S3_BUCKET, Key: objectKey }),
    );
    if (!object.Body) throw new Error('PDF object has no body');
    return Buffer.from(await object.Body.transformToByteArray());
  }

  private audit(
    tx: Transaction,
    actor: RequestActor,
    scope: TenantScope,
    action: string,
    resourceId: string,
    metadata: Record<string, unknown>,
    result: 'success' | 'failure' = 'success',
  ) {
    return tx.insert(auditLogs).values({
      organizationId: scope.orgId,
      actorUserId: actor.userId,
      action,
      resourceType: RESOURCE_TYPE,
      resourceId,
      result,
      metadata,
    });
  }
}

function tenantScope(actor: RequestActor): TenantScope {
  if (!actor.orgId) throw new ForbiddenException('Select an organization first');
  return { orgId: actor.orgId, userId: actor.userId };
}

function toContract(row: Row): ReceivedDocument {
  return {
    id: row.id,
    importId: row.importId,
    documentType: row.documentType,
    cufe: row.cufe,
    folio: row.folio,
    prefix: row.prefix,
    paymentMethod: row.paymentMethod,
    issueDate: row.issueDate,
    receivedAt: row.receivedAt?.toISOString() ?? null,
    issuerNit: row.issuerNit,
    issuerName: row.issuerName,
    iva: row.iva,
    inc: row.inc,
    total: row.total,
    dianStatus: row.dianStatus,
    dianGroup: row.dianGroup,
    costCenter: row.costCenter,
    paymentType: row.paymentType,
    acknowledgmentStatus: row.acknowledgmentStatus,
    invoiceReference: row.invoiceReference,
    observations: row.observations,
    status: row.status,
    decidedBy: row.decidedBy,
    decidedAt: row.decidedAt?.toISOString() ?? null,
    decisionReason: row.decisionReason,
    rejectionCode: row.rejectionCode,
    pdf:
      row.pdfFileName && row.pdfUploadedAt
        ? {
            fileName: row.pdfFileName,
            uploadedAt: row.pdfUploadedAt.toISOString(),
            sizeBytes: row.pdfSizeBytes ?? 0,
          }
        : null,
    odoo: row.odooStatus
      ? {
          status: row.odooStatus,
          moveId: row.odooMoveId,
          error: row.odooError,
          sentAt: row.odooSentAt?.toISOString() ?? null,
        }
      : null,
    createdAt: row.createdAt.toISOString(),
  };
}

const sha256 = (content: Buffer) => createHash('sha256').update(content).digest('hex');

function chunks<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    result.push(items.slice(start, start + size));
  }
  return result;
}
