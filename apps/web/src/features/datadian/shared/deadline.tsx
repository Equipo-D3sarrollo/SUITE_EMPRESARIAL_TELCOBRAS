import type { RadianDeadline, RadianStatus } from '@telcobras/contracts';
import { type Status, StatusBadge } from '@telcobras/ui';
import { useEffect, useState } from 'react';
import { t } from '@/i18n/es-CO';
import { formatDeadline } from './format';

const text = t.datadian.deadline;

const TONE: Record<RadianDeadline['state'], Status> = {
  none: 'neutral',
  open: 'ok',
  due_soon: 'warning',
  expired: 'error',
};

/** El plazo solo corre desde el 032 (§5.5): con otro estado RADIAN no hay semáforo. */
const appliesTo = (status: RadianStatus, deadline: RadianDeadline) =>
  status === 'goods_received' && deadline.state !== 'none' && deadline.claimDeadlineAt !== null;

/** Semáforo compacto para la grilla. */
export function DeadlineBadge({
  status,
  deadline,
}: {
  status: RadianStatus;
  deadline: RadianDeadline;
}) {
  if (!appliesTo(status, deadline)) return <span aria-hidden="true">—</span>;
  const label =
    deadline.state === 'open'
      ? text.badge.open(deadline.businessDaysRemaining ?? 0)
      : deadline.state === 'due_soon'
        ? text.badge.due_soon
        : text.badge.expired;
  return <StatusBadge status={TONE[deadline.state]}>{label}</StatusBadge>;
}

/** Cuenta regresiva en horas y minutos, actualizada cada minuto (no cada segundo). */
function useMinutesLeft(target: string | null): number | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [target]);
  if (!target) return null;
  return Math.max(0, Math.floor((new Date(target).getTime() - now) / 60_000));
}

/**
 * Semáforo completo de la Zona 3. Los días hábiles los calcula el servidor con el calendario de la
 * base de datos: la interfaz no cuenta días.
 */
export function DeadlineLight({
  status,
  deadline,
  businessDays,
}: {
  status: RadianStatus;
  deadline: RadianDeadline;
  /** Días hábiles de la regla vigente (de GET /radian/rules). */
  businessDays: number | undefined;
}) {
  const minutesLeft = useMinutesLeft(
    deadline.state === 'due_soon' ? deadline.claimDeadlineAt : null,
  );
  if (!appliesTo(status, deadline) || !deadline.claimDeadlineAt) return null;

  const date = formatDeadline(deadline.claimDeadlineAt);
  const message =
    deadline.state === 'open'
      ? text.open(deadline.businessDaysRemaining ?? 0, date)
      : deadline.state === 'due_soon'
        ? text.dueSoon(date)
        : text.expired(date);

  return (
    <section aria-labelledby="deadline-title" className="space-y-2">
      <h3 id="deadline-title" className="font-semibold text-sm">
        {text.title}
      </h3>
      <StatusBadge status={TONE[deadline.state]} className="h-auto whitespace-normal py-1">
        {message}
      </StatusBadge>
      {minutesLeft !== null && (
        <p className="font-medium text-sm tabular-nums">
          {text.countdown(Math.floor(minutesLeft / 60), minutesLeft % 60)}
        </p>
      )}
      {businessDays !== undefined && (
        <p className="text-xs">{text.rule(businessDays, deadline.ruleVersion)}</p>
      )}
      {!deadline.ruleVerified && <p className="text-xs italic">{text.unverified}</p>}
      <time dateTime={deadline.claimDeadlineAt} className="sr-only">
        {deadline.claimDeadlineAt}
      </time>
    </section>
  );
}
