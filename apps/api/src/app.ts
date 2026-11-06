import fastifyCookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import type { Auth } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { AUTH } from './auth/auth.module.js';
import { correlationIdFor, exposeCorrelationId } from './common/correlation-id.js';
import { ENV } from './config/config.module.js';
import type { Env } from './config/env.js';
import { buildOpenApiDocument } from './openapi.js';

/** Crea y configura la API sin abrir el puerto: la usan main.ts, las pruebas y la exportación de OpenAPI. */
export async function createApp(): Promise<NestFastifyApplication> {
  const adapter = new FastifyAdapter({
    genReqId: correlationIdFor,
    // Solo se cree X-Forwarded-For cuando viene de la red local o privada (Caddy en el mismo host o red de Docker).
    trustProxy: 'loopback, linklocal, uniquelocal',
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  const env = app.get<Env>(ENV);

  await app.register(helmet, {
    // Sin HTTPS en local, upgrade-insecure-requests dejaría la documentación (Swagger UI) sin estilos ni scripts.
    contentSecurityPolicy: {
      directives: { upgradeInsecureRequests: env.NODE_ENV === 'production' ? [] : null },
    },
  });
  await app.register(fastifyCookie);
  const auth = app.get<Auth>(AUTH);
  app
    .getHttpAdapter()
    .getInstance()
    .all('/api/auth/*', async (request, reply) => {
      const headers = fromNodeHeaders(request.headers);
      headers.delete('content-length');
      headers.delete('transfer-encoding');
      headers.delete('connection');
      headers.delete('host');
      const body =
        request.body === undefined || request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : JSON.stringify(request.body);
      const response = await auth.handler(
        new Request(new URL(request.url, env.BETTER_AUTH_URL), {
          method: request.method,
          headers,
          body,
        }),
      );
      for (const [name, value] of response.headers) {
        if (name !== 'set-cookie') reply.header(name, value);
      }
      const cookies = response.headers.getSetCookie();
      if (cookies.length > 0) reply.header('set-cookie', cookies);
      return reply.status(response.status).send(Buffer.from(await response.arrayBuffer()));
    });
  app.enableCors({ origin: env.WEB_ORIGIN, credentials: true });
  exposeCorrelationId(app.getHttpAdapter().getInstance());

  app.setGlobalPrefix('api/v1');
  SwaggerModule.setup('api/v1/docs', app, buildOpenApiDocument(app), {
    jsonDocumentUrl: 'api/v1/openapi.json',
    raw: ['json'],
  });
  return app;
}
