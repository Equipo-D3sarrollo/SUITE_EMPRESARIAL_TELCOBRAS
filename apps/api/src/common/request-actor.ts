/**
 * Quién hace la petición. Lo asigna la guardia de sesión del módulo auth (las guardias corren antes de los
 * interceptores); orgId es null mientras el usuario no ha elegido organización.
 */
export interface RequestActor {
  userId: string;
  orgId: string | null;
}

declare module 'fastify' {
  interface FastifyRequest {
    actor?: RequestActor;
  }
}
