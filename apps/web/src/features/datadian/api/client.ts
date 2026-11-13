import {
  DATADIAN_ROUTES,
  type DatadianBody,
  type DatadianParams,
  type DatadianQuery,
  type DatadianResponse,
  type DatadianRouteDefinition,
  type DatadianRouteId,
  datadianPath,
  type ProblemDetails,
} from '@telcobras/contracts';
import { ApiError } from '@/lib/api-client';

/**
 * Cliente HTTP de DataDian guiado por el catálogo de rutas de `@telcobras/contracts` (contrato
 * primero, §1.2): el camino, el método y el esquema de la respuesta salen del catálogo, y cada
 * respuesta se valida con zod antes de llegar a la interfaz. Los mocks MSW interceptan este mismo
 * `fetch`, así que el código del feature no sabe si habla con la API o con los mocks.
 */
export type RequestOptions<K extends DatadianRouteId> = {
  params?: DatadianParams<K>;
  query?: DatadianQuery<K>;
  body?: DatadianBody<K> | FormData;
  /** Llave de la intención (§3.6). Si falta en una mutación se genera una. */
  idempotencyKey?: string;
  signal?: AbortSignal;
};

function toSearch(query: Record<string, unknown> | undefined): string {
  if (!query) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

/** Camino con la consulta, relativo al origen (para enlaces de descarga y para fetch). */
export function datadianUrl<K extends DatadianRouteId>(
  routeId: K,
  options: Pick<RequestOptions<K>, 'params' | 'query'> = {},
): string {
  const path = datadianPath(routeId, options.params as Record<string, string> | undefined);
  return `${path}${toSearch(options.query as Record<string, unknown> | undefined)}`;
}

function isProblem(body: unknown): body is ProblemDetails {
  return typeof body === 'object' && body !== null && 'title' in body && 'status' in body;
}

export async function datadianRequest<K extends DatadianRouteId>(
  routeId: K,
  options: RequestOptions<K> = {},
): Promise<DatadianResponse<K>> {
  const route: DatadianRouteDefinition = DATADIAN_ROUTES[routeId];
  const headers = new Headers({ Accept: 'application/json, application/problem+json' });
  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }
  if (route.method !== 'GET') {
    headers.set('Idempotency-Key', options.idempotencyKey ?? crypto.randomUUID());
  }

  const url = new URL(datadianUrl(routeId, options), window.location.origin);
  const response = await fetch(url, {
    method: route.method,
    headers,
    body,
    signal: options.signal,
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => undefined);
    throw new ApiError(response.status, isProblem(problem) ? problem : undefined);
  }
  if (route.responseContentType === 'application/xml') {
    return (await response.text()) as DatadianResponse<K>;
  }
  if (!route.response || response.status === 204) return undefined as DatadianResponse<K>;
  return route.response.parse(await response.json()) as DatadianResponse<K>;
}

/** `code` de un problem+json de DataDian (§3.5), si vino. */
export function problemCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const code = error.problem?.code;
  return typeof code === 'string' ? code : undefined;
}
