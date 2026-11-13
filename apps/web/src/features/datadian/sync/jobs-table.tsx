import { useQuery } from '@tanstack/react-query';
import type { TelcoJob } from '@telcobras/contracts';
import {
  Button,
  createDataTableColumns,
  DataTable,
  EmptyState,
  Field,
  Select,
  type Status,
  StatusBadge,
} from '@telcobras/ui';
import { ListChecks, RotateCw, X } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { useJobAction } from '../api/mutations';
import { jobsQuery } from '../api/queries';
import { datadianErrorMessage } from '../shared/errors';

const text = t.datadian.sync.jobs;

const JOB_TONE: Record<TelcoJob['status'], Status> = {
  queued: 'neutral',
  running: 'info',
  succeeded: 'ok',
  dead: 'error',
  cancelled: 'neutral',
};

/** Cola y errores (§5.7): trabajos detenidos con "Reintentar" y en cola con "Cancelar". */
export function JobsTable() {
  const [status, setStatus] = useState<'dead' | 'queued'>('dead');
  const jobs = useQuery(jobsQuery(status));
  const action = useJobAction();
  const [notice, setNotice] = useState<string | null>(null);

  const column = createDataTableColumns<TelcoJob>();
  const columns = column.columns([
    column.display({
      id: 'kind',
      header: text.kind,
      cell: ({ row }) => text.kinds[row.original.kind],
    }),
    column.display({
      id: 'status',
      header: text.status,
      cell: ({ row }) => (
        <StatusBadge status={JOB_TONE[row.original.status]}>
          {text.statuses[row.original.status]}
        </StatusBadge>
      ),
    }),
    column.display({
      id: 'attempts',
      header: text.attempts,
      cell: ({ row }) => (
        <span className="tabular-nums">{`${row.original.attempts}/${row.original.maxAttempts}`}</span>
      ),
    }),
    column.display({
      id: 'lastError',
      header: text.lastError,
      cell: ({ row }) => (
        <span className="block max-w-72 text-xs">{row.original.lastError ?? '—'}</span>
      ),
    }),
    column.display({
      id: 'resource',
      header: text.resource,
      cell: ({ row }) => row.original.resource?.label ?? '—',
    }),
    column.display({
      id: 'actions',
      header: text.actions,
      cell: ({ row }) => {
        const job = row.original;
        const run = (kind: 'retry' | 'cancel') =>
          action.mutate(
            { id: job.id, action: kind },
            {
              onSuccess: () => setNotice(kind === 'retry' ? text.retried : text.cancelled),
              onError: (error) => setNotice(datadianErrorMessage(error)),
            },
          );
        if (job.status === 'dead') {
          return (
            <Button
              size="sm"
              variant="secondary"
              disabled={action.isPending}
              onClick={() => run('retry')}
            >
              <RotateCw aria-hidden="true" />
              {text.retry}
            </Button>
          );
        }
        if (job.status === 'queued') {
          return (
            <Button
              size="sm"
              variant="ghost"
              disabled={action.isPending}
              onClick={() => run('cancel')}
            >
              <X aria-hidden="true" />
              {text.cancel}
            </Button>
          );
        }
        return null;
      },
    }),
  ]);

  return (
    <div className="space-y-3">
      <Field label={text.filter} className="w-48">
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as 'dead' | 'queued')}
        >
          <option value="dead">{text.filters.dead}</option>
          <option value="queued">{text.filters.queued}</option>
        </Select>
      </Field>
      <div role="status" aria-live="polite" className="text-sm">
        {notice}
      </div>
      <DataTable
        caption={text.caption}
        columns={columns}
        data={jobs.data?.items}
        loading={jobs.isPending}
        getRowId={(job) => job.id}
        emptyState={<EmptyState icon={ListChecks} title={text.empty} />}
      />
    </div>
  );
}
