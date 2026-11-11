import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  RECEIVED_DOCUMENT_STATUSES,
  type ReceivedDocument,
  type ReceivedDocumentDecision,
  type ReceivedDocumentStatus,
} from '@telcobras/contracts';
import {
  Button,
  Card,
  createDataTableColumns,
  DataTable,
  EmptyState,
  KpiCard,
  StatusBadge,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@telcobras/ui';
import {
  CircleCheck,
  CircleX,
  Clock,
  FileWarning,
  Inbox,
  PencilLine,
  RotateCw,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { api, unwrap } from '@/lib/api-client';
import { formatCop, formatDate, formatNit } from '@/lib/format-co';
import { permissionsQuery } from '@/lib/queries';
import { moduleLabel, submoduleLabel } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import {
  DATADIAN_KEY,
  errorMessage,
  invoiceLabel,
  receivedDocumentsQuery,
  settingsQuery,
  summaryQuery,
} from './api';
import { DocumentStatus } from './document-status';
import { InvoiceDetail } from './invoice-detail';
import { RejectDialog } from './reject-dialog';

const text = t.datadian;
const OPEN = new Set<ReceivedDocumentStatus>(['imported', 'draft']);
type Filter = ReceivedDocumentStatus | 'all';

type Notice = { tone: 'ok' | 'warning' | 'error'; message: string };

/**
 * Tablero de DataDian: cifras, facturas por estado y las acciones de la revisión.
 * Aprobar envía la factura a Odoo; Borrador la deja guardada para aprobarla después.
 */
export function InvoicesPage() {
  const queryClient = useQueryClient();
  const { data: permissions } = useSuspenseQuery(permissionsQuery);
  const canDecide = permissions.permissions.includes('documents:decide');

  const [filter, setFilter] = useState<Filter>('imported');
  const [picked, setPicked] = useState<ReceivedDocument | null>(null);
  const [rejecting, setRejecting] = useState<ReceivedDocument | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const summary = useQuery(summaryQuery);
  const settings = useQuery(settingsQuery);
  const list = useInfiniteQuery(receivedDocumentsQuery(filter === 'all' ? undefined : filter));
  const documents = list.data?.pages.flatMap((page) => page.items);
  // La versión más reciente de la factura elegida, aunque ya no esté en el filtro actual.
  const selected = documents?.find((document) => document.id === picked?.id) ?? picked;
  const odooReady = Boolean(settings.data?.odoo);

  const refresh = () => queryClient.invalidateQueries({ queryKey: DATADIAN_KEY });

  const decide = useMutation({
    mutationFn: ({ id, ...body }: ReceivedDocumentDecision & { id: string }) =>
      unwrap(
        api.POST('/api/v1/documents/received/{id}/decision', { params: { path: { id } }, body }),
      ),
    onSuccess: (document) => {
      const invoice = invoiceLabel(document);
      if (document.status === 'approved') {
        setNotice(
          document.odoo?.status === 'sent'
            ? { tone: 'ok', message: text.actions.approved(invoice) }
            : { tone: 'warning', message: text.actions.approvedWithError(invoice) },
        );
      } else if (document.status === 'draft') {
        setNotice({ tone: 'ok', message: text.actions.drafted(invoice) });
      } else {
        setNotice({ tone: 'ok', message: text.actions.rejected(invoice) });
      }
      setRejecting(null);
      setPicked(document);
    },
    onError: (error) =>
      setNotice({ tone: 'error', message: errorMessage(error, text.actions.error) }),
    onSettled: refresh,
  });

  const retry = useMutation({
    mutationFn: (id: string) =>
      unwrap(api.POST('/api/v1/documents/received/{id}/odoo-sync', { params: { path: { id } } })),
    onSuccess: (document) => {
      const invoice = invoiceLabel(document);
      setPicked(document);
      setNotice(
        document.odoo?.status === 'sent'
          ? { tone: 'ok', message: text.actions.approved(invoice) }
          : { tone: 'warning', message: text.actions.approvedWithError(invoice) },
      );
    },
    onError: (error) =>
      setNotice({ tone: 'error', message: errorMessage(error, text.actions.error) }),
    onSettled: refresh,
  });

  const busy = decide.isPending || retry.isPending;
  const column = createDataTableColumns<ReceivedDocument>();
  const columns = column.columns([
    column.display({
      id: 'invoice',
      header: text.table.invoice,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setPicked(row.original)}
          aria-pressed={row.original.id === picked?.id}
          className="font-semibold text-tb-azul underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-tb-azul"
        >
          {invoiceLabel(row.original) || '—'}
        </button>
      ),
    }),
    column.display({
      id: 'date',
      header: text.table.date,
      cell: ({ row }) =>
        row.original.issueDate ? (
          <span className="tabular-nums">
            {formatDate(`${row.original.issueDate}T12:00:00-05:00`)}
          </span>
        ) : (
          '—'
        ),
    }),
    column.display({
      id: 'supplier',
      header: text.table.supplier,
      cell: ({ row }) => (
        <div className="min-w-48">
          <p>{row.original.issuerName ?? '—'}</p>
          {row.original.issuerNit && (
            <p className="text-xs tabular-nums">{formatNit(row.original.issuerNit)}</p>
          )}
        </div>
      ),
    }),
    column.display({
      id: 'total',
      header: text.table.total,
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">
          {row.original.total === null ? '—' : formatCop(Number(row.original.total))}
        </span>
      ),
    }),
    column.display({
      id: 'costCenter',
      header: text.table.costCenter,
      cell: ({ row }) => row.original.costCenter ?? '—',
    }),
    column.display({
      id: 'pdf',
      header: text.table.pdf,
      cell: ({ row }) =>
        row.original.pdf ? (
          <StatusBadge status="ok">{text.table.pdfReady}</StatusBadge>
        ) : (
          <StatusBadge status="warning">{text.table.pdfMissing}</StatusBadge>
        ),
    }),
    column.display({
      id: 'status',
      header: text.table.status,
      cell: ({ row }) => <DocumentStatus document={row.original} />,
    }),
    column.display({
      id: 'actions',
      header: text.table.actions,
      cell: ({ row }) => {
        const document = row.original;
        if (!canDecide) return null;
        if (document.status === 'approved' && document.odoo?.status !== 'sent') {
          return (
            <Button
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => retry.mutate(document.id)}
            >
              <RotateCw aria-hidden="true" />
              {text.actions.retry}
            </Button>
          );
        }
        if (!OPEN.has(document.status)) return null;
        const approveBlocker = !document.pdf
          ? text.actions.approveNeedsPdf
          : !odooReady
            ? text.actions.approveNeedsOdoo
            : undefined;
        return (
          <div className="flex gap-1.5">
            <Button
              size="sm"
              disabled={busy || approveBlocker !== undefined}
              title={approveBlocker}
              onClick={() => decide.mutate({ id: document.id, decision: 'approved' })}
            >
              <CircleCheck aria-hidden="true" />
              {text.actions.approve}
            </Button>
            {document.status === 'imported' && (
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() => decide.mutate({ id: document.id, decision: 'draft' })}
              >
                <PencilLine aria-hidden="true" />
                {text.actions.draft}
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() => setRejecting(document)}
            >
              <CircleX aria-hidden="true" />
              {text.actions.reject}
            </Button>
          </div>
        );
      },
    }),
  ]);

  const counts = summary.data?.byStatus;
  const kpi = (value: number | undefined) => (value === undefined ? '—' : value);

  return (
    <>
      <Workspace
        routeKey="documents/invoices"
        eyebrow={moduleLabel('documents')}
        title={submoduleLabel('documents', 'invoices')}
      >
        <section aria-label={text.table.caption} className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <KpiCard title={text.kpis.imported} value={kpi(counts?.imported)} icon={Inbox} />
          <KpiCard title={text.kpis.draft} value={kpi(counts?.draft)} icon={PencilLine} />
          <KpiCard title={text.kpis.approved} value={kpi(counts?.approved)} icon={CircleCheck} />
          <KpiCard title={text.kpis.rejected} value={kpi(counts?.rejected)} icon={CircleX} />
          <KpiCard
            title={text.kpis.withoutPdf}
            value={kpi(summary.data?.withoutPdf)}
            icon={FileWarning}
          />
          <KpiCard
            title={text.kpis.odooFailed}
            value={kpi(summary.data?.odooFailed)}
            icon={TriangleAlert}
          />
          <KpiCard
            title={text.kpis.pendingTotal}
            value={summary.data ? formatCop(Number(summary.data.pendingTotal)) : '—'}
            icon={Wallet}
            className="col-span-2"
          />
        </section>

        {settings.data && !odooReady && canDecide && (
          <Card className="flex items-center gap-2 border-tb-amarillo p-3 text-sm">
            <Clock aria-hidden="true" className="size-4 shrink-0" />
            {text.odoo.notConfigured}
          </Card>
        )}

        <div role="status" aria-live="polite">
          {notice && (
            <Card
              className={`p-3 text-sm ${notice.tone === 'error' ? 'border-tb-error' : notice.tone === 'warning' ? 'border-tb-amarillo' : 'border-tb-verde'}`}
            >
              {notice.message}
            </Card>
          )}
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList aria-label={text.filters.label}>
            {RECEIVED_DOCUMENT_STATUSES.map((status) => (
              <TabsTrigger key={status} value={status}>
                {`${text.statuses[status]} (${counts?.[status] ?? 0})`}
              </TabsTrigger>
            ))}
            <TabsTrigger value="all">{text.filters.all}</TabsTrigger>
          </TabsList>
        </Tabs>

        <DataTable
          caption={text.table.caption}
          columns={columns}
          data={documents}
          loading={list.isPending}
          getRowId={(document) => document.id}
          emptyState={
            <EmptyState
              icon={Inbox}
              title={text.table.empty}
              description={text.table.emptyDescription}
            />
          }
        />
        {list.hasNextPage && (
          <Button
            variant="secondary"
            className="self-center"
            disabled={list.isFetchingNextPage}
            onClick={() => list.fetchNextPage()}
          >
            {text.table.loadMore}
          </Button>
        )}
      </Workspace>

      <ContextPanel routeKey={`documents/invoices/${selected?.id ?? 'none'}`}>
        {selected ? (
          <InvoiceDetail document={selected} />
        ) : (
          <Card className="p-4 text-sm">{text.detail.empty}</Card>
        )}
      </ContextPanel>

      <RejectDialog
        invoice={rejecting ? invoiceLabel(rejecting) : null}
        pending={decide.isPending}
        onClose={() => setRejecting(null)}
        onConfirm={(rejectionCode, reason) =>
          rejecting &&
          decide.mutate({ id: rejecting.id, decision: 'rejected', rejectionCode, reason })
        }
      />
    </>
  );
}
