import type { ProblemDetails } from '@telcobras/contracts';
import createClient from 'openapi-fetch';
import type { paths } from './api-schema';

/** Cliente tipado de la API REST. Mismo origen: en local Vite reenvía /api y en producción lo hace Caddy. */
export const api = createClient<paths>();

api.use({
  onRequest({ request }) {
    // Las mutaciones llevan Idempotency-Key (documento madre §5.3): si la red repite la petición, la API no la aplica dos veces.
    if (request.method !== 'GET' && !request.headers.has('Idempotency-Key')) {
      request.headers.set('Idempotency-Key', crypto.randomUUID());
    }
    return request;
  },
});

/** Error de la API con el cuerpo RFC 9457 (problem+json), si vino uno. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: ProblemDetails | undefined,
  ) {
    super(problem?.title ?? `HTTP ${status}`);
    this.name = 'ApiError';
  }
}

// Sin zod a propósito: este módulo va en el bundle inicial y el cuerpo solo se usa para mostrar el error.
function isProblem(body: unknown): body is ProblemDetails {
  return typeof body === 'object' && body !== null && 'title' in body && 'status' in body;
}

/** Devuelve el cuerpo de una respuesta exitosa o lanza ApiError, para que TanStack Query lo trate como error. */
export async function unwrap<T>(
  request: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
  const { data, error, response } = await request;
  if (!response.ok) throw new ApiError(response.status, isProblem(error) ? error : undefined);
  return data as T;
}
