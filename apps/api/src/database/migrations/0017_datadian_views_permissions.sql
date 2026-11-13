-- DataDian, subetapa 2.9: vistas y permisos (ARQUITECTURA_DB_DATADIAN.md §8.2, §9.4 y §10.2). Sin cambios de
-- tablas: migración personalizada de drizzle-kit (generate --custom). Reverso:
-- 0017_datadian_views_permissions.reverse.sql.

-- Vistas con security_invoker: corren con los privilegios y la RLS de quien consulta. Sin esa opción
-- correrían como su dueño y se saltarían la RLS. El estado que depende de la hora se calcula con now().
CREATE VIEW app.received_documents_radian WITH (security_invoker = true) AS
SELECT d.id, d.organization_id, d.cufe, d.document_type, d.prefix, d.folio, d.issue_date, d.issued_at,
       d.due_date, d.issuer_nit, d.issuer_name, d.buyer_nit, d.currency, d.total, d.payment_form,
       d.validation_status, d.radian_status, d.radian_status_at, d.claim_deadline_at,
       d.deadline_rule_version,
       CASE
         WHEN d.radian_status <> 'goods_received' OR d.claim_deadline_at IS NULL THEN 'none'
         WHEN now() > d.claim_deadline_at THEN 'expired'
         WHEN d.claim_deadline_at - now() < interval '24 hours' THEN 'due_soon'
         ELSE 'open'
       END AS deadline_state,
       -- Los eventos serían obligatorios solo a crédito (POR VERIFICAR 8).
       d.payment_form = '2' AS events_expected,
       -- Con 033 o 034 aceptados la factura es título valor y no admite notas (§7.3).
       d.radian_status IN ('accepted_express', 'accepted_tacit') AS notes_blocked,
       d.created_at, d.updated_at
  FROM app.received_documents d;
--> statement-breakpoint
CREATE VIEW app.dian_certificate_status WITH (security_invoker = true) AS
SELECT c.id, c.organization_id, c.status, c.serial_number, c.subject_nit, c.subject_dn, c.issuer_dn,
       c.not_before, c.not_after, c.signature_algorithm, c.validated_at, c.retired_at,
       floor(extract(epoch FROM c.not_after - now()) / 86400)::integer AS days_to_expiry,
       CASE
         WHEN c.not_after IS NULL THEN NULL
         WHEN c.not_after <= now() THEN 'expired'
         WHEN c.not_after - now() <= interval '90 days' THEN 'due_soon'
         ELSE 'ok'
       END AS expiry_state,
       c.created_at, c.updated_at
  FROM app.dian_certificates c;
--> statement-breakpoint
GRANT SELECT ON app.received_documents_radian, app.dian_certificate_status TO app_user, app_worker;
--> statement-breakpoint

-- Permisos nuevos de DataDian (§9.4) en el catálogo y en los roles semilla owner y accountant. FORCE RLS
-- también restringe a app_owner: se levanta solo durante esta carga, en la transacción de la migración.
INSERT INTO app.permissions (key) VALUES ('documents:events'), ('documents:sync') ON CONFLICT DO NOTHING;
ALTER TABLE app.roles NO FORCE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions NO FORCE ROW LEVEL SECURITY;
INSERT INTO app.role_permissions (organization_id, role_id, permission_key)
  SELECT r.organization_id, r.id, p.key
    FROM app.roles r
   CROSS JOIN (VALUES ('documents:events'), ('documents:sync')) AS p (key)
   WHERE r.is_system AND r.key IN ('owner', 'accountant')
  ON CONFLICT DO NOTHING;
ALTER TABLE app.roles FORCE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions FORCE ROW LEVEL SECURITY;
