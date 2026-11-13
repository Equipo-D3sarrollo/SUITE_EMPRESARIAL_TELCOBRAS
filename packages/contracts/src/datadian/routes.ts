import { z } from 'zod';
import type { Permission } from '../permissions.js';
import { cursorPageSchema } from '../schemas/pagination.js';
import {
  odooConnectionInputSchema,
  receivedDocumentDecisionSchema,
  receivedDocumentHistoryEntrySchema,
  receivedDocumentSchema,
} from '../schemas/received-document.js';
import {
  datadianHealthSchema,
  datadianSettingsSchema,
  dianCertificateSchema,
  dianCertificateUploadSchema,
  dianReadinessSchema,
  dianSettingsInputSchema,
  dianSettingsSchema,
  EVENT_XML_PARTS,
  INVOICE_XML_PARTS,
  imapMailboxInputSchema,
  imapMailboxSchema,
  invoiceContentSchema,
  radianEventDetailSchema,
  radianEventRequestSchema,
  radianEventSchema,
  radianInvoiceDetailSchema,
  radianInvoiceListQuerySchema,
  radianInvoicePageSchema,
  radianRulesSchema,
  radianSummarySchema,
  syncRunDetailSchema,
  syncRunListQuerySchema,
  syncRunRequestSchema,
  syncRunSchema,
  syncStatusSchema,
  telcoJobListQuerySchema,
  telcoJobSchema,
} from './api-schemas.js';
import type { DatadianErrorCode } from './errors.js';

/**
 * Catálogo de rutas de DataDian (§3.4): de él salen el OpenAPI, el cliente del frontend y los mocks.
 * Todas cuelgan de `DATADIAN_BASE_PATH`, con SessionGuard y OrganizationGuard. Las `L*` son las rutas
 * heredadas que se conservan sin cambios de forma (decisión interna y Odoo).
 */
export const DATADIAN_BASE_PATH = '/api/v1/documents';

type ContentType =
  | 'application/json'
  | 'application/xml'
  | 'application/pdf'
  | 'multipart/form-data'
  | 'text/event-stream';

export interface DatadianRouteDefinition {
  readonly method: 'GET' | 'POST' | 'PUT';
  /** Relativo a DATADIAN_BASE_PATH, con parámetros `{id}`. */
  readonly path: string;
  readonly permission: Permission;
  readonly summary: string;
  readonly params?: z.ZodObject;
  readonly query?: z.ZodType;
  readonly body?: z.ZodType;
  readonly bodyContentType?: ContentType;
  readonly response?: z.ZodType;
  readonly responseContentType: ContentType;
  readonly status: 200 | 202 | 204;
  /** Exige el encabezado Idempotency-Key. */
  readonly idempotent?: boolean;
  readonly errors?: readonly DatadianErrorCode[];
}

const idParams = z.object({ id: z.uuid() });
const eventParams = z.object({ id: z.uuid(), eventId: z.uuid() });
const json = 'application/json' as const;

export const DATADIAN_ROUTES = {
  E1: {
    method: 'GET',
    path: '/received',
    permission: 'documents:view',
    summary: 'Bandeja de facturas recibidas',
    query: radianInvoiceListQuerySchema,
    response: radianInvoicePageSchema,
    responseContentType: json,
    status: 200,
  },
  E2: {
    method: 'GET',
    path: '/received/summary',
    permission: 'documents:view',
    summary: 'Cifras de la bandeja',
    response: radianSummarySchema,
    responseContentType: json,
    status: 200,
  },
  E3: {
    method: 'GET',
    path: '/received/{id}',
    permission: 'documents:view',
    summary: 'Detalle de una factura',
    params: idParams,
    response: radianInvoiceDetailSchema,
    responseContentType: json,
    status: 200,
  },
  E4: {
    method: 'GET',
    path: '/received/{id}/content',
    permission: 'documents:view',
    summary: 'Contenido normalizado para el visor',
    params: idParams,
    response: invoiceContentSchema,
    responseContentType: json,
    status: 200,
    errors: ['API_XML_MISSING'],
  },
  E5: {
    method: 'GET',
    path: '/received/{id}/xml',
    permission: 'documents:view',
    summary: 'XML original (AttachedDocument, factura o validación)',
    params: idParams,
    query: z.object({ part: z.enum(INVOICE_XML_PARTS).default('invoice') }),
    response: z.string(),
    responseContentType: 'application/xml',
    status: 200,
  },
  E6: {
    method: 'GET',
    path: '/received/{id}/pdf',
    permission: 'documents:view',
    summary: 'PDF guardado de la factura',
    params: idParams,
    responseContentType: 'application/pdf',
    status: 200,
  },
  E7: {
    method: 'GET',
    path: '/received/{id}/events',
    permission: 'documents:view',
    summary: 'Línea de tiempo RADIAN (tope 100)',
    params: idParams,
    response: z.array(radianEventSchema).max(100),
    responseContentType: json,
    status: 200,
  },
  E8: {
    method: 'GET',
    path: '/received/{id}/events/{eventId}',
    permission: 'documents:view',
    summary: 'Detalle de un evento con sus intentos',
    params: eventParams,
    response: radianEventDetailSchema,
    responseContentType: json,
    status: 200,
  },
  E9: {
    method: 'GET',
    path: '/received/{id}/events/{eventId}/xml',
    permission: 'documents:view',
    summary: 'XML enviado o respuesta de la DIAN',
    params: eventParams,
    query: z.object({ part: z.enum(EVENT_XML_PARTS) }),
    response: z.string(),
    responseContentType: 'application/xml',
    status: 200,
  },
  E10: {
    method: 'POST',
    path: '/received/{id}/events',
    permission: 'documents:events',
    summary: 'Pedir un evento RADIAN (030, 032, 033 o 031)',
    params: idParams,
    body: radianEventRequestSchema,
    bodyContentType: json,
    response: radianEventSchema,
    responseContentType: json,
    status: 202,
    idempotent: true,
    errors: [
      'DD001',
      'DD002',
      'DD003',
      'DD007',
      'DD008',
      'DD009',
      'DD010',
      'API_EVENT_IN_PROGRESS',
      'API_SOFTWARE_MISSING',
    ],
  },
  E11: {
    method: 'GET',
    path: '/radian/rules',
    permission: 'documents:view',
    summary: 'Reglas de precedencia y de plazo',
    response: radianRulesSchema,
    responseContentType: json,
    status: 200,
  },
  E12: {
    method: 'GET',
    path: '/settings',
    permission: 'documents:view',
    summary: 'Configuración de DataDian (Odoo y DIAN)',
    response: datadianSettingsSchema,
    responseContentType: json,
    status: 200,
  },
  E13: {
    method: 'PUT',
    path: '/settings/dian',
    permission: 'documents:configure',
    summary: 'Guardar los datos DIAN de la organización',
    body: dianSettingsInputSchema,
    bodyContentType: json,
    response: dianSettingsSchema,
    responseContentType: json,
    status: 200,
    errors: ['API_NIT_TAKEN', 'API_PRODUCTION_NOT_READY'],
  },
  E14: {
    method: 'GET',
    path: '/settings/dian/readiness',
    permission: 'documents:view',
    summary: 'Lista de chequeo para pasar a producción',
    response: dianReadinessSchema,
    responseContentType: json,
    status: 200,
  },
  E15: {
    method: 'GET',
    path: '/settings/dian/certificates',
    permission: 'documents:configure',
    summary: 'Historial de certificados',
    response: z.array(dianCertificateSchema),
    responseContentType: json,
    status: 200,
  },
  E16: {
    method: 'POST',
    path: '/settings/dian/certificates',
    permission: 'documents:configure',
    summary: 'Subir un certificado .pfx o .p12 (máximo 65 536 bytes)',
    body: dianCertificateUploadSchema,
    bodyContentType: 'multipart/form-data',
    response: dianCertificateSchema,
    responseContentType: json,
    status: 202,
    idempotent: true,
    errors: ['API_BAD_FILE', 'API_DUPLICATE_CERTIFICATE'],
  },
  E17: {
    method: 'GET',
    path: '/settings/dian/certificates/{id}',
    permission: 'documents:configure',
    summary: 'Un certificado',
    params: idParams,
    response: dianCertificateSchema,
    responseContentType: json,
    status: 200,
  },
  E18: {
    method: 'POST',
    path: '/settings/dian/certificates/{id}/activate',
    permission: 'documents:configure',
    summary: 'Activar un certificado válido',
    params: idParams,
    response: dianSettingsSchema,
    responseContentType: json,
    status: 200,
    errors: ['DD010'],
  },
  E19: {
    method: 'POST',
    path: '/settings/dian/certificates/{id}/retire',
    permission: 'documents:configure',
    summary: 'Retirar un certificado que no está activo',
    params: idParams,
    response: dianCertificateSchema,
    responseContentType: json,
    status: 200,
    errors: ['API_CERTIFICATE_ACTIVE'],
  },
  E20: {
    method: 'GET',
    path: '/settings/dian/mailboxes',
    permission: 'documents:configure',
    summary: 'Buzones IMAP',
    response: z.array(imapMailboxSchema),
    responseContentType: json,
    status: 200,
  },
  E21: {
    method: 'POST',
    path: '/settings/dian/mailboxes',
    permission: 'documents:configure',
    summary: 'Agregar un buzón IMAP',
    body: imapMailboxInputSchema,
    bodyContentType: json,
    response: imapMailboxSchema,
    responseContentType: json,
    status: 200,
    errors: ['API_DUPLICATE_MAILBOX'],
  },
  E22: {
    method: 'PUT',
    path: '/settings/dian/mailboxes/{id}',
    permission: 'documents:configure',
    summary: 'Editar un buzón IMAP (secreto opcional)',
    params: idParams,
    body: imapMailboxInputSchema,
    bodyContentType: json,
    response: imapMailboxSchema,
    responseContentType: json,
    status: 200,
  },
  E23: {
    method: 'GET',
    path: '/sync/status',
    permission: 'documents:view',
    summary: 'Estado de las sincronizaciones por canal',
    response: syncStatusSchema,
    responseContentType: json,
    status: 200,
  },
  E24: {
    method: 'GET',
    path: '/sync-runs',
    permission: 'documents:view',
    summary: 'Historial de sincronizaciones',
    query: syncRunListQuerySchema,
    response: cursorPageSchema(syncRunSchema),
    responseContentType: json,
    status: 200,
  },
  E25: {
    method: 'GET',
    path: '/sync-runs/{id}',
    permission: 'documents:view',
    summary: 'Detalle de una sincronización con errores por CUFE',
    params: idParams,
    response: syncRunDetailSchema,
    responseContentType: json,
    status: 200,
  },
  E26: {
    method: 'POST',
    path: '/sync-runs',
    permission: 'documents:sync',
    summary: 'Sincronizar ahora (RPA o IMAP)',
    body: syncRunRequestSchema,
    bodyContentType: json,
    response: syncRunSchema,
    responseContentType: json,
    status: 202,
    idempotent: true,
    errors: ['API_SYNC_RUNNING', 'API_CHANNEL_DISABLED', 'API_CERTIFICATE_MISSING'],
  },
  E27: {
    method: 'POST',
    path: '/received/xml-upload',
    permission: 'documents:sync',
    summary: 'Subir XML o ZIP a mano (máximo 5 MB)',
    body: z.object({ file: z.string().meta({ format: 'binary' }) }),
    bodyContentType: 'multipart/form-data',
    response: syncRunSchema,
    responseContentType: json,
    status: 202,
    idempotent: true,
    errors: ['API_BAD_FILE'],
  },
  E28: {
    method: 'GET',
    path: '/jobs',
    permission: 'documents:sync',
    summary: 'Cola de trabajos de Telco',
    query: telcoJobListQuerySchema,
    response: cursorPageSchema(telcoJobSchema),
    responseContentType: json,
    status: 200,
  },
  E29: {
    method: 'POST',
    path: '/jobs/{id}/retry',
    permission: 'documents:sync',
    summary: 'Reintentar un trabajo muerto',
    params: idParams,
    response: telcoJobSchema,
    responseContentType: json,
    status: 200,
    errors: ['API_JOB_NOT_DEAD'],
  },
  E30: {
    method: 'POST',
    path: '/jobs/{id}/cancel',
    permission: 'documents:sync',
    summary: 'Cancelar un trabajo en cola',
    params: idParams,
    response: telcoJobSchema,
    responseContentType: json,
    status: 200,
    errors: ['API_JOB_NOT_QUEUED'],
  },
  E31: {
    method: 'GET',
    path: '/status',
    permission: 'documents:view',
    summary: 'Estado de DataDian para la Zona 4',
    response: datadianHealthSchema,
    responseContentType: json,
    status: 200,
  },
  E32: {
    method: 'GET',
    path: '/stream',
    permission: 'documents:view',
    summary: 'Eventos en vivo (SSE, Etapa 4.6)',
    responseContentType: 'text/event-stream',
    status: 200,
  },
  // Heredadas: se conservan sin cambios de forma hasta la Etapa 5.
  L1: {
    method: 'POST',
    path: '/received/{id}/decision',
    permission: 'documents:decide',
    summary: 'Decisión interna heredada (borrador, aprobar, rechazar)',
    params: idParams,
    body: receivedDocumentDecisionSchema,
    bodyContentType: json,
    response: receivedDocumentSchema,
    responseContentType: json,
    status: 200,
  },
  L2: {
    method: 'POST',
    path: '/received/{id}/odoo-sync',
    permission: 'documents:decide',
    summary: 'Reintentar el envío a Odoo',
    params: idParams,
    response: receivedDocumentSchema,
    responseContentType: json,
    status: 200,
  },
  L3: {
    method: 'GET',
    path: '/received/{id}/history',
    permission: 'documents:view',
    summary: 'Historial de auditoría de la factura',
    params: idParams,
    response: z.array(receivedDocumentHistoryEntrySchema),
    responseContentType: json,
    status: 200,
  },
  L4: {
    method: 'PUT',
    path: '/settings/odoo',
    permission: 'documents:configure',
    summary: 'Guardar la conexión con Odoo',
    body: odooConnectionInputSchema,
    bodyContentType: json,
    response: datadianSettingsSchema,
    responseContentType: json,
    status: 200,
  },
  L5: {
    method: 'POST',
    path: '/settings/odoo/test',
    permission: 'documents:configure',
    summary: 'Probar la conexión con Odoo',
    response: z.object({ ok: z.literal(true) }),
    responseContentType: json,
    status: 200,
  },
} as const satisfies Record<string, DatadianRouteDefinition>;

export type DatadianRoutes = typeof DATADIAN_ROUTES;
export type DatadianRouteId = keyof DatadianRoutes;
export type DatadianRoute<K extends DatadianRouteId> = DatadianRoutes[K];

type SchemaOf<R, F extends string> = R extends Record<F, infer S extends z.ZodType> ? S : never;

/** Respuesta ya validada de una ruta. */
export type DatadianResponse<K extends DatadianRouteId> = z.output<
  SchemaOf<DatadianRoutes[K], 'response'>
>;
/** Cuerpo que se envía a una ruta. */
export type DatadianBody<K extends DatadianRouteId> = z.input<SchemaOf<DatadianRoutes[K], 'body'>>;
/** Parámetros de consulta de una ruta. */
export type DatadianQuery<K extends DatadianRouteId> = z.input<
  SchemaOf<DatadianRoutes[K], 'query'>
>;
/** Parámetros de ruta (`{id}`, `{eventId}`). */
export type DatadianParams<K extends DatadianRouteId> = z.input<
  SchemaOf<DatadianRoutes[K], 'params'>
>;

/** Camino completo de una ruta con sus parámetros sustituidos. */
export function datadianPath(routeId: DatadianRouteId, params: Record<string, string> = {}) {
  const template = DATADIAN_ROUTES[routeId].path;
  return `${DATADIAN_BASE_PATH}${template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`Falta el parámetro ${name} de ${routeId}`);
    return encodeURIComponent(value);
  })}`;
}
