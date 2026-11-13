import {
  CLAIM_CODES,
  DIAN_ENVIRONMENTS,
  RADIAN_ATTEMPT_OUTCOMES,
  RADIAN_EVENT_ACTORS,
  RADIAN_EVENT_CODES,
  RADIAN_EVENT_ORIGINS,
  RADIAN_EVENT_STATUSES,
} from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  text,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { dianFiles } from './datadian-files.js';
import { dianCertificates } from './datadian-settings.js';
import { organizations } from './organizations.js';
import { receivedDocuments } from './received-documents.js';

// DataDian, subetapa 2.6 (ARQUITECTURA_DB_DATADIAN.md §6 y §7.1 a §7.4, migración 0014).

type ErrorTrace = { code: string; message: string }[];

/**
 * Reglas de precedencia de los eventos RADIAN (catálogo global, sin RLS, solo lectura para la aplicación).
 * Las cambia una migración, sin tocar código (§6.1). Sin verificar contra la fuente primaria.
 */
export const radianEventRules = appSchema.table(
  'radian_event_rules',
  {
    eventCode: char('event_code', { length: 3, enum: RADIAN_EVENT_CODES }).primaryKey(),
    name: text('name').notNull(),
    actor: text('actor', { enum: RADIAN_EVENT_ACTORS }).notNull(),
    requires: char('requires', { length: 3 }).array().notNull().default(sql`'{}'::char(3)[]`),
    blockedBy: char('blocked_by', { length: 3 }).array().notNull().default(sql`'{}'::char(3)[]`),
    terminal: boolean('terminal').notNull(),
    claimCodeRequired: boolean('claim_code_required').notNull().default(false),
    enforceClaimDeadline: boolean('enforce_claim_deadline').notNull().default(false),
    verified: boolean('verified').notNull().default(false),
    source: text('source').notNull(),
    updatedAt: updatedAt(),
  },
  (t) => [
    oneOf('radian_event_rules_event_code_check', t.eventCode, RADIAN_EVENT_CODES),
    oneOf('radian_event_rules_actor_check', t.actor, RADIAN_EVENT_ACTORS),
  ],
);

/** Cadena de eventos RADIAN de cada factura (§6.2). Los eventos se agregan, nunca se reescriben. */
export const radianEvents = appSchema.table(
  'radian_events',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    receivedDocumentId: uuid('received_document_id').notNull(),
    eventCode: char('event_code', { length: 3, enum: RADIAN_EVENT_CODES })
      .notNull()
      .references(() => radianEventRules.eventCode),
    actor: text('actor', { enum: RADIAN_EVENT_ACTORS }).notNull(),
    origin: text('origin', { enum: RADIAN_EVENT_ORIGINS }).notNull(),
    environment: char('environment', { length: 1, enum: DIAN_ENVIRONMENTS }).notNull(),
    status: text('status', { enum: RADIAN_EVENT_STATUSES }).notNull().default('pending'),
    claimCode: char('claim_code', { length: 2, enum: CLAIM_CODES }),
    claimNote: text('claim_note'),
    cude: text('cude'),
    generatedAt: nullableTimestamp('generated_at'),
    sentAt: nullableTimestamp('sent_at'),
    dianRegisteredAt: nullableTimestamp('dian_registered_at'),
    dianStatusCode: text('dian_status_code'),
    requestFileId: uuid('request_file_id'),
    responseFileId: uuid('response_file_id'),
    certificateId: uuid('certificate_id'),
    errorMessage: text('error_message'),
    errorTrace: jsonb('error_trace').$type<ErrorTrace>().notNull().default([]),
    attempts: integer('attempts').notNull().default(0),
    idempotencyKey: text('idempotency_key').notNull(),
    requestedBy: uuid('requested_by'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('radian_events_organization_id_id_key').on(t.organizationId, t.id),
    unique('radian_events_organization_id_cude_key').on(t.organizationId, t.cude),
    unique('radian_events_organization_id_idempotency_key_key').on(
      t.organizationId,
      t.idempotencyKey,
    ),
    foreignKey({
      name: 'radian_events_document_fk',
      columns: [t.organizationId, t.receivedDocumentId],
      foreignColumns: [receivedDocuments.organizationId, receivedDocuments.id],
    }),
    foreignKey({
      name: 'radian_events_request_file_fk',
      columns: [t.organizationId, t.requestFileId],
      foreignColumns: [dianFiles.organizationId, dianFiles.id],
    }),
    foreignKey({
      name: 'radian_events_response_file_fk',
      columns: [t.organizationId, t.responseFileId],
      foreignColumns: [dianFiles.organizationId, dianFiles.id],
    }),
    foreignKey({
      name: 'radian_events_certificate_fk',
      columns: [t.organizationId, t.certificateId],
      foreignColumns: [dianCertificates.organizationId, dianCertificates.id],
    }),
    // Un solo evento vivo (pending o accepted) por código, factura y ambiente (§7.2).
    uniqueIndex('radian_events_one_live_per_code')
      .on(t.organizationId, t.receivedDocumentId, t.eventCode, t.environment)
      .where(sql`${t.status} in ('pending', 'accepted')`),
    index('radian_events_timeline_idx').on(
      t.organizationId,
      t.receivedDocumentId,
      t.createdAt,
      t.id,
    ),
    index('radian_events_pending_idx')
      .on(t.organizationId, t.status)
      .where(sql`${t.status} = 'pending'`),
    oneOf('radian_events_actor_check', t.actor, RADIAN_EVENT_ACTORS),
    oneOf('radian_events_origin_check', t.origin, RADIAN_EVENT_ORIGINS),
    oneOf('radian_events_environment_check', t.environment, DIAN_ENVIRONMENTS),
    oneOf('radian_events_status_check', t.status, RADIAN_EVENT_STATUSES),
    oneOf('radian_events_claim_code_check', t.claimCode, CLAIM_CODES),
    check('radian_events_cude_check', sql`${t.cude} ~ '^[0-9a-f]{96}$'`),
    check('radian_events_attempts_check', sql`${t.attempts} >= 0`),
    check(
      'radian_events_issuer_actor_check',
      sql`(${t.eventCode} = '034') = (${t.actor} = 'issuer')`,
    ),
    check('radian_events_suite_buyer_check', sql`${t.origin} = 'dian' or ${t.actor} = 'buyer'`),
    check(
      'radian_events_claim_check',
      sql`${t.origin} <> 'suite' or (${t.eventCode} = '031') = (${t.claimCode} is not null)`,
    ),
    check(
      'radian_events_requested_by_check',
      sql`${t.origin} <> 'suite' or ${t.requestedBy} is not null`,
    ),
    check(
      'radian_events_accepted_check',
      sql`${t.status} <> 'accepted' or (${t.cude} is not null and ${t.dianRegisteredAt} is not null)`,
    ),
    check(
      'radian_events_rejected_check',
      sql`${t.status} <> 'rejected' or ${t.responseFileId} is not null or ${t.origin} = 'dian'`,
    ),
    check(
      'radian_events_failed_check',
      sql`${t.status} <> 'failed' or ${t.errorMessage} is not null`,
    ),
  ],
);

/** Cada intento de envío de un evento (§6.4). Solo inserción. */
export const radianEventAttempts = appSchema.table(
  'radian_event_attempts',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    radianEventId: uuid('radian_event_id').notNull(),
    attemptNo: integer('attempt_no').notNull(),
    jobId: uuid('job_id'),
    startedAt: nullableTimestamp('started_at').notNull(),
    finishedAt: nullableTimestamp('finished_at'),
    outcome: text('outcome', { enum: RADIAN_ATTEMPT_OUTCOMES }).notNull(),
    httpStatus: integer('http_status'),
    dianStatusCode: text('dian_status_code'),
    requestFileId: uuid('request_file_id'),
    responseFileId: uuid('response_file_id'),
    errorTrace: jsonb('error_trace').$type<ErrorTrace>().notNull().default([]),
    durationMs: integer('duration_ms'),
  },
  (t) => [
    unique('radian_event_attempts_attempt_no_key').on(
      t.organizationId,
      t.radianEventId,
      t.attemptNo,
    ),
    foreignKey({
      name: 'radian_event_attempts_event_fk',
      columns: [t.organizationId, t.radianEventId],
      foreignColumns: [radianEvents.organizationId, radianEvents.id],
    }),
    foreignKey({
      name: 'radian_event_attempts_request_file_fk',
      columns: [t.organizationId, t.requestFileId],
      foreignColumns: [dianFiles.organizationId, dianFiles.id],
    }),
    foreignKey({
      name: 'radian_event_attempts_response_file_fk',
      columns: [t.organizationId, t.responseFileId],
      foreignColumns: [dianFiles.organizationId, dianFiles.id],
    }),
    oneOf('radian_event_attempts_outcome_check', t.outcome, RADIAN_ATTEMPT_OUTCOMES),
    check('radian_event_attempts_attempt_no_check', sql`${t.attemptNo} > 0`),
  ],
);
