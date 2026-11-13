import type {
  InvoiceValidationStatus,
  RadianEvent,
  RadianStatus,
  ReceivedDocument,
} from '@telcobras/contracts';
import { type Status, StatusBadge } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';

const text = t.datadian;

const RADIAN_TONE: Record<RadianStatus, Status> = {
  none: 'neutral',
  acknowledged: 'info',
  goods_received: 'warning',
  claimed: 'error',
  accepted_express: 'ok',
  accepted_tacit: 'ok',
};

const VALIDATION_TONE: Record<InvoiceValidationStatus, Status> = {
  pending_xml: 'neutral',
  pending_validation: 'info',
  valid: 'ok',
  invalid: 'error',
};

/** Estado RADIAN de la factura: icono y texto, nunca solo color. */
export function RadianStatusBadge({ status }: { status: RadianStatus }) {
  return <StatusBadge status={RADIAN_TONE[status]}>{text.radianStatuses[status]}</StatusBadge>;
}

export function ValidationBadge({
  status,
  errors,
}: {
  status: InvoiceValidationStatus;
  errors?: readonly { code: string; message: string }[];
}) {
  const reason = errors?.map((error) => text.viewer.validationCodes[error.code] ?? error.message);
  return (
    <StatusBadge status={VALIDATION_TONE[status]} title={reason?.join(' ')}>
      {text.validationStatuses[status]}
      {reason && reason.length > 0 && <span className="sr-only">: {reason.join(' ')}</span>}
    </StatusBadge>
  );
}

/** Estado de un evento de la línea de tiempo; "Enviando" si ya salió y sigue pendiente. */
export function EventStatusBadge({ event }: { event: Pick<RadianEvent, 'status' | 'sentAt'> }) {
  if (event.status === 'pending') {
    return (
      <StatusBadge status="info">
        {event.sentAt ? text.eventStatuses.sending : text.eventStatuses.pending}
      </StatusBadge>
    );
  }
  const tone: Status = event.status === 'accepted' ? 'ok' : 'error';
  return <StatusBadge status={tone}>{text.eventStatuses[event.status]}</StatusBadge>;
}

const STATUS_TONE: Record<ReceivedDocument['status'], Status> = {
  imported: 'info',
  draft: 'warning',
  approved: 'ok',
  rejected: 'error',
};

const ODOO_TONE: Record<NonNullable<ReceivedDocument['odoo']>['status'], Status> = {
  pending: 'neutral',
  sent: 'ok',
  failed: 'error',
};

/** Decisión interna heredada y, si se aprobó, el estado de su envío a Odoo. */
export function LegacyStatus({
  document,
}: {
  document: Pick<ReceivedDocument, 'status' | 'odoo'>;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <StatusBadge status={STATUS_TONE[document.status]}>
        {text.statuses[document.status]}
      </StatusBadge>
      {document.odoo && (
        <StatusBadge status={ODOO_TONE[document.odoo.status]}>
          {text.odoo[document.odoo.status]}
        </StatusBadge>
      )}
    </div>
  );
}
