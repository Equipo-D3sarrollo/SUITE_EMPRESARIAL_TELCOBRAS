import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { ReceivedDocument, ReceivedDocumentStatus } from '@telcobras/contracts';
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
 * Mensaje de un error de la API. Los 422 de DataDian (por ejemplo, falta la conexión con Odoo)
 * vienen redactados para el usuario; los demás usan el texto genérico.
 */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.status === 422 && error.problem?.detail) {
    return error.problem.detail;
  }
  return fallback;
}
