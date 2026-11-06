import { z } from 'zod';
import { permissionSchema } from '../permissions.js';

/** Rol configurable de una organización: un nombre y su lista de permisos "recurso:acción". */
export const roleCreateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
  permissions: z
    .array(permissionSchema)
    .refine((list) => new Set(list).size === list.length, { error: 'role.duplicatePermissions' }),
});

export const roleUpdateSchema = roleCreateSchema.partial();

export type RoleCreate = z.infer<typeof roleCreateSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;
