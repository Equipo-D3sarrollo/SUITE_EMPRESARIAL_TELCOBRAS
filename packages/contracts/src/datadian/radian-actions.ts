import type {
  DeadlineState,
  DianEnvironment,
  InvoiceValidationStatus,
  PaymentForm,
  RadianEventCode,
} from '../schemas/datadian-records.js';
import type { RadianEventRule, RequestableEventCode } from './api-schemas.js';

/**
 * Máquina de estados de los botones RADIAN (§5.3). Función pura: la usan la interfaz, los mocks y,
 * en la Etapa 4, la API. No escribe la secuencia a mano: la deriva de `requires`, `blocked_by` y
 * `terminal` de las reglas (`GET /radian/rules`), así que cambiar una regla no cambia código.
 */

export type RadianUiState = 'blocked' | 'new' | 'acknowledged' | 'goods_received' | 'terminal';

export type DisabledReason =
  | 'no_permission'
  | 'event_in_progress'
  | 'xml_not_valid'
  | 'environment_mismatch'
  | 'certificate_missing'
  | 'software_missing'
  | 'deadline_expired'
  | 'cash_invoice'
  | 'terminal'
  | 'requires_previous'
  | 'blocked_by_other';

export type RadianActionWarning =
  | 'cash_invoice'
  | 'rule_unverified'
  | 'deadline_due_soon'
  | 'deadline_expired';

export type RadianButtonTone = 'info' | 'accent' | 'primary' | 'destructive';

export interface RadianActionsOptions {
  /** Decisión 5: al vencer el plazo sin 031 ni 033, la factura queda terminal (blueprint, Estado 4). */
  expiryIsTerminal: boolean;
  /** Decisión 6: qué hacer con las facturas de contado mientras se verifica el punto 8. */
  cashInvoices: 'allow' | 'warn' | 'block';
}

export const DEFAULT_RADIAN_ACTIONS_OPTIONS: RadianActionsOptions = {
  expiryIsTerminal: true,
  cashInvoices: 'warn',
};

export interface RadianActionsInput {
  validationStatus: InvoiceValidationStatus;
  invoiceEnvironment: DianEnvironment | null;
  configuredEnvironment: DianEnvironment;
  paymentForm: PaymentForm | null;
  /** Eventos aceptados del ambiente configurado, de ambos orígenes (suite y DIAN). */
  acceptedCodes: readonly RadianEventCode[];
  pendingEvent: { eventCode: RequestableEventCode } | null;
  deadlineState: DeadlineState;
  rules: readonly RadianEventRule[];
  readiness: { certificateValid: boolean; softwareConfigured: boolean };
  canRequestEvents: boolean;
  options?: RadianActionsOptions;
}

export interface RadianActionButton {
  code: RequestableEventCode;
  visible: boolean;
  enabled: boolean;
  reason?: DisabledReason;
  tone: RadianButtonTone;
}

export interface RadianActions {
  /** 'new' = Estado 1, 'acknowledged' = 2, 'goods_received' = 3, 'terminal' = 4. */
  state: RadianUiState;
  /** Hay un evento `pending`. */
  busy: boolean;
  /** Por qué la factura está bloqueada (solo con `state = 'blocked'`). */
  blockedReason?: 'xml_not_valid' | 'environment_mismatch';
  /** Qué dejó la factura en estado terminal: el código aceptado o el plazo vencido. */
  terminalCause?: RadianEventCode | 'deadline_expired';
  buttons: readonly RadianActionButton[];
  warnings: readonly RadianActionWarning[];
}

/** Orden de los botones en pantalla: el camino del blueprint (030 → 032 → 033 / 031). */
const BUTTON_ORDER: readonly RequestableEventCode[] = ['030', '032', '033', '031'];

export const RADIAN_BUTTON_TONES: Readonly<Record<RequestableEventCode, RadianButtonTone>> = {
  '030': 'info',
  '032': 'accent',
  '033': 'primary',
  '031': 'destructive',
};

// Si hay varios terminales aceptados (no debería), manda el de mayor precedencia.
const TERMINAL_PRECEDENCE: readonly RadianEventCode[] = ['034', '033', '031', '032', '030'];

/**
 * Reglas semilla de `radian_event_rules` (Etapa 2, §6.1), **sin verificar**. Sirven a los mocks y a
 * las pruebas; la interfaz real usa las de `GET /radian/rules`.
 */
export const SEED_RADIAN_EVENT_RULES: readonly RadianEventRule[] = [
  {
    eventCode: '030',
    name: 'Acuse de recibo de la factura electrónica de venta',
    actor: 'buyer',
    requires: [],
    blockedBy: [],
    terminal: false,
    claimCodeRequired: false,
    enforceClaimDeadline: false,
    verified: false,
    source: 'Blueprint DataDian §6.3 (por verificar contra el anexo técnico T5.1)',
  },
  {
    eventCode: '032',
    name: 'Recibo del bien o prestación del servicio',
    actor: 'buyer',
    requires: ['030'],
    blockedBy: [],
    terminal: false,
    claimCodeRequired: false,
    enforceClaimDeadline: false,
    verified: false,
    source: 'Blueprint DataDian §6.3 (por verificar contra el anexo técnico T5.1)',
  },
  {
    eventCode: '033',
    name: 'Aceptación expresa',
    actor: 'buyer',
    requires: ['032'],
    blockedBy: ['031', '034'],
    terminal: true,
    claimCodeRequired: false,
    enforceClaimDeadline: false,
    verified: false,
    source: 'Blueprint DataDian §6.3 (por verificar contra el anexo técnico T5.1)',
  },
  {
    eventCode: '031',
    name: 'Reclamo de la factura electrónica de venta',
    actor: 'buyer',
    requires: ['032'],
    blockedBy: ['033', '034'],
    terminal: true,
    claimCodeRequired: true,
    enforceClaimDeadline: false,
    verified: false,
    source: 'Blueprint DataDian §6.3; [POR VERIFICAR 5] si basta el 030',
  },
  {
    eventCode: '034',
    name: 'Aceptación tácita',
    actor: 'issuer',
    requires: ['032'],
    blockedBy: ['031', '033'],
    terminal: true,
    claimCodeRequired: false,
    enforceClaimDeadline: false,
    verified: false,
    source: 'Blueprint DataDian §6.3 (lo registra el emisor)',
  },
];

/** Deriva el estado visible y los botones de una factura a partir de sus eventos y de las reglas. */
export function deriveRadianActions(input: RadianActionsInput): RadianActions {
  const options = input.options ?? DEFAULT_RADIAN_ACTIONS_OPTIONS;
  const busy = input.pendingEvent !== null;

  // 1. Sin XML válido o de otro ambiente: bloqueada, sin botones.
  if (input.validationStatus !== 'valid') {
    return { state: 'blocked', busy, blockedReason: 'xml_not_valid', buttons: [], warnings: [] };
  }
  if (input.invoiceEnvironment !== input.configuredEnvironment) {
    return {
      state: 'blocked',
      busy,
      blockedReason: 'environment_mismatch',
      buttons: [],
      warnings: [],
    };
  }

  const accepted = new Set(input.acceptedCodes);
  const rules = new Map(input.rules.map((rule) => [rule.eventCode, rule]));

  // 2. Un evento terminal aceptado (031, 033 o 034 con la semilla) cierra la factura.
  const terminalCode = TERMINAL_PRECEDENCE.find(
    (code) => accepted.has(code) && rules.get(code)?.terminal,
  );
  if (terminalCode) {
    return { state: 'terminal', busy, terminalCause: terminalCode, buttons: [], warnings: [] };
  }

  // 3. Plazo vencido sin decisión: terminal si así se decidió (Estado 4 del blueprint).
  const expired = input.deadlineState === 'expired' && !accepted.has('031') && !accepted.has('033');
  if (expired && options.expiryIsTerminal) {
    return {
      state: 'terminal',
      busy,
      terminalCause: 'deadline_expired',
      buttons: [],
      warnings: [],
    };
  }

  // 4. Candidatos: pedibles, no aceptados, con sus requisitos aceptados y sin bloqueos.
  const candidates = BUTTON_ORDER.filter((code) => {
    const rule = rules.get(code);
    if (!rule || accepted.has(code)) return false;
    return (
      rule.requires.every((required) => accepted.has(required)) &&
      !rule.blockedBy.some((blocker) => accepted.has(blocker))
    );
  });

  // 5. Estado visible: el último código aceptado del camino principal.
  const state: RadianUiState = accepted.has('032')
    ? 'goods_received'
    : accepted.has('030')
      ? 'acknowledged'
      : 'new';

  const isCash = input.paymentForm === '1';
  const warnings = new Set<RadianActionWarning>();
  if (isCash && options.cashInvoices !== 'allow') warnings.add('cash_invoice');
  if (input.deadlineState === 'due_soon') warnings.add('deadline_due_soon');
  if (expired) warnings.add('deadline_expired');
  if (candidates.some((code) => rules.get(code)?.verified === false)) {
    warnings.add('rule_unverified');
  }

  // 6. Botones visibles; inactivos con su motivo cuando algo lo impide.
  const buttons = candidates.map((code): RadianActionButton => {
    const tone = RADIAN_BUTTON_TONES[code];
    if (!input.canRequestEvents) {
      return { code, visible: false, enabled: false, reason: 'no_permission', tone };
    }
    let reason: DisabledReason | undefined;
    if (busy) reason = 'event_in_progress';
    else if (!input.readiness.certificateValid) reason = 'certificate_missing';
    else if (!input.readiness.softwareConfigured) reason = 'software_missing';
    else if (isCash && options.cashInvoices === 'block') reason = 'cash_invoice';
    else if (expired && rules.get(code)?.enforceClaimDeadline) reason = 'deadline_expired';
    return reason
      ? { code, visible: true, enabled: false, reason, tone }
      : { code, visible: true, enabled: true, tone };
  });

  return { state, busy, buttons, warnings: [...warnings] };
}

/**
 * Motivo por el que la API rechazaría un evento (lo usan los mocks y, en la Etapa 4, la API antes de
 * insertar). Devuelve null si el evento es pedible ahora, con la misma lógica de la base de datos.
 */
export function radianSequenceViolation(
  code: RequestableEventCode,
  acceptedCodes: readonly RadianEventCode[],
  rules: readonly RadianEventRule[],
): 'DD001' | 'DD002' | 'DD003' | null {
  const accepted = new Set(acceptedCodes);
  const byCode = new Map(rules.map((rule) => [rule.eventCode, rule]));
  if ([...accepted].some((done) => byCode.get(done)?.terminal)) return 'DD003';
  const rule = byCode.get(code);
  if (!rule?.requires.every((required) => accepted.has(required))) return 'DD001';
  if (rule.blockedBy.some((blocker) => accepted.has(blocker))) return 'DD002';
  return null;
}
