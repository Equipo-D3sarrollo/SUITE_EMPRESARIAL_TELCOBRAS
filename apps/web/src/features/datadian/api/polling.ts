import type {
  DianCertificate,
  RadianEvent,
  RadianInvoiceDetail,
  SyncRun,
  SyncStatus,
} from '@telcobras/contracts';

/**
 * Reglas de sondeo de la Etapa 3 (§6.1). El SSE de la 4.6 las apagará; mientras tanto, cada consulta
 * decide su intervalo según lo que está esperando.
 */
export const POLL = {
  pendingEvent: 3_000,
  pendingEventSlow: 15_000,
  /** Tras 2 minutos con el evento pendiente, el sondeo baja a 15 s. */
  pendingEventSlowAfter: 2 * 60_000,
  inbox: 30_000,
  certificate: 3_000,
  sync: 5_000,
  health: 60_000,
} as const;

/** Factura abierta: 3 s mientras haya un evento `pending`; 15 s si lleva más de 2 minutos. */
export function invoicePollInterval(invoice: RadianInvoiceDetail | undefined): number | false {
  if (!invoice?.pendingEvent) return false;
  const waited = Date.now() - new Date(invoice.pendingEvent.since).getTime();
  return waited > POLL.pendingEventSlowAfter ? POLL.pendingEventSlow : POLL.pendingEvent;
}

export function eventsPollInterval(events: readonly RadianEvent[] | undefined): number | false {
  return events?.some((event) => event.status === 'pending') ? POLL.pendingEvent : false;
}

export function certificatesPollInterval(
  certificates: readonly DianCertificate[] | undefined,
): number | false {
  return certificates?.some((certificate) => certificate.status === 'pending_validation')
    ? POLL.certificate
    : false;
}

const active = (run: SyncRun | null) => run?.status === 'queued' || run?.status === 'running';

export function syncPollInterval(status: SyncStatus | undefined): number | false {
  return status?.channels.some((channel) => channel.running || active(channel.lastRun))
    ? POLL.sync
    : false;
}
