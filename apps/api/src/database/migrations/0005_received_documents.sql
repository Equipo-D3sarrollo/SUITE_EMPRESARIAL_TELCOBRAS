CREATE TABLE "app"."received_document_imports" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_sha256" text NOT NULL,
	"total_rows" integer NOT NULL,
	"created_count" integer NOT NULL,
	"existing_count" integer NOT NULL,
	"rejected_count" integer NOT NULL,
	"imported_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "received_document_imports_organization_id_id_key" UNIQUE("organization_id","id")
);
--> statement-breakpoint
CREATE TABLE "app"."received_documents" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"import_id" uuid NOT NULL,
	"document_type" text,
	"cufe" text NOT NULL,
	"folio" text,
	"prefix" text,
	"payment_method" text,
	"issue_date" date,
	"issuer_nit" text,
	"issuer_name" text,
	"iva" numeric(18, 2),
	"inc" numeric(18, 2),
	"total" numeric(18, 2),
	"dian_status" text,
	"dian_group" text,
	"cost_center" text,
	"payment_type" text,
	"acknowledgment_status" text,
	"invoice_reference" text,
	"observations" text,
	"status" text DEFAULT 'imported' NOT NULL,
	"decided_by" uuid,
	"decided_at" timestamp (3) with time zone,
	"decision_reason" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "received_documents_organization_id_cufe_key" UNIQUE("organization_id","cufe"),
	CONSTRAINT "received_documents_status_check" CHECK ("app"."received_documents"."status" in ('imported', 'approved', 'rejected'))
);
--> statement-breakpoint
ALTER TABLE "app"."received_document_imports" ADD CONSTRAINT "received_document_imports_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_import_fk" FOREIGN KEY ("organization_id","import_id") REFERENCES "app"."received_document_imports"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "received_document_imports_cursor_idx" ON "app"."received_document_imports" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "received_documents_cursor_idx" ON "app"."received_documents" USING btree ("organization_id","created_at","id");--> statement-breakpoint
CREATE INDEX "received_documents_status_idx" ON "app"."received_documents" USING btree ("organization_id","status","created_at","id");--> statement-breakpoint

-- Aislamiento por organización, igual que en 0001_rls.sql.
ALTER TABLE app.received_document_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.received_document_imports FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.received_document_imports
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.received_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.received_documents FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.received_documents
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios de app_user. Las cargas son un registro: se insertan y se leen, nunca cambian.
GRANT SELECT, INSERT ON app.received_document_imports TO app_user;
-- Los datos de la DIAN no se modifican (DD-12): app_user solo actualiza la decisión interna.
-- Sin DELETE: el borrado definitivo espera la regla de retención legal.
GRANT SELECT, INSERT ON app.received_documents TO app_user;
GRANT UPDATE (status, decided_by, decided_at, decision_reason, updated_at)
  ON app.received_documents TO app_user;
--> statement-breakpoint

-- Permisos nuevos de DataDian en el catálogo global.
INSERT INTO app.permissions (key) VALUES ('documents:import'), ('documents:decide')
  ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- Los roles semilla que ya existen reciben los permisos nuevos: owner (todos) y accountant.
-- FORCE RLS también restringe a app_owner, así que se levanta solo durante esta carga.
-- La migración corre en una transacción: si algo falla, FORCE queda como estaba.
ALTER TABLE app.roles NO FORCE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions NO FORCE ROW LEVEL SECURITY;
INSERT INTO app.role_permissions (organization_id, role_id, permission_key)
  SELECT r.organization_id, r.id, p.key
  FROM app.roles r
  CROSS JOIN (VALUES ('documents:import'), ('documents:decide')) AS p(key)
  WHERE r.is_system AND r.key IN ('owner', 'accountant')
  ON CONFLICT DO NOTHING;
ALTER TABLE app.roles FORCE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions FORCE ROW LEVEL SECURITY;
