import type { DatadianQuery } from '@telcobras/contracts';

/** Todo lo de DataDian cuelga de esta llave: invalidarla refresca bandeja, cifras y detalle. */
export const DATADIAN_KEY = ['datadian'] as const;

/** Llaves de consulta de DataDian, definidas una sola vez (§6.1). */
export const datadianKeys = {
  invoices: () => [...DATADIAN_KEY, 'invoices'] as const,
  invoiceList: (query: DatadianQuery<'E1'>) => [...DATADIAN_KEY, 'invoices', query] as const,
  summary: () => [...DATADIAN_KEY, 'summary'] as const,
  invoice: (id: string) => [...DATADIAN_KEY, 'invoice', id] as const,
  invoicePart: (id: string, part: 'detail' | 'content' | 'events' | 'history') =>
    [...DATADIAN_KEY, 'invoice', id, part] as const,
  invoiceXml: (id: string, part: string) => [...DATADIAN_KEY, 'invoice', id, 'xml', part] as const,
  event: (id: string, eventId: string) =>
    [...DATADIAN_KEY, 'invoice', id, 'event', eventId] as const,
  rules: () => [...DATADIAN_KEY, 'rules'] as const,
  settings: () => [...DATADIAN_KEY, 'settings'] as const,
  readiness: () => [...DATADIAN_KEY, 'settings', 'readiness'] as const,
  certificates: () => [...DATADIAN_KEY, 'settings', 'certificates'] as const,
  mailboxes: () => [...DATADIAN_KEY, 'settings', 'mailboxes'] as const,
  syncStatus: () => [...DATADIAN_KEY, 'sync', 'status'] as const,
  syncRuns: () => [...DATADIAN_KEY, 'sync', 'runs'] as const,
  syncRun: (id: string) => [...DATADIAN_KEY, 'sync', 'run', id] as const,
  jobs: (status: string | undefined) => [...DATADIAN_KEY, 'jobs', status ?? 'all'] as const,
  health: () => [...DATADIAN_KEY, 'health'] as const,
};
