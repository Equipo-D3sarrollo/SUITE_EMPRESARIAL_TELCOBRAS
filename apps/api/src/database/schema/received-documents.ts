import {
  DIAN_ENVIRONMENTS,
  DIAN_SYNC_CHANNELS,
  INVOICE_VALIDATION_STATUSES,
  ODOO_SYNC_STATUSES,
  PAYMENT_FORMS,
  RADIAN_STATUSES,
  RECEIVED_DOCUMENT_STATUSES,
  REJECTION_CODES,
} from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  text,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { dianFiles, dianSyncRuns } from './datadian-files.js';
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
 * El identificador de negocio es el CUFE, único por organización. Desde la 0013 (DataDian 2.5,
 * ARQUITECTURA_DB_DATADIAN.md §5.6) entra por una sincronización (sync_run_id) o por el lote legado
 * (import_id), y el disparador received_documents_guard congela los datos de origen al llegar el XML.
 */
export const receivedDocuments = appSchema.table(
  'received_documents',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    importId: uuid('import_id'),

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

    // DataDian 2.5 (§5.6): datos del XML, ingesta, validación y caché RADIAN.
    issuedAt: nullableTimestamp('issued_at'),
    dueDate: date('due_date'),
    dianValidatedAt: nullableTimestamp('dian_validated_at'),
    buyerNit: text('buyer_nit'),
    currency: char('currency', { length: 3 }),
    subtotal: numeric('subtotal', { precision: 18, scale: 2 }),
    taxTotal: numeric('tax_total', { precision: 18, scale: 2 }),
    paymentForm: char('payment_form', { length: 1, enum: PAYMENT_FORMS }),
    paymentMeansCode: text('payment_means_code'),
    ublTypeCode: text('ubl_type_code'),
    profileExecutionId: char('profile_execution_id', { length: 1, enum: DIAN_ENVIRONMENTS }),
    attachedDocumentFileId: uuid('attached_document_file_id'),
    // El default solo cubre el lote legado (import_id); Telco lo fija siempre (ver la 0013).
    ingestionSource: text('ingestion_source', { enum: DIAN_SYNC_CHANNELS })
      .notNull()
      .default('manual'),
    syncRunId: uuid('sync_run_id'),
    validationStatus: text('validation_status', { enum: INVOICE_VALIDATION_STATUSES })
      .notNull()
      .default('pending_xml'),
    validationErrors: jsonb('validation_errors').$type<unknown[]>().notNull().default([]),
    validatedAt: nullableTimestamp('validated_at'),
    preXmlSnapshot: jsonb('pre_xml_snapshot').$type<Record<string, unknown>>(),
    radianStatus: text('radian_status', { enum: RADIAN_STATUSES }).notNull().default('none'),
    radianStatusAt: nullableTimestamp('radian_status_at'),
    claimDeadlineAt: nullableTimestamp('claim_deadline_at'),
    deadlineRuleVersion: integer('deadline_rule_version'),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('received_documents_organization_id_cufe_key').on(t.organizationId, t.cufe),
    unique('received_documents_organization_id_id_key').on(t.organizationId, t.id),
    foreignKey({
      name: 'received_documents_attached_document_fk',
      columns: [t.organizationId, t.attachedDocumentFileId],
      foreignColumns: [dianFiles.organizationId, dianFiles.id],
    }),
    foreignKey({
      name: 'received_documents_sync_run_fk',
      columns: [t.organizationId, t.syncRunId],
      foreignColumns: [dianSyncRuns.organizationId, dianSyncRuns.id],
    }),
    check('received_documents_origin_check', sql`num_nonnulls(${t.importId}, ${t.syncRunId}) = 1`),
    check(
      'received_documents_legacy_source_check',
      sql`${t.importId} is null or ${t.ingestionSource} = 'manual'`,
    ),
    check('received_documents_cufe_check', sql`${t.cufe} ~ '^[0-9a-f]{96}$'`),
    check(
      'received_documents_valid_xml_check',
      sql`${t.validationStatus} <> 'valid' or ${t.attachedDocumentFileId} is not null`,
    ),
    check('received_documents_issuer_nit_check', sql`${t.issuerNit} ~ '^[0-9]{5,15}$'`),
    check('received_documents_buyer_nit_check', sql`${t.buyerNit} ~ '^[0-9]{5,15}$'`),
    oneOf('received_documents_payment_form_check', t.paymentForm, PAYMENT_FORMS),
    oneOf('received_documents_profile_execution_id_check', t.profileExecutionId, DIAN_ENVIRONMENTS),
    oneOf('received_documents_ingestion_source_check', t.ingestionSource, DIAN_SYNC_CHANNELS),
    oneOf(
      'received_documents_validation_status_check',
      t.validationStatus,
      INVOICE_VALIDATION_STATUSES,
    ),
    oneOf('received_documents_radian_status_check', t.radianStatus, RADIAN_STATUSES),
    index('received_documents_radian_status_idx').on(
      t.organizationId,
      t.radianStatus,
      t.createdAt,
      t.id,
    ),
    index('received_documents_claim_deadline_idx')
      .on(t.organizationId, t.claimDeadlineAt)
      .where(sql`${t.radianStatus} = 'goods_received'`),
    index('received_documents_issuer_nit_idx').on(t.organizationId, t.issuerNit),
    index('received_documents_issue_date_idx').on(t.organizationId, t.issueDate, t.id),
    index('received_documents_validation_status_idx')
      .on(t.organizationId, t.validationStatus)
      .where(sql`${t.validationStatus} <> 'valid'`),
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

/** Desglose de cac:TaxTotal/cac:TaxSubtotal de la factura. Solo inserción, al adjuntar el XML (§5.7). */
export const receivedDocumentTaxes = appSchema.table(
  'received_document_taxes',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    receivedDocumentId: uuid('received_document_id').notNull(),
    taxSchemeId: text('tax_scheme_id').notNull(),
    percent: numeric('percent', { precision: 7, scale: 4 }),
    taxableAmount: numeric('taxable_amount', { precision: 18, scale: 2 }).notNull(),
    taxAmount: numeric('tax_amount', { precision: 18, scale: 2 }).notNull(),
    isWithholding: boolean('is_withholding').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    foreignKey({
      name: 'received_document_taxes_document_fk',
      columns: [t.organizationId, t.receivedDocumentId],
      foreignColumns: [receivedDocuments.organizationId, receivedDocuments.id],
    }),
    uniqueIndex('received_document_taxes_scheme_key').on(
      t.organizationId,
      t.receivedDocumentId,
      t.taxSchemeId,
      t.isWithholding,
      sql`coalesce(${t.percent}, -1)`,
    ),
  ],
);
