// Convenciones de base de datos de DataDian compartidas por la API, Telco y las pruebas
// (docs/modules/documents/ARQUITECTURA_DB_DATADIAN.md §7.1 y §7.7).

/**
 * SQLSTATE propios de la clase `DD` que levantan las funciones y los disparadores de DataDian.
 * Las migraciones los escriben como literales (`RAISE ... USING ERRCODE = 'DD006'`); este es el único
 * catálogo: la API los traduce a problem details por el código, sin leer el texto del error.
 */
export const DATADIAN_SQLSTATE = {
  /** Evento fuera de secuencia: falta un evento previo aceptado. */
  eventOutOfSequence: 'DD001',
  /** Evento bloqueado por otro ya aceptado (por ejemplo, 034 contra 031 o 033). */
  eventBlocked: 'DD002',
  /** La factura está en estado terminal. */
  invoiceTerminal: 'DD003',
  /** Transición de estado no permitida. */
  transitionNotAllowed: 'DD004',
  /** Dato inmutable. */
  immutableData: 'DD005',
  /** El calendario de festivos no cubre el año pedido. */
  calendarNotCovered: 'DD006',
  /** La factura no tiene XML válido. */
  invoiceWithoutValidXml: 'DD007',
  /** Ambiente distinto al configurado. */
  environmentMismatch: 'DD008',
  /** Plazo de reclamo vencido (solo si la regla lo hace obligatorio). */
  claimDeadlineExpired: 'DD009',
  /** Certificado activo inválido o de otro NIT. */
  invalidActiveCertificate: 'DD010',
} as const;

export type DatadianSqlStateName = keyof typeof DATADIAN_SQLSTATE;
export type DatadianSqlState = (typeof DATADIAN_SQLSTATE)[DatadianSqlStateName];

const DATADIAN_SQLSTATE_CODES: ReadonlySet<string> = new Set(Object.values(DATADIAN_SQLSTATE));

/** Indica si un SQLSTATE es uno de los códigos `DD0xx` del catálogo. */
export const isDatadianSqlState = (code: unknown): code is DatadianSqlState =>
  typeof code === 'string' && DATADIAN_SQLSTATE_CODES.has(code);

/**
 * Actor de sistema con el que Telco firma sus acciones en `audit_logs.actor_user_id` (y en
 * `created_by` o `requested_by` cuando no hay usuario), acompañado de `metadata.actor = 'telco'`.
 * UUID fijo con versión 7 y marca de tiempo cero: no coincide con ningún `uuidv7()` real.
 */
export const SYSTEM_ACTOR_TELCO = '00000000-0000-7000-8000-000000000001';
