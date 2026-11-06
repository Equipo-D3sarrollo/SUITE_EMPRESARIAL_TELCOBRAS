import { z } from 'zod';

/** Invitación de un usuario a la organización activa con un rol de esa organización. */
export const invitationCreateSchema = z.object({
  // Se normaliza antes de validar el formato para aceptar espacios y mayúsculas al copiar y pegar.
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  roleId: z.uuid(),
});

export type InvitationCreate = z.infer<typeof invitationCreateSchema>;
