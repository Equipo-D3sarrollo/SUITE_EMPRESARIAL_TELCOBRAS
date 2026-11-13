import { z } from 'zod';
import { REJECTION_CODES } from './received-document.js';

/**
 * Enumerados y filas de las tablas de DataDian de la Etapa 2 (docs/modules/documents/
 * ARQUITECTURA_DB_DATADIAN.md §5 a §8). Son la fuente de las listas cerradas (`CHECK`) de las
 * migraciones 0011 a 0017 y de los tipos que usa el frontend. Las filas no traen columnas secretas
 * (`software_pin`, `password`, `pfx_data_key`, `secret`): `app_user` no las puede leer (§9.3).
 */

// ---- Enumerados ----

/** Ambiente DIAN (`cbc:ProfileExecutionID`): 1 producción, 2 habilitación. */
export const DIAN_ENVIRONMENTS = ['1', '2'] as const;
export type DianEnvironment = (typeof DIAN_ENVIRONMENTS)[number];

/** Modo de operación ante la DIAN (D-14). */
export const DIAN_OPERATION_MODES = ['own_software', 'technology_provider'] as const;
export type DianOperationMode = (typeof DIAN_OPERATION_MODES)[number];

/** Estado de un certificado `.pfx` (§5.2). */
export const DIAN_CERTIFICATE_STATUSES = [
  'pending_validation',
  'valid',
  'invalid',
  'retired',
] as const;
export type DianCertificateStatus = (typeof DIAN_CERTIFICATE_STATUSES)[number];

/** Autenticación del buzón IMAP (§5.3). */
export const IMAP_AUTH_METHODS = ['password', 'oauth2'] as const;
export type ImapAuthMethod = (typeof IMAP_AUTH_METHODS)[number];

/** Clase de archivo guardado en S3 (§5.4). */
export const DIAN_FILE_KINDS = [
  'attached_document',
  'invoice_pdf',
  'event_request',
  'event_response',
  'status_response',
  'dian_listing',
] as const;
export type DianFileKind = (typeof DIAN_FILE_KINDS)[number];

/** Canal por el que entra una factura o se sincroniza (§5.5 y §5.6). */
export const DIAN_SYNC_CHANNELS = ['rpa', 'imap', 'manual'] as const;
export type DianSyncChannel = (typeof DIAN_SYNC_CHANNELS)[number];

/** Quién lanzó la sincronización (§5.5). */
export const DIAN_SYNC_TRIGGERS = ['schedule', 'user', 'system'] as const;
export type DianSyncTrigger = (typeof DIAN_SYNC_TRIGGERS)[number];

/** Estado de una ejecución de sincronización (§5.5). */
export const DIAN_SYNC_STATUSES = ['queued', 'running', 'succeeded', 'partial', 'failed'] as const;
export type DianSyncStatus = (typeof DIAN_SYNC_STATUSES)[number];

/** Validación de la factura contra su XML (§5.6). */
export const INVOICE_VALIDATION_STATUSES = [
  'pending_xml',
  'pending_validation',
  'valid',
  'invalid',
] as const;
export type InvoiceValidationStatus = (typeof INVOICE_VALIDATION_STATUSES)[number];

/** Estado RADIAN de la factura: caché del último evento aceptado (§5.6). */
export const RADIAN_STATUSES = [
  'none',
  'acknowledged',
  'goods_received',
  'claimed',
  'accepted_express',
  'accepted_tacit',
] as const;
export type RadianStatus = (typeof RADIAN_STATUSES)[number];

/** Forma de pago (`cac:PaymentMeans/cbc:ID`): 1 contado, 2 crédito. */
export const PAYMENT_FORMS = ['1', '2'] as const;
export type PaymentForm = (typeof PAYMENT_FORMS)[number];

/** Códigos de evento RADIAN (§6.1). */
export const RADIAN_EVENT_CODES = ['030', '031', '032', '033', '034'] as const;
export type RadianEventCode = (typeof RADIAN_EVENT_CODES)[number];

/** Quién registra el evento: `buyer`, la organización; `issuer`, el proveedor. */
export const RADIAN_EVENT_ACTORS = ['buyer', 'issuer'] as const;
export type RadianEventActor = (typeof RADIAN_EVENT_ACTORS)[number];

/** Origen del evento: pedido en la suite u observado en la DIAN. */
export const RADIAN_EVENT_ORIGINS = ['suite', 'dian'] as const;
export type RadianEventOrigin = (typeof RADIAN_EVENT_ORIGINS)[number];

/** Estado del evento (§6.3): `pending` es local; los demás son finales. */
export const RADIAN_EVENT_STATUSES = ['pending', 'accepted', 'rejected', 'failed'] as const;
export type RadianEventStatus = (typeof RADIAN_EVENT_STATUSES)[number];

/** Concepto del reclamo (031). Mismo catálogo que el rechazo interno, por verificar (PV-3). */
export const CLAIM_CODES = REJECTION_CODES;
export type ClaimCode = (typeof CLAIM_CODES)[number];

/** Resultado de un intento de envío (§6.4). */
export const RADIAN_ATTEMPT_OUTCOMES = [
  'accepted',
  'rejected',
  'already_processed',
  'transport_error',
  'timeout',
  'local_error',
] as const;
export type RadianAttemptOutcome = (typeof RADIAN_ATTEMPT_OUTCOMES)[number];

/** Clase de trabajo de la cola de Telco (§7.6). */
export const TELCO_JOB_KINDS = [
  'rpa_sync',
  'imap_sync',
  'xml_fetch',
  'xml_ingest',
  'radian_event_send',
  'radian_status_query',
  'certificate_check',
  'odoo_push',
] as const;
export type TelcoJobKind = (typeof TELCO_JOB_KINDS)[number];

/** Estado de un trabajo de Telco (§7.6). */
export const TELCO_JOB_STATUSES = ['queued', 'running', 'succeeded', 'dead', 'cancelled'] as const;
export type TelcoJobStatus = (typeof TELCO_JOB_STATUSES)[number];

/** Estado del vínculo con el movimiento de Odoo (§7.8). */
export const ODOO_LINK_STATES = ['pending', 'created', 'failed', 'cancelled'] as const;
export type OdooLinkState = (typeof ODOO_LINK_STATES)[number];

/** Estado del plazo de reclamo que calcula la vista `received_documents_radian` (§8.2). */
export const DEADLINE_STATES = ['none', 'open', 'due_soon', 'expired'] as const;
export type DeadlineState = (typeof DEADLINE_STATES)[number];

/** Estado de vencimiento del certificado que calcula la vista `dian_certificate_status` (§8.2). */
export const CERTIFICATE_EXPIRY_STATES = ['ok', 'due_soon', 'expired'] as const;
export type CertificateExpiryState = (typeof CERTIFICATE_EXPIRY_STATES)[number];

/** Acciones de DataDian en `audit_logs.action` (§7.7). */
export const DATADIAN_AUDIT_ACTIONS = [
  'datadian.settings.update',
  'datadian.certificate.upload',
  'datadian.certificate.validate',
  'datadian.certificate.activate',
  'datadian.certificate.retire',
  'datadian.mailbox.update',
  'datadian.sync.request',
  'datadian.sync.finish',
  'datadian.invoice.ingest',
  'datadian.invoice.xml_attach',
  'datadian.invoice.validate',
  'datadian.event.request',
  'datadian.event.accepted',
  'datadian.event.rejected',
  'datadian.event.failed',
  'datadian.event.observed',
  'datadian.job.retry',
  'datadian.job.cancel',
] as const;
export type DatadianAuditAction = (typeof DATADIAN_AUDIT_ACTIONS)[number];

/** `resource_type` de las acciones de DataDian en `audit_logs` (§7.7). */
export const DATADIAN_AUDIT_RESOURCE_TYPES = [
  'dian_settings',
  'dian_certificate',
  'imap_mailbox',
  'dian_sync_run',
  'received_document',
  'radian_event',
  'telco_job',
] as const;
export type DatadianAuditResourceType = (typeof DATADIAN_AUDIT_RESOURCE_TYPES)[number];

// ---- Filas (sin columnas secretas) ----

const uuid = z.uuid();
const timestamp = z.iso.datetime({ offset: true });
const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
/** NIT sin dígito de verificación, como lo guarda `dian_settings.nit`. */
export const dianNitSchema = z.string().regex(/^[0-9]{5,15}$/, 'NIT sin dígito de verificación');
/** Importes como texto decimal: no pasan por coma flotante. */
const amount = z.string().regex(/^-?\d+(\.\d{1,2})?$/);

/** Configuración DIAN de la organización (`dian_settings`), sin `software_pin`. */
export const dianSettingsRowSchema = z.object({
  organizationId: uuid,
  nit: dianNitSchema,
  nitDv: z
    .string()
    .regex(/^[0-9]$/)
    .nullable(),
  environment: z.enum(DIAN_ENVIRONMENTS),
  operationMode: z.enum(DIAN_OPERATION_MODES),
  softwareId: uuid.nullable(),
  testSetId: z.string().nullable(),
  activeCertificateId: uuid.nullable(),
  rpaEnabled: z.boolean(),
  imapEnabled: z.boolean(),
  syncLookbackDays: z.int().min(1).max(92),
  updatedBy: uuid,
  createdAt: timestamp,
  updatedAt: timestamp,
});
export type DianSettingsRow = z.infer<typeof dianSettingsRowSchema>;

/** Certificado `.pfx` (`dian_certificates`), sin `password` ni `pfx_data_key`. */
export const dianCertificateRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  storageKey: z.string(),
  pfxSha256: sha256,
  pfxSizeBytes: z.int().positive().max(65536),
  status: z.enum(DIAN_CERTIFICATE_STATUSES),
  serialNumber: z.string().nullable(),
  subjectNit: z.string().nullable(),
  subjectDn: z.string().nullable(),
  issuerDn: z.string().nullable(),
  notBefore: timestamp.nullable(),
  notAfter: timestamp.nullable(),
  signatureAlgorithm: z.string().nullable(),
  keyUsageOk: z.boolean().nullable(),
  chainOk: z.boolean().nullable(),
  validationErrors: z.array(z.unknown()),
  uploadedBy: uuid,
  validatedAt: timestamp.nullable(),
  retiredAt: timestamp.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});
export type DianCertificateRow = z.infer<typeof dianCertificateRowSchema>;

/** Buzón IMAP (`imap_mailboxes`), sin `secret`. */
export const imapMailboxRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  host: z.string(),
  port: z.int().min(1).max(65535),
  useTls: z.boolean(),
  username: z.string(),
  authMethod: z.enum(IMAP_AUTH_METHODS),
  folder: z.string(),
  uidValidity: z.string().nullable(),
  lastUid: z.string().nullable(),
  enabled: z.boolean(),
  updatedBy: uuid,
  createdAt: timestamp,
  updatedAt: timestamp,
});
export type ImapMailboxRow = z.infer<typeof imapMailboxRowSchema>;

/** Archivo en S3 con su hash (`dian_files`). */
export const dianFileRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  kind: z.enum(DIAN_FILE_KINDS),
  storageKey: z.string(),
  sha256,
  sizeBytes: z.number().int().positive(),
  contentType: z.string(),
  originalName: z.string().nullable(),
  createdBy: uuid.nullable(),
  createdAt: timestamp,
});
export type DianFileRow = z.infer<typeof dianFileRowSchema>;

/** Ejecución de sincronización (`dian_sync_runs`). */
export const dianSyncRunRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  channel: z.enum(DIAN_SYNC_CHANNELS),
  trigger: z.enum(DIAN_SYNC_TRIGGERS),
  requestedBy: uuid.nullable(),
  jobId: uuid.nullable(),
  mailboxId: uuid.nullable(),
  periodStart: z.iso.date().nullable(),
  periodEnd: z.iso.date().nullable(),
  status: z.enum(DIAN_SYNC_STATUSES),
  startedAt: timestamp.nullable(),
  finishedAt: timestamp.nullable(),
  listedCount: z.int().nonnegative(),
  newCount: z.int().nonnegative(),
  existingCount: z.int().nonnegative(),
  xmlDownloadedCount: z.int().nonnegative(),
  failedCount: z.int().nonnegative(),
  listingFileId: uuid.nullable(),
  errorMessage: z.string().nullable(),
  details: z.record(z.string(), z.unknown()),
  createdAt: timestamp,
  updatedAt: timestamp,
});
export type DianSyncRunRow = z.infer<typeof dianSyncRunRowSchema>;

/** Columnas RADIAN y de validación que la 0013 agrega a `received_documents` (§5.6). */
export const receivedDocumentRadianFieldsSchema = z.object({
  issuedAt: timestamp.nullable(),
  dueDate: z.iso.date().nullable(),
  dianValidatedAt: timestamp.nullable(),
  buyerNit: z.string().nullable(),
  currency: z.string().length(3).nullable(),
  subtotal: amount.nullable(),
  taxTotal: amount.nullable(),
  paymentForm: z.enum(PAYMENT_FORMS).nullable(),
  paymentMeansCode: z.string().nullable(),
  ublTypeCode: z.string().nullable(),
  profileExecutionId: z.enum(DIAN_ENVIRONMENTS).nullable(),
  attachedDocumentFileId: uuid.nullable(),
  ingestionSource: z.enum(DIAN_SYNC_CHANNELS),
  syncRunId: uuid.nullable(),
  validationStatus: z.enum(INVOICE_VALIDATION_STATUSES),
  validationErrors: z.array(z.unknown()),
  validatedAt: timestamp.nullable(),
  radianStatus: z.enum(RADIAN_STATUSES),
  radianStatusAt: timestamp.nullable(),
  claimDeadlineAt: timestamp.nullable(),
  deadlineRuleVersion: z.int().positive().nullable(),
});
export type ReceivedDocumentRadianFields = z.infer<typeof receivedDocumentRadianFieldsSchema>;

/** Impuesto de la factura (`received_document_taxes`). */
export const receivedDocumentTaxRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  receivedDocumentId: uuid,
  taxSchemeId: z.string(),
  percent: z.string().nullable(),
  taxableAmount: amount,
  taxAmount: amount,
  isWithholding: z.boolean(),
  createdAt: timestamp,
});
export type ReceivedDocumentTaxRow = z.infer<typeof receivedDocumentTaxRowSchema>;

/** Error de una regla incumplida, en `error_trace`. */
export const radianErrorTraceEntrySchema = z.object({ code: z.string(), message: z.string() });

/** Evento RADIAN (`radian_events`). */
export const radianEventRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  receivedDocumentId: uuid,
  eventCode: z.enum(RADIAN_EVENT_CODES),
  actor: z.enum(RADIAN_EVENT_ACTORS),
  origin: z.enum(RADIAN_EVENT_ORIGINS),
  environment: z.enum(DIAN_ENVIRONMENTS),
  status: z.enum(RADIAN_EVENT_STATUSES),
  claimCode: z.enum(CLAIM_CODES).nullable(),
  claimNote: z.string().nullable(),
  cude: z
    .string()
    .regex(/^[0-9a-f]{96}$/)
    .nullable(),
  generatedAt: timestamp.nullable(),
  sentAt: timestamp.nullable(),
  dianRegisteredAt: timestamp.nullable(),
  dianStatusCode: z.string().nullable(),
  requestFileId: uuid.nullable(),
  responseFileId: uuid.nullable(),
  certificateId: uuid.nullable(),
  errorMessage: z.string().nullable(),
  errorTrace: z.array(radianErrorTraceEntrySchema),
  attempts: z.int().nonnegative(),
  idempotencyKey: z.string(),
  requestedBy: uuid.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});
export type RadianEventRow = z.infer<typeof radianEventRowSchema>;

/** Intento de envío de un evento (`radian_event_attempts`). */
export const radianEventAttemptRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  radianEventId: uuid,
  attemptNo: z.int().positive(),
  jobId: uuid.nullable(),
  startedAt: timestamp,
  finishedAt: timestamp.nullable(),
  outcome: z.enum(RADIAN_ATTEMPT_OUTCOMES),
  httpStatus: z.int().nullable(),
  dianStatusCode: z.string().nullable(),
  requestFileId: uuid.nullable(),
  responseFileId: uuid.nullable(),
  errorTrace: z.array(radianErrorTraceEntrySchema),
  durationMs: z.int().nonnegative().nullable(),
});
export type RadianEventAttemptRow = z.infer<typeof radianEventAttemptRowSchema>;

/** Trabajo de la cola de Telco (`telco_jobs`). */
export const telcoJobRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  kind: z.enum(TELCO_JOB_KINDS),
  payload: z.record(z.string(), z.unknown()),
  status: z.enum(TELCO_JOB_STATUSES),
  priority: z.int(),
  runAt: timestamp,
  attempts: z.int().nonnegative(),
  maxAttempts: z.int().positive(),
  leaseOwner: z.string().nullable(),
  leasedAt: timestamp.nullable(),
  leaseExpiresAt: timestamp.nullable(),
  backoffBaseSeconds: z.int().positive(),
  backoffMaxSeconds: z.int().positive(),
  recurrenceSeconds: z.int().positive().nullable(),
  dedupeKey: z.string().nullable(),
  lastError: z.string().nullable(),
  lastErrorAt: timestamp.nullable(),
  result: z.unknown().nullable(),
  createdBy: uuid.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
  finishedAt: timestamp.nullable(),
});
export type TelcoJobRow = z.infer<typeof telcoJobRowSchema>;

/** Vínculo de la factura con su movimiento de Odoo (`odoo_document_links`). */
export const odooDocumentLinkRowSchema = z.object({
  id: uuid,
  organizationId: uuid,
  receivedDocumentId: uuid,
  odooBaseUrl: z.string(),
  odooDatabase: z.string(),
  moveId: z.int().nullable(),
  attachmentId: z.int().nullable(),
  state: z.enum(ODOO_LINK_STATES),
  triggerEventId: uuid.nullable(),
  lastError: z.string().nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});
export type OdooDocumentLinkRow = z.infer<typeof odooDocumentLinkRowSchema>;
