import { index, text, unique, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, oneOf, updatedAt } from './columns.js';
import { organizations } from './organizations.js';

export const MEMBERSHIP_STATUSES = ['active', 'suspended'] as const;

/** Pertenencia de un usuario a una organización: un usuario puede estar en varias. */
export const memberships = appSchema.table(
  'memberships',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull(),
    status: text('status', { enum: MEMBERSHIP_STATUSES }).notNull().default('active'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('memberships_organization_id_user_id_key').on(t.organizationId, t.userId),
    // Destino de las llaves foráneas compuestas: impide enlazar filas de otra organización.
    unique('memberships_organization_id_id_key').on(t.organizationId, t.id),
    // "Mis organizaciones": membresías del usuario antes de elegir organización.
    index('memberships_user_id_idx').on(t.userId),
    index('memberships_cursor_idx').on(t.organizationId, t.createdAt, t.id),
    oneOf('memberships_status_check', t.status, MEMBERSHIP_STATUSES),
  ],
);
