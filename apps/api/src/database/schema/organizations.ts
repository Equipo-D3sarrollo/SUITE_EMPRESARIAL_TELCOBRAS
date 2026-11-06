import { ORGANIZATION_SIZES } from '@telcobras/contracts';
import { char, text, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, oneOf } from './columns.js';

export const ORGANIZATION_STATUSES = ['active', 'suspended'] as const;

/** Organización cliente (tenant). Las demás tablas de negocio cuelgan de ella por organization_id. */
export const organizations = appSchema.table(
  'organizations',
  {
    id: id(),
    name: text('name').notNull(),
    legalName: text('legal_name').notNull(),
    nit: text('nit').notNull(),
    size: text('size', { enum: ORGANIZATION_SIZES }).notNull(),
    timezone: text('timezone').notNull().default('America/Bogota'),
    currency: char('currency', { length: 3 }).notNull().default('COP'),
    status: text('status', { enum: ORGANIZATION_STATUSES }).notNull().default('active'),
    createdBy: uuid('created_by').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    oneOf('organizations_size_check', t.size, ORGANIZATION_SIZES),
    oneOf('organizations_status_check', t.status, ORGANIZATION_STATUSES),
  ],
);
