import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import { trace } from '@opentelemetry/api';
import type { FastifyInstance } from 'fastify';

const HEADER = 'x-correlation-id';
// Se acepta el id del cliente o del proxy solo si es corto y sin caracteres raros: va a los logs y a la auditoría.
const VALID_ID = /^[\w.:-]{1,128}$/;

/** Generador de request.id de Fastify: reutiliza X-Correlation-Id si es válido o crea uno nuevo. */
export function correlationIdFor(request: IncomingMessage): string {
  const incoming = request.headers[HEADER];
  return typeof incoming === 'string' && VALID_ID.test(incoming) ? incoming : randomUUID();
}

/** Devuelve el id en la respuesta y lo agrega a la traza activa (OpenTelemetry), si la hay. */
export function exposeCorrelationId(fastify: FastifyInstance): void {
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header(HEADER, request.id);
    trace.getActiveSpan()?.setAttribute('correlation_id', request.id);
  });
}
