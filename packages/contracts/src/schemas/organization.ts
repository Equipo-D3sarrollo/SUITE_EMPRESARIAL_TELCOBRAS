import { z } from 'zod';
import { nitSchema } from './nit.js';

export const ORGANIZATION_SIZES = ['1-10', '11-50', '51-200', '200+'] as const;

export const organizationSizeSchema = z.enum(ORGANIZATION_SIZES);

/** Datos del onboarding simplificado (documento madre §12.5): nombre, razón social, NIT y tamaño. */
export const organizationCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  legalName: z.string().trim().min(2).max(200),
  nit: nitSchema,
  size: organizationSizeSchema,
});

export const organizationUpdateSchema = organizationCreateSchema.partial();

export type OrganizationCreate = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdate = z.infer<typeof organizationUpdateSchema>;
export type OrganizationSize = z.infer<typeof organizationSizeSchema>;
