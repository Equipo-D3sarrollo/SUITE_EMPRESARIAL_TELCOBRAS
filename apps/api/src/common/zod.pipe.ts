import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { FieldError } from '@telcobras/contracts';
import type { z } from 'zod';

/**
 * Valida cuerpo, parámetros o consulta con un esquema zod de @telcobras/contracts.
 * Uso: @Body(new ZodPipe(organizationCreateSchema)). Si falla: 400 con la lista de campos (problem+json).
 */
export class ZodPipe<T extends z.ZodType> implements PipeTransform<unknown, z.output<T>> {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;
    const errors: FieldError[] = result.error.issues.map((issue) => ({
      path: issue.path.map(String).join('.'),
      message: issue.message,
    }));
    throw new BadRequestException({ message: 'Request validation failed', errors });
  }
}
