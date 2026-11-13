import { z } from 'zod';
import {
  CERTIFICATE_EXPIRY_STATES,
  CLAIM_CODES,
  DEADLINE_STATES,
  DIAN_CERTIFICATE_STATUSES,
  DIAN_ENVIRONMENTS,
  DIAN_OPERATION_MODES,
  DIAN_SYNC_CHANNELS,
  DIAN_SYNC_STATUSES,
  DIAN_SYNC_TRIGGERS,
  IMAP_AUTH_METHODS,
  INVOICE_VALIDATION_STATUSES,
  PAYMENT_FORMS,
  RADIAN_ATTEMPT_OUTCOMES,
  RADIAN_EVENT_ACTORS,
  RADIAN_EVENT_CODES,
  RADIAN_EVENT_ORIGINS,
  RADIAN_EVENT_STATUSES,
  RADIAN_STATUSES,
  radianErrorTraceEntrySchema,
  TELCO_JOB_KINDS,
  TELCO_JOB_STATUSES,
} from '../schemas/datadian-records.js';
import { cursorPageQuerySchema, cursorPageSchema } from '../schemas/pagination.js';
import {
  odooConnectionSchema,
  receivedDocumentSchema,
  receivedDocumentSummarySchema,
} from '../schemas/received-document.js';

/**
 * Contratos de la API de DataDian (Etapa 3, docs/modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md
 * §3). Los enumerados vienen de `schemas/datadian-records.ts` (copia de los CHECK de la Etapa 2); aquí
 * solo están las formas que viajan por HTTP. Ninguna respuesta trae contraseña, PIN, llave del `.pfx`
 * ni secreto IMAP.
 */

// ---- Enumerados propios de la API ----

/** Eventos que la suite puede pedir: el 034 lo registra el emisor. */
export const REQUESTABLE_EVENT_CODES = ['030', '031', '032', '033'] as const;
export type RequestableEventCode = (typeof REQUESTABLE_EVENT_CODES)[number];

/** Validaciones de Telco sobre el `.pfx` (Circular 03-2016 de la ONAC). */
export const CERTIFICATE_CHECKS = [
  'format',
  'validity',
  'key_usage_critical',
  'key_usage_purposes',
  'signature_algorithm',
  'chain',
  'nit_match',
] as const;
export type CertificateCheck = (typeof CERTIFICATE_CHECKS)[number];

export const CERTIFICATE_CHECK_STATUSES = ['pending', 'ok', 'failed'] as const;
export type CertificateCheckStatus = (typeof CERTIFICATE_CHECK_STATUSES)[number];

/** Puntos de la lista de chequeo para pasar a producción (§5.6). */
export const DIAN_READINESS_ITEMS = [
  'certificate_active',
  'xml_query_ok',
  'status_query_ok',
  'test_event_registered',
  'portal_access',
] as const;
export type DianReadinessItem = (typeof DIAN_READINESS_ITEMS)[number];

export const RADIAN_INVOICE_SORTS = ['issue_date_desc', 'deadline_asc'] as const;
export const INVOICE_XML_PARTS = ['attached', 'invoice', 'validation'] as const;
export const EVENT_XML_PARTS = ['request', 'response'] as const;

// ---- Piezas comunes ----

const uuid = z.uuid();
const timestamp = z.iso.datetime({ offset: true });
const amount = z.string().regex(/^-?\d+(\.\d{1,2})?$/);
const traceSchema = z.array(radianErrorTraceEntrySchema);
const userRefSchema = z.object({ id: uuid, name: z.string() });

/** "none,acknowledged" → ['none', 'acknowledged'], validado contra el enumerado. */
const csvEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
  z
    .string()
    .transform((value) => value.split(',').filter(Boolean))
    .pipe(z.array(z.enum(values)).min(1));

// ---- Facturas ----

export const radianDeadlineSchema = z.object({
  claimDeadlineAt: timestamp.nullable(),
  state: z.enum(DEADLINE_STATES),
  /** Lo calcula el servidor con el calendario de festivos de la base: la interfaz no cuenta días. */
  businessDaysRemaining: z.int().min(0).nullable(),
  ruleVersion: z.int().nullable(),
  /** `radian_deadline_rules.verified`. */
  ruleVerified: z.boolean(),
});
export type RadianDeadline = z.infer<typeof radianDeadlineSchema>;

export const pendingEventRefSchema = z.object({
  id: uuid,
  eventCode: z.enum(REQUESTABLE_EVENT_CODES),
  since: timestamp,
});

/** Factura de la bandeja. Extiende la factura heredada; `importId` pasa a nulable (migración 0013). */
export const radianInvoiceSchema = receivedDocumentSchema.extend({
  importId: uuid.nullable(),
  syncRunId: uuid.nullable(),
  ingestionSource: z.enum(DIAN_SYNC_CHANNELS),
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
  validationStatus: z.enum(INVOICE_VALIDATION_STATUSES),
  validationErrors: traceSchema,
  radianStatus: z.enum(RADIAN_STATUSES),
  radianStatusAt: timestamp.nullable(),
  deadline: radianDeadlineSchema,
  /** payment_form = '2' [POR VERIFICAR 8]. */
  eventsExpected: z.boolean().nullable(),
  /** 033 o 034 aceptados: la factura ya no admite notas. */
  notesBlocked: z.boolean(),
  /** Eventos aceptados del ambiente configurado, de ambos orígenes. */
  acceptedEventCodes: z.array(z.enum(RADIAN_EVENT_CODES)),
  pendingEvent: pendingEventRefSchema.nullable(),
  hasAttachedDocument: z.boolean(),
});
export type RadianInvoice = z.infer<typeof radianInvoiceSchema>;

export const invoiceTaxSchema = z.object({
  taxSchemeId: z.string(),
  percent: z.string().nullable(),
  taxableAmount: amount,
  taxAmount: amount,
  isWithholding: z.boolean(),
});
export type InvoiceTax = z.infer<typeof invoiceTaxSchema>;

export const radianInvoiceDetailSchema = radianInvoiceSchema.extend({
  taxes: z.array(invoiceTaxSchema),
  /** Datos del listado que el XML corrigió (`pre_xml_snapshot`). */
  listingSnapshot: z.record(z.string(), z.unknown()).nullable(),
});
export type RadianInvoiceDetail = z.infer<typeof radianInvoiceDetailSchema>;

export const radianInvoiceListQuerySchema = cursorPageQuerySchema
  .extend({
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    /** NIT del proveedor (solo dígitos) o CUFE completo (96 hexadecimales). */
    q: z.string().trim().min(5).max(96).optional(),
    radianStatus: csvEnum(RADIAN_STATUSES).optional(),
    deadlineState: z.enum(DEADLINE_STATES).optional(),
    validationStatus: z.enum(INVOICE_VALIDATION_STATUSES).optional(),
    ingestionSource: z.enum(DIAN_SYNC_CHANNELS).optional(),
    paymentForm: z.enum(PAYMENT_FORMS).optional(),
    sort: z.enum(RADIAN_INVOICE_SORTS).default('issue_date_desc'),
  })
  .refine(({ from, to }) => !from || !to || from <= to, { path: ['to'] });
export type RadianInvoiceListQuery = z.input<typeof radianInvoiceListQuerySchema>;

export const radianInvoicePageSchema = cursorPageSchema(radianInvoiceSchema);

const partySchema = z.object({
  nit: z.string().nullable(),
  nitDv: z.string().nullable(),
  name: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  email: z.string().nullable(),
});

/** Contenido normalizado del `AttachedDocument` para el visor. Sin HTML del proveedor. */
export const invoiceContentSchema = z.object({
  number: z.string().nullable(),
  issueDate: z.iso.date().nullable(),
  issueTime: z.string().nullable(),
  dueDate: z.iso.date().nullable(),
  currency: z.string().length(3),
  supplier: partySchema,
  buyer: partySchema,
  paymentForm: z.enum(PAYMENT_FORMS).nullable(),
  paymentMeansCode: z.string().nullable(),
  lines: z.array(
    z.object({
      lineNo: z.int(),
      description: z.string(),
      quantity: z.string(),
      unitCode: z.string().nullable(),
      unitPrice: amount,
      lineTotal: amount,
      taxPercent: z.string().nullable(),
    }),
  ),
  taxes: z.array(invoiceTaxSchema),
  totals: z.object({
    lineExtension: amount,
    taxExclusive: amount,
    taxInclusive: amount,
    allowances: amount,
    charges: amount,
    payable: amount,
  }),
  /** Validación previa de la DIAN que viene en el AttachedDocument. */
  dianValidation: z
    .object({
      validatedAt: timestamp.nullable(),
      statusCode: z.string().nullable(),
      statusDescription: z.string().nullable(),
    })
    .nullable(),
  notes: z.array(z.string()),
  /** SHA-256 del XML original guardado, para comparar con el descargado. */
  xmlSha256: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .nullable(),
});
export type InvoiceContent = z.infer<typeof invoiceContentSchema>;

export const radianSummarySchema = z.object({
  byRadianStatus: z.record(z.enum(RADIAN_STATUSES), z.int()),
  byDeadlineState: z.record(z.enum(DEADLINE_STATES), z.int()),
  byValidationStatus: z.record(z.enum(INVOICE_VALIDATION_STATUSES), z.int()),
  /** `expired` sin evento terminal. */
  expiredWithoutDecision: z.int(),
  /** XML inválido o trabajos muertos. */
  withProblems: z.int(),
  /** Cifras heredadas del tablero (decisión interna). */
  legacy: receivedDocumentSummarySchema,
});
export type RadianSummary = z.infer<typeof radianSummarySchema>;

// ---- Eventos RADIAN ----

export const radianEventSchema = z.object({
  id: uuid,
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
  /** Código crudo de la DIAN [POR VERIFICAR 18]. */
  dianStatusCode: z.string().nullable(),
  errorMessage: z.string().nullable(),
  errorTrace: traceSchema,
  attempts: z.int().min(0),
  requestedBy: userRefSchema.nullable(),
  hasRequestXml: z.boolean(),
  hasResponseXml: z.boolean(),
  createdAt: timestamp,
});
export type RadianEvent = z.infer<typeof radianEventSchema>;

export const radianEventAttemptSchema = z.object({
  attemptNo: z.int(),
  startedAt: timestamp,
  finishedAt: timestamp.nullable(),
  outcome: z.enum(RADIAN_ATTEMPT_OUTCOMES),
  httpStatus: z.int().nullable(),
  dianStatusCode: z.string().nullable(),
  durationMs: z.int().nullable(),
  errorTrace: traceSchema,
});

export const radianEventDetailSchema = radianEventSchema.extend({
  attemptsLog: z.array(radianEventAttemptSchema),
});
export type RadianEventDetail = z.infer<typeof radianEventDetailSchema>;

/** Persona que recibe, por si el anexo la exige en el 030 y el 032 [POR VERIFICAR 12]. */
export const issuerPersonSchema = z.object({
  idType: z.string().min(1).max(3),
  idNumber: z.string().regex(/^[0-9]{3,15}$/),
  firstName: z.string().trim().min(1).max(100),
  familyName: z.string().trim().min(1).max(100),
  jobTitle: z.string().trim().max(100).optional(),
  department: z.string().trim().max(100).optional(),
});

/** Pedido de un evento. Encabezado Idempotency-Key obligatorio. */
export const radianEventRequestSchema = z.discriminatedUnion('eventCode', [
  z.strictObject({ eventCode: z.literal('030'), issuerPerson: issuerPersonSchema.optional() }),
  z.strictObject({ eventCode: z.literal('032'), issuerPerson: issuerPersonSchema.optional() }),
  z.strictObject({ eventCode: z.literal('033') }),
  z.strictObject({
    eventCode: z.literal('031'),
    claimCode: z.enum(CLAIM_CODES),
    claimNote: z.string().trim().max(1000).optional(),
  }),
]);
export type RadianEventRequest = z.infer<typeof radianEventRequestSchema>;

export const radianEventRuleSchema = z.object({
  eventCode: z.enum(RADIAN_EVENT_CODES),
  name: z.string(),
  actor: z.enum(RADIAN_EVENT_ACTORS),
  requires: z.array(z.enum(RADIAN_EVENT_CODES)),
  blockedBy: z.array(z.enum(RADIAN_EVENT_CODES)),
  terminal: z.boolean(),
  claimCodeRequired: z.boolean(),
  enforceClaimDeadline: z.boolean(),
  verified: z.boolean(),
  source: z.string(),
});
export type RadianEventRule = z.infer<typeof radianEventRuleSchema>;

export const radianRulesSchema = z.object({
  events: z.array(radianEventRuleSchema),
  deadline: z.object({
    version: z.int(),
    businessDays: z.int().positive(),
    verified: z.boolean(),
    source: z.string(),
  }),
});
export type RadianRules = z.infer<typeof radianRulesSchema>;

// ---- Configuración DIAN ----

/** Configuración DIAN. El PIN se escribe y nunca se lee: solo `softwarePinSet`. */
export const dianSettingsSchema = z.object({
  nit: z.string(),
  nitDv: z.string().nullable(),
  environment: z.enum(DIAN_ENVIRONMENTS),
  operationMode: z.enum(DIAN_OPERATION_MODES),
  softwareId: uuid.nullable(),
  softwarePinSet: z.boolean(),
  testSetId: z.string().nullable(),
  activeCertificateId: uuid.nullable(),
  rpaEnabled: z.boolean(),
  imapEnabled: z.boolean(),
  syncLookbackDays: z.int().min(1).max(92),
  updatedAt: timestamp,
});
export type DianSettings = z.infer<typeof dianSettingsSchema>;

export const dianSettingsInputSchema = z.object({
  nit: z.string().regex(/^[0-9]{5,15}$/),
  nitDv: z
    .string()
    .regex(/^[0-9]$/)
    .nullable(),
  environment: z.enum(DIAN_ENVIRONMENTS),
  operationMode: z.enum(DIAN_OPERATION_MODES),
  softwareId: uuid.nullable(),
  /** Ausente = conservar el guardado. */
  softwarePin: z.string().trim().min(1).max(20).optional(),
  testSetId: z.string().trim().max(100).nullable(),
  rpaEnabled: z.boolean(),
  imapEnabled: z.boolean(),
  syncLookbackDays: z.int().min(1).max(92),
});
export type DianSettingsInput = z.infer<typeof dianSettingsInputSchema>;

/** Respuesta de GET /settings: Odoo (heredado) y DIAN (null hasta configurarla). */
export const datadianSettingsSchema = z.object({
  odoo: odooConnectionSchema.nullable(),
  dian: dianSettingsSchema.nullable(),
});
export type DatadianSettings = z.infer<typeof datadianSettingsSchema>;

export const dianReadinessSchema = z.object({
  ready: z.boolean(),
  items: z.array(
    z.object({
      item: z.enum(DIAN_READINESS_ITEMS),
      ok: z.boolean(),
      detail: z.string().optional(),
    }),
  ),
});
export type DianReadiness = z.infer<typeof dianReadinessSchema>;

/** Límite del `.pfx` de la Etapa 2 (`pfx_size_bytes <= 65536`). */
export const CERTIFICATE_MAX_BYTES = 65_536;

/** Certificado. Nunca incluye la contraseña, la llave de datos ni el archivo. */
export const dianCertificateSchema = z.object({
  id: uuid,
  status: z.enum(DIAN_CERTIFICATE_STATUSES),
  isActive: z.boolean(),
  pfxSha256: z.string().regex(/^[0-9a-f]{64}$/),
  pfxSizeBytes: z.int(),
  serialNumber: z.string().nullable(),
  subjectNit: z.string().nullable(),
  subjectDn: z.string().nullable(),
  issuerDn: z.string().nullable(),
  notBefore: timestamp.nullable(),
  notAfter: timestamp.nullable(),
  signatureAlgorithm: z.string().nullable(),
  checks: z.array(
    z.object({
      check: z.enum(CERTIFICATE_CHECKS),
      status: z.enum(CERTIFICATE_CHECK_STATUSES),
      detail: z.string().optional(),
    }),
  ),
  daysToExpiry: z.int().nullable(),
  expiryState: z.enum(CERTIFICATE_EXPIRY_STATES).nullable(),
  uploadedBy: userRefSchema,
  createdAt: timestamp,
  validatedAt: timestamp.nullable(),
  retiredAt: timestamp.nullable(),
});
export type DianCertificate = z.infer<typeof dianCertificateSchema>;

/** Campos de texto del multipart de E16; el archivo va en `file`. */
export const dianCertificateUploadSchema = z.object({
  file: z.string().meta({ format: 'binary' }),
  password: z.string().min(1).max(200),
});

export const imapMailboxSchema = z.object({
  id: uuid,
  host: z.string(),
  port: z.int().min(1).max(65535),
  useTls: z.boolean(),
  username: z.string(),
  authMethod: z.enum(IMAP_AUTH_METHODS),
  folder: z.string(),
  enabled: z.boolean(),
  /** El secreto se escribe y nunca se lee. */
  secretSet: z.boolean(),
  lastSyncAt: timestamp.nullable(),
  updatedAt: timestamp,
});
export type ImapMailbox = z.infer<typeof imapMailboxSchema>;

export const imapMailboxInputSchema = z.object({
  host: z.string().trim().min(3).max(255),
  port: z.int().min(1).max(65535).default(993),
  useTls: z.boolean().default(true),
  username: z.string().trim().min(1).max(255),
  authMethod: z.enum(IMAP_AUTH_METHODS),
  /** Ausente al editar = conservar el guardado. */
  secret: z.string().min(1).max(4096).optional(),
  folder: z.string().trim().min(1).max(255).default('INBOX'),
  enabled: z.boolean().default(true),
});
export type ImapMailboxInput = z.input<typeof imapMailboxInputSchema>;

// ---- Sincronizaciones y cola ----

export const syncRunSchema = z.object({
  id: uuid,
  channel: z.enum(DIAN_SYNC_CHANNELS),
  trigger: z.enum(DIAN_SYNC_TRIGGERS),
  status: z.enum(DIAN_SYNC_STATUSES),
  requestedBy: userRefSchema.nullable(),
  mailboxId: uuid.nullable(),
  periodStart: z.iso.date().nullable(),
  periodEnd: z.iso.date().nullable(),
  startedAt: timestamp.nullable(),
  finishedAt: timestamp.nullable(),
  listedCount: z.int().min(0),
  newCount: z.int().min(0),
  existingCount: z.int().min(0),
  xmlDownloadedCount: z.int().min(0),
  failedCount: z.int().min(0),
  /** El listado vino vacío de forma sospechosa (lección del Extractor V2). */
  emptyListingWarning: z.boolean(),
  /** El portal pidió una verificación humana; la suite no la evade [POR VERIFICAR 7]. */
  humanVerificationRequired: z.boolean(),
  errorMessage: z.string().nullable(),
  createdAt: timestamp,
});
export type SyncRun = z.infer<typeof syncRunSchema>;

export const syncRunDetailSchema = syncRunSchema.extend({
  errors: z.array(z.object({ cufe: z.string().nullable(), code: z.string(), message: z.string() })),
});
export type SyncRunDetail = z.infer<typeof syncRunDetailSchema>;

export const syncRunRequestSchema = z
  .object({
    channel: z.enum(['rpa', 'imap']),
    periodStart: z.iso.date().optional(),
    periodEnd: z.iso.date().optional(),
    mailboxId: uuid.optional(),
  })
  .refine(({ periodStart, periodEnd }) => !periodStart || !periodEnd || periodStart <= periodEnd, {
    path: ['periodEnd'],
  });
export type SyncRunRequest = z.infer<typeof syncRunRequestSchema>;

export const syncRunListQuerySchema = cursorPageQuerySchema.extend({
  channel: z.enum(DIAN_SYNC_CHANNELS).optional(),
  status: z.enum(DIAN_SYNC_STATUSES).optional(),
});

export const syncStatusSchema = z.object({
  channels: z.array(
    z.object({
      channel: z.enum(DIAN_SYNC_CHANNELS),
      enabled: z.boolean(),
      lastRun: syncRunSchema.nullable(),
      nextRunAt: timestamp.nullable(),
      running: z.boolean(),
    }),
  ),
  deadJobs: z.int().min(0),
  queuedJobs: z.int().min(0),
});
export type SyncStatus = z.infer<typeof syncStatusSchema>;

/** Trabajo de Telco sin `payload`. */
export const telcoJobSchema = z.object({
  id: uuid,
  kind: z.enum(TELCO_JOB_KINDS),
  status: z.enum(TELCO_JOB_STATUSES),
  attempts: z.int().min(0),
  maxAttempts: z.int().positive(),
  runAt: timestamp,
  /** Error saneado: sin secretos ni rutas internas. */
  lastError: z.string().nullable(),
  lastErrorAt: timestamp.nullable(),
  resource: z
    .object({
      type: z.enum(['received_document', 'radian_event', 'dian_sync_run', 'dian_certificate']),
      id: uuid,
      label: z.string(),
    })
    .nullable(),
  createdAt: timestamp,
});
export type TelcoJob = z.infer<typeof telcoJobSchema>;

export const telcoJobListQuerySchema = cursorPageQuerySchema.extend({
  status: z.enum(TELCO_JOB_STATUSES).optional(),
  kind: z.enum(TELCO_JOB_KINDS).optional(),
});

/** Estado de DataDian para la Zona 4. */
export const datadianHealthSchema = z.object({
  status: z.enum(['ok', 'warning', 'error']),
  certificate: z.object({
    expiryState: z.enum(CERTIFICATE_EXPIRY_STATES).nullable(),
    daysToExpiry: z.int().nullable(),
  }),
  deadJobs: z.int().min(0),
  lastSyncStatus: z.enum(DIAN_SYNC_STATUSES).nullable(),
  /** Mediana de las últimas llamadas SOAP. */
  latencyMs: z.int().min(0).nullable(),
  checkedAt: timestamp,
});
export type DatadianHealth = z.infer<typeof datadianHealthSchema>;

/** Mensajes del SSE de la 4.6: solo identificadores. */
export const datadianStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('invoice.changed'), id: uuid }),
  z.object({
    type: z.literal('event.changed'),
    id: uuid,
    receivedDocumentId: uuid,
    status: z.enum(RADIAN_EVENT_STATUSES),
  }),
  z.object({ type: z.literal('sync.changed'), id: uuid, status: z.enum(DIAN_SYNC_STATUSES) }),
  z.object({
    type: z.literal('certificate.changed'),
    id: uuid,
    status: z.enum(DIAN_CERTIFICATE_STATUSES),
  }),
  z.object({ type: z.literal('job.dead'), id: uuid, kind: z.enum(TELCO_JOB_KINDS) }),
]);
export type DatadianStreamEvent = z.infer<typeof datadianStreamEventSchema>;
