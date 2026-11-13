CREATE TABLE "app"."received_document_taxes" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"received_document_id" uuid NOT NULL,
	"tax_scheme_id" text NOT NULL,
	"percent" numeric(7, 4),
	"taxable_amount" numeric(18, 2) NOT NULL,
	"tax_amount" numeric(18, 2) NOT NULL,
	"is_withholding" boolean NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."received_documents" ALTER COLUMN "import_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "issued_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "due_date" date;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "dian_validated_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "buyer_nit" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "currency" char(3);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "subtotal" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "tax_total" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "payment_form" char(1);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "payment_means_code" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "ubl_type_code" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "profile_execution_id" char(1);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "attached_document_file_id" uuid;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "ingestion_source" text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "sync_run_id" uuid;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "validation_status" text DEFAULT 'pending_xml' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "validation_errors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "validated_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pre_xml_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "radian_status" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "radian_status_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "claim_deadline_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "deadline_rule_version" integer;--> statement-breakpoint
ALTER TABLE "app"."received_document_taxes" ADD CONSTRAINT "received_document_taxes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_organization_id_id_key" UNIQUE("organization_id","id");--> statement-breakpoint
ALTER TABLE "app"."received_document_taxes" ADD CONSTRAINT "received_document_taxes_document_fk" FOREIGN KEY ("organization_id","received_document_id") REFERENCES "app"."received_documents"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "received_document_taxes_scheme_key" ON "app"."received_document_taxes" USING btree ("organization_id","received_document_id","tax_scheme_id","is_withholding",coalesce("percent", -1));--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_attached_document_fk" FOREIGN KEY ("organization_id","attached_document_file_id") REFERENCES "app"."dian_files"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_sync_run_fk" FOREIGN KEY ("organization_id","sync_run_id") REFERENCES "app"."dian_sync_runs"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "received_documents_radian_status_idx" ON "app"."received_documents" USING btree ("organization_id","radian_status","created_at","id");--> statement-breakpoint
CREATE INDEX "received_documents_claim_deadline_idx" ON "app"."received_documents" USING btree ("organization_id","claim_deadline_at") WHERE "app"."received_documents"."radian_status" = 'goods_received';--> statement-breakpoint
CREATE INDEX "received_documents_issuer_nit_idx" ON "app"."received_documents" USING btree ("organization_id","issuer_nit");--> statement-breakpoint
CREATE INDEX "received_documents_issue_date_idx" ON "app"."received_documents" USING btree ("organization_id","issue_date","id");--> statement-breakpoint
CREATE INDEX "received_documents_validation_status_idx" ON "app"."received_documents" USING btree ("organization_id","validation_status") WHERE "app"."received_documents"."validation_status" <> 'valid';--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_origin_check" CHECK (num_nonnulls("app"."received_documents"."import_id", "app"."received_documents"."sync_run_id") = 1);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_legacy_source_check" CHECK ("app"."received_documents"."import_id" is null or "app"."received_documents"."ingestion_source" = 'manual');--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_cufe_check" CHECK ("app"."received_documents"."cufe" ~ '^[0-9a-f]{96}$') NOT VALID;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_valid_xml_check" CHECK ("app"."received_documents"."validation_status" <> 'valid' or "app"."received_documents"."attached_document_file_id" is not null);--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_issuer_nit_check" CHECK ("app"."received_documents"."issuer_nit" ~ '^[0-9]{5,15}$') NOT VALID;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_buyer_nit_check" CHECK ("app"."received_documents"."buyer_nit" ~ '^[0-9]{5,15}$');--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_payment_form_check" CHECK ("app"."received_documents"."payment_form" in ('1', '2'));--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_profile_execution_id_check" CHECK ("app"."received_documents"."profile_execution_id" in ('1', '2'));--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_ingestion_source_check" CHECK ("app"."received_documents"."ingestion_source" in ('rpa', 'imap', 'manual'));--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_validation_status_check" CHECK ("app"."received_documents"."validation_status" in ('pending_xml', 'pending_validation', 'valid', 'invalid'));--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_radian_status_check" CHECK ("app"."received_documents"."radian_status" in ('none', 'acknowledged', 'goods_received', 'claimed', 'accepted_express', 'accepted_tacit'));
--> statement-breakpoint

-- DataDian, subetapa 2.5: received_documents evolucionada y received_document_taxes
-- (ARQUITECTURA_DB_DATADIAN.md §4, §5.6, §5.7 y §9). Reverso: 0013_datadian_received_documents_v2.reverse.sql.
--
-- Filas existentes: los defaults constantes las dejan con ingestion_source = 'manual' (el Excel se subía a
-- mano), validation_status = 'pending_xml' y radian_status = 'none', sin reescribir la tabla.
-- Desviación (§10.3): ingestion_source conserva el default 'manual' para el lote legado (import_id), que
-- sigue insertando sin ese campo hasta la contracción de la Etapa 4; received_documents_legacy_source_check
-- impide usarlo con otra fuente. Telco lo fija siempre con sync_run_id.
-- El CHECK del CUFE y el del NIT del emisor quedan NOT VALID: las filas antiguas pueden traer mayúsculas,
-- CUFE anteriores al SHA-384 o el NIT con dígito de verificación (POR VERIFICAR 9). Se validan aparte.

-- Inmutabilidad de los datos de origen (§5.6). También frena a app_owner. pre_xml_snapshot solo lo escribe
-- este disparador.
CREATE FUNCTION app.received_documents_guard() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
DECLARE
  source_columns constant text[] := ARRAY[
    'document_type', 'folio', 'prefix', 'issue_date', 'issued_at', 'due_date', 'received_at',
    'dian_validated_at', 'issuer_nit', 'issuer_name', 'buyer_nit', 'currency', 'subtotal', 'tax_total',
    'iva', 'inc', 'total', 'payment_form', 'payment_means_code', 'ubl_type_code', 'profile_execution_id'];
  v_old constant jsonb := to_jsonb(OLD);
  v_new constant jsonb := to_jsonb(NEW);
  v_changed text[];
BEGIN
  IF ROW(NEW.id, NEW.organization_id, NEW.cufe, NEW.created_at)
     IS DISTINCT FROM ROW(OLD.id, OLD.organization_id, OLD.cufe, OLD.created_at) THEN
    RAISE EXCEPTION 'El id, la organización, el CUFE y la fecha de ingreso de una factura no cambian'
      USING ERRCODE = 'DD005';
  END IF;

  v_changed := ARRAY(SELECT c FROM unnest(source_columns) AS c WHERE v_old -> c IS DISTINCT FROM v_new -> c);

  IF OLD.attached_document_file_id IS NOT NULL THEN
    -- Con XML: los datos de origen y el XML quedan congelados.
    IF NEW.attached_document_file_id IS DISTINCT FROM OLD.attached_document_file_id
       OR cardinality(v_changed) > 0 THEN
      RAISE EXCEPTION 'La factura ya tiene su XML: no cambian %',
        coalesce(nullif(array_to_string(v_changed, ', '), ''), 'el XML')
        USING ERRCODE = 'DD005';
    END IF;
  ELSIF NEW.attached_document_file_id IS NOT NULL THEN
    -- Llega el XML: se guardan los valores del listado que el XML sobrescribe.
    NEW.pre_xml_snapshot := (
      SELECT jsonb_object_agg(c, v_old -> c) FROM unnest(v_changed) AS c
       WHERE v_old -> c <> 'null'::jsonb);
    RETURN NEW;
  END IF;

  NEW.pre_xml_snapshot := OLD.pre_xml_snapshot;
  RETURN NEW;
END
$$;
--> statement-breakpoint
CREATE TRIGGER received_documents_guard
  BEFORE UPDATE ON app.received_documents
  FOR EACH ROW EXECUTE FUNCTION app.received_documents_guard();
REVOKE ALL ON FUNCTION app.received_documents_guard() FROM PUBLIC;
--> statement-breakpoint

-- Políticas por comando sin DELETE (§4.2 punto 4 y §9.2): tenant_isolation también cubría DELETE.
DROP POLICY tenant_isolation ON app.received_documents;
CREATE POLICY tenant_select ON app.received_documents FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.received_documents FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_update ON app.received_documents FOR UPDATE
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.received_document_taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.received_document_taxes FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.received_document_taxes FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.received_document_taxes FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios (§9.3). app_user conserva lo de hoy (SELECT, INSERT y UPDATE de la decisión, del PDF y de
-- Odoo); no recibe nada nuevo. Nadie tiene UPDATE sobre radian_status, radian_status_at,
-- claim_deadline_at, deadline_rule_version ni pre_xml_snapshot: los escriben los disparadores.
GRANT SELECT, INSERT ON app.received_documents TO app_worker;
GRANT UPDATE (document_type, folio, prefix, issue_date, issued_at, due_date, received_at,
              dian_validated_at, issuer_nit, issuer_name, buyer_nit, currency, subtotal, tax_total, iva,
              inc, total, payment_form, payment_means_code, ubl_type_code, profile_execution_id,
              attached_document_file_id, validation_status, validation_errors, validated_at,
              sync_run_id, updated_at)
  ON app.received_documents TO app_worker;
GRANT SELECT ON app.received_document_taxes TO app_user;
GRANT SELECT, INSERT ON app.received_document_taxes TO app_worker;
