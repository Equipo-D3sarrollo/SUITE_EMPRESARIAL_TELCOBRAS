import { createHash } from 'node:crypto';
import {
  BadRequestException,
  type CallHandler,
  ConflictException,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Redis } from 'ioredis';
import { catchError, mergeMap, type Observable, of } from 'rxjs';
import type { RequestActor } from './request-actor.js';

const MUTATIONS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const VALID_KEY = /^[\x21-\x7e]{1,255}$/;
const TTL_SECONDS = 24 * 60 * 60;

type StoredEntry = { fingerprint: string } & ({ done: false } | { done: true; body: unknown });

/**
 * Idempotency-Key en mutaciones (documento madre §5.3, §19.2): si el cliente repite la petición con la misma
 * llave, recibe la respuesta guardada en lugar de ejecutarla otra vez. Las llaves se guardan en Valkey 24 h,
 * separadas por organización y usuario, así que nunca se comparten respuestas entre ellos.
 * Solo aplica a peticiones autenticadas: sin request.actor no hay a quién atribuir la llave.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(Redis) private readonly valkey: Redis) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const key = request.headers['idempotency-key'];
    if (key === undefined || !MUTATIONS.has(request.method) || !request.actor) return next.handle();
    if (typeof key !== 'string' || !VALID_KEY.test(key)) {
      throw new BadRequestException('Invalid Idempotency-Key header');
    }

    const { orgId, userId }: RequestActor = request.actor;
    const storeKey = `idempotency:${orgId ?? 'none'}:${userId}:${key}`;
    const fingerprint = createHash('sha256')
      .update(`${request.method} ${request.url}\n${JSON.stringify(request.body ?? null)}`)
      .digest('base64url');

    const pending: StoredEntry = { fingerprint, done: false };
    const claimed = await this.valkey.set(
      storeKey,
      JSON.stringify(pending),
      'EX',
      TTL_SECONDS,
      'NX',
    );
    if (claimed === null) {
      return of(await this.replay(storeKey, fingerprint, http.getResponse<FastifyReply>()));
    }

    return next.handle().pipe(
      mergeMap(async (body: unknown) => {
        const done: StoredEntry = { fingerprint, done: true, body };
        await this.valkey.set(storeKey, JSON.stringify(done), 'EX', TTL_SECONDS);
        return body;
      }),
      // Si la operación falla, se libera la llave para que el cliente pueda reintentar.
      catchError(async (error: unknown) => {
        await this.valkey.del(storeKey);
        throw error;
      }),
    );
  }

  private async replay(
    storeKey: string,
    fingerprint: string,
    reply: FastifyReply,
  ): Promise<unknown> {
    const raw = await this.valkey.get(storeKey);
    const entry = raw === null ? null : (JSON.parse(raw) as StoredEntry);
    if (entry !== null && entry.fingerprint !== fingerprint) {
      throw new UnprocessableEntityException(
        'Idempotency-Key was already used with a different request',
      );
    }
    if (entry === null || !entry.done) {
      throw new ConflictException('A request with this Idempotency-Key is still in progress');
    }
    void reply.header('idempotent-replayed', 'true');
    return entry.body;
  }
}
