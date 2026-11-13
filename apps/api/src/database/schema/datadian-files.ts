import {
  DIAN_FILE_KINDS,
  DIAN_SYNC_CHANNELS,
  DIAN_SYNC_STATUSES,
  DIAN_SYNC_TRIGGERS,
} from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import {
  bigint,
  char,
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { telcoJobs } from './datadian-jobs.js';
import { imapMailboxes } from './datadian-settings.js';
import { organizations } from './organizations.js';

// DataDian, subetapa 2.4 (ARQUITECTURA_DB_DATADIAN.md §5.4 y §5.5, migración 0012).

/** Registro de solo inserción de cada archivo de DataDian en S3, con su hash (§5.4). */
export const dianFiles = appSchema.table(
  'dian_files',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    kind: text('kind', { enum: DIAN_FILE_KINDS }).notNull(),
    storageKey: text('storage_key').notNull(),
    sha256: char('sha256', { length: 64 }).notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    contentType: text('content_type').notNull(),
    originalName: text('original_name'),
    createdBy: uuid('created_by'),
    createdAt: createdAt(),
  },
  (t) => [
    unique('dian_files_organization_id_id_key').on(t.organizationId, t.id),
    unique('dian_files_storage_key_key').on(t.storageKey),
    unique('dian_files_organization_id_kind_sha256_key').on(t.organizationId, t.kind, t.sha256),
    oneOf('dian_files_kind_check', t.kind, DIAN_FILE_KINDS),
    check('dian_files_sha256_check', sql`${t.sha256} ~ '^[0-9a-f]{64}$'`),
    check('dian_files_size_bytes_check', sql`${t.sizeBytes} > 0`),
  ],
);

/** Una ejecución de sincronización por RPA, IMAP o carga manual, con su resultado (§5.5). */
export const dianSyncRuns = appSchema.table(
  'dian_sync_runs',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    channel: text('channel', { enum: DIAN_SYNC_CHANNELS }).notNull(),
    trigger: text('trigger', { enum: DIAN_SYNC_TRIGGERS }).notNull(),
    requestedBy: uuid('requested_by'),
    jobId: uuid('job_id'),
    mailboxId: uuid('mailbox_id'),
    periodStart: date('period_start'),
    periodEnd: date('period_end'),
    status: text('status', { enum: DIAN_SYNC_STATUSES }).notNull().default('queued'),
    startedAt: nullableTimestamp('started_at'),
    finishedAt: nullableTimestamp('finished_at'),
    listedCount: integer('listed_count').notNull().default(0),
    newCount: integer('new_count').notNull().default(0),
    existingCount: integer('existing_count').notNull().default(0),
    xmlDownloadedCount: integer('xml_downloaded_count').notNull().default(0),
    failedCount: integer('failed_count').notNull().default(0),
    listingFileId: uuid('listing_file_id'),
    errorMessage: text('error_message'),
    details: jsonb('details').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('dian_sync_runs_organization_id_id_key').on(t.organizationId, t.id),
    foreignKey({
      name: 'dian_sync_runs_mailbox_fk',
      columns: [t.organizationId, t.mailboxId],
      foreignColumns: [imapMailboxes.organizationId, imapMailboxes.id],
    }),
    // Llega con la 0015, que crea la cola (§10.1).
    foreignKey({
      name: 'dian_sync_runs_job_fk',
      columns: [t.organizationId, t.jobId],
      foreignColumns: [telcoJobs.organizationId, telcoJobs.id],
    }),
    foreignKey({
      name: 'dian_sync_runs_listing_file_fk',
      columns: [t.organizationId, t.listingFileId],
      foreignColumns: [dianFiles.organizationId, dianFiles.id],
    }),
    index('dian_sync_runs_cursor_idx').on(t.organizationId, t.createdAt, t.id),
    index('dian_sync_runs_channel_status_idx').on(t.organizationId, t.channel, t.status),
    oneOf('dian_sync_runs_channel_check', t.channel, DIAN_SYNC_CHANNELS),
    oneOf('dian_sync_runs_trigger_check', t.trigger, DIAN_SYNC_TRIGGERS),
    oneOf('dian_sync_runs_status_check', t.status, DIAN_SYNC_STATUSES),
    check(
      'dian_sync_runs_requested_by_check',
      sql`${t.trigger} <> 'user' or ${t.requestedBy} is not null`,
    ),
    check(
      'dian_sync_runs_mailbox_check',
      sql`(${t.channel} = 'imap') = (${t.mailboxId} is not null)`,
    ),
    check('dian_sync_runs_period_check', sql`${t.periodEnd} >= ${t.periodStart}`),
    check(
      'dian_sync_runs_finished_check',
      sql`(${t.status} in ('succeeded', 'partial', 'failed')) = (${t.finishedAt} is not null)`,
    ),
    check(
      'dian_sync_runs_counts_check',
      sql`${t.listedCount} >= 0 and ${t.newCount} >= 0 and ${t.existingCount} >= 0
        and ${t.xmlDownloadedCount} >= 0 and ${t.failedCount} >= 0`,
    ),
  ],
);
