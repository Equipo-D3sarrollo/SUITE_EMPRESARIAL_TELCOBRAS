import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type {
  ProblemDetails,
  ReceivedDocument,
  ReceivedDocumentImportSummary,
  ReceivedDocumentPdfUpload,
  ReceivedDocumentStatus,
} from '@telcobras/contracts';
import { ApiError, api, unwrap } from '@/lib/api-client';

const PAGE_SIZE = 50;

/** Todo lo de DataDian cuelga de esta llave: invalidarla refresca tablero, cifras e historial. */
export const DATADIAN_KEY = ['datadian'] as const;

export const receivedDocumentsQuery = (status: ReceivedDocumentStatus | undefined) =>
  infiniteQueryOptions({
    queryKey: [...DATADIAN_KEY, 'received', status ?? 'all'],
    queryFn: ({ pageParam }) =>
      unwrap(
        api.GET('/api/v1/documents/received', {
          params: { query: { limit: PAGE_SIZE, status, cursor: pageParam } },
        }),
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });

export const summaryQuery = queryOptions({
  queryKey: [...DATADIAN_KEY, 'summary'],
  queryFn: () => unwrap(api.GET('/api/v1/documents/received/summary')),
});

export const historyQuery = (id: string) =>
  queryOptions({
    queryKey: [...DATADIAN_KEY, 'history', id],
    queryFn: () =>
      unwrap(api.GET('/api/v1/documents/received/{id}/history', { params: { path: { id } } })),
  });

export const dianSessionQuery = queryOptions({
  queryKey: [...DATADIAN_KEY, 'dian', 'session'],
  queryFn: () => unwrap(api.GET('/api/v1/documents/dian/session')),
});

export const extractionsQuery = queryOptions({
  queryKey: [...DATADIAN_KEY, 'dian', 'extractions'],
  queryFn: () =>
    unwrap(api.GET('/api/v1/documents/dian/extractions', { params: { query: { limit: 10 } } })),
});

/** Avance de una extracción: se consulta cada 3 s mientras siga en curso. */
export const extractionJobQuery = (id: string) =>
  queryOptions({
    queryKey: [...DATADIAN_KEY, 'dian', 'extractions', id],
    queryFn: () =>
      unwrap(api.GET('/api/v1/documents/dian/extractions/{id}', { params: { path: { id } } })),
    refetchInterval: (query) =>
      query.state.data?.status === 'done' || query.state.data?.status === 'error' ? false : 3_000,
  });

/** Facturas de una importación (las que trajo una extracción). */
export const importedDocumentsQuery = (importId: string) =>
  queryOptions({
    queryKey: [...DATADIAN_KEY, 'received', 'import', importId],
    queryFn: () =>
      unwrap(
        api.GET('/api/v1/documents/received', {
          params: { query: { limit: PAGE_SIZE, importId } },
        }),
      ),
  });

export const settingsQuery = queryOptions({
  queryKey: [...DATADIAN_KEY, 'settings'],
  queryFn: () => unwrap(api.GET('/api/v1/documents/settings')),
});

/** Número de la factura como lo ve el usuario: prefijo y folio, sin repetir el prefijo. */
export function invoiceLabel({ prefix, folio }: Pick<ReceivedDocument, 'prefix' | 'folio'>) {
  const cleanPrefix = prefix ?? '';
  const cleanFolio = folio ?? '';
  return cleanFolio.startsWith(cleanPrefix) ? cleanFolio : `${cleanPrefix}${cleanFolio}`;
}

export const pdfUrl = (id: string) => `/api/v1/documents/received/${id}/pdf`;

/**
 * Sube un archivo como cuerpo binario (el .xlsx de la DIAN o un PDF). openapi-fetch serializa JSON,
 * así que va por fetch directo, con su Idempotency-Key como las demás mutaciones.
 */
async function uploadBinary<T>(path: string, file: File, contentType: string): Promise<T> {
  const url = `${path}?${new URLSearchParams({ fileName: file.name })}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': contentType, 'Idempotency-Key': crypto.randomUUID() },
    body: file,
  });
  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const problem =
      typeof body === 'object' && body !== null && 'title' in body
        ? (body as ProblemDetails)
        : undefined;
    throw new ApiError(response.status, problem);
  }
  return body as T;
}

export const uploadListing = (file: File) =>
  uploadBinary<ReceivedDocumentImportSummary>(
    '/api/v1/documents/received/imports',
    file,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );

export const uploadPdf = (file: File) =>
  uploadBinary<ReceivedDocumentPdfUpload>(
    '/api/v1/documents/received/pdfs',
    file,
    'application/pdf',
  );

/**
 * Mensaje de un error de la API. Los 422 de DataDian (archivo inválido, PDF de otra empresa, falta
 * el PDF o la conexión con Odoo) vienen redactados para el usuario; los demás usan el texto genérico.
 */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.status === 422 && error.problem?.detail) {
    return error.problem.detail;
  }
  return fallback;
}
