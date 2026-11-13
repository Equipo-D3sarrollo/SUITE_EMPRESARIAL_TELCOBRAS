-- Reverso de 0016_datadian_odoo_links.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración: revertir
-- en un entorno real es una migración nueva con este SQL (y el esquema Drizzle sin datadian-odoo.ts). La
-- 0017 debe revertirse antes. Los datos de Odoo siguen en received_documents.odoo_*.
DROP TABLE app.odoo_document_links;
REVOKE ALL ON app.audit_logs, app.organizations, app.odoo_connections FROM app_worker;
