import { useQuery } from '@tanstack/react-query';
import type { RadianInvoice } from '@telcobras/contracts';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@telcobras/ui';
import { CircleCheck, CircleX, PencilLine, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { useLegacyDecision, useLegacyOdooRetry } from '../api/mutations';
import { historyQuery, invoiceLabel } from '../api/queries';
import { LegacyStatus } from '../shared/badges';
import { datadianErrorMessage } from '../shared/errors';
import { formatDateTime } from '../shared/format';
import { LegacyRejectDialog } from './legacy-reject-dialog';

const text = t.datadian;

/**
 * Tarjeta secundaria "Contabilidad (Odoo)" (§10, decisión 8): la decisión interna heredada y el
 * reintento a Odoo siguen funcionando con `documents:decide` hasta que la Etapa 5 los relacione con
 * el 033. No es un evento ante la DIAN.
 */
export function LegacyDecisionCard({
  invoice,
  canDecide,
  odooReady,
  onNotice,
}: {
  invoice: RadianInvoice;
  canDecide: boolean;
  odooReady: boolean;
  onNotice: (message: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const decide = useLegacyDecision(invoice.id);
  const retry = useLegacyOdooRetry(invoice.id);
  const history = useQuery(historyQuery(invoice.id));
  const label = invoiceLabel(invoice);
  const busy = decide.isPending || retry.isPending;
  const open = invoice.status === 'imported' || invoice.status === 'draft';

  const onError = (error: unknown) => onNotice(datadianErrorMessage(error));
  const onDecided = (document: { status: string; odoo: { status: string } | null }) => {
    if (document.status === 'approved') {
      onNotice(
        document.odoo?.status === 'sent'
          ? text.legacyActions.approved(label)
          : text.legacyActions.approvedWithError(label),
      );
    } else if (document.status === 'draft') onNotice(text.legacyActions.drafted(label));
    else onNotice(text.legacyActions.rejected(label));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle asChild>
          <h3>{text.legacy.title}</h3>
        </CardTitle>
        <CardDescription>{text.legacy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <LegacyStatus document={invoice} />
        {invoice.rejectionCode && (
          <p>
            <span className="font-medium">{text.detail.rejectionCode}: </span>
            {text.rejectionCodes[invoice.rejectionCode]}
          </p>
        )}
        {invoice.decisionReason && (
          <p>
            <span className="font-medium">{text.detail.note}: </span>
            {invoice.decisionReason}
          </p>
        )}
        {invoice.odoo?.moveId != null && <p>{text.detail.odooMove(invoice.odoo.moveId)}</p>}
        {invoice.odoo?.error && <p className="text-tb-error">{invoice.odoo.error}</p>}

        {canDecide && open && (
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              disabled={busy || !odooReady}
              title={odooReady ? undefined : text.legacyActions.approveNeedsOdoo}
              onClick={() =>
                decide.mutate({ decision: 'approved' }, { onSuccess: onDecided, onError })
              }
            >
              <CircleCheck aria-hidden="true" />
              {text.legacyActions.approve}
            </Button>
            {invoice.status === 'imported' && (
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() =>
                  decide.mutate({ decision: 'draft' }, { onSuccess: onDecided, onError })
                }
              >
                <PencilLine aria-hidden="true" />
                {text.legacyActions.draft}
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() => setRejecting(true)}
            >
              <CircleX aria-hidden="true" />
              {text.legacyActions.reject}
            </Button>
          </div>
        )}
        {canDecide && !odooReady && open && <p className="text-xs">{text.odoo.notConfigured}</p>}
        {canDecide && invoice.status === 'approved' && invoice.odoo?.status !== 'sent' && (
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => retry.mutate(undefined, { onSuccess: onDecided, onError })}
          >
            <RotateCw aria-hidden="true" />
            {text.legacyActions.retry}
          </Button>
        )}

        <div className="space-y-1 border-tb-gris/30 border-t pt-3">
          <p className="font-medium">{text.detail.historyTitle}</p>
          {history.data && history.data.length > 0 ? (
            <ol className="space-y-1 text-xs">
              {history.data.map((entry) => (
                <li key={entry.id}>
                  {text.history[entry.action] ?? entry.action}
                  {entry.result !== 'success' && ` (${text.detail.historyFailed})`} ·{' '}
                  <time dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs">{text.detail.historyEmpty}</p>
          )}
        </div>
      </CardContent>

      <LegacyRejectDialog
        invoice={rejecting ? label : null}
        pending={decide.isPending}
        onClose={() => setRejecting(false)}
        onConfirm={(rejectionCode, reason) =>
          decide.mutate(
            { decision: 'rejected', rejectionCode, reason },
            {
              onSuccess: (document) => {
                setRejecting(false);
                onDecided(document);
              },
              onError,
            },
          )
        }
      />
    </Card>
  );
}
