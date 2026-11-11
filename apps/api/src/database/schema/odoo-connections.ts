import { jsonb, text, uuid } from 'drizzle-orm/pg-core';
import type { EncryptedSecret } from '../../common/credentials-cipher.js';
import { appSchema } from './app-schema.js';
import { createdAt, updatedAt } from './columns.js';
import { organizations } from './organizations.js';

/**
 * Conexión de una organización con su Odoo 19 (API JSON-2). Una por organización.
 * La API key se guarda con cifrado envolvente (ADR-009) y nunca sale hacia el navegador.
 */
export const odooConnections = appSchema.table('odoo_connections', {
  organizationId: uuid('organization_id')
    .primaryKey()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  baseUrl: text('base_url').notNull(),
  database: text('database').notNull(),
  apiKey: jsonb('api_key').$type<EncryptedSecret>().notNull(),
  updatedBy: uuid('updated_by').notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
