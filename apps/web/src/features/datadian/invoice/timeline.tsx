import { useQuery } from '@tanstack/react-query';
import { isDatadianErrorCode, type RadianEvent } from '@telcobras/contracts';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from '@telcobras/ui';
import { Download, History } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { datadianUrl } from '../api/client';
import { eventDetailQuery } from '../api/queries';
import { EventStatusBadge } from '../shared/badges';
import { CopyButton } from '../shared/copy-button';
import { formatDateTime, shortHash } from '../shared/format';

const text = t.datadian.timeline;
const DATES = ['createdAt', 'generatedAt', 'sentAt', 'dianRegisteredAt'] as const;

/**
 * Traza legible de una respuesta 04 o de una falla (§5.8). Solo se traducen los códigos documentados
 * (los `DD0xx` y los locales); para reglas de la DIAN sin texto propio se muestra el mensaje crudo.
 */
function Trace({ event }: { event: RadianEvent }) {
  const known = event.errorTrace.filter((entry) => isDatadianErrorCode(entry.code));
  return (
    <div className="space-y-1.5 rounded-sm border border-tb-error p-2 text-xs">
      {event.errorMessage && <p className="font-medium text-sm">{event.errorMessage}</p>}
      {event.errorTrace.length > 0 && (
        <>
          <p className="font-medium">{text.trace}</p>
          <ul className="space-y-1">
            {event.errorTrace.map((entry) => (
              <li key={`${entry.code}-${entry.message}`} className="flex items-start gap-1.5">
                <Badge className="shrink-0 font-mono">{entry.code}</Badge>
                <span>{entry.message}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        <span className="font-medium">{text.whatToDo}: </span>
        {known.length > 0 && isDatadianErrorCode(known[0]?.code)
          ? t.datadian.errors[known[0].code]
          : text.unknownRule}
      </p>
    </div>
  );
}

function AttemptsDialog({ event, onClose }: { event: RadianEvent | null; onClose: () => void }) {
  const detail = useQuery({
    ...eventDetailQuery(event?.receivedDocumentId ?? '', event?.id ?? ''),
    enabled: event !== null,
  });
  return (
    <Dialog open={event !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeLabel={t.common.close} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{text.attemptsTitle}</DialogTitle>
        </DialogHeader>
        {detail.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : detail.data ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">{text.attemptsTitle}</caption>
              <thead>
                <tr>
                  {(['no', 'started', 'outcome', 'http', 'code', 'duration'] as const).map(
                    (key) => (
                      <th key={key} scope="col" className="px-2 py-1">
                        {text.attempt[key]}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {detail.data.attemptsLog.map((attempt) => (
                  <tr key={attempt.attemptNo} className="border-tb-gris/30 border-t">
                    <td className="px-2 py-1 tabular-nums">{attempt.attemptNo}</td>
                    <td className="px-2 py-1 tabular-nums">{formatDateTime(attempt.startedAt)}</td>
                    <td className="px-2 py-1">
                      {text.outcomes[attempt.outcome] ?? attempt.outcome}
                    </td>
                    <td className="px-2 py-1 tabular-nums">{attempt.httpStatus ?? '—'}</td>
                    <td className="px-2 py-1 font-mono">{attempt.dianStatusCode ?? '—'}</td>
                    <td className="px-2 py-1 tabular-nums">
                      {attempt.durationMs === null ? '—' : `${attempt.durationMs} ms`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm">{t.datadian.viewer.loadError}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventItem({ event, onAttempts }: { event: RadianEvent; onAttempts: () => void }) {
  const failed = event.status === 'rejected' || event.status === 'failed';
  return (
    <li className="space-y-1.5 border-tb-gris/40 border-l-2 pb-3 pl-3">
      <h4 className="font-semibold text-sm">
        {`${event.eventCode} · ${t.datadian.eventCodes[event.eventCode]}`}
      </h4>
      <div className="flex flex-wrap items-center gap-1.5">
        <EventStatusBadge event={event} />
        {event.dianStatusCode && (
          <span className="font-mono text-xs">{text.dianCode(event.dianStatusCode)}</span>
        )}
        <span className="text-xs">{text.origin[event.origin]}</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 text-xs">
        {DATES.map((field) => {
          const value = event[field];
          return value ? (
            <div key={field} className="contents">
              <dt>{text.dates[field]}</dt>
              <dd>
                <time dateTime={value} className="tabular-nums">
                  {formatDateTime(value)}
                </time>
              </dd>
            </div>
          ) : null;
        })}
      </dl>
      {event.requestedBy && <p className="text-xs">{text.requestedBy(event.requestedBy.name)}</p>}
      {event.claimCode && (
        <p className="text-xs">
          {text.claim(event.claimCode, t.datadian.claimConcepts[event.claimCode].label)}
        </p>
      )}
      {event.claimNote && (
        <p className="text-xs">
          <span className="font-medium">{text.note}: </span>
          {event.claimNote}
        </p>
      )}
      {event.cude && (
        <p className="flex flex-wrap items-center gap-1 text-xs">
          <span className="font-medium">{text.cude}</span>
          <span className="font-mono" aria-hidden="true">
            {shortHash(event.cude)}
          </span>
          <span className="sr-only">{event.cude}</span>
          <CopyButton value={event.cude} />
        </p>
      )}
      {failed && <Trace event={event} />}
      <div className="flex flex-wrap gap-1">
        {event.attempts > 0 && (
          <Button size="sm" variant="ghost" onClick={onAttempts}>
            <History aria-hidden="true" />
            {text.attempts(event.attempts)}
          </Button>
        )}
        {event.hasRequestXml && (
          <Button size="sm" variant="ghost" asChild>
            <a
              href={datadianUrl('E9', {
                params: { id: event.receivedDocumentId, eventId: event.id },
                query: { part: 'request' },
              })}
              download
            >
              <Download aria-hidden="true" />
              {text.downloadRequest}
            </a>
          </Button>
        )}
        {event.hasResponseXml && (
          <Button size="sm" variant="ghost" asChild>
            <a
              href={datadianUrl('E9', {
                params: { id: event.receivedDocumentId, eventId: event.id },
                query: { part: 'response' },
              })}
              download
            >
              <Download aria-hidden="true" />
              {text.downloadResponse}
            </a>
          </Button>
        )}
      </div>
    </li>
  );
}

/** Línea de tiempo RADIAN de la Zona 3 (§5.2.2): del evento más antiguo al más reciente. */
export function RadianTimeline({ events }: { events: readonly RadianEvent[] | undefined }) {
  const [attemptsOf, setAttemptsOf] = useState<RadianEvent | null>(null);
  return (
    <section aria-labelledby="radian-timeline-title" className="space-y-3">
      <h3 id="radian-timeline-title" className="font-semibold text-sm">
        {text.title}
      </h3>
      {events === undefined ? (
        <Skeleton className="h-24 w-full" />
      ) : events.length === 0 ? (
        <p className="text-sm">{text.empty}</p>
      ) : (
        <ol className="space-y-1">
          {[...events]
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((event) => (
              <EventItem key={event.id} event={event} onAttempts={() => setAttemptsOf(event)} />
            ))}
        </ol>
      )}
      <AttemptsDialog event={attemptsOf} onClose={() => setAttemptsOf(null)} />
    </section>
  );
}
