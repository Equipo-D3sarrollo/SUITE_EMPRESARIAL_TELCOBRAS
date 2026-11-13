CREATE TABLE "app"."odoo_document_links" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"received_document_id" uuid NOT NULL,
	"odoo_base_url" text NOT NULL,
	"odoo_database" text NOT NULL,
	"move_id" integer,
	"attachment_id" integer,
	"state" text NOT NULL,
	"trigger_event_id" uuid,
	"last_error" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "odoo_document_links_document_database_key" UNIQUE("organization_id","received_document_id","odoo_database"),
	CONSTRAINT "odoo_document_links_state_check" CHECK ("app"."odoo_document_links"."state" in ('pending', 'created', 'failed', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "app"."odoo_document_links" ADD CONSTRAINT "odoo_document_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."odoo_document_links" ADD CONSTRAINT "odoo_document_links_connection_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."odoo_connections"("organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."odoo_document_links" ADD CONSTRAINT "odoo_document_links_document_fk" FOREIGN KEY ("organization_id","received_document_id") REFERENCES "app"."received_documents"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."odoo_document_links" ADD CONSTRAINT "odoo_document_links_trigger_event_fk" FOREIGN KEY ("organization_id","trigger_event_id") REFERENCES "app"."radian_events"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "odoo_document_links_move_key" ON "app"."odoo_document_links" USING btree ("organization_id","odoo_database","move_id") WHERE "app"."odoo_document_links"."move_id" is not null;
--> statement-breakpoint

-- DataDian, subetapa 2.8: vínculo con Odoo y privilegios de Telco sobre tablas existentes
-- (ARQUITECTURA_DB_DATADIAN.md §7.7, §7.8 y §9). Reverso: 0016_datadian_odoo_links.reverse.sql.

-- Copia de received_documents.odoo_* (las columnas siguen vivas hasta que la Etapa 5 cambie el código).
-- Se copian las facturas con odoo_move_id: el movimiento ya existe en Odoo. FORCE RLS también restringe a
-- app_owner, así que se levanta solo durante la copia (como la 0005); la migración corre en una
-- transacción.
ALTER TABLE app.received_documents NO FORCE ROW LEVEL SECURITY;
ALTER TABLE app.odoo_connections NO FORCE ROW LEVEL SECURITY;
INSERT INTO app.odoo_document_links
  (organization_id, received_document_id, odoo_base_url, odoo_database, move_id, attachment_id, state,
   last_error, created_at, updated_at)
SELECT d.organization_id, d.id, c.base_url, c.database, d.odoo_move_id, d.odoo_attachment_id, 'created',
       d.odoo_error, coalesce(d.odoo_sent_at, d.updated_at), d.updated_at
  FROM app.received_documents d
  JOIN app.odoo_connections c ON c.organization_id = d.organization_id
 WHERE d.odoo_move_id IS NOT NULL;
ALTER TABLE app.received_documents FORCE ROW LEVEL SECURITY;
ALTER TABLE app.odoo_connections FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

ALTER TABLE app.odoo_document_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.odoo_document_links FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.odoo_document_links FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.odoo_document_links FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_update ON app.odoo_document_links FOR UPDATE
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios (§9.3). Telco audita sus acciones con el actor de sistema (§7.7) dentro de withTenant: las
-- políticas de audit_logs, organizations y odoo_connections ya aplican a todos los roles.
GRANT SELECT ON app.odoo_document_links TO app_user;
GRANT SELECT, INSERT ON app.odoo_document_links TO app_worker;
GRANT UPDATE (move_id, attachment_id, state, last_error, updated_at) ON app.odoo_document_links TO app_worker;
GRANT SELECT, INSERT ON app.audit_logs TO app_worker;
GRANT SELECT ON app.organizations, app.odoo_connections TO app_worker;
