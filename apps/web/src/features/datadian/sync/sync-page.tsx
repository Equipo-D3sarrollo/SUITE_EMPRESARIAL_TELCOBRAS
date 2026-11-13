import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { SyncRun } from '@telcobras/contracts';
import {
  Button,
  Card,
  createDataTableColumns,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Skeleton,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@telcobras/ui';
import { History, Info } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { moduleLabel, submoduleLabel } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import { settingsQuery, syncRunQuery, syncRunsQuery, syncStatusQuery } from '../api/queries';
import { CertificateBanner } from '../shared/certificate-banner';
import { formatDateTime } from '../shared/format';
import { MockBadge } from '../shared/mock-badge';
import { useDatadianPermissions } from '../shared/permissions';
import { ChannelCard, RunWarnings, SYNC_TONE } from './channel-card';
import { JobsTable } from './jobs-table';
import { UploadXml } from './upload-xml';

const text = t.datadian.sync;

function RunErrorsDialog({ runId, onClose }: { runId: string | null; onClose: () => void }) {
  const run = useQuery({ ...syncRunQuery(runId ?? ''), enabled: runId !== null });
  return (
    <Dialog open={runId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeLabel={t.common.close} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{text.history.errorsTitle}</DialogTitle>
        </DialogHeader>
        {run.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : run.data && run.data.errors.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {run.data.errors.map((error) => (
              <li key={`${error.cufe}-${error.code}`}>
                <span className="font-mono text-xs">{error.cufe ?? '—'}</span>
                <span className="block">{`${error.code}: ${error.message}`}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">{text.history.noErrors}</p>
        )}
        {run.data && <RunWarnings run={run.data} />}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Submódulo Sincronizaciones (§5.7): tarjeta por canal con "Sincronizar ahora", carga manual de XML,
 * historial con errores por CUFE y, con `documents:sync`, la cola de trabajos de Telco.
 */
export function SyncPage() {
  const permissions = useDatadianPermissions();
  const status = useQuery(syncStatusQuery);
  const settings = useQuery(settingsQuery);
  const runs = useInfiniteQuery(syncRunsQuery);
  const [detail, setDetail] = useState<string | null>(null);
  const lookback = settings.data?.dian?.syncLookbackDays ?? 30;

  const column = createDataTableColumns<SyncRun>();
  const columns = column.columns([
    column.display({
      id: 'channel',
      header: text.history.channel,
      cell: ({ row }) => t.datadian.channels[row.original.channel],
    }),
    column.display({
      id: 'trigger',
      header: text.history.trigger,
      cell: ({ row }) => text.triggers[row.original.trigger],
    }),
    column.display({
      id: 'status',
      header: text.history.status,
      cell: ({ row }) => (
        <div className="space-y-1">
          <StatusBadge status={SYNC_TONE[row.original.status]}>
            {text.statuses[row.original.status]}
          </StatusBadge>
          {row.original.emptyListingWarning && <p className="text-xs">{text.emptyListing}</p>}
          {row.original.humanVerificationRequired && (
            <p className="text-xs">{text.humanVerification}</p>
          )}
        </div>
      ),
    }),
    column.display({
      id: 'started',
      header: text.history.started,
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">
          {row.original.startedAt ? formatDateTime(row.original.startedAt) : '—'}
        </span>
      ),
    }),
    column.display({
      id: 'counters',
      header: text.history.counters,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs tabular-nums">
          {`${row.original.listedCount} / ${row.original.newCount} / ${row.original.failedCount}`}
        </span>
      ),
    }),
    column.display({
      id: 'detail',
      header: '',
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => setDetail(row.original.id)}>
          {text.history.detail}
        </Button>
      ),
    }),
  ]);

  return (
    <>
      <Workspace
        routeKey="documents/sync"
        eyebrow={
          <span className="flex items-center gap-2">
            {moduleLabel('documents')}
            <MockBadge />
          </span>
        }
        title={submoduleLabel('documents', 'sync')}
      >
        <CertificateBanner />
        <Tabs defaultValue="channels">
          <TabsList>
            <TabsTrigger value="channels">{text.tabs.channels}</TabsTrigger>
            {permissions.canSync && <TabsTrigger value="jobs">{text.tabs.jobs}</TabsTrigger>}
          </TabsList>
          <TabsContent value="channels" className="space-y-6 pt-4">
            <section aria-label={text.channelsTitle} className="grid gap-3 xl:grid-cols-3">
              {status.isPending
                ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-56 w-full" />)
                : status.data?.channels.map((channel) => (
                    <ChannelCard
                      key={channel.channel}
                      channel={channel}
                      lookbackDays={lookback}
                      canSync={permissions.canSync}
                    />
                  ))}
            </section>
            {permissions.canSync ? (
              <UploadXml />
            ) : (
              <Card className="flex items-center gap-2 p-3 text-sm">
                <Info aria-hidden="true" className="size-4 shrink-0" />
                {text.noPermission}
              </Card>
            )}
            <section className="space-y-3">
              <h2 className="font-semibold">{text.history.title}</h2>
              <DataTable
                caption={text.history.caption}
                columns={columns}
                data={runs.data?.pages.flatMap((page) => page.items)}
                loading={runs.isPending}
                getRowId={(run) => run.id}
                emptyState={<EmptyState icon={History} title={text.history.empty} />}
              />
              {runs.hasNextPage && (
                <Button variant="secondary" onClick={() => runs.fetchNextPage()}>
                  {t.datadian.inbox.loadMore}
                </Button>
              )}
            </section>
          </TabsContent>
          {permissions.canSync && (
            <TabsContent value="jobs" className="pt-4">
              <JobsTable />
            </TabsContent>
          )}
        </Tabs>
      </Workspace>
      <ContextPanel routeKey="documents/sync">
        <Card className="space-y-2 p-4 text-sm">
          <p className="font-semibold">{text.tabs.jobs}</p>
          <p>
            {`${text.jobs.filters.dead}: ${status.data?.deadJobs ?? '—'} · ${text.jobs.filters.queued}: ${status.data?.queuedJobs ?? '—'}`}
          </p>
          <p className="text-xs">{t.datadian.settings.sync.rpaLegal}</p>
        </Card>
      </ContextPanel>
      <RunErrorsDialog runId={detail} onClose={() => setDetail(null)} />
    </>
  );
}
