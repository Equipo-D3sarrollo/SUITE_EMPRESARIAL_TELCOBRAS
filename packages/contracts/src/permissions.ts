import { z } from 'zod';

// Catálogo de permisos "recurso:acción" de la etapa 1. Los roles guardan estos valores como datos.
export const PERMISSIONS = [
  'dashboard:view',
  'commercial:view',
  'leadgen:view',
  'documents:view',
  'documents:decide',
  'documents:configure',
  // DataDian, Etapa 3: pedir eventos RADIAN (030, 032, 033, 031) y operar sincronizaciones y cola.
  'documents:events',
  'documents:sync',
  'integrations:view',
  'automation:view',
  'ai:view',
  'analytics:view',
  'administration:view',
  'help:view',
  'organization:read',
  'organization:update',
  'members:read',
  'members:invite',
  'members:update',
  'members:remove',
  'roles:read',
  'roles:create',
  'roles:update',
  'roles:delete',
  'audit:read',
] as const satisfies readonly `${string}:${string}`[];

export type Permission = (typeof PERMISSIONS)[number];

export const permissionSchema = z.enum(PERMISSIONS);
