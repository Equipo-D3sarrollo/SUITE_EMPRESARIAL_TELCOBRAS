// Idempotency-Key, validación con zod y errores problem+json sobre un controlador de prueba y el Valkey de Compose.
import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import {
  Body,
  type CanActivate,
  Controller,
  type ExecutionContext,
  Post,
  UseGuards,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import type { FastifyRequest } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { IdempotencyInterceptor } from '../src/common/idempotency.interceptor.js';
import { ProblemDetailsFilter } from '../src/common/problem-details.filter.js';
import { ValkeyModule } from '../src/common/valkey.module.js';
import { ZodPipe } from '../src/common/zod.pipe.js';
import { ConfigModule } from '../src/config/config.module.js';

const org = randomUUID();
const user = randomUUID();

// Hace las veces de la guardia de sesión del módulo auth.
class ActorFromHeaders implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const userId = request.headers['x-test-user'];
    if (typeof userId === 'string') request.actor = { userId, orgId: org };
    return true;
  }
}

const itemSchema = z.object({ name: z.string().min(2) });
let calls = 0;

@Controller('items')
@UseGuards(ActorFromHeaders)
class ItemsController {
  @Post()
  async create(@Body(new ZodPipe(itemSchema)) body: z.infer<typeof itemSchema>) {
    calls += 1;
    if (body.name === 'slow') await sleep(200);
    return { name: body.name, call: calls };
  }
}

let app: NestFastifyApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule, ValkeyModule],
    controllers: [ItemsController],
    providers: [
      { provide: APP_FILTER, useClass: ProblemDetailsFilter },
      { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
    ],
  }).compile();
  app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

afterAll(() => app.close());

const post = (name: string, headers: Record<string, string>) =>
  app.inject({ method: 'POST', url: '/items', payload: { name }, headers });

describe('Idempotency-Key', () => {
  it('repetir la petición con la misma llave devuelve la respuesta guardada sin ejecutarla otra vez', async () => {
    const headers = { 'x-test-user': user, 'idempotency-key': randomUUID() };
    const first = await post('uno', headers);
    const second = await post('uno', headers);
    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(201);
    expect(second.json()).toEqual(first.json());
    expect(second.headers['idempotent-replayed']).toBe('true');
  });

  it('la misma llave con otro cuerpo es 422', async () => {
    const headers = { 'x-test-user': user, 'idempotency-key': randomUUID() };
    await post('uno', headers);
    const reused = await post('dos', headers);
    expect(reused.statusCode).toBe(422);
    expect(reused.headers['content-type']).toMatch(/^application\/problem\+json/);
  });

  it('mientras la primera petición sigue en curso, la repetida recibe 409', async () => {
    const headers = { 'x-test-user': user, 'idempotency-key': randomUUID() };
    const statuses = (await Promise.all([post('slow', headers), post('slow', headers)])).map(
      (response) => response.statusCode,
    );
    expect(statuses.sort()).toEqual([201, 409]);
  });

  it('si la operación falla, la llave se libera para reintentar', async () => {
    const headers = { 'x-test-user': user, 'idempotency-key': randomUUID() };
    expect((await post('x', headers)).statusCode).toBe(400);
    expect((await post('valido', headers)).statusCode).toBe(201);
  });

  it('sin usuario autenticado la llave se ignora, y una llave inválida es 400', async () => {
    const key = randomUUID();
    const a = await post('anonimo', { 'idempotency-key': key });
    const b = await post('anonimo', { 'idempotency-key': key });
    expect(a.json().call).not.toBe(b.json().call);
    const invalid = await post('uno', { 'x-test-user': user, 'idempotency-key': 'con espacio' });
    expect(invalid.statusCode).toBe(400);
  });
});

describe('validación con zod', () => {
  it('responde 400 problem+json con los campos inválidos', async () => {
    const response = await post('x', { 'x-test-user': user });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      status: 400,
      title: 'Bad Request',
      errors: [{ path: 'name', message: expect.any(String) }],
    });
  });
});
