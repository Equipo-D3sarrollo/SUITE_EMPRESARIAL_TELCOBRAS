-- Reverso de 0013_datadian_received_documents_v2.sql (ARQUITECTURA_DB_DATADIAN.md §10.1). NO es una
-- migración: revertir en un entorno real es una migración nueva con este SQL (y el esquema Drizzle de
-- received-documents.ts anterior). Las migraciones 0014 a 0017 deben revertirse antes que esta.
-- Restaurar import_id NOT NULL falla si ya hay facturas que entraron por una sincronización: primero hay
-- que decidir qué hacer con ellas (no se borran: §2.2).
DROP TABLE app.received_document_taxes;
DROP TRIGGER received_documents_guard ON app.received_documents;
DROP FUNCTION app.received_documents_guard();
REVOKE ALL ON app.received_documents FROM app_worker;
DROP POLICY tenant_select ON app.received_documents;
DROP POLICY tenant_insert ON app.received_documents;
DROP POLICY tenant_update ON app.received_documents;
CREATE POLICY tenant_isolation ON app.received_documents
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
ALTER TABLE app.received_documents
  DROP CONSTRAINT received_documents_attached_document_fk,
  DROP CONSTRAINT received_documents_sync_run_fk,
  DROP CONSTRAINT received_documents_organization_id_id_key,
  DROP CONSTRAINT received_documents_origin_check,
  DROP CONSTRAINT received_documents_legacy_source_check,
  DROP CONSTRAINT received_documents_cufe_check,
  DROP CONSTRAINT received_documents_valid_xml_check,
  DROP CONSTRAINT received_documents_issuer_nit_check,
  DROP CONSTRAINT received_documents_buyer_nit_check,
  DROP CONSTRAINT received_documents_payment_form_check,
  DROP CONSTRAINT received_documents_profile_execution_id_check,
  DROP CONSTRAINT received_documents_ingestion_source_check,
  DROP CONSTRAINT received_documents_validation_status_check,
  DROP CONSTRAINT received_documents_radian_status_check;
DROP INDEX app.received_documents_radian_status_idx;
DROP INDEX app.received_documents_claim_deadline_idx;
DROP INDEX app.received_documents_issuer_nit_idx;
DROP INDEX app.received_documents_issue_date_idx;
DROP INDEX app.received_documents_validation_status_idx;
ALTER TABLE app.received_documents
  DROP COLUMN issued_at,
  DROP COLUMN due_date,
  DROP COLUMN dian_validated_at,
  DROP COLUMN buyer_nit,
  DROP COLUMN currency,
  DROP COLUMN subtotal,
  DROP COLUMN tax_total,
  DROP COLUMN payment_form,
  DROP COLUMN payment_means_code,
  DROP COLUMN ubl_type_code,
  DROP COLUMN profile_execution_id,
  DROP COLUMN attached_document_file_id,
  DROP COLUMN ingestion_source,
  DROP COLUMN sync_run_id,
  DROP COLUMN validation_status,
  DROP COLUMN validation_errors,
  DROP COLUMN validated_at,
  DROP COLUMN pre_xml_snapshot,
  DROP COLUMN radian_status,
  DROP COLUMN radian_status_at,
  DROP COLUMN claim_deadline_at,
  DROP COLUMN deadline_rule_version;
ALTER TABLE app.received_documents ALTER COLUMN import_id SET NOT NULL;
