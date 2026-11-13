import { useQuery } from '@tanstack/react-query';
import type { SyncRun, SyncStatus } from '@telcobras/contracts';
import { Button, Card, Field, Input, Select, type Status, StatusBadge } from '@telcobras/ui';
import { RefreshCw, ShieldAlert, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { useRequestSync } from '../api/mutations';
import { mailboxesQuery } from '../api/queries';
import { datadianErrorMessage } from '../shared/errors';
import { bogotaDate, formatDateTime } from '../shared/format';

const text = t.datadian.sync;

export const SYNC_TONE: Record<SyncRun['status'], Status> = {
  queued: 'neutral',
  running: 'info',
  succeeded: 'ok',
  partial: 'warning',
  failed: 'error',
};

/** Advertencias de una ejecución: listado vacío sospechoso y verificación humana (no se evade). */
export function RunWarnings({ run }: { run: SyncRun }) {
  return (
    <>
      {run.emptyListingWarning && (
        <p className="flex items-start gap-1.5 text-sm">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {text.emptyListing}
        </p>
      )}
      {run.humanVerificationRequired && (
        <p className="flex items-start gap-1.5 text-sm">
          <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {text.humanVerification}
        </p>
      )}
    </>
  );
}

export function RunCounters({ run }: { run: SyncRun }) {
  return (
    <dl className="grid grid-cols-5 gap-2 text-center text-xs">
      {(
        [
          ['listed', run.listedCount],
          ['new', run.newCount],
          ['existing', run.existingCount],
          ['xml', run.xmlDownloadedCount],
          ['failed', run.failedCount],
        ] as const
      ).map(([key, value]) => (
        <div key={key}>
          <dt>{text.counters[key]}</dt>
          <dd className="font-semibold text-base tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

type Channel = SyncStatus['channels'][number];

/** Tarjeta por canal (§5.7): estado, última y próxima ejecución, contadores y "Sincronizar ahora". */
export function ChannelCard({
  channel,
  lookbackDays,
  canSync,
}: {
  channel: Channel;
  lookbackDays: number;
  canSync: boolean;
}) {
  const request = useRequestSync();
  const mailboxes = useQuery({ ...mailboxesQuery, enabled: channel.channel === 'imap' && canSync });
  const today = bogotaDate(new Date());
  const [periodStart, setPeriodStart] = useState(
    bogotaDate(new Date(Date.now() - (lookbackDays - 1) * 86_400_000)),
  );
  const [periodEnd, setPeriodEnd] = useState(today);
  const [mailboxId, setMailboxId] = useState('');
  const run = channel.lastRun;
  const busy = channel.running || run?.status === 'queued' || run?.status === 'running';
  const duration =
    run?.startedAt && run.finishedAt
      ? Math.round((new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000)
      : null;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{t.datadian.channels[channel.channel]}</h3>
        <StatusBadge status={channel.enabled ? 'ok' : 'neutral'}>
          {channel.enabled ? text.enabled : text.disabled}
        </StatusBadge>
      </div>
      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium">{text.lastRun}: </span>
          {run ? (
            <>
              <StatusBadge status={SYNC_TONE[run.status]}>{text.statuses[run.status]}</StatusBadge>{' '}
              {run.startedAt && formatDateTime(run.startedAt)}
              {duration !== null && ` · ${text.duration(duration)}`}
            </>
          ) : (
            text.never
          )}
        </p>
        {channel.nextRunAt && (
          <p>
            <span className="font-medium">{text.nextRun}: </span>
            {formatDateTime(channel.nextRunAt)}
          </p>
        )}
      </div>
      {run && <RunCounters run={run} />}
      {run && <RunWarnings run={run} />}
      {run?.errorMessage && <p className="text-sm text-tb-error">{run.errorMessage}</p>}

      {canSync && channel.channel !== 'manual' && (
        <form
          className="mt-auto space-y-2 border-tb-gris/30 border-t pt-3"
          onSubmit={(event) => {
            event.preventDefault();
            request.mutate(
              channel.channel === 'rpa'
                ? { channel: 'rpa', periodStart, periodEnd }
                : { channel: 'imap', ...(mailboxId ? { mailboxId } : {}) },
            );
          }}
        >
          {channel.channel === 'rpa' ? (
            <div className="grid grid-cols-2 gap-2">
              <Field label={text.periodStart}>
                <Input
                  type="date"
                  value={periodStart}
                  max={periodEnd}
                  onChange={(event) => setPeriodStart(event.target.value)}
                />
              </Field>
              <Field label={text.periodEnd}>
                <Input
                  type="date"
                  value={periodEnd}
                  max={today}
                  onChange={(event) => setPeriodEnd(event.target.value)}
                />
              </Field>
            </div>
          ) : (
            <Field label={text.mailbox}>
              <Select value={mailboxId} onChange={(event) => setMailboxId(event.target.value)}>
                <option value="">{t.datadian.filters.any}</option>
                {mailboxes.data?.map((mailbox) => (
                  <option key={mailbox.id} value={mailbox.id}>
                    {mailbox.username}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Button
            type="submit"
            variant="secondary"
            disabled={!channel.enabled || busy || request.isPending}
          >
            <RefreshCw
              aria-hidden="true"
              className={busy ? 'motion-safe:animate-spin' : undefined}
            />
            {busy ? text.running : text.syncNow}
          </Button>
          <div role="status" aria-live="polite" className="text-sm">
            {request.isSuccess && <p>{text.requested}</p>}
            {request.isError && (
              <p className="text-tb-error">{datadianErrorMessage(request.error)}</p>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}
