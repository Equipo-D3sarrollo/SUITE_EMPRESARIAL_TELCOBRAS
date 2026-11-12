import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  check,
  date,
  integer,
  primaryKey,
  smallint,
  text,
  time,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, nullableTimestamp, oneOf } from './columns.js';

// Calendario y reglas de plazo de DataDian (migración 0010, ARQUITECTURA_DB_DATADIAN.md §7.4 y §7.5).
// Tablas globales, sin organization_id ni RLS, como permissions: app_user y app_worker solo leen;
// se modifican únicamente por migración (app_owner).

/** Festivos de Colombia. La tabla, no la función co_holidays_compute, es la fuente de verdad. */
export const coHolidays = appSchema.table(
  'co_holidays',
  {
    day: date('day').primaryKey(),
    name: text('name').notNull(),
    rule: text('rule').notNull(),
    legalBasis: text('legal_basis').notNull(),
    createdAt: createdAt(),
  },
  (t) => [oneOf('co_holidays_rule_check', t.rule, ['fixed', 'emiliani', 'easter', 'manual'])],
);

/** Años cubiertos por co_holidays: las funciones de día hábil y de plazo fallan (DD006) fuera de ellos. */
export const coHolidayYears = appSchema.table(
  'co_holiday_years',
  {
    year: smallint('year').primaryKey(),
    source: text('source').notNull(),
    verifiedAt: nullableTimestamp('verified_at'),
    seededAt: nullableTimestamp('seeded_at').notNull().defaultNow(),
  },
  (t) => [oneOf('co_holiday_years_source_check', t.source, ['computed', 'manual'])],
);

/**
 * Reglas versionadas del plazo de reclamo y de la aceptación tácita, contado desde el 032.
 * Una sola versión activa por clave; cambiar de regla es una migración de datos, no de código.
 */
export const radianDeadlineRules = appSchema.table(
  'radian_deadline_rules',
  {
    key: text('key').notNull(),
    version: integer('version').notNull(),
    unit: text('unit').notNull(),
    amount: integer('amount').notNull(),
    anchorEvent: char('anchor_event', { length: 3 }).notNull(),
    anchorField: text('anchor_field').notNull(),
    startMode: text('start_mode').notNull(),
    // Hora local de corte del último día (solo business_days). 23:59:59.999 = fin del día.
    cutoffLocal: time('cutoff_local', { precision: 3 }).notNull().default('23:59:59.999'),
    // Días ISO no hábiles (6 sábado, 7 domingo).
    nonWorkingIsodow: smallint('non_working_isodow')
      .array()
      .notNull()
      .default(sql`'{6,7}'::smallint[]`),
    timezone: text('timezone').notNull().default('America/Bogota'),
    active: boolean('active').notNull().default(false),
    verified: boolean('verified').notNull().default(false),
    source: text('source').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.key, t.version] }),
    uniqueIndex('radian_deadline_rules_one_active_idx').on(t.key).where(sql`${t.active}`),
    check('radian_deadline_rules_version_check', sql`${t.version} > 0`),
    check('radian_deadline_rules_amount_check', sql`${t.amount} > 0`),
    oneOf('radian_deadline_rules_unit_check', t.unit, ['business_days', 'business_hours']),
    oneOf('radian_deadline_rules_anchor_event_check', t.anchorEvent, [
      '030',
      '031',
      '032',
      '033',
      '034',
    ]),
    oneOf('radian_deadline_rules_anchor_field_check', t.anchorField, [
      'dian_registered_at',
      'generated_at',
    ]),
    oneOf('radian_deadline_rules_start_mode_check', t.startMode, [
      'next_business_day',
      'same_instant',
    ]),
    // Solo las combinaciones que radian_deadline define: días hábiles desde el día hábil siguiente
    // y horas hábiles desde el mismo instante.
    check(
      'radian_deadline_rules_unit_start_mode_check',
      sql`(${t.unit} = 'business_days') = (${t.startMode} = 'next_business_day')`,
    ),
    check(
      'radian_deadline_rules_non_working_isodow_check',
      sql`${t.nonWorkingIsodow} <@ '{1,2,3,4,5,6,7}'::smallint[] and cardinality(${t.nonWorkingIsodow}) < 7`,
    ),
  ],
);
