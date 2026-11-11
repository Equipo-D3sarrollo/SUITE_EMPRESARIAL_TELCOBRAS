import { z } from 'zod';
import { cursorPageQuerySchema } from './pagination.js';

/**
 * Factura recibida de DataDian (módulo `documents`, docs/etapas/ETAPA_2_DATADIAN.md §1.1).
 * Trece campos vienen del listado que exporta la DIAN y no se modifican en la suite (DD-12); los
 * cinco últimos (centro de costos, tipo, estado del acuse, factura y observaciones) los agrega
 * Telcobras en su hoja de trabajo y solo llegan cuando se importa esa hoja a mano.
 * El identificador de negocio es el CUFE.
 */

/** CUFE o CUDE: SHA-384 en hexadecimal, 96 caracteres. Se guarda en minúsculas. */
export const cufeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[0-9a-f]{96}$/, 'El CUFE debe tener 96 caracteres hexadecimales');

/**
 * Estado interno de la factura en la suite. No es un evento ante la DIAN.
 * imported: recién cargada, pendiente de revisión. draft: revisada y guardada para aprobar después.
 * approved: aprobada y enviada (o en envío) a Odoo. rejected: rechazada con motivo.
 */
export const RECEIVED_DOCUMENT_STATUSES = ['imported', 'draft', 'approved', 'rejected'] as const;
export type ReceivedDocumentStatus = (typeof RECEIVED_DOCUMENT_STATUSES)[number];

/**
 * Motivos de reclamo de la factura electrónica (evento RADIAN 031), con los códigos del anexo técnico.
 * Catálogo tomado de APIDIAN (tabla type_rejections, corregida en septiembre de 2026 porque la DIAN
 * respondía AAH10). Se usa al rechazar una factura y servirá para enviar el reclamo en la fase C.
 */
export const REJECTION_CODES = ['01', '02', '03', '04'] as const;
export type RejectionCode = (typeof REJECTION_CODES)[number];

/** Estado del envío a Odoo de una factura aprobada. */
export const ODOO_SYNC_STATUSES = ['pending', 'sent', 'failed'] as const;
export type OdooSyncStatus = (typeof ODOO_SYNC_STATUSES)[number];

/** Importes como texto decimal ("77901.00"): no pasan por coma flotante. */
const amount = z.string().regex(/^-?\d+(\.\d{1,2})?$/);

/** Los campos del listado, con el nombre de la columna de origen. */
export const dianListingFieldsSchema = z.object({
  /** Tipo de documento */
  documentType: z.string().nullable(),
  /** CUFE/CUDE */
  cufe: cufeSchema,
  /** Folio */
  folio: z.string().nullable(),
  /** Prefijo */
  prefix: z.string().nullable(),
  /** Medio de Pago */
  paymentMethod: z.string().nullable(),
  /** Fecha Emisión, como aaaa-mm-dd */
  issueDate: z.iso.date().nullable(),
  /** Fecha Recepción: cuándo llegó a la DIAN, en hora de Colombia */
  receivedAt: z.iso.datetime({ offset: true }).nullable(),
  /** NIT Emisor */
  issuerNit: z.string().nullable(),
  /** Nombre Emisor */
  issuerName: z.string().nullable(),
  /** IVA */
  iva: amount.nullable(),
  /** INC */
  inc: amount.nullable(),
  /** Total */
  total: amount.nullable(),
  /** Estado */
  dianStatus: z.string().nullable(),
  /** Grupo */
  dianGroup: z.string().nullable(),
  // Columnas de la hoja de trabajo de Telcobras (no vienen en la exportación de la DIAN).
  /** Centro de costos */
  costCenter: z.string().nullable(),
  /** TIPO */
  paymentType: z.string().nullable(),
  /** Estado (Acuse…) */
  acknowledgmentStatus: z.string().nullable(),
  /** FACTURA */
  invoiceReference: z.string().nullable(),
  /** Observaciones */
  observations: z.string().nullable(),
});

export type DianListingFields = z.infer<typeof dianListingFieldsSchema>;

export const receivedDocumentSchema = dianListingFieldsSchema.extend({
  id: z.uuid(),
  importId: z.uuid(),
  status: z.enum(RECEIVED_DOCUMENT_STATUSES),
  decidedBy: z.uuid().nullable(),
  decidedAt: z.iso.datetime().nullable(),
  decisionReason: z.string().nullable(),
  /** Motivo de reclamo DIAN del rechazo (01 a 04). */
  rejectionCode: z.enum(REJECTION_CODES).nullable(),
  /** PDF de la DIAN ya abierto (sin clave). */
  pdf: z
    .object({ fileName: z.string(), uploadedAt: z.iso.datetime(), sizeBytes: z.number().int() })
    .nullable(),
  odoo: z
    .object({
      status: z.enum(ODOO_SYNC_STATUSES),
      moveId: z.number().int().nullable(),
      error: z.string().nullable(),
      sentAt: z.iso.datetime().nullable(),
    })
    .nullable(),
  createdAt: z.iso.datetime(),
});

export type ReceivedDocument = z.infer<typeof receivedDocumentSchema>;

export const receivedDocumentListQuerySchema = cursorPageQuerySchema.extend({
  status: z.enum(RECEIVED_DOCUMENT_STATUSES).optional(),
  /** Solo las facturas de una importación (por ejemplo, las de una extracción de la DIAN). */
  importId: z.uuid().optional(),
});

export type ReceivedDocumentListQuery = z.infer<typeof receivedDocumentListQuerySchema>;

/**
 * Decisión sobre una factura: dejarla en borrador, aprobarla (se envía a Odoo) o rechazarla.
 * El rechazo exige el motivo de reclamo DIAN; la nota es opcional.
 */
export const receivedDocumentDecisionSchema = z
  .object({
    decision: z.enum(['draft', 'approved', 'rejected']),
    rejectionCode: z.enum(REJECTION_CODES).optional(),
    reason: z.string().trim().min(1).max(1000).optional(),
  })
  .refine(({ decision, rejectionCode }) => decision !== 'rejected' || rejectionCode !== undefined, {
    path: ['rejectionCode'],
    message: 'El rechazo necesita el motivo de reclamo',
  })
  .refine(({ decision, rejectionCode }) => decision === 'rejected' || rejectionCode === undefined, {
    path: ['rejectionCode'],
    message: 'Solo el rechazo lleva motivo de reclamo',
  });

export type ReceivedDocumentDecision = z.infer<typeof receivedDocumentDecisionSchema>;

/** Resultado de importar un listado: nada se sobrescribe; lo que ya existía solo se cuenta. */
export const receivedDocumentImportSummarySchema = z.object({
  importId: z.uuid(),
  fileName: z.string(),
  totalRows: z.number().int(),
  created: z.number().int(),
  alreadyExisting: z.number().int(),
  rejected: z.array(z.object({ row: z.number().int(), reason: z.string() })),
});

export type ReceivedDocumentImportSummary = z.infer<typeof receivedDocumentImportSummarySchema>;

/** Un paso del historial de una factura (auditoría de negocio). */
export const receivedDocumentHistoryEntrySchema = z.object({
  id: z.uuid(),
  action: z.string(),
  actorUserId: z.uuid(),
  result: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.iso.datetime(),
});

export type ReceivedDocumentHistoryEntry = z.infer<typeof receivedDocumentHistoryEntrySchema>;

/** Resultado de cargar un PDF de la DIAN: a qué factura quedó asociado por su CUFE. */
export const receivedDocumentPdfUploadSchema = z.object({
  documentId: z.uuid(),
  cufe: cufeSchema,
  fileName: z.string(),
  sizeBytes: z.number().int(),
});

export type ReceivedDocumentPdfUpload = z.infer<typeof receivedDocumentPdfUploadSchema>;

/** Cifras del tablero de DataDian. */
export const receivedDocumentSummarySchema = z.object({
  byStatus: z.record(z.enum(RECEIVED_DOCUMENT_STATUSES), z.number().int()),
  withoutPdf: z.number().int(),
  odooFailed: z.number().int(),
  /** Suma del Total de las facturas pendientes y en borrador, como texto decimal. */
  pendingTotal: z.string(),
});

export type ReceivedDocumentSummary = z.infer<typeof receivedDocumentSummarySchema>;

/** Conexión de la organización con Odoo 19 (API JSON-2). La API key nunca vuelve al navegador. */
export const odooConnectionInputSchema = z.object({
  baseUrl: z
    .url({ protocol: /^https?$/ })
    .trim()
    .transform((value) => value.replace(/\/+$/, '')),
  database: z.string().trim().min(1).max(100),
  apiKey: z.string().trim().min(20).max(200),
});

export type OdooConnectionInput = z.infer<typeof odooConnectionInputSchema>;

export const odooConnectionSchema = z.object({
  baseUrl: z.string(),
  database: z.string(),
  updatedAt: z.iso.datetime(),
});

export type OdooConnection = z.infer<typeof odooConnectionSchema>;

export const documentsSettingsSchema = z.object({
  odoo: odooConnectionSchema.nullable(),
});

export type DocumentsSettings = z.infer<typeof documentsSettingsSchema>;
