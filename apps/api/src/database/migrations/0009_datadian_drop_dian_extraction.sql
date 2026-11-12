DROP TABLE "app"."dian_extraction_jobs" CASCADE;--> statement-breakpoint
DROP TABLE "app"."dian_sessions" CASCADE;--> statement-breakpoint

-- Con las dos tablas de la 0008 caen sus políticas de RLS, sus privilegios, sus restricciones y su
-- tipo de fila. received_documents.received_at, que también añadió la 0008, se conserva.

-- El permiso documents:import queda fuera del catálogo: ningún flujo lo usa.
-- FORCE RLS también restringe a app_owner, así que se levanta solo durante este borrado.
-- La migración corre en una transacción: si algo falla, FORCE queda como estaba.
ALTER TABLE app.role_permissions NO FORCE ROW LEVEL SECURITY;
DELETE FROM app.role_permissions WHERE permission_key = 'documents:import';
ALTER TABLE app.role_permissions FORCE ROW LEVEL SECURITY;
DELETE FROM app.permissions WHERE key = 'documents:import';
