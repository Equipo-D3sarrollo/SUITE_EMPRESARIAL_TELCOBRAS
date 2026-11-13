CREATE TABLE "app"."radian_event_attempts" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"radian_event_id" uuid NOT NULL,
	"attempt_no" integer NOT NULL,
	"job_id" uuid,
	"started_at" timestamp (3) with time zone NOT NULL,
	"finished_at" timestamp (3) with time zone,
	"outcome" text NOT NULL,
	"http_status" integer,
	"dian_status_code" text,
	"request_file_id" uuid,
	"response_file_id" uuid,
	"error_trace" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"duration_ms" integer,
	CONSTRAINT "radian_event_attempts_attempt_no_key" UNIQUE("organization_id","radian_event_id","attempt_no"),
	CONSTRAINT "radian_event_attempts_outcome_check" CHECK ("app"."radian_event_attempts"."outcome" in ('accepted', 'rejected', 'already_processed', 'transport_error', 'timeout', 'local_error')),
	CONSTRAINT "radian_event_attempts_attempt_no_check" CHECK ("app"."radian_event_attempts"."attempt_no" > 0)
);
--> statement-breakpoint
CREATE TABLE "app"."radian_event_rules" (
	"event_code" char(3) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"actor" text NOT NULL,
	"requires" char(3)[] DEFAULT '{}'::char(3)[] NOT NULL,
	"blocked_by" char(3)[] DEFAULT '{}'::char(3)[] NOT NULL,
	"terminal" boolean NOT NULL,
	"claim_code_required" boolean DEFAULT false NOT NULL,
	"enforce_claim_deadline" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"source" text NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "radian_event_rules_event_code_check" CHECK ("app"."radian_event_rules"."event_code" in ('030', '031', '032', '033', '034')),
	CONSTRAINT "radian_event_rules_actor_check" CHECK ("app"."radian_event_rules"."actor" in ('buyer', 'issuer'))
);
--> statement-breakpoint
CREATE TABLE "app"."radian_events" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"organization_id" uuid NOT NULL,
	"received_document_id" uuid NOT NULL,
	"event_code" char(3) NOT NULL,
	"actor" text NOT NULL,
	"origin" text NOT NULL,
	"environment" char(1) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"claim_code" char(2),
	"claim_note" text,
	"cude" text,
	"generated_at" timestamp (3) with time zone,
	"sent_at" timestamp (3) with time zone,
	"dian_registered_at" timestamp (3) with time zone,
	"dian_status_code" text,
	"request_file_id" uuid,
	"response_file_id" uuid,
	"certificate_id" uuid,
	"error_message" text,
	"error_trace" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"idempotency_key" text NOT NULL,
	"requested_by" uuid,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "radian_events_organization_id_id_key" UNIQUE("organization_id","id"),
	CONSTRAINT "radian_events_organization_id_cude_key" UNIQUE("organization_id","cude"),
	CONSTRAINT "radian_events_organization_id_idempotency_key_key" UNIQUE("organization_id","idempotency_key"),
	CONSTRAINT "radian_events_actor_check" CHECK ("app"."radian_events"."actor" in ('buyer', 'issuer')),
	CONSTRAINT "radian_events_origin_check" CHECK ("app"."radian_events"."origin" in ('suite', 'dian')),
	CONSTRAINT "radian_events_environment_check" CHECK ("app"."radian_events"."environment" in ('1', '2')),
	CONSTRAINT "radian_events_status_check" CHECK ("app"."radian_events"."status" in ('pending', 'accepted', 'rejected', 'failed')),
	CONSTRAINT "radian_events_claim_code_check" CHECK ("app"."radian_events"."claim_code" in ('01', '02', '03', '04')),
	CONSTRAINT "radian_events_cude_check" CHECK ("app"."radian_events"."cude" ~ '^[0-9a-f]{96}$'),
	CONSTRAINT "radian_events_attempts_check" CHECK ("app"."radian_events"."attempts" >= 0),
	CONSTRAINT "radian_events_issuer_actor_check" CHECK (("app"."radian_events"."event_code" = '034') = ("app"."radian_events"."actor" = 'issuer')),
	CONSTRAINT "radian_events_suite_buyer_check" CHECK ("app"."radian_events"."origin" = 'dian' or "app"."radian_events"."actor" = 'buyer'),
	CONSTRAINT "radian_events_claim_check" CHECK ("app"."radian_events"."origin" <> 'suite' or ("app"."radian_events"."event_code" = '031') = ("app"."radian_events"."claim_code" is not null)),
	CONSTRAINT "radian_events_requested_by_check" CHECK ("app"."radian_events"."origin" <> 'suite' or "app"."radian_events"."requested_by" is not null),
	CONSTRAINT "radian_events_accepted_check" CHECK ("app"."radian_events"."status" <> 'accepted' or ("app"."radian_events"."cude" is not null and "app"."radian_events"."dian_registered_at" is not null)),
	CONSTRAINT "radian_events_rejected_check" CHECK ("app"."radian_events"."status" <> 'rejected' or "app"."radian_events"."response_file_id" is not null or "app"."radian_events"."origin" = 'dian'),
	CONSTRAINT "radian_events_failed_check" CHECK ("app"."radian_events"."status" <> 'failed' or "app"."radian_events"."error_message" is not null)
);
--> statement-breakpoint
ALTER TABLE "app"."radian_event_attempts" ADD CONSTRAINT "radian_event_attempts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_event_attempts" ADD CONSTRAINT "radian_event_attempts_event_fk" FOREIGN KEY ("organization_id","radian_event_id") REFERENCES "app"."radian_events"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_event_attempts" ADD CONSTRAINT "radian_event_attempts_request_file_fk" FOREIGN KEY ("organization_id","request_file_id") REFERENCES "app"."dian_files"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_event_attempts" ADD CONSTRAINT "radian_event_attempts_response_file_fk" FOREIGN KEY ("organization_id","response_file_id") REFERENCES "app"."dian_files"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_events" ADD CONSTRAINT "radian_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "app"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_events" ADD CONSTRAINT "radian_events_event_code_radian_event_rules_event_code_fk" FOREIGN KEY ("event_code") REFERENCES "app"."radian_event_rules"("event_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_events" ADD CONSTRAINT "radian_events_document_fk" FOREIGN KEY ("organization_id","received_document_id") REFERENCES "app"."received_documents"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_events" ADD CONSTRAINT "radian_events_request_file_fk" FOREIGN KEY ("organization_id","request_file_id") REFERENCES "app"."dian_files"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_events" ADD CONSTRAINT "radian_events_response_file_fk" FOREIGN KEY ("organization_id","response_file_id") REFERENCES "app"."dian_files"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."radian_events" ADD CONSTRAINT "radian_events_certificate_fk" FOREIGN KEY ("organization_id","certificate_id") REFERENCES "app"."dian_certificates"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "radian_events_one_live_per_code" ON "app"."radian_events" USING btree ("organization_id","received_document_id","event_code","environment") WHERE "app"."radian_events"."status" in ('pending', 'accepted');--> statement-breakpoint
CREATE INDEX "radian_events_timeline_idx" ON "app"."radian_events" USING btree ("organization_id","received_document_id","created_at","id");--> statement-breakpoint
CREATE INDEX "radian_events_pending_idx" ON "app"."radian_events" USING btree ("organization_id","status") WHERE "app"."radian_events"."status" = 'pending';
--> statement-breakpoint

-- DataDian, subetapa 2.6: eventos RADIAN (ARQUITECTURA_DB_DATADIAN.md §6, §7.1 a §7.4 y §9).
-- Reverso: 0014_datadian_radian_events.reverse.sql.

-- Reglas de precedencia del blueprint, sin verificar (§6.1). Si el 031 solo exige el 030 (POR VERIFICAR 5),
-- una migración cambia requires a {030} sin tocar código.
INSERT INTO app.radian_event_rules
  (event_code, name, actor, requires, blocked_by, terminal, claim_code_required, enforce_claim_deadline,
   verified, source)
VALUES
  ('030', 'Acuse de recibo de la factura electrónica de venta', 'buyer', '{}', '{}', false, false, false,
   false, 'Blueprint DataDian/Telco §3 (sin verificar contra el anexo técnico T5.1)'),
  ('032', 'Recibo del bien o prestación del servicio', 'buyer', '{030}', '{}', false, false, false,
   false, 'Blueprint DataDian/Telco §3 (sin verificar contra el anexo técnico T5.1)'),
  ('033', 'Aceptación expresa', 'buyer', '{032}', '{031,034}', true, false, false,
   false, 'Blueprint DataDian/Telco §3 (sin verificar contra el anexo técnico T5.1)'),
  ('031', 'Reclamo de la factura electrónica de venta', 'buyer', '{032}', '{033,034}', true, true, false,
   false, 'Blueprint DataDian/Telco §3; POR VERIFICAR 5 (si basta el 030)'),
  ('034', 'Aceptación tácita', 'issuer', '{032}', '{031,033}', true, false, false,
   false, 'Blueprint DataDian/Telco §3. La registra el emisor; la suite solo la observa');
--> statement-breakpoint

-- radian_events_sequence_guard (§7.1): bloquea la factura (serializa los eventos de la misma factura sin
-- frenar al resto) y valida la secuencia con la tabla de reglas. Corre con los privilegios del llamador.
-- Orden de las comprobaciones: DD007, DD008, DD002 (bloqueado), DD003 (terminal), DD001 (falta un
-- requisito), DD009 (plazo). Los eventos observados en la DIAN se registran siempre: son la realidad.
CREATE FUNCTION app.radian_events_sequence_guard() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
DECLARE
  v_doc record;
  v_environment char(1);
  v_rule app.radian_event_rules;
  v_accepted char(3)[];
BEGIN
  SELECT validation_status, claim_deadline_at INTO v_doc
    FROM app.received_documents
   WHERE organization_id = NEW.organization_id AND id = NEW.received_document_id
     FOR UPDATE;

  IF NEW.origin = 'dian' THEN
    RETURN NEW;
  END IF;

  IF v_doc.validation_status IS DISTINCT FROM 'valid' THEN
    RAISE EXCEPTION 'La factura no tiene un XML válido' USING ERRCODE = 'DD007';
  END IF;
  SELECT environment INTO v_environment FROM app.dian_settings WHERE organization_id = NEW.organization_id;
  IF v_environment IS DISTINCT FROM NEW.environment THEN
    RAISE EXCEPTION 'El ambiente % no es el configurado (%)', NEW.environment, coalesce(v_environment, 'ninguno')
      USING ERRCODE = 'DD008';
  END IF;

  v_accepted := ARRAY(
    SELECT e.event_code FROM app.radian_events e
     WHERE e.organization_id = NEW.organization_id AND e.received_document_id = NEW.received_document_id
       AND e.environment = NEW.environment AND e.status = 'accepted');
  SELECT * INTO STRICT v_rule FROM app.radian_event_rules WHERE event_code = NEW.event_code;

  IF v_rule.blocked_by && v_accepted THEN
    RAISE EXCEPTION 'El evento % está bloqueado por los eventos aceptados %', NEW.event_code, v_accepted
      USING ERRCODE = 'DD002';
  END IF;
  IF EXISTS (SELECT 1 FROM app.radian_event_rules t WHERE t.terminal AND t.event_code = ANY (v_accepted)) THEN
    RAISE EXCEPTION 'La factura está en estado terminal (eventos aceptados %)', v_accepted
      USING ERRCODE = 'DD003';
  END IF;
  IF NOT (v_rule.requires <@ v_accepted) THEN
    RAISE EXCEPTION 'El evento % exige antes los eventos aceptados %', NEW.event_code, v_rule.requires
      USING ERRCODE = 'DD001';
  END IF;
  IF v_rule.enforce_claim_deadline AND now() > v_doc.claim_deadline_at THEN
    RAISE EXCEPTION 'El plazo de reclamo venció el %', v_doc.claim_deadline_at USING ERRCODE = 'DD009';
  END IF;
  RETURN NEW;
END
$$;
--> statement-breakpoint
CREATE TRIGGER radian_events_sequence_guard
  BEFORE INSERT ON app.radian_events
  FOR EACH ROW EXECUTE FUNCTION app.radian_events_sequence_guard();
--> statement-breakpoint

-- radian_events_update_guard (§6.3, §6.5 y §7.1): columnas inmutables, de una sola escritura, transiciones
-- pending -> accepted | rejected | failed y orden temporal de generated_at frente a los requisitos.
CREATE FUNCTION app.radian_events_update_guard() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
DECLARE
  v_requires char(3)[];
  v_previous timestamptz;
BEGIN
  IF ROW(NEW.id, NEW.organization_id, NEW.received_document_id, NEW.event_code, NEW.actor, NEW.origin,
         NEW.environment, NEW.claim_code, NEW.claim_note, NEW.idempotency_key, NEW.requested_by,
         NEW.created_at)
     IS DISTINCT FROM
     ROW(OLD.id, OLD.organization_id, OLD.received_document_id, OLD.event_code, OLD.actor, OLD.origin,
         OLD.environment, OLD.claim_code, OLD.claim_note, OLD.idempotency_key, OLD.requested_by,
         OLD.created_at) THEN
    RAISE EXCEPTION 'Columna inmutable del evento RADIAN' USING ERRCODE = 'DD005';
  END IF;
  IF (OLD.cude IS NOT NULL AND NEW.cude IS DISTINCT FROM OLD.cude)
     OR (OLD.generated_at IS NOT NULL AND NEW.generated_at IS DISTINCT FROM OLD.generated_at)
     OR (OLD.request_file_id IS NOT NULL AND NEW.request_file_id IS DISTINCT FROM OLD.request_file_id)
     OR (OLD.certificate_id IS NOT NULL AND NEW.certificate_id IS DISTINCT FROM OLD.certificate_id) THEN
    RAISE EXCEPTION 'El CUDE, la fecha del evento, el XML firmado y el certificado se escriben una sola vez'
      USING ERRCODE = 'DD005';
  END IF;
  IF OLD.status <> 'pending' THEN
    RAISE EXCEPTION 'El evento ya está en un estado final (%)', OLD.status USING ERRCODE = 'DD004';
  END IF;
  IF NEW.status NOT IN ('pending', 'accepted', 'rejected', 'failed') THEN
    RAISE EXCEPTION 'Transición no permitida: % -> %', OLD.status, NEW.status USING ERRCODE = 'DD004';
  END IF;

  -- Aceptar un evento de la suite: se serializa por factura y se rechaza si otro evento aceptado lo bloquea
  -- (031 frente a 033 pedidos a la vez). Así nunca quedan aceptados dos eventos incompatibles.
  IF NEW.origin = 'suite' AND NEW.status = 'accepted' THEN
    PERFORM 1 FROM app.received_documents d
     WHERE d.organization_id = NEW.organization_id AND d.id = NEW.received_document_id
       FOR UPDATE;
    IF EXISTS (
      SELECT 1 FROM app.radian_events e JOIN app.radian_event_rules r ON r.event_code = NEW.event_code
       WHERE e.organization_id = NEW.organization_id AND e.received_document_id = NEW.received_document_id
         AND e.environment = NEW.environment AND e.status = 'accepted' AND e.id <> NEW.id
         AND e.event_code = ANY (r.blocked_by)) THEN
      RAISE EXCEPTION 'El evento % está bloqueado por otro evento aceptado', NEW.event_code
        USING ERRCODE = 'DD002';
    END IF;
  END IF;

  IF NEW.origin = 'suite' AND OLD.generated_at IS NULL AND NEW.generated_at IS NOT NULL THEN
    SELECT requires INTO v_requires FROM app.radian_event_rules WHERE event_code = NEW.event_code;
    SELECT max(e.generated_at) INTO v_previous FROM app.radian_events e
     WHERE e.organization_id = NEW.organization_id AND e.received_document_id = NEW.received_document_id
       AND e.environment = NEW.environment AND e.status = 'accepted' AND e.event_code = ANY (v_requires);
    IF NEW.generated_at <= v_previous THEN
      RAISE EXCEPTION 'La fecha del evento % debe ser posterior a la de sus requisitos (%)',
        NEW.event_code, v_previous USING ERRCODE = 'DD001';
    END IF;
  END IF;
  RETURN NEW;
END
$$;
--> statement-breakpoint
CREATE TRIGGER radian_events_update_guard
  BEFORE UPDATE ON app.radian_events
  FOR EACH ROW EXECUTE FUNCTION app.radian_events_update_guard();
--> statement-breakpoint

-- radian_events_status_sync (§6.5 y §7.4): con un evento aceptado actualiza la caché RADIAN de la factura
-- y, si es el ancla del plazo (032), claim_deadline_at y deadline_rule_version. Nadie tiene UPDATE sobre
-- esas columnas: la función es SECURITY DEFINER de app_owner y corre en la transacción y con el app.org_id
-- del llamador, así que la RLS sigue aplicando. La caché no retrocede (un 030 observado después del 032
-- no la devuelve a acknowledged).
CREATE FUNCTION app.radian_events_status_sync() RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = app, pg_temp
AS $$
DECLARE
  v_status text;
  v_rank constant jsonb := '{"none": 0, "acknowledged": 1, "goods_received": 2, "claimed": 3,
                              "accepted_express": 3, "accepted_tacit": 3}';
  v_rule app.radian_deadline_rules;
  v_deadline timestamptz;
  v_version integer;
BEGIN
  IF NEW.status <> 'accepted' OR (TG_OP = 'UPDATE' AND OLD.status = 'accepted') THEN
    RETURN NULL;
  END IF;
  v_status := CASE NEW.event_code
    WHEN '030' THEN 'acknowledged' WHEN '032' THEN 'goods_received' WHEN '031' THEN 'claimed'
    WHEN '033' THEN 'accepted_express' WHEN '034' THEN 'accepted_tacit' END;

  UPDATE app.received_documents d
     SET radian_status = v_status, radian_status_at = NEW.dian_registered_at
   WHERE d.organization_id = NEW.organization_id AND d.id = NEW.received_document_id
     AND (v_rank ->> v_status)::int > (v_rank ->> d.radian_status)::int;

  SELECT * INTO v_rule FROM app.radian_deadline_rules WHERE key = 'claim_window' AND active;
  IF FOUND AND NEW.event_code = v_rule.anchor_event THEN
    SELECT dl.deadline, dl.rule_version INTO v_deadline, v_version
      FROM app.radian_deadline(
        CASE v_rule.anchor_field WHEN 'generated_at' THEN NEW.generated_at ELSE NEW.dian_registered_at END,
        'claim_window') AS dl;
    UPDATE app.received_documents d
       SET claim_deadline_at = v_deadline, deadline_rule_version = v_version
     WHERE d.organization_id = NEW.organization_id AND d.id = NEW.received_document_id;
  END IF;
  RETURN NULL;
END
$$;
--> statement-breakpoint
CREATE TRIGGER radian_events_status_sync
  AFTER INSERT OR UPDATE OF status ON app.radian_events
  FOR EACH ROW EXECUTE FUNCTION app.radian_events_status_sync();
--> statement-breakpoint

-- app.radian_recompute_deadlines (§7.4): la llama la migración que cambie una regla o un festivo. Recalcula
-- las facturas en goods_received con la regla activa y devuelve cuántas cambió. Corre con los privilegios y
-- la RLS del llamador (app_owner): una migración que recalcule todas las organizaciones levanta FORCE
-- durante la carga, como la 0005.
CREATE FUNCTION app.radian_recompute_deadlines(p_key text DEFAULT 'claim_window') RETURNS integer
  LANGUAGE plpgsql
  SET search_path = app, pg_temp
AS $$
DECLARE
  v_rule app.radian_deadline_rules;
  v_count integer;
BEGIN
  SELECT * INTO STRICT v_rule FROM app.radian_deadline_rules WHERE key = p_key AND active;
  UPDATE app.received_documents d
     SET claim_deadline_at = dl.deadline, deadline_rule_version = dl.rule_version
    FROM app.radian_events e
    CROSS JOIN LATERAL app.radian_deadline(
      CASE v_rule.anchor_field WHEN 'generated_at' THEN e.generated_at ELSE e.dian_registered_at END,
      p_key) AS dl
   WHERE d.radian_status = 'goods_received'
     AND e.organization_id = d.organization_id AND e.received_document_id = d.id
     AND e.event_code = v_rule.anchor_event AND e.status = 'accepted';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END
$$;
--> statement-breakpoint

REVOKE ALL ON FUNCTION app.radian_events_sequence_guard() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.radian_events_update_guard() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.radian_events_status_sync() FROM PUBLIC;
REVOKE ALL ON FUNCTION app.radian_recompute_deadlines(text) FROM PUBLIC;
--> statement-breakpoint

-- RLS (§9.2). app_user solo pide eventos de la suite en pending, sin CUDE ni registro; Telco inserta los
-- observados y actualiza el resultado. Sin DELETE para nadie.
ALTER TABLE app.radian_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.radian_events FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.radian_events FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY user_insert ON app.radian_events FOR INSERT TO app_user
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid
              AND origin = 'suite' AND status = 'pending' AND cude IS NULL AND dian_registered_at IS NULL);
CREATE POLICY worker_insert ON app.radian_events FOR INSERT TO app_worker
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY worker_update ON app.radian_events FOR UPDATE TO app_worker
  USING      (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint
ALTER TABLE app.radian_event_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.radian_event_attempts FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_select ON app.radian_event_attempts FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
CREATE POLICY tenant_insert ON app.radian_event_attempts FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.org_id', true), '')::uuid);
--> statement-breakpoint

-- Privilegios (§9.3).
GRANT SELECT ON app.radian_event_rules TO app_user, app_worker;
GRANT SELECT, INSERT ON app.radian_events TO app_user, app_worker;
GRANT UPDATE (status, cude, generated_at, sent_at, dian_registered_at, dian_status_code, request_file_id,
              response_file_id, certificate_id, error_message, error_trace, attempts, updated_at)
  ON app.radian_events TO app_worker;
GRANT SELECT ON app.radian_event_attempts TO app_user;
GRANT SELECT, INSERT ON app.radian_event_attempts TO app_worker;
