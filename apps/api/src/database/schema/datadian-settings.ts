import {
  DIAN_CERTIFICATE_STATUSES,
  DIAN_ENVIRONMENTS,
  DIAN_OPERATION_MODES,
  IMAP_AUTH_METHODS,
} from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  char,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  smallint,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import type { EncryptedSecret } from '../../common/credentials-cipher.js';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, oneOf, updatedAt } from './columns.js';
import { organizations } from './organizations.js';

// DataDian, subetapa 2.3 (ARQUITECTURA_DB_DATADIAN.md §5.1 a §5.3, migración 0011). Las columnas secretas
// (software_pin, password, pfx_data_key, secret) no las lee app_user: SELECT por columna (§9.3). La API
// consulta estas tablas con selecciones explícitas, nunca con select() sin columnas ni RETURNING *.

/** Certificado .pfx de una organización. El archivo va cifrado en S3, nunca en la base (§5.2). */
export const dianCertificates = appSchema.table(
  'dian_certificates',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    storageKey: text('storage_key').notNull(),
    pfxDataKey: jsonb('pfx_data_key').$type<EncryptedSecret['key']>().notNull(),
    pfxSha256: char('pfx_sha256', { length: 64 }).notNull(),
    pfxSizeBytes: integer('pfx_size_bytes').notNull(),
    password: jsonb('password').$type<EncryptedSecret>().notNull(),
    status: text('status', { enum: DIAN_CERTIFICATE_STATUSES })
      .notNull()
      .default('pending_validation'),
    serialNumber: text('serial_number'),
    subjectNit: text('subject_nit'),
    subjectDn: text('subject_dn'),
    issuerDn: text('issuer_dn'),
    notBefore: nullableTimestamp('not_before'),
    notAfter: nullableTimestamp('not_after'),
    signatureAlgorithm: text('signature_algorithm'),
    keyUsageOk: boolean('key_usage_ok'),
    chainOk: boolean('chain_ok'),
    validationErrors: jsonb('validation_errors').$type<unknown[]>().notNull().default([]),
    uploadedBy: uuid('uploaded_by').notNull(),
    validatedAt: nullableTimestamp('validated_at'),
    retiredAt: nullableTimestamp('retired_at'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('dian_certificates_organization_id_id_key').on(t.organizationId, t.id),
    unique('dian_certificates_storage_key_key').on(t.storageKey),
    unique('dian_certificates_organization_id_pfx_sha256_key').on(t.organizationId, t.pfxSha256),
    index('dian_certificates_expiry_idx').on(t.organizationId, t.notAfter),
    oneOf('dian_certificates_status_check', t.status, DIAN_CERTIFICATE_STATUSES),
    check('dian_certificates_pfx_sha256_check', sql`${t.pfxSha256} ~ '^[0-9a-f]{64}$'`),
    check(
      'dian_certificates_pfx_size_bytes_check',
      sql`${t.pfxSizeBytes} > 0 and ${t.pfxSizeBytes} <= 65536`,
    ),
    check(
      'dian_certificates_valid_check',
      sql`${t.status} <> 'valid' or (${t.serialNumber} is not null and ${t.subjectNit} is not null
        and ${t.notBefore} is not null and ${t.notAfter} is not null
        and ${t.keyUsageOk} is true and ${t.chainOk} is true)`,
    ),
    check('dian_certificates_validity_check', sql`${t.notAfter} > ${t.notBefore}`),
    check(
      'dian_certificates_retired_check',
      sql`${t.status} <> 'retired' or ${t.retiredAt} is not null`,
    ),
  ],
);

/** Configuración DIAN de una organización: una fila por organización, como odoo_connections (§5.1). */
export const dianSettings = appSchema.table(
  'dian_settings',
  {
    organizationId: uuid('organization_id')
      .primaryKey()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    nit: text('nit').notNull(),
    nitDv: char('nit_dv', { length: 1 }),
    environment: char('environment', { length: 1, enum: DIAN_ENVIRONMENTS }).notNull().default('2'),
    operationMode: text('operation_mode', { enum: DIAN_OPERATION_MODES })
      .notNull()
      .default('own_software'),
    softwareId: text('software_id'),
    softwarePin: jsonb('software_pin').$type<EncryptedSecret>(),
    testSetId: text('test_set_id'),
    activeCertificateId: uuid('active_certificate_id'),
    rpaEnabled: boolean('rpa_enabled').notNull().default(false),
    imapEnabled: boolean('imap_enabled').notNull().default(false),
    syncLookbackDays: smallint('sync_lookback_days').notNull().default(30),
    updatedBy: uuid('updated_by').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    // NIT único entre organizaciones (§5.1, decisión aceptada): evita eventos duplicados por la misma empresa.
    unique('dian_settings_nit_key').on(t.nit),
    foreignKey({
      name: 'dian_settings_active_certificate_fk',
      columns: [t.organizationId, t.activeCertificateId],
      foreignColumns: [dianCertificates.organizationId, dianCertificates.id],
    }),
    check('dian_settings_nit_check', sql`${t.nit} ~ '^[0-9]{5,15}$'`),
    check('dian_settings_nit_dv_check', sql`${t.nitDv} ~ '^[0-9]$'`),
    oneOf('dian_settings_environment_check', t.environment, DIAN_ENVIRONMENTS),
    oneOf('dian_settings_operation_mode_check', t.operationMode, DIAN_OPERATION_MODES),
    check(
      'dian_settings_software_id_check',
      sql`${t.softwareId} ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'`,
    ),
    check(
      'dian_settings_software_complete_check',
      sql`(${t.softwareId} is null) = (${t.softwarePin} is null)`,
    ),
    check('dian_settings_sync_lookback_days_check', sql`${t.syncLookbackDays} between 1 and 92`),
  ],
);

/** Buzón de correo que Telco lee para recibir facturas, con su cursor IMAP (§5.3). */
export const imapMailboxes = appSchema.table(
  'imap_mailboxes',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    host: text('host').notNull(),
    port: integer('port').notNull().default(993),
    useTls: boolean('use_tls').notNull().default(true),
    username: text('username').notNull(),
    authMethod: text('auth_method', { enum: IMAP_AUTH_METHODS }).notNull().default('password'),
    secret: jsonb('secret').$type<EncryptedSecret>().notNull(),
    folder: text('folder').notNull().default('INBOX'),
    uidValidity: bigint('uid_validity', { mode: 'bigint' }),
    lastUid: bigint('last_uid', { mode: 'bigint' }),
    enabled: boolean('enabled').notNull().default(true),
    updatedBy: uuid('updated_by').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('imap_mailboxes_organization_id_id_key').on(t.organizationId, t.id),
    unique('imap_mailboxes_mailbox_key').on(t.organizationId, t.host, t.username, t.folder),
    check('imap_mailboxes_port_check', sql`${t.port} between 1 and 65535`),
    oneOf('imap_mailboxes_auth_method_check', t.authMethod, IMAP_AUTH_METHODS),
  ],
);
