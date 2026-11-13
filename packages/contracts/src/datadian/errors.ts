import { DATADIAN_SQLSTATE } from '../datadian-database.js';

/**
 * Errores propios de la API de DataDian (§3.5). El cuerpo es problem+json con dos extensiones:
 * `code` (el SQLSTATE `DD0xx` o un código de la API) y `type` = `urn:telcobras:datadian:<slug>`.
 * La interfaz decide por `code`, nunca por el texto.
 */
export const DATADIAN_PROBLEM_TYPE_PREFIX = 'urn:telcobras:datadian:';

export const DATADIAN_ERRORS = {
  [DATADIAN_SQLSTATE.eventOutOfSequence]: { status: 409, slug: 'out-of-sequence' },
  [DATADIAN_SQLSTATE.eventBlocked]: { status: 409, slug: 'event-blocked' },
  [DATADIAN_SQLSTATE.invoiceTerminal]: { status: 409, slug: 'invoice-terminal' },
  [DATADIAN_SQLSTATE.invoiceWithoutValidXml]: { status: 422, slug: 'invoice-not-valid' },
  [DATADIAN_SQLSTATE.environmentMismatch]: { status: 422, slug: 'environment-mismatch' },
  [DATADIAN_SQLSTATE.claimDeadlineExpired]: { status: 422, slug: 'claim-deadline-expired' },
  [DATADIAN_SQLSTATE.invalidActiveCertificate]: { status: 422, slug: 'certificate-invalid' },
  API_EVENT_IN_PROGRESS: { status: 409, slug: 'event-in-progress' },
  API_SOFTWARE_MISSING: { status: 422, slug: 'software-missing' },
  API_PRODUCTION_NOT_READY: { status: 422, slug: 'production-not-ready' },
  API_NIT_TAKEN: { status: 409, slug: 'nit-taken' },
  API_DUPLICATE_CERTIFICATE: { status: 409, slug: 'duplicate-certificate' },
  API_CERTIFICATE_ACTIVE: { status: 409, slug: 'certificate-active' },
  API_BAD_FILE: { status: 400, slug: 'bad-file' },
  API_DUPLICATE_MAILBOX: { status: 409, slug: 'duplicate-mailbox' },
  API_SYNC_RUNNING: { status: 409, slug: 'sync-running' },
  API_CHANNEL_DISABLED: { status: 422, slug: 'channel-disabled' },
  API_CERTIFICATE_MISSING: { status: 422, slug: 'certificate-missing' },
  API_JOB_NOT_DEAD: { status: 409, slug: 'job-not-dead' },
  API_JOB_NOT_QUEUED: { status: 409, slug: 'job-not-queued' },
  API_XML_MISSING: { status: 409, slug: 'xml-missing' },
} as const satisfies Record<string, { status: number; slug: string }>;

export type DatadianErrorCode = keyof typeof DATADIAN_ERRORS;

export const DATADIAN_ERROR_CODES = Object.keys(DATADIAN_ERRORS) as DatadianErrorCode[];

export const isDatadianErrorCode = (code: unknown): code is DatadianErrorCode =>
  typeof code === 'string' && Object.hasOwn(DATADIAN_ERRORS, code);

/** Cuerpo problem+json de un error de DataDian, para la API y los mocks. */
export function datadianProblem(code: DatadianErrorCode, title: string, detail?: string) {
  const { status, slug } = DATADIAN_ERRORS[code];
  return {
    type: `${DATADIAN_PROBLEM_TYPE_PREFIX}${slug}`,
    title,
    status,
    code,
    ...(detail ? { detail } : {}),
  };
}
