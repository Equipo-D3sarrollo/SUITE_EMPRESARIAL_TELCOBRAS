import {
  ODOO_SYNC_STATUSES,
  RECEIVED_DOCUMENT_STATUSES,
  REJECTION_CODES,
} from '@telcobras/contracts';
import { date, foreignKey, index, integer, numeric, text, unique, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { organizations } from './organizations.js';

/**
 * Lote con el que ingresan facturas recibidas a DataDian. Se adapta en la Etapa 5
 * (docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md).
 */
export const receivedDocumentImports = appSchema.table(
  'received_document_imports',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    fileName: text('file_name').notNull(),
    fileSha256: text('file_sha256').notNull(),
    totalRows: integer('total_rows').notNull(),
    createdCount: integer('created_count').notNull(),
    existingCount: integer('existing_count').notNull(),
    rejectedCount: integer('rejected_count').notNull(),
    importedBy: uuid('imported_by').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    unique('received_document_imports_organization_id_id_key').on(t.organizationId, t.id),
    index('received_document_imports_cursor_idx').on(t.organizationId, t.createdAt, t.id),
  ],
);

/**
 * Factura recibida. Los datos de la DIAN se guardan tal cual y no se modifican: app_user solo puede
 * actualizar las columnas de la decisión interna, del PDF y del envío a Odoo (ver las migraciones).
 * El identificador de negocio es el CUFE, único por organización.
 */
export const receivedDocuments = appSchema.table(
  'received_documents',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    importId: uuid('import_id').notNull(),

    // Datos de la factura según la DIAN.
    documentType: text('document_type'),
    cufe: text('cufe').notNull(),
    folio: text('folio'),
    prefix: text('prefix'),
    paymentMethod: text('payment_method'),
    issueDate: date('issue_date'),
    receivedAt: nullableTimestamp('received_at'),
    issuerNit: text('issuer_nit'),
    issuerName: text('issuer_name'),
    iva: numeric('iva', { precision: 18, scale: 2 }),
    inc: numeric('inc', { precision: 18, scale: 2 }),
    total: numeric('total', { precision: 18, scale: 2 }),
    dianStatus: text('dian_status'),
    dianGroup: text('dian_group'),
    costCenter: text('cost_center'),
    paymentType: text('payment_type'),
    acknowledgmentStatus: text('acknowledgment_status'),
    invoiceReference: text('invoice_reference'),
    observations: text('observations'),

    // Decisión interna de la suite. No es un evento ante la DIAN.
    status: text('status', { enum: RECEIVED_DOCUMENT_STATUSES }).notNull().default('imported'),
    decidedBy: uuid('decided_by'),
    decidedAt: nullableTimestamp('decided_at'),
    decisionReason: text('decision_reason'),
    rejectionCode: text('rejection_code', { enum: REJECTION_CODES }),

    // PDF de la factura en S3 (opcional).
    pdfObjectKey: text('pdf_object_key'),
    pdfFileName: text('pdf_file_name'),
    pdfSha256: text('pdf_sha256'),
    pdfSizeBytes: integer('pdf_size_bytes'),
    pdfUploadedBy: uuid('pdf_uploaded_by'),
    pdfUploadedAt: nullableTimestamp('pdf_uploaded_at'),

    // Envío a Odoo de la factura aprobada.
    odooStatus: text('odoo_status', { enum: ODOO_SYNC_STATUSES }),
    odooMoveId: integer('odoo_move_id'),
    odooAttachmentId: integer('odoo_attachment_id'),
    odooError: text('odoo_error'),
    odooSentAt: nullableTimestamp('odoo_sent_at'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('received_documents_organization_id_cufe_key').on(t.organizationId, t.cufe),
    foreignKey({
      name: 'received_documents_import_fk',
      columns: [t.organizationId, t.importId],
      foreignColumns: [receivedDocumentImports.organizationId, receivedDocumentImports.id],
    }),
    index('received_documents_cursor_idx').on(t.organizationId, t.createdAt, t.id),
    index('received_documents_status_idx').on(t.organizationId, t.status, t.createdAt, t.id),
    oneOf('received_documents_status_check', t.status, RECEIVED_DOCUMENT_STATUSES),
    oneOf('received_documents_odoo_status_check', t.odooStatus, ODOO_SYNC_STATUSES),
    oneOf('received_documents_rejection_code_check', t.rejectionCode, REJECTION_CODES),
  ],
);
