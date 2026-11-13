import { useQuery } from '@tanstack/react-query';
import type { RadianInvoiceDetail } from '@telcobras/contracts';
import { Card, CardContent, Skeleton } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { formatDate } from '@/lib/format-co';
import { RadianActionsPanel } from '../actions/radian-actions';
import { eventsQuery, healthQuery, rulesQuery, settingsQuery } from '../api/queries';
import { DeadlineLight } from '../shared/deadline';
import { useDatadianPermissions } from '../shared/permissions';
import { LegacyDecisionCard } from './legacy-decision';
import { RadianTimeline } from './timeline';

const text = t.datadian;

/**
 * Zona 3 de la vista dividida (§5.2.2): semáforo del plazo, botones de eventos, línea de tiempo,
 * datos clave y, aparte, la decisión interna heredada con Odoo.
 */
export function InvoiceContext({
  invoice,
  onNotice,
}: {
  invoice: RadianInvoiceDetail;
  onNotice: (message: string) => void;
}) {
  const permissions = useDatadianPermissions();
  const events = useQuery(eventsQuery(invoice.id));
  const rules = useQuery(rulesQuery);
  const settings = useQuery(settingsQuery);
  const health = useQuery(healthQuery);

  const dian = settings.data?.dian ?? null;
  const certificateValid =
    Boolean(dian?.activeCertificateId) && health.data?.certificate.expiryState !== 'expired';

  return (
    <>
      <Card>
        <CardContent className="space-y-5 pt-5">
          <DeadlineLight
            status={invoice.radianStatus}
            deadline={invoice.deadline}
            businessDays={rules.data?.deadline.businessDays}
          />
          {rules.data && settings.data ? (
            <RadianActionsPanel
              invoice={invoice}
              events={events.data}
              rules={rules.data}
              settings={dian}
              certificateValid={certificateValid}
              canRequestEvents={permissions.canRequestEvents}
              onNotice={onNotice}
            />
          ) : (
            <Skeleton className="h-16 w-full" />
          )}
          <RadianTimeline events={events.data} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <h3 className="mb-2 font-semibold text-sm">{text.timeline.keyData}</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="font-medium">{text.viewer.paymentForm}</dt>
            <dd>{invoice.paymentForm ? text.paymentForms[invoice.paymentForm] : '—'}</dd>
            <dt className="font-medium">{text.viewer.dueDate}</dt>
            <dd>{invoice.dueDate ? formatDate(`${invoice.dueDate}T12:00:00-05:00`) : '—'}</dd>
            <dt className="font-medium">{text.timeline.environment}</dt>
            <dd>
              {invoice.profileExecutionId ? text.environments[invoice.profileExecutionId] : '—'}
            </dd>
            <dt className="font-medium">{text.timeline.source}</dt>
            <dd>{text.channels[invoice.ingestionSource]}</dd>
          </dl>
        </CardContent>
      </Card>

      <LegacyDecisionCard
        invoice={invoice}
        canDecide={permissions.canDecide}
        odooReady={Boolean(settings.data?.odoo)}
        onNotice={onNotice}
      />
    </>
  );
}
