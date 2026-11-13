import { ODOO_LINK_STATES } from '@telcobras/contracts';
import { sql } from 'drizzle-orm';
import { foreignKey, integer, text, unique, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, oneOf, updatedAt } from './columns.js';
import { radianEvents } from './datadian-radian.js';
import { odooConnections } from './odoo-connections.js';
import { organizations } from './organizations.js';
import { receivedDocuments } from './received-documents.js';

// DataDian, subetapa 2.8 (ARQUITECTURA_DB_DATADIAN.md §7.8, migración 0016).

/**
 * Vínculo de la factura con su movimiento de Odoo (para la Etapa 5). Reemplaza la búsqueda del CUFE en
 * narration. Guarda la base de Odoo del momento: si la organización cambia de Odoo, el move_id viejo no
 * se confunde con uno del nuevo.
 */
export const odooDocumentLinks = appSchema.table(
  'odoo_document_links',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    receivedDocumentId: uuid('received_document_id').notNull(),
    odooBaseUrl: text('odoo_base_url').notNull(),
    odooDatabase: text('odoo_database').notNull(),
    moveId: integer('move_id'),
    attachmentId: integer('attachment_id'),
    state: text('state', { enum: ODOO_LINK_STATES }).notNull(),
    triggerEventId: uuid('trigger_event_id'),
    lastError: text('last_error'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('odoo_document_links_document_database_key').on(
      t.organizationId,
      t.receivedDocumentId,
      t.odooDatabase,
    ),
    uniqueIndex('odoo_document_links_move_key')
      .on(t.organizationId, t.odooDatabase, t.moveId)
      .where(sql`${t.moveId} is not null`),
    // Sin DELETE sobre odoo_connections: la conexión no se borra con vínculos vivos.
    foreignKey({
      name: 'odoo_document_links_connection_fk',
      columns: [t.organizationId],
      foreignColumns: [odooConnections.organizationId],
    }),
    foreignKey({
      name: 'odoo_document_links_document_fk',
      columns: [t.organizationId, t.receivedDocumentId],
      foreignColumns: [receivedDocuments.organizationId, receivedDocuments.id],
    }),
    foreignKey({
      name: 'odoo_document_links_trigger_event_fk',
      columns: [t.organizationId, t.triggerEventId],
      foreignColumns: [radianEvents.organizationId, radianEvents.id],
    }),
    oneOf('odoo_document_links_state_check', t.state, ODOO_LINK_STATES),
  ],
);
