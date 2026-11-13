CREATE TABLE "app"."dian_certificates" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"pfx_data_key" jsonb NOT NULL,
	"pfx_sha256" char(64) NOT NULL,
	"pfx_size_bytes" integer NOT NULL,
	"password" jsonb NOT NULL,
	"status" text DEFAULT 'pending_validation' NOT NULL,
	"serial_number" text,
	"subject_nit" text,
	"subject_dn" text,
	"issuer_dn" text,
	"not_before" timestamp (3) with time zone,
	"not_after" timestamp (3) with time zone,
	"signature_algorithm" text,
	"key_usage_ok" boolean,
	"chain_ok" boolean,
	"validation_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"validated_at" timestamp (3) with time zone,
	"retired_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dian_certificates_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "dian_certificates_storage_key_key" UNIQUE("storage_key"),
	CONSTRAINT "dian_certificates_organization_id_pfx_sha256_key" UNIQUE("organization_id","pfx_sha256"),
	CONSTRAINT "dian_certificates_status_check" CHECK ("app"."dian_certificates"."status" in ('pending_validation', 'valid', 'invalid', 'retired')),
	CONSTRAINT "dian_certificates_pfx_sha256_check" CHECK ("app"."dian_certificates"."pfx_sha256" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "dian_certificates_pfx_size_bytes_check" CHECK ("app"."dian_certificates"."pfx_size_bytes" > 0 and "app"."dian_certificates"."pfx_size_bytes" <= 65536),
	CONSTRAINT "dian_certificates_valid_check" CHECK ("app"."dian_certificates"."status" <> 'valid' or ("app"."dian_certificates"."serial_number" is not null and "app"."dian_certificates"."subject_nit" is not null
        and "app"."dian_certificates"."not_before" is not null and "app"."dian_certificates"."not_after" is not null
        and "app"."dian_certificates"."key_usage_ok" is true and "app"."dian_certificates"."chain_ok" is true)),
	CONSTRAINT "dian_certificates_validity_check" CHECK ("app"."dian_certificates"."not_after" > "app"."dian_certificates"."not_before"),
	CONSTRAINT "dian_certificates_retired_check" CHECK ("app"."dian_certificates"."status" <> 'retired' or "app"."dian_certificates"."retired_at" is not null)
);
--> statement-breakpoint
CREATE TABLE "app"."dian_settings" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"nit" text NOT NULL,
	"nit_dv" char(1),
	"environment" char(1) DEFAULT '2' NOT NULL,
	"operation_mode" text DEFAULT 'own_software' NOT NULL,
	"software_id" text,
	"software_pin" jsonb,
	"test_set_id" text,
	"active_certificate_id" uuid,
	"rpa_enabled" boolean DEFAULT false NOT NULL,
	"imap_enabled" boolean DEFAULT false NOT NULL,
	"sync_lookback_days" smallint DEFAULT 30 NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dian_settings_nit_key" UNIQUE("nit"),
	CONSTRAINT "dian_settings_nit_check" CHECK ("app"."dian_settings"."nit" ~ '^[0-9]{5,15}$'),
	CONSTRAINT "dian_settings_nit_dv_check" CHECK ("app"."dian_settings"."nit_dv" ~ '^[0-9]$'),
	CONSTRAINT "dian_settings_environment_check" CHECK ("app"."dian_settings"."environment" in ('1', '2')),
	CONSTRAINT "dian_settings_operation_mode_check" CHECK ("app"."dian_settings"."operation_mode" in ('own_software', 'technology_provider')),
	CONSTRAINT "dian_settings_software_id_check" CHECK ("app"."dian_settings"."software_id" ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
	CONSTRAINT "dian_settings_software_complete_check" CHECK (("app"."dian_settings"."software_id" is null) = ("app"."dian_settings"."software_pin" is null)),
	CONSTRAINT "dian_settings_sync_lookback_days_check" CHECK ("app"."dian_settings"."sync_lookback_days" between 1 and 92)
);
--> statement-breakpoint
CREATE TABLE "app"."imap_mailboxes" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"host" text NOT NULL,
	"port" integer DEFAULT 993 NOT NULL,
	"use_tls" boolean DEFAULT true NOT NULL,
	"username" text NOT NULL,
	"auth_method" text DEFAULT 'password' NOT NULL,
	"secret" jsonb NOT NULL,
	"folder" text DEFAULT 'INBOX' NOT NULL,
	"uid_validity" bigint,
	"last_uid" bigint,
	"enabled" boolean DEFAULT true NOT NULL,
	"updated_by" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "imap_mailboxes_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "imap_mailboxes_mailbox_key" UNIQUE("organization_id","host","username","folder"),
	CONSTRAINT "imap_mailboxes_port_check" CHECK ("app"."imap_mailboxes"."port" between 1 and 65535),
	CONSTRAINT "imap_mailboxes_auth_method_check" CHECK ("app"."imap_mailboxes"."auth_method" in ('password', 'oauth2'))
);
--> statement-breakpoint
ALTER TABLE "app"."dian_certificates" ADD CONSTRAINT "dian_certificates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."dian_settings" ADD CONSTRAINT "dian_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."dian_settings" ADD CONSTRAINT "dian_settings_active_certificate_fk" FOREIGN KEY ("organization_id","active_certificate_id") REFERENCES "app"."dian_certificates"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."imap_mailboxes" ADD CONSTRAINT "imap_mailboxes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dian_certificates_expiry_idx" ON "app"."dian_certificates" USING btree ("organization_id","not_after");
--> statement-breakpoint

-- DataDian, subetapa 2.3: configuración DIAN, certificados .pfx y buzones IMAP (ARQUITECTURA_DB_DATADIAN.md
-- §5.1 a §5.3 y §9). Reverso documentado y probado: 0011_datadian_settings.reverse.sql.

-- app_worker no hereda privilegios de otro rol (§9.1; hallazgo B2 de la auditoría de la 0010, que no se
-- edita porque ya está aplicada).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_auth_members m JOIN pg_roles r ON r.oid = m.member
              WHERE r.rolname = 'app_worker') THEN
    RAISE EXCEPTION 'El rol app_worker no puede ser miembro de ningún rol'
      USING HINT = 'Revoque la pertenencia con REVOKE y vuelva a migrar.';
  END IF;
END
$$;
--> statement-breakpoint

-- Segunda capa del aislamiento entre inquilinos (§2.4): el certificado activo debe estar válido, vigente
-- y emitido al mismo NIT de la configuración. Lee con los privilegios y el app.org_id del llamador.
CREATE FUNCTION app.dian_settings_certificate_guard() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
DECLARE
  c record;
BEGIN
  IF NEW.active_certificate_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT status, subject_nit, not_after INTO c
    FROM app.dian_certificates
   WHERE organization_id = NEW.organization_id AND id = NEW.active_certificate_id;
  IF NOT FOUND OR c.status <> 'valid' OR c.subject_nit IS DISTINCT FROM NEW.nit
     OR c.not_after <= now() THEN
    RAISE EXCEPTION 'El certificado activo debe estar válido, vigente y emitido al NIT %', NEW.nit
      USING ERRCODE = 'DD010';
  END IF;
  RETURN NEW;
END
$$;
--> statement-breakpoint
CREATE TRIGGER dian_settings_certificate_guard
  BEFORE INSERT OR UPDATE OF active_certificate_id, nit ON app.dian_settings
  FOR EACH ROW EXECUTE FUNCTION app.dian_settings_certificate_guard();
--> statement-breakpoint

-- Certificado de una sola escritura (§5.2): el archivo, su hash, su llave y su contraseña no cambian nunca
-- (un certificado nuevo es una fila nueva) y los metadatos de la validación se congelan al salir de
-- pending_validation. Transiciones: pending_validation -> valid | invalid | retired; valid | invalid ->
-- retired. app_user solo retira: validar es de Telco.
CREATE FUNCTION app.dian_certificates_guard() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
BEGIN
  IF ROW(NEW.id, NEW.organization_id, NEW.storage_key, NEW.pfx_data_key, NEW.pfx_sha256,
         NEW.pfx_size_bytes, NEW.password, NEW.uploaded_by, NEW.created_at)
     IS DISTINCT FROM
     ROW(OLD.id, OLD.organization_id, OLD.storage_key, OLD.pfx_data_key, OLD.pfx_sha256,
         OLD.pfx_size_bytes, OLD.password, OLD.uploaded_by, OLD.created_at) THEN
    RAISE EXCEPTION 'El archivo y la contraseña de un certificado no cambian: cargue uno nuevo'
      USING ERRCODE = 'DD005';
  END IF;
  IF OLD.status <> 'pending_validation'
     AND ROW(NEW.serial_number, NEW.subject_nit, NEW.subject_dn, NEW.issuer_dn, NEW.not_before,
             NEW.not_after, NEW.signature_algorithm, NEW.key_usage_ok, NEW.chain_ok,
             NEW.validation_errors, NEW.validated_at)
         IS DISTINCT FROM
         ROW(OLD.serial_number, OLD.subject_nit, OLD.subject_dn, OLD.issuer_dn, OLD.not_before,
             OLD.not_after, OLD.signature_algorithm, OLD.key_usage_ok, OLD.chain_ok,
             OLD.validation_errors, OLD.validated_at) THEN
    RAISE EXCEPTION 'Los metadatos de un certificado ya validado no cambian'
      USING ERRCODE = 'DD005';
  END IF;
  IF NEW.status <> OLD.status AND NOT (
       (OLD.status = 'pending_validation' AND NEW.status IN ('valid', 'invalid', 'retired'))
       OR (OLD.status IN ('valid', 'invalid') AND NEW.status = 'retired')) THEN
    RAISE EXCEPTION 'Transición de certificado no permitida: % -> %', OLD.status, NEW.status
      USING ERRCODE = 'DD004';
  END IF;
  IF NEW.status <> OLD.status AND NEW.status <> 'retired' AND current_user = 'app_user' THEN
    RAISE EXCEPTION 'Solo Telco valida certificados'
      USING ERRCODE = 'DD004';
  END IF;
  RETURN NEW;
END
$$;
--> statement-breakpoint
CREATE TRIGGER dian_certificates_guard
  BEFORE UPDATE ON app.dian_certificates
  FOR EACH ROW EXECUTE FUNCTION app.dian_certificates_guard();
--> statement-breakpoint

-- Los disparadores no necesitan EXECUTE para dispararse; nadie los llama como funciones.
REVOKE ALL ON FUNCTION app.dian_settings_certificate_guard() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.dian_certificates_guard() FROM PUBLIC;
--> statement-breakpoint

-- RLS forzada con políticas por comando y sin DELETE (§9.2): ni app_owner borra por SQL. Las filas solo
-- desaparecen en cascada al borrar la organización.
ALTER TABLE app.dian_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.dian_settings FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.dian_settings FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.dian_settings FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_update ON app.dian_settings FOR UPDATE
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.dian_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.dian_certificates FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.dian_certificates FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.dian_certificates FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_update ON app.dian_certificates FOR UPDATE
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.imap_mailboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.imap_mailboxes FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.imap_mailboxes FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.imap_mailboxes FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_update ON app.imap_mailboxes FOR UPDATE
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios por columna (§9.3). "Todas menos X" se escribe listando las columnas: una columna nueva no
-- queda expuesta por accidente. app_user no lee software_pin, password, pfx_data_key ni secret; solo
-- Telco (app_worker), que es quien firma y lee el buzón.
GRANT SELECT (organization_id, nit, nit_dv, environment, operation_mode, software_id, test_set_id,
              active_certificate_id, rpa_enabled, imap_enabled, sync_lookback_days, updated_by,
              created_at, updated_at)
  ON app.dian_settings TO app_user;
GRANT INSERT ON app.dian_settings TO app_user;
GRANT UPDATE (nit, nit_dv, environment, operation_mode, software_id, software_pin, test_set_id,
              active_certificate_id, rpa_enabled, imap_enabled, sync_lookback_days, updated_by,
              updated_at)
  ON app.dian_settings TO app_user;
GRANT SELECT ON app.dian_settings TO app_worker;
--> statement-breakpoint
GRANT SELECT (id, organization_id, storage_key, pfx_sha256, pfx_size_bytes, status, serial_number,
              subject_nit, subject_dn, issuer_dn, not_before, not_after, signature_algorithm,
              key_usage_ok, chain_ok, validation_errors, uploaded_by, validated_at, retired_at,
              created_at, updated_at)
  ON app.dian_certificates TO app_user;
GRANT INSERT ON app.dian_certificates TO app_user;
GRANT UPDATE (status, retired_at, updated_at) ON app.dian_certificates TO app_user;
GRANT SELECT ON app.dian_certificates TO app_worker;
GRANT UPDATE (status, serial_number, subject_nit, subject_dn, issuer_dn, not_before, not_after,
              signature_algorithm, key_usage_ok, chain_ok, validation_errors, validated_at, updated_at)
  ON app.dian_certificates TO app_worker;
--> statement-breakpoint
GRANT SELECT (id, organization_id, host, port, use_tls, username, auth_method, folder, uid_validity,
              last_uid, enabled, updated_by, created_at, updated_at)
  ON app.imap_mailboxes TO app_user;
GRANT INSERT ON app.imap_mailboxes TO app_user;
GRANT UPDATE (host, port, use_tls, username, auth_method, secret, folder, enabled, updated_by,
              updated_at)
  ON app.imap_mailboxes TO app_user;
GRANT SELECT ON app.imap_mailboxes TO app_worker;
GRANT UPDATE (uid_validity, last_uid, updated_at) ON app.imap_mailboxes TO app_worker;
