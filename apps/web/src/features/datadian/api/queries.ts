import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { DatadianQuery, RadianInvoice } from '@telcobras/contracts';
import { datadianRequest } from './client';
import { datadianKeys } from './keys';
import {
  certificatesPollInterval,
  eventsPollInterval,
  invoicePollInterval,
  POLL,
  syncPollInterval,
} from './polling';

const PAGE_SIZE = 50;

export type InvoiceListFilters = Omit<DatadianQuery<'E1'>, 'cursor' | 'limit'>;

export const invoicesQuery = (filters: InvoiceListFilters) =>
  infiniteQueryOptions({
    queryKey: datadianKeys.invoiceList(filters),
    queryFn: ({ pageParam, signal }) =>
      datadianRequest('E1', {
        query: { ...filters, limit: PAGE_SIZE, cursor: pageParam },
        signal,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    refetchInterval: POLL.inbox,
    refetchOnWindowFocus: true,
  });

export const summaryQuery = queryOptions({
  queryKey: datadianKeys.summary(),
  queryFn: ({ signal }) => datadianRequest('E2', { signal }),
  refetchInterval: POLL.inbox,
  refetchOnWindowFocus: true,
});

export const invoiceQuery = (id: string) =>
  queryOptions({
    queryKey: datadianKeys.invoicePart(id, 'detail'),
    queryFn: ({ signal }) => datadianRequest('E3', { params: { id }, signal }),
    refetchInterval: (query) => invoicePollInterval(query.state.data),
    refetchOnWindowFocus: true,
  });

export const invoiceContentQuery = (id: string) =>
  queryOptions({
    queryKey: datadianKeys.invoicePart(id, 'content'),
    queryFn: ({ signal }) => datadianRequest('E4', { params: { id }, signal }),
    staleTime: 5 * 60_000,
  });

export const invoiceXmlQuery = (id: string, part: 'attached' | 'invoice' | 'validation') =>
  queryOptions({
    queryKey: datadianKeys.invoiceXml(id, part),
    queryFn: ({ signal }) => datadianRequest('E5', { params: { id }, query: { part }, signal }),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const eventsQuery = (id: string) =>
  queryOptions({
    queryKey: datadianKeys.invoicePart(id, 'events'),
    queryFn: ({ signal }) => datadianRequest('E7', { params: { id }, signal }),
    refetchInterval: (query) => eventsPollInterval(query.state.data),
    refetchOnWindowFocus: true,
  });

export const eventDetailQuery = (id: string, eventId: string) =>
  queryOptions({
    queryKey: datadianKeys.event(id, eventId),
    queryFn: ({ signal }) => datadianRequest('E8', { params: { id, eventId }, signal }),
  });

export const historyQuery = (id: string) =>
  queryOptions({
    queryKey: datadianKeys.invoicePart(id, 'history'),
    queryFn: ({ signal }) => datadianRequest('L3', { params: { id }, signal }),
  });

export const rulesQuery = queryOptions({
  queryKey: datadianKeys.rules(),
  queryFn: ({ signal }) => datadianRequest('E11', { signal }),
  staleTime: 60 * 60_000,
});

export const settingsQuery = queryOptions({
  queryKey: datadianKeys.settings(),
  queryFn: ({ signal }) => datadianRequest('E12', { signal }),
  staleTime: 60_000,
});

export const readinessQuery = queryOptions({
  queryKey: datadianKeys.readiness(),
  queryFn: ({ signal }) => datadianRequest('E14', { signal }),
});

export const certificatesQuery = queryOptions({
  queryKey: datadianKeys.certificates(),
  queryFn: ({ signal }) => datadianRequest('E15', { signal }),
  refetchInterval: (query) => certificatesPollInterval(query.state.data),
});

export const mailboxesQuery = queryOptions({
  queryKey: datadianKeys.mailboxes(),
  queryFn: ({ signal }) => datadianRequest('E20', { signal }),
});

export const syncStatusQuery = queryOptions({
  queryKey: datadianKeys.syncStatus(),
  queryFn: ({ signal }) => datadianRequest('E23', { signal }),
  refetchInterval: (query) => syncPollInterval(query.state.data),
  refetchOnWindowFocus: true,
});

export const syncRunsQuery = infiniteQueryOptions({
  queryKey: datadianKeys.syncRuns(),
  queryFn: ({ pageParam, signal }) =>
    datadianRequest('E24', { query: { limit: 20, cursor: pageParam }, signal }),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (page) => page.nextCursor ?? undefined,
  refetchInterval: POLL.sync,
});

export const syncRunQuery = (id: string) =>
  queryOptions({
    queryKey: datadianKeys.syncRun(id),
    queryFn: ({ signal }) => datadianRequest('E25', { params: { id }, signal }),
  });

export const jobsQuery = (status: 'dead' | 'queued' | undefined) =>
  queryOptions({
    queryKey: datadianKeys.jobs(status),
    queryFn: ({ signal }) => datadianRequest('E28', { query: { status, limit: 50 }, signal }),
  });

export const healthQuery = queryOptions({
  queryKey: datadianKeys.health(),
  queryFn: ({ signal }) => datadianRequest('E31', { signal }),
  refetchInterval: POLL.health,
  staleTime: 30_000,
});

/** Número de la factura como lo ve el usuario: prefijo y folio, sin repetir el prefijo. */
export function invoiceLabel({ prefix, folio }: Pick<RadianInvoice, 'prefix' | 'folio'>) {
  const cleanPrefix = prefix ?? '';
  const cleanFolio = folio ?? '';
  return cleanFolio.startsWith(cleanPrefix) ? cleanFolio : `${cleanPrefix}${cleanFolio}`;
}

export const pdfUrl = (id: string) => `/api/v1/documents/received/${id}/pdf`;
