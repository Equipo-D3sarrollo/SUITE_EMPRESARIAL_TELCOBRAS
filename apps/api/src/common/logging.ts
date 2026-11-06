import type { Params } from 'nestjs-pino';
import type { Env } from '../config/env.js';

/**
 * Logs JSON con pino. Cada línea de una petición lleva correlation_id (el request.id de Fastify, ver
 * correlation-id.ts). Nunca se registran cookies, tokens ni cabeceras de autorización.
 */
export const loggerParams = (env: Env): Params => ({
  pinoHttp: {
    level: env.LOG_LEVEL,
    // Los logs dentro de una petición llevan solo correlation_id; el de "request completed" trae además req y res.
    quietReqLogger: true,
    customAttributeKeys: { reqId: 'correlation_id' },
    redact: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
    // Legible en desarrollo; JSON puro en el resto de ambientes.
    transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  },
});
