import { DIAN_EXTRACTION_STAGES, DIAN_EXTRACTION_STATUSES } from '@telcobras/contracts';
import { date, index, integer, jsonb, text, uuid } from 'drizzle-orm/pg-core';
import type { EncryptedSecret } from '../../common/credentials-cipher.js';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { organizations } from './organizations.js';

/**
 * Sesión de una organización en el catálogo de factura electrónica de la DIAN. Se abre con el enlace
 * del token del correo; la cookie que entrega el portal dura unos 14 días y se guarda cifrada.
 */
export const dianSessions = appSchema.table('dian_sessions', {
  organizationId: uuid('organization_id')
    .primaryKey()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  host: text('host').notNull(),
  nit: text('nit').notNull(),
  cookies: jsonb('cookies').$type<EncryptedSecret>().notNull(),
  expiresAt: nullableTimestamp('expires_at'),
  connectedBy: uuid('connected_by').notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/** Una extracción del listado de recibidos por rango de fechas, con su avance y su resultado. */
export const dianExtractionJobs = appSchema.table(
  'dian_extraction_jobs',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    status: text('status', { enum: DIAN_EXTRACTION_STATUSES }).notNull().default('queued'),
    stage: text('stage', { enum: DIAN_EXTRACTION_STAGES }).notNull().default('connecting'),
    message: text('message'),
    portalTotal: integer('portal_total'),
    importId: uuid('import_id'),
    createdCount: integer('created_count'),
    existingCount: integer('existing_count'),
    rejectedCount: integer('rejected_count'),
    requestedBy: uuid('requested_by').notNull(),
    startedAt: nullableTimestamp('started_at'),
    finishedAt: nullableTimestamp('finished_at'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('dian_extraction_jobs_cursor_idx').on(t.organizationId, t.createdAt, t.id),
    oneOf('dian_extraction_jobs_status_check', t.status, DIAN_EXTRACTION_STATUSES),
    oneOf('dian_extraction_jobs_stage_check', t.stage, DIAN_EXTRACTION_STAGES),
  ],
);
