import type { ReceivedDocument } from '@telcobras/contracts';
import { type Status, StatusBadge } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';

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

/** Estado interno de la factura y, si se aprobó, el estado de su envío a Odoo. */
export function DocumentStatus({ document }: { document: ReceivedDocument }) {
  return (
    <div className="flex flex-wrap gap-1">
      <StatusBadge status={STATUS_TONE[document.status]}>
        {t.datadian.statuses[document.status]}
      </StatusBadge>
      {document.odoo && document.odoo.status !== 'sent' && (
        <StatusBadge status={ODOO_TONE[document.odoo.status]}>
          {t.datadian.odoo[document.odoo.status]}
        </StatusBadge>
      )}
    </div>
  );
}

export function OdooStatus({ odoo }: { odoo: NonNullable<ReceivedDocument['odoo']> }) {
  return <StatusBadge status={ODOO_TONE[odoo.status]}>{t.datadian.odoo[odoo.status]}</StatusBadge>;
}
