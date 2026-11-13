import { TELCO_JOB_KINDS, TELCO_JOB_STATUSES } from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  smallint,
  text,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { organizations } from './organizations.js';

// DataDian, subetapa 2.7 (ARQUITECTURA_DB_DATADIAN.md §7.6, migración 0015).

/**
 * Cola de trabajos de Telco en PostgreSQL (RNF2): se reclama con FOR UPDATE SKIP LOCKED y arrendamiento
 * que vence. Es la única tabla que app_worker lee entre organizaciones; payload lleva solo identificadores.
 */
export const telcoJobs = appSchema.table(
  'telco_jobs',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    kind: text('kind', { enum: TELCO_JOB_KINDS }).notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
    status: text('status', { enum: TELCO_JOB_STATUSES }).notNull().default('queued'),
    priority: smallint('priority').notNull().default(100),
    runAt: nullableTimestamp('run_at').notNull().defaultNow(),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(8),
    leaseOwner: text('lease_owner'),
    leasedAt: nullableTimestamp('leased_at'),
    leaseExpiresAt: nullableTimestamp('lease_expires_at'),
    backoffBaseSeconds: integer('backoff_base_seconds').notNull().default(30),
    backoffMaxSeconds: integer('backoff_max_seconds').notNull().default(3600),
    recurrenceSeconds: integer('recurrence_seconds'),
    dedupeKey: text('dedupe_key'),
    lastError: text('last_error'),
    lastErrorAt: nullableTimestamp('last_error_at'),
    result: jsonb('result'),
    createdBy: uuid('created_by'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    finishedAt: nullableTimestamp('finished_at'),
  },
  (t) => [
    unique('telco_jobs_organization_id_id_key').on(t.organizationId, t.id),
    uniqueIndex('telco_jobs_dedupe_key')
      .on(t.organizationId, t.kind, t.dedupeKey)
      .where(sql`${t.status} in ('queued', 'running')`),
    index('telco_jobs_claim_idx').on(t.priority, t.runAt, t.id).where(sql`${t.status} = 'queued'`),
    index('telco_jobs_lease_idx').on(t.leaseExpiresAt).where(sql`${t.status} = 'running'`),
    index('telco_jobs_cursor_idx').on(t.organizationId, t.createdAt, t.id),
    index('telco_jobs_dead_idx').on(t.organizationId, t.kind).where(sql`${t.status} = 'dead'`),
    oneOf('telco_jobs_kind_check', t.kind, TELCO_JOB_KINDS),
    oneOf('telco_jobs_status_check', t.status, TELCO_JOB_STATUSES),
    check('telco_jobs_payload_check', sql`jsonb_typeof(${t.payload}) = 'object'`),
    check('telco_jobs_max_attempts_check', sql`${t.maxAttempts} > 0`),
    check('telco_jobs_attempts_check', sql`${t.attempts} between 0 and ${t.maxAttempts}`),
    check(
      'telco_jobs_backoff_check',
      sql`${t.backoffBaseSeconds} > 0 and ${t.backoffMaxSeconds} >= ${t.backoffBaseSeconds}`,
    ),
    check('telco_jobs_recurrence_check', sql`${t.recurrenceSeconds} > 0`),
    check(
      'telco_jobs_lease_check',
      sql`(${t.status} = 'running') = (${t.leaseOwner} is not null and ${t.leaseExpiresAt} is not null)`,
    ),
    check(
      'telco_jobs_finished_check',
      sql`(${t.status} in ('succeeded', 'dead', 'cancelled')) = (${t.finishedAt} is not null)`,
    ),
  ],
);
