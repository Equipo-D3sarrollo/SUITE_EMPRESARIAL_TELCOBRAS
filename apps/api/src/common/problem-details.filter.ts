import { STATUS_CODES } from 'node:http';
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { type FieldError, PROBLEM_CONTENT_TYPE, type ProblemDetails } from '@telcobras/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';

type Problem = Pick<ProblemDetails, 'status' | 'detail' | 'errors'>;

/**
 * Toda respuesta de error sale como RFC 9457 (application/problem+json) con el id de correlación.
 * Los 5xx no exponen detalles internos: se registran en el log con el mismo id.
 */
@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const reply = http.getResponse<FastifyReply>();
    const { status, detail, errors } = toProblem(exception);
    if (status >= 500) this.logger.error(exception);

    const body: ProblemDetails = {
      type: 'about:blank',
      title: STATUS_CODES[status] ?? 'Error',
      status,
      detail,
      instance: request.url.split('?')[0],
      correlationId: request.id,
      errors,
    };
    void reply.status(status).type(PROBLEM_CONTENT_TYPE).send(body);
  }
}

// Nest ya convierte en HttpException los errores 4xx de Fastify (JSON mal formado, cuerpo muy grande...).
function toProblem(exception: unknown): Problem {
  if (!(exception instanceof HttpException)) return { status: 500 };
  const status = exception.getStatus();
  if (status >= 500) return { status };
  const response = exception.getResponse();
  const errors =
    typeof response === 'object' && 'errors' in response
      ? (response.errors as FieldError[])
      : undefined;
  return { status, detail: exception.message, errors };
}
