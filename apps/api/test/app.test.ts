// Arranque real de la API (sin abrir el puerto) contra los servicios de Compose.
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

let app: NestFastifyApplication;

beforeAll(async () => {
  app = await createApp();
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

afterAll(() => app.close());

describe('API base', () => {
  it('health responde con PostgreSQL, Valkey y S3 arriba', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
      checks: { postgres: 'up', valkey: 'up', s3: 'up' },
    });
  });

  it('los errores salen en RFC 9457 con el id de correlación', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/missing?secret=1' });
    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toMatch(/^application\/problem\+json/);
    expect(response.json()).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      instance: '/api/v1/missing',
      correlationId: response.headers['x-correlation-id'],
    });
  });

  it('reutiliza un X-Correlation-Id válido y reemplaza uno inválido', async () => {
    const valid = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
      headers: { 'x-correlation-id': 'caddy-1234.abc' },
    });
    const invalid = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
      headers: { 'x-correlation-id': 'bad id\n{"level":60}' },
    });
    expect(valid.headers['x-correlation-id']).toBe('caddy-1234.abc');
    expect(invalid.headers['x-correlation-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('publica el contrato OpenAPI y la documentación', async () => {
    const spec = await app.inject({ method: 'GET', url: '/api/v1/openapi.json' });
    const docs = await app.inject({ method: 'GET', url: '/api/v1/docs' });
    expect(spec.statusCode).toBe(200);
    expect(Object.keys(spec.json().paths)).toContain('/api/v1/health');
    expect(Object.keys(spec.json().paths)).toContain('/api/v1/me/organizations');
    expect(Object.keys(spec.json().paths)).toContain('/api/v1/invitations');
    expect(Object.keys(spec.json().paths)).toContain('/api/v1/invitations/{token}/accept');
    expect(docs.statusCode).toBe(200);
  });

  it('publica la sesión de Better Auth y protege los recursos privados', async () => {
    const session = await app.inject({ method: 'GET', url: '/api/auth/get-session' });
    const organizations = await app.inject({ method: 'GET', url: '/api/v1/me/organizations' });

    expect(session.statusCode).toBe(200);
    expect(session.json()).toBeNull();
    expect(organizations.statusCode).toBe(401);
    expect(organizations.headers['content-type']).toMatch(/^application\/problem\+json/);
  });

  it('CORS solo para el origen de la SPA, con credenciales, y cabeceras de seguridad', async () => {
    const allowed = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
      headers: { origin: process.env.WEB_ORIGIN },
    });
    const foreign = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
      headers: { origin: 'https://evil.example' },
    });
    expect(allowed.headers['access-control-allow-origin']).toBe(process.env.WEB_ORIGIN);
    expect(allowed.headers['access-control-allow-credentials']).toBe('true');
    // Con un origen fijo, la cabecera siempre nombra a la SPA: el navegador bloquea cualquier otro origen.
    expect(foreign.headers['access-control-allow-origin']).toBe(process.env.WEB_ORIGIN);
    expect(allowed.headers['x-content-type-options']).toBe('nosniff');
    expect(allowed.headers['strict-transport-security']).toBeDefined();
  });
});
