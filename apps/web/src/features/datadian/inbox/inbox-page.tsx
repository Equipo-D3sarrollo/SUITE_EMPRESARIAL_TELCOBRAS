import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import type { RadianInvoice } from '@telcobras/contracts';
import {
  Badge,
  Button,
  Card,
  createDataTableColumns,
  DataTable,
  EmptyState,
  KpiCard,
  Skeleton,
} from '@telcobras/ui';
import {
  CalendarClock,
  CircleAlert,
  FileWarning,
  Inbox,
  PackageCheck,
  Scale,
  TimerOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { t } from '@/i18n/es-CO';
import { formatCop, formatDate, formatNit } from '@/lib/format-co';
import { moduleLabel, submoduleLabel } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import {
  invoiceLabel,
  invoiceQuery,
  invoicesQuery,
  settingsQuery,
  summaryQuery,
} from '../api/queries';
import { InvoiceContext } from '../invoice/invoice-context';
import { InvoiceViewer } from '../invoice/invoice-viewer';
import { RadianStatusBadge, ValidationBadge } from '../shared/badges';
import { CertificateBanner } from '../shared/certificate-banner';
import { DeadlineBadge } from '../shared/deadline';
import { MockBadge } from '../shared/mock-badge';
import { InboxFilters } from './filters';
import { type InboxSearch, toListFilters, useInboxSearch } from './search-params';

const text = t.datadian.inbox;
const issueDay = (value: string | null) => (value ? formatDate(`${value}T12:00:00-05:00`) : '—');

/**
 * Bandeja de recepción de DataDian (§5.1) y vista dividida (§5.2): sin `?invoice=` muestra cifras,
 * filtros y grilla; con `?invoice=` la Zona 2 pasa a ser el visor y la Zona 3 la línea de tiempo.
 */
export function InboxPage() {
  const { search, setSearch } = useInboxSearch();
  const [notice, setNotice] = useState<string | null>(null);
  const lastOpened = useRef<string | null>(null);

  const open = (id: string) => {
    lastOpened.current = id;
    setNotice(null);
    setSearch({ invoice: id, view: undefined });
  };

  return search.invoice ? (
    <InvoiceSplitView
      id={search.invoice}
      view={search.view}
      notice={notice}
      setNotice={setNotice}
      onViewChange={(view) => setSearch({ view }, { replace: true })}
      onBack={() => setSearch({ invoice: undefined, view: undefined })}
    />
  ) : (
    <InboxGrid
      search={search}
      setSearch={setSearch}
      onOpen={open}
      notice={notice}
      focusId={lastOpened.current}
    />
  );
}

function NoticeRegion({ notice }: { notice: string | null }) {
  return (
    <div role="status" aria-live="polite">
      {notice && <Card className="border-tb-azul p-3 text-sm">{notice}</Card>}
    </div>
  );
}

function InboxGrid({
  search,
  setSearch,
  onOpen,
  notice,
  focusId,
}: {
  search: InboxSearch;
  setSearch: ReturnType<typeof useInboxSearch>['setSearch'];
  onOpen: (id: string) => void;
  notice: string | null;
  focusId: string | null;
}) {
  const filters = toListFilters(search);
  const list = useInfiniteQuery(invoicesQuery(filters));
  const summary = useQuery(summaryQuery);
  const settings = useQuery(settingsQuery);
  const invoices = list.data?.pages.flatMap((page) => page.items);

  // Al volver de la vista dividida, el foco vuelve a la fila de la factura (§7).
  useEffect(() => {
    if (!focusId || !invoices) return;
    document.querySelector<HTMLElement>(`[data-invoice-id="${focusId}"]`)?.focus();
  }, [focusId, invoices]);

  const column = createDataTableColumns<RadianInvoice>();
  const columns = column.columns([
    column.display({
      id: 'nit',
      header: text.columns.nit,
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">
          {row.original.issuerNit ? formatNit(row.original.issuerNit) : '—'}
        </span>
      ),
    }),
    column.display({
      id: 'supplier',
      header: text.columns.supplier,
      cell: ({ row }) => <span className="block min-w-40">{row.original.issuerName ?? '—'}</span>,
    }),
    column.display({
      id: 'number',
      header: text.columns.number,
      cell: ({ row }) => (
        <button
          type="button"
          data-invoice-id={row.original.id}
          onClick={() => onOpen(row.original.id)}
          className="whitespace-nowrap font-semibold text-tb-azul underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-tb-azul"
        >
          {invoiceLabel(row.original) || '—'}
        </button>
      ),
    }),
    column.display({
      id: 'issueDate',
      header: text.columns.issueDate,
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">{issueDay(row.original.issueDate)}</span>
      ),
    }),
    column.display({
      id: 'total',
      header: () => <span className="block text-right">{text.columns.total}</span>,
      cell: ({ row }) => (
        <span className="block whitespace-nowrap text-right tabular-nums">
          {row.original.total === null ? '—' : formatCop(Number(row.original.total))}
        </span>
      ),
    }),
    column.display({
      id: 'radian',
      header: text.columns.radian,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <RadianStatusBadge status={row.original.radianStatus} />
          {row.original.pendingEvent && (
            <Badge>{text.sending(row.original.pendingEvent.eventCode)}</Badge>
          )}
        </div>
      ),
    }),
    column.display({
      id: 'deadline',
      header: text.columns.deadline,
      cell: ({ row }) => (
        <DeadlineBadge status={row.original.radianStatus} deadline={row.original.deadline} />
      ),
    }),
    column.display({
      id: 'xml',
      header: text.columns.xml,
      cell: ({ row }) => (
        <ValidationBadge
          status={row.original.validationStatus}
          errors={row.original.validationErrors}
        />
      ),
    }),
  ]);

  const counts = summary.data;
  const kpi = (value: number | undefined) => (value === undefined ? '—' : value);
  const quick = (label: string, patch: Parameters<typeof setSearch>[0]) => (
    <Button size="sm" variant="ghost" className="-mx-2" onClick={() => setSearch(patch)}>
      {t.datadian.inbox.kpis.quickFilter(label)}
    </Button>
  );
  const dueSoon = counts?.byDeadlineState.due_soon ?? 0;
  const noDian = settings.data && !settings.data.dian;

  return (
    <>
      <Workspace
        routeKey="documents/invoices"
        eyebrow={
          <span className="flex items-center gap-2">
            {moduleLabel('documents')}
            <MockBadge />
          </span>
        }
        title={submoduleLabel('documents', 'invoices')}
      >
        <CertificateBanner />
        {dueSoon > 0 && (
          <Card
            role="note"
            className="flex flex-wrap items-center gap-2 border-tb-amarillo p-3 text-sm"
          >
            <CalendarClock aria-hidden="true" className="size-4 shrink-0" />
            <span className="flex-1">{text.dueSoonBanner(dueSoon)}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSearch({ deadline: 'due_soon' })}
            >
              {text.showDueSoon}
            </Button>
          </Card>
        )}

        <section aria-label={text.caption} className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <KpiCard
            title={text.kpis.none}
            value={kpi(counts?.byRadianStatus.none)}
            icon={Inbox}
            footer={quick(text.kpis.none, { radian: ['none'], deadline: undefined })}
          />
          <KpiCard
            title={text.kpis.acknowledged}
            value={kpi(counts?.byRadianStatus.acknowledged)}
            icon={PackageCheck}
            footer={quick(text.kpis.acknowledged, {
              radian: ['acknowledged'],
              deadline: undefined,
            })}
          />
          <KpiCard
            title={text.kpis.goodsReceived}
            value={kpi(counts?.byRadianStatus.goods_received)}
            icon={Scale}
            footer={quick(text.kpis.goodsReceived, {
              radian: ['goods_received'],
              deadline: undefined,
            })}
          />
          <KpiCard
            title={text.kpis.dueSoon}
            value={kpi(counts?.byDeadlineState.due_soon)}
            icon={CalendarClock}
            footer={quick(text.kpis.dueSoon, { deadline: 'due_soon', radian: undefined })}
          />
          <KpiCard
            title={text.kpis.expired}
            value={kpi(counts?.expiredWithoutDecision)}
            icon={TimerOff}
            footer={quick(text.kpis.expired, { deadline: 'expired', radian: undefined })}
          />
          <KpiCard
            title={text.kpis.problems}
            value={kpi(counts?.withProblems)}
            icon={FileWarning}
            footer={quick(text.kpis.problems, { validation: 'invalid' })}
          />
        </section>

        <InboxFilters search={search} setSearch={setSearch} />
        <NoticeRegion notice={notice} />

        {list.isError ? (
          <Card className="flex items-center gap-3 border-tb-error p-4 text-sm">
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
            <span className="flex-1">{text.error}</span>
            <Button size="sm" variant="secondary" onClick={() => list.refetch()}>
              {t.common.retry}
            </Button>
          </Card>
        ) : (
          <DataTable
            caption={text.caption}
            columns={columns}
            data={invoices}
            loading={list.isPending}
            getRowId={(invoice) => invoice.id}
            emptyState={
              noDian ? (
                <EmptyState
                  icon={Inbox}
                  title={text.noDianSettings}
                  description={
                    <Link
                      to="/app/$module/$submodule"
                      params={{ module: 'documents', submodule: 'settings' }}
                      className="text-tb-azul underline"
                    >
                      {text.goToSettings}
                    </Link>
                  }
                />
              ) : (
                <EmptyState
                  icon={Inbox}
                  title={text.empty}
                  description={
                    <>
                      {text.emptyDescription(
                        issueDay(filters.from ?? null),
                        issueDay(filters.to ?? null),
                      )}{' '}
                      <Link
                        to="/app/$module/$submodule"
                        params={{ module: 'documents', submodule: 'sync' }}
                        className="text-tb-azul underline"
                      >
                        {text.goToSync}
                      </Link>
                    </>
                  }
                />
              )
            }
          />
        )}
        {list.hasNextPage && (
          <Button
            variant="secondary"
            className="self-center"
            disabled={list.isFetchingNextPage}
            onClick={() => list.fetchNextPage()}
          >
            {text.loadMore}
          </Button>
        )}
      </Workspace>

      <ContextPanel routeKey="documents/invoices/none">
        <Card className="space-y-2 p-4 text-sm">
          <h2 className="font-semibold">{text.help.title}</h2>
          <p>{text.help.body}</p>
          <p>{text.help.flow}</p>
        </Card>
      </ContextPanel>
    </>
  );
}

function InvoiceSplitView({
  id,
  view,
  notice,
  setNotice,
  onViewChange,
  onBack,
}: {
  id: string;
  view: InboxSearch['view'];
  notice: string | null;
  setNotice: (notice: string) => void;
  onViewChange: (view: InboxSearch['view']) => void;
  onBack: () => void;
}) {
  const invoice = useQuery(invoiceQuery(id));

  return (
    <>
      <Workspace
        routeKey={`documents/invoices/${id}`}
        eyebrow={
          <span className="flex items-center gap-2">
            {moduleLabel('documents')}
            <MockBadge />
          </span>
        }
        title={submoduleLabel('documents', 'invoices')}
      >
        <CertificateBanner />
        <NoticeRegion notice={notice} />
        {invoice.isPending ? (
          <Skeleton className="h-96 w-full" />
        ) : invoice.isError ? (
          <Card className="space-y-3 p-4 text-sm">
            <p>{t.datadian.viewer.loadError}</p>
            <Button size="sm" variant="secondary" onClick={onBack}>
              {t.datadian.viewer.back}
            </Button>
          </Card>
        ) : (
          <InvoiceViewer
            invoice={invoice.data}
            view={view}
            onViewChange={onViewChange}
            onBack={onBack}
          />
        )}
      </Workspace>
      <ContextPanel routeKey={`documents/invoices/${id}`}>
        {invoice.data ? (
          <InvoiceContext invoice={invoice.data} onNotice={setNotice} />
        ) : (
          <Skeleton className="h-64 w-full" />
        )}
      </ContextPanel>
    </>
  );
}
