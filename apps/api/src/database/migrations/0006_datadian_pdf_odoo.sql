CREATE TABLE "app"."odoo_connections" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"base_url" text NOT NULL,
	"database" text NOT NULL,
	"api_key" jsonb NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."received_documents" DROP CONSTRAINT "received_documents_status_check";--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pdf_object_key" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pdf_file_name" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pdf_sha256" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pdf_size_bytes" integer;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pdf_uploaded_by" uuid;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "pdf_uploaded_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "odoo_status" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "odoo_move_id" integer;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "odoo_attachment_id" integer;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "odoo_error" text;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD COLUMN "odoo_sent_at" timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "app"."odoo_connections" ADD CONSTRAINT "odoo_connections_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_odoo_status_check" CHECK ("app"."received_documents"."odoo_status" in ('pending', 'sent', 'failed'));--> statement-breakpoint
ALTER TABLE "app"."received_documents" ADD CONSTRAINT "received_documents_status_check" CHECK ("app"."received_documents"."status" in ('imported', 'draft', 'approved', 'rejected'));--> statement-breakpoint

-- odoo_connections: una fila por organización, aislada con RLS como las demás tablas de negocio.
ALTER TABLE app.odoo_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.odoo_connections FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON app.odoo_connections
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE ON app.odoo_connections TO app_user;
--> statement-breakpoint

-- Datos propios de la suite sobre la factura: el PDF ya abierto y el envío a Odoo.
-- Los campos de la DIAN siguen sin privilegio de UPDATE (DD-12).
GRANT UPDATE (
  pdf_object_key, pdf_file_name, pdf_sha256, pdf_size_bytes, pdf_uploaded_by, pdf_uploaded_at,
  odoo_status, odoo_move_id, odoo_attachment_id, odoo_error, odoo_sent_at
) ON app.received_documents TO app_user;
--> statement-breakpoint

-- Permiso nuevo: configurar la conexión con Odoo. Lo recibe el rol propietario de cada organización.
INSERT INTO app.permissions (key) VALUES ('documents:configure') ON CONFLICT DO NOTHING;
--> statement-breakpoint
ALTER TABLE app.roles NO FORCE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions NO FORCE ROW LEVEL SECURITY;
INSERT INTO app.role_permissions (organization_id, role_id, permission_key)
  SELECT r.organization_id, r.id, 'documents:configure'
  FROM app.roles r
  WHERE r.is_system AND r.key = 'owner'
  ON CONFLICT DO NOTHING;
ALTER TABLE app.roles FORCE ROW LEVEL SECURITY;
ALTER TABLE app.role_permissions FORCE ROW LEVEL SECURITY;
