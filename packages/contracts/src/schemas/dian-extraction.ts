import { z } from 'zod';

/**
 * Extracción automática de facturas recibidas desde el catálogo de factura electrónica de la DIAN
 * (DataDian, etapa 2). Replica lo que hace el extractor de FacturaLatam: entrar con el enlace del
 * token, pedir la exportación del listado por rango de fechas, esperar el ZIP con el Excel e importarlo.
 */

/** Hosts del catálogo: producción (facturas reales) y habilitación (pruebas). */
export const DIAN_CATALOG_HOSTS = [
  'catalogo-vpfe.dian.gov.co',
  'catalogo-vpfe-hab.dian.gov.co',
] as const;

/** Enlace "INGRESE AQUÍ" del correo "Token acceso DIAN": https://catalogo-vpfe.dian.gov.co/User/AuthToken?… */
export const dianTokenLinkSchema = z.object({
  tokenLink: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return (
        url.protocol === 'https:' &&
        (DIAN_CATALOG_HOSTS as readonly string[]).includes(url.hostname) &&
        url.pathname.toLowerCase() === '/user/authtoken' &&
        url.searchParams.has('token')
      );
    }, 'Pegue el enlace completo del correo "Token acceso DIAN"'),
});

export type DianTokenLink = z.infer<typeof dianTokenLinkSchema>;

/** Estado de la conexión de la organización con el catálogo de la DIAN. Las cookies nunca salen. */
export const dianSessionSchema = z.object({
  connected: z.boolean(),
  host: z.string().nullable(),
  /** NIT con el que se entró al portal (viene en el enlace del token). */
  nit: z.string().nullable(),
  expiresAt: z.iso.datetime().nullable(),
  connectedAt: z.iso.datetime().nullable(),
});

export type DianSession = z.infer<typeof dianSessionSchema>;

export const DIAN_EXTRACTION_STATUSES = ['queued', 'running', 'done', 'error'] as const;
export type DianExtractionStatus = (typeof DIAN_EXTRACTION_STATUSES)[number];

/** Etapas, en orden, de una extracción. */
export const DIAN_EXTRACTION_STAGES = [
  'connecting',
  'requesting_export',
  'waiting_export',
  'downloading',
  'importing',
  'done',
] as const;
export type DianExtractionStage = (typeof DIAN_EXTRACTION_STAGES)[number];

/** El portal exporta hasta 150 000 documentos; un rango corto mantiene la espera razonable. */
export const MAX_EXTRACTION_DAYS = 92;

export const dianExtractionRequestSchema = z
  .object({
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    path: ['endDate'],
    message: 'La fecha final debe ser igual o posterior a la inicial',
  })
  .refine(
    ({ startDate, endDate }) =>
      (Date.parse(endDate) - Date.parse(startDate)) / 86_400_000 < MAX_EXTRACTION_DAYS,
    { path: ['endDate'], message: `El rango no puede superar ${MAX_EXTRACTION_DAYS} días` },
  );

export type DianExtractionRequest = z.infer<typeof dianExtractionRequestSchema>;

export const dianExtractionJobSchema = z.object({
  id: z.uuid(),
  status: z.enum(DIAN_EXTRACTION_STATUSES),
  stage: z.enum(DIAN_EXTRACTION_STAGES),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  /** Mensaje de error o de avance, redactado para el usuario. */
  message: z.string().nullable(),
  /** Documentos que el portal dice haber exportado. */
  portalTotal: z.number().int().nullable(),
  importId: z.uuid().nullable(),
  created: z.number().int().nullable(),
  alreadyExisting: z.number().int().nullable(),
  rejected: z.number().int().nullable(),
  requestedBy: z.uuid(),
  startedAt: z.iso.datetime().nullable(),
  finishedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

export type DianExtractionJob = z.infer<typeof dianExtractionJobSchema>;
