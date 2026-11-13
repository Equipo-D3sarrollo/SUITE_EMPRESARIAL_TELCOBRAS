import { isDatadianErrorCode } from '@telcobras/contracts';
import { t } from '@/i18n/es-CO';
import { ApiError } from '@/lib/api-client';
import { problemCode } from '../api/client';

/**
 * Mensaje de un error de la API de DataDian. Decide por el `code` del problem+json (§3.5), nunca por
 * el texto; los 422 heredados (por ejemplo, falta Odoo) traen su `detail` redactado para el usuario.
 */
export function datadianErrorMessage(error: unknown): string {
  const code = problemCode(error);
  if (isDatadianErrorCode(code)) return t.datadian.errors[code];
  if (error instanceof ApiError) {
    if (error.status === 422 && error.problem?.detail) return error.problem.detail;
    return t.datadian.genericError(error.problem?.correlationId);
  }
  return t.datadian.genericError();
}

/** Errores tras los que conviene refrescar la factura en lugar de solo avisar. */
export const REFRESH_CODES = new Set(['DD001', 'DD002', 'DD003', 'API_EVENT_IN_PROGRESS']);
