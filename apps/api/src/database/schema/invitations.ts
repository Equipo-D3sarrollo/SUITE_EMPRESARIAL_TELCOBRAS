import { foreignKey, index, text, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp } from './columns.js';
import { roles } from './rbac.js';

/** Invitación a una organización con un rol. Solo se guarda el hash del token, nunca el token. */
export const invitations = appSchema.table(
  'invitations',
  {
    id: id(),
    organizationId: uuid('organization_id').notNull(),
    email: text('email').notNull(),
    roleId: uuid('role_id').notNull(),
    tokenHash: text('token_hash').notNull().unique('invitations_token_hash_key'),
    expiresAt: nullableTimestamp('expires_at').notNull(),
    acceptedAt: nullableTimestamp('accepted_at'),
    invitedBy: uuid('invited_by').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    // El rol tiene que ser de la misma organización; la organización queda garantizada a través del rol.
    foreignKey({
      name: 'invitations_role_fk',
      columns: [t.organizationId, t.roleId],
      foreignColumns: [roles.organizationId, roles.id],
    }).onDelete('cascade'),
    index('invitations_cursor_idx').on(t.organizationId, t.createdAt, t.id),
  ],
);
