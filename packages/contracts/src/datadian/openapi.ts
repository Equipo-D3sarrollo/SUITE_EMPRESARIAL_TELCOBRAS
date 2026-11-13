import { z } from 'zod';
import { problemDetailsSchema } from '../schemas/problem.js';
import { DATADIAN_ERRORS } from './errors.js';
import { DATADIAN_BASE_PATH, DATADIAN_ROUTES, type DatadianRouteDefinition } from './routes.js';

/**
 * OpenAPI 3.1 de DataDian generado desde el catálogo (§3.1), no desde los controladores de Nest:
 * el frontend se construye antes que la API. En la Etapa 4 una prueba compara este documento con el
 * OpenAPI de Nest.
 */
type JsonSchema = Record<string, unknown>;

// Con `format` (uuid, date-time, date) el `pattern` que agrega zod sobra y multiplica el tamaño.
function dropFormatPatterns(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(dropFormatPatterns);
  if (typeof node !== 'object' || node === null) return node;
  const entries = Object.entries(node).filter(([key]) => !(key === 'pattern' && 'format' in node));
  return Object.fromEntries(entries.map(([key, value]) => [key, dropFormatPatterns(value)]));
}

const toSchema = (schema: z.ZodType, io: 'input' | 'output'): JsonSchema => {
  const { $schema: _ignored, ...rest } = z.toJSONSchema(schema, {
    target: 'draft-2020-12',
    io,
    unrepresentable: 'any',
  }) as JsonSchema;
  return dropFormatPatterns(rest) as JsonSchema;
};

function parameters(route: DatadianRouteDefinition) {
  const list: JsonSchema[] = [];
  if (route.params) {
    for (const [name, schema] of Object.entries(route.params.shape)) {
      list.push({
        name,
        in: 'path',
        required: true,
        schema: toSchema(schema as z.ZodType, 'input'),
      });
    }
  }
  if (route.query) {
    const query = toSchema(route.query, 'input') as {
      properties?: Record<string, JsonSchema>;
      required?: string[];
    };
    for (const [name, schema] of Object.entries(query.properties ?? {})) {
      list.push({ name, in: 'query', required: query.required?.includes(name) ?? false, schema });
    }
  }
  if (route.idempotent) {
    list.push({
      name: 'Idempotency-Key',
      in: 'header',
      required: true,
      schema: { type: 'string', format: 'uuid' },
    });
  }
  return list;
}

function responses(route: DatadianRouteDefinition) {
  const success: JsonSchema = { description: route.summary };
  if (route.response) {
    success.content = {
      [route.responseContentType]: { schema: toSchema(route.response, 'output') },
    };
  } else if (route.responseContentType !== 'application/json') {
    success.content = { [route.responseContentType]: {} };
  }
  const result: Record<string, JsonSchema> = { [String(route.status)]: success };
  const problem = {
    'application/problem+json': { schema: toSchema(problemDetailsSchema, 'output') },
  };
  for (const code of route.errors ?? []) {
    const { status, slug } = DATADIAN_ERRORS[code];
    const key = String(status);
    const previous = result[key]?.description;
    result[key] = {
      description: previous ? `${previous}, ${slug}` : slug,
      content: problem,
    };
  }
  result.default = { description: 'Error (RFC 9457)', content: problem };
  return result;
}

export function buildDatadianOpenApi() {
  const paths: Record<string, Record<string, JsonSchema>> = {};
  for (const [id, route] of Object.entries(DATADIAN_ROUTES) as [
    string,
    DatadianRouteDefinition,
  ][]) {
    const path = `${DATADIAN_BASE_PATH}${route.path}`;
    const operation: JsonSchema = {
      operationId: `datadian${id}`,
      summary: route.summary,
      tags: ['DataDian'],
      'x-permission': route.permission,
      parameters: parameters(route),
      responses: responses(route),
    };
    if (route.body) {
      operation.requestBody = {
        required: true,
        content: {
          [route.bodyContentType ?? 'application/json']: { schema: toSchema(route.body, 'input') },
        },
      };
    }
    paths[path] = { ...paths[path], [route.method.toLowerCase()]: operation };
  }
  return {
    openapi: '3.1.0',
    info: {
      title: 'DataDian API',
      version: '0.3.0',
      description: 'Contratos de DataDian generados desde packages/contracts (Etapa 3).',
    },
    paths,
  };
}
