import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  DEADLINE_STATES,
  DIAN_SYNC_CHANNELS,
  INVOICE_VALIDATION_STATUSES,
  PAYMENT_FORMS,
  RADIAN_STATUSES,
  type RadianStatus,
} from '@telcobras/contracts';
import { z } from 'zod';
import type { InvoiceListFilters } from '../api/queries';
import { bogotaDate } from '../shared/format';

/**
 * Filtros de la bandeja y factura abierta en la URL (§2.2), para compartir un enlace y para que
 * "atrás" funcione. Cada valor que llega mal cae a su valor por defecto sin romper la página.
 */
const fallback = <T extends z.ZodType>(schema: T) => schema.optional().catch(undefined);

export const inboxSearchSchema = z.object({
  from: fallback(z.iso.date()),
  to: fallback(z.iso.date()),
  q: fallback(z.string().trim().min(1).max(96)),
  radian: fallback(
    z
      .string()
      .transform((value) => value.split(',').filter(Boolean))
      .pipe(z.array(z.enum(RADIAN_STATUSES)).min(1)),
  ),
  deadline: fallback(z.enum(DEADLINE_STATES)),
  validation: fallback(z.enum(INVOICE_VALIDATION_STATUSES)),
  source: fallback(z.enum(DIAN_SYNC_CHANNELS)),
  payment: fallback(z.enum(PAYMENT_FORMS)),
  invoice: fallback(z.uuid()),
  view: z.enum(['content', 'xml', 'pdf']).catch('content').default('content'),
});

export type InboxSearch = z.infer<typeof inboxSearchSchema>;

const CUFE = /^[0-9a-f]{96}$/i;
const NIT = /^\d{5,15}$/;

/** "NIT o CUFE" (§5.1): 96 hexadecimales → CUFE; solo dígitos → NIT; si no, no se consulta. */
export function classifySearch(raw: string | undefined): 'cufe' | 'nit' | 'invalid' | 'empty' {
  const value = raw?.trim() ?? '';
  if (!value) return 'empty';
  if (CUFE.test(value)) return 'cufe';
  if (NIT.test(value.replace(/[.\-\s]/g, ''))) return 'nit';
  return 'invalid';
}

/** Mes en curso en hora de Bogotá: el rango por defecto. */
export function currentMonthRange(now = new Date()) {
  const today = bogotaDate(now);
  return { from: `${today.slice(0, 7)}-01`, to: today };
}

export function previousMonthRange(now = new Date()) {
  const [year, month] = bogotaDate(now).split('-').map(Number) as [number, number];
  const first = new Date(Date.UTC(month === 1 ? year - 1 : year, (month + 10) % 12, 1));
  const last = new Date(Date.UTC(year, month - 1, 0));
  return { from: first.toISOString().slice(0, 10), to: last.toISOString().slice(0, 10) };
}

export function last30DaysRange(now = new Date()) {
  return { from: bogotaDate(new Date(now.getTime() - 29 * 86_400_000)), to: bogotaDate(now) };
}

/** Filtros que viajan a GET /received, ya validados. */
export function toListFilters(search: InboxSearch): InvoiceListFilters {
  const range = currentMonthRange();
  const from = search.from ?? range.from;
  const to = search.to && search.to >= from ? search.to : search.from ? undefined : range.to;
  const kind = classifySearch(search.q);
  return {
    from,
    to,
    q:
      kind === 'cufe'
        ? search.q?.toLowerCase()
        : kind === 'nit'
          ? search.q?.replace(/\D/g, '')
          : undefined,
    radianStatus: search.radian?.join(','),
    deadlineState: search.deadline,
    validationStatus: search.validation,
    ingestionSource: search.source,
    paymentForm: search.payment,
    sort: search.deadline ? 'deadline_asc' : 'issue_date_desc',
  };
}

type SearchPatch = Partial<Record<keyof InboxSearch, string | RadianStatus[] | undefined>>;

/** Lee y escribe los parámetros de la bandeja en la URL. */
export function useInboxSearch() {
  const raw = useSearch({ from: '/app/$module/$submodule' });
  const navigate = useNavigate({ from: '/app/$module/$submodule' });
  const search = inboxSearchSchema.parse(raw);

  const setSearch = (patch: SearchPatch, options: { replace?: boolean } = {}) =>
    navigate({
      search: (previous) => {
        const next: Record<string, string | undefined> = { ...previous };
        for (const [key, value] of Object.entries(patch)) {
          next[key] = Array.isArray(value) ? value.join(',') || undefined : value || undefined;
        }
        return next;
      },
      replace: options.replace,
    });

  return { search, setSearch };
}
