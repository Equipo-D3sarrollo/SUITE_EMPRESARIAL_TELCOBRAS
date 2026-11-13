import {
  type ClaimCode,
  DEFAULT_RADIAN_ACTIONS_OPTIONS,
  type DianSettings,
  deriveRadianActions,
  type RadianActionButton,
  type RadianEvent,
  type RadianEventRequest,
  type RadianInvoice,
  type RadianRules,
  type RequestableEventCode,
} from '@telcobras/contracts';
import { Button } from '@telcobras/ui';
import {
  CircleCheckBig,
  FileCheck2,
  Info,
  LoaderCircle,
  MessageSquareWarning,
  PackageCheck,
} from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';
import { t } from '@/i18n/es-CO';
import { formatCop } from '@/lib/format-co';
import { newIntentKey, useRequestEvent } from '../api/mutations';
import { invoiceLabel } from '../api/queries';
import { datadianErrorMessage } from '../shared/errors';
import { formatDateTime } from '../shared/format';
import { ClaimDialog } from './claim-dialog';
import { ConfirmEventDialog } from './confirm-event-dialog';

const text = t.datadian;

const ICONS = {
  '030': FileCheck2,
  '032': PackageCheck,
  '033': CircleCheckBig,
  '031': MessageSquareWarning,
} satisfies Record<RequestableEventCode, unknown>;

export type RadianActionsPanelProps = {
  invoice: RadianInvoice;
  /** Línea de tiempo, para fechar el estado terminal. */
  events: readonly RadianEvent[] | undefined;
  rules: RadianRules;
  settings: DianSettings | null;
  certificateValid: boolean;
  canRequestEvents: boolean;
  /** Avisa el resultado a la región `role="status"` de la página. */
  onNotice: (message: string) => void;
};

type Intent = { code: RequestableEventCode; key: string } | null;

/**
 * Botones de eventos RADIAN según `deriveRadianActions` (§5.3): Estado 1 solo 030; Estado 2 solo 032;
 * Estado 3 033 y 031; terminal sin botones. Un botón bloqueado se muestra inactivo con su motivo
 * escrito y asociado con `aria-describedby`; sin permiso, no se muestra.
 */
export function RadianActionsPanel({
  invoice,
  events,
  rules,
  settings,
  certificateValid,
  canRequestEvents,
  onNotice,
}: RadianActionsPanelProps) {
  const reasonId = useId();
  const [intent, setIntent] = useState<Intent>(null);
  const request = useRequestEvent(invoice.id);

  const actions = deriveRadianActions({
    validationStatus: invoice.validationStatus,
    invoiceEnvironment: invoice.profileExecutionId,
    configuredEnvironment: settings?.environment ?? '2',
    paymentForm: invoice.paymentForm,
    acceptedCodes: invoice.acceptedEventCodes,
    pendingEvent: invoice.pendingEvent,
    deadlineState: invoice.deadline.state,
    rules: rules.events,
    readiness: {
      certificateValid,
      softwareConfigured: Boolean(settings?.softwareId && settings.softwarePinSet),
    },
    canRequestEvents,
    options: DEFAULT_RADIAN_ACTIONS_OPTIONS,
  });

  const label = invoiceLabel(invoice);
  const summary = text.confirm.summary(
    invoice.issuerName ?? '—',
    label,
    invoice.total === null ? '—' : formatCop(Number(invoice.total)),
  );

  const open = (code: RequestableEventCode) => {
    request.reset();
    // Una llave por intención: cerrar y volver a abrir genera otra.
    setIntent({ code, key: newIntentKey() });
  };
  const close = () => setIntent(null);

  const send = (body: RadianEventRequest) => {
    if (!intent) return;
    request.mutate(
      { request: body, idempotencyKey: intent.key },
      {
        onSuccess: (event) => {
          setIntent(null);
          onNotice(text.actions.requested(event.eventCode, label));
        },
      },
    );
  };

  const errorText = request.isError ? datadianErrorMessage(request.error) : null;

  let status: ReactNode = null;
  if (actions.state === 'blocked' && actions.blockedReason) {
    status = <p className="text-sm">{text.actions.blocked[actions.blockedReason]}</p>;
  } else if (actions.state === 'terminal' && actions.terminalCause) {
    const cause = actions.terminalCause;
    if (cause === 'deadline_expired') {
      status = <p className="text-sm">{text.actions.terminal.deadline_expired}</p>;
    } else {
      const event = events?.find((item) => item.eventCode === cause && item.status === 'accepted');
      const date = event?.dianRegisteredAt ?? invoice.radianStatusAt;
      status = (
        <p className="font-medium text-sm">
          {text.actions.terminal[cause](date ? formatDateTime(date) : '—')}
        </p>
      );
    }
  }

  const visible = actions.buttons.filter((button) => button.visible);

  return (
    <section aria-labelledby="radian-actions-title" className="space-y-3">
      <h3 id="radian-actions-title" className="font-semibold text-sm">
        {text.actions.title}
      </h3>
      {status}
      {!canRequestEvents && actions.state !== 'blocked' && actions.state !== 'terminal' && (
        <p className="flex items-center gap-1.5 text-sm">
          <Info aria-hidden="true" className="size-4 shrink-0" />
          {text.timeline.readOnly}
        </p>
      )}
      {invoice.pendingEvent && (
        <p className="flex items-center gap-1.5 font-medium text-sm" role="status">
          <LoaderCircle aria-hidden="true" className="size-4 shrink-0 motion-safe:animate-spin" />
          {text.actions.sending(invoice.pendingEvent.eventCode)}
        </p>
      )}
      {visible.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visible.map((button) => (
            <ActionButton
              key={button.code}
              button={button}
              reasonId={`${reasonId}-${button.code}`}
              pending={request.isPending}
              onClick={() => open(button.code)}
            />
          ))}
        </div>
      )}
      {visible.map(
        (button) =>
          button.reason && (
            <p key={button.code} id={`${reasonId}-${button.code}`} className="text-xs">
              {text.disabledReasons[button.reason]}
            </p>
          ),
      )}
      {actions.warnings.length > 0 && (
        <ul className="space-y-1 text-xs">
          {actions.warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-1.5">
              <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              {text.warnings[warning]}
            </li>
          ))}
        </ul>
      )}

      <ConfirmEventDialog
        code={intent && intent.code !== '031' ? intent.code : null}
        summary={summary}
        pending={request.isPending}
        error={errorText}
        variant={intent?.code === '030' ? 'info' : intent?.code === '032' ? 'accent' : 'primary'}
        onClose={close}
        onConfirm={() =>
          intent && intent.code !== '031' && send({ eventCode: intent.code } as RadianEventRequest)
        }
      />
      <ClaimDialog
        open={intent?.code === '031'}
        invoice={label}
        deadline={invoice.deadline}
        pending={request.isPending}
        error={errorText}
        onClose={close}
        onConfirm={(claimCode: ClaimCode, claimNote) =>
          send({ eventCode: '031', claimCode, ...(claimNote ? { claimNote } : {}) })
        }
      />
    </section>
  );
}

function ActionButton({
  button,
  reasonId,
  pending,
  onClick,
}: {
  button: RadianActionButton;
  reasonId: string;
  pending: boolean;
  onClick: () => void;
}) {
  const Icon = ICONS[button.code];
  const inactive = !button.enabled || pending;
  return (
    <Button
      variant={button.tone}
      aria-disabled={inactive || undefined}
      aria-describedby={button.reason ? reasonId : undefined}
      onClick={() => {
        if (!inactive) onClick();
      }}
    >
      <Icon aria-hidden="true" />
      {t.datadian.eventButtons[button.code]}
    </Button>
  );
}
