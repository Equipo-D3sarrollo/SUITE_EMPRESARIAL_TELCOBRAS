import { z } from 'zod';

export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

/** Error de un campo concreto, con la ruta del campo en el cuerpo o la consulta. */
export const fieldErrorSchema = z.object({
  path: z.string(),
  message: z.string(),
});

/** Cuerpo de error RFC 9457. Admite miembros de extensión, como exige la RFC. */
export const problemDetailsSchema = z.looseObject({
  type: z.string().default('about:blank'),
  title: z.string(),
  status: z.int().min(100).max(599),
  detail: z.string().optional(),
  instance: z.string().optional(),
  correlationId: z.string().optional(),
  errors: z.array(fieldErrorSchema).optional(),
});

export type FieldError = z.infer<typeof fieldErrorSchema>;
export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
