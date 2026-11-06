import { index, inet, jsonb, text, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, oneOf } from './columns.js';
import { organizations } from './organizations.js';

export const AUDIT_RESULTS = ['success', 'failure', 'denied'] as const;

/** Auditoría de negocio, append-only: app_user solo tiene INSERT y SELECT. No reemplaza a los logs técnicos. */
export const auditLogs = appSchema.table(
  'audit_logs',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    actorUserId: uuid('actor_user_id').notNull(),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    result: text('result', { enum: AUDIT_RESULTS }).notNull(),
    ip: inet('ip'),
    userAgent: text('user_agent'),
    correlationId: text('correlation_id'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [
    index('audit_logs_cursor_idx').on(t.organizationId, t.createdAt, t.id),
    oneOf('audit_logs_result_check', t.result, AUDIT_RESULTS),
  ],
);
