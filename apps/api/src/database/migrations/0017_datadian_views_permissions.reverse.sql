-- Reverso de 0017_datadian_views_permissions.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una migración:
-- revertir en un entorno real es una migración nueva con este SQL. Primero se quitan las asignaciones de
-- los permisos (con FORCE levantado, como en la 0005) y luego el catálogo.
DROP VIEW app.received_documents_radian;
DROP VIEW app.dian_certificate_status;
ALTER TABLE app.role_permissions NO FORCE ROW LEVEL SECURITY;
DELETE FROM app.role_permissions WHERE permission_key IN ('documents:events', 'documents:sync');
ALTER TABLE app.role_permissions FORCE ROW LEVEL SECURITY;
DELETE FROM app.permissions WHERE key IN ('documents:events', 'documents:sync');
