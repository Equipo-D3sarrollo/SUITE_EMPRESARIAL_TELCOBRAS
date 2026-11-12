CREATE TABLE "app"."co_holiday_years" (
	"year" smallint PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"verified_at" timestamp (3) with time zone,
	"seeded_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "co_holiday_years_source_check" CHECK ("app"."co_holiday_years"."source" in ('computed', 'manual'))
);
--> statement-breakpoint
CREATE TABLE "app"."co_holidays" (
	"day" date PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rule" text NOT NULL,
	"legal_basis" text NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "co_holidays_rule_check" CHECK ("app"."co_holidays"."rule" in ('fixed', 'emiliani', 'easter', 'manual'))
);
--> statement-breakpoint
CREATE TABLE "app"."radian_deadline_rules" (
	"key" text NOT NULL,
	"version" integer NOT NULL,
	"unit" text NOT NULL,
	"amount" integer NOT NULL,
	"anchor_event" char(3) NOT NULL,
	"anchor_field" text NOT NULL,
	"start_mode" text NOT NULL,
	"cutoff_local" time(3) DEFAULT '23:59:59.999' NOT NULL,
	"non_working_isodow" smallint[] DEFAULT '{6,7}'::smallint[] NOT NULL,
	"timezone" text DEFAULT 'America/Bogota' NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "radian_deadline_rules_key_version_pk" PRIMARY KEY("key","version"),
	CONSTRAINT "radian_deadline_rules_version_check" CHECK ("app"."radian_deadline_rules"."version" > 0),
	CONSTRAINT "radian_deadline_rules_amount_check" CHECK ("app"."radian_deadline_rules"."amount" > 0),
	CONSTRAINT "radian_deadline_rules_unit_check" CHECK ("app"."radian_deadline_rules"."unit" in ('business_days', 'business_hours')),
	CONSTRAINT "radian_deadline_rules_anchor_event_check" CHECK ("app"."radian_deadline_rules"."anchor_event" in ('030', '031', '032', '033', '034')),
	CONSTRAINT "radian_deadline_rules_anchor_field_check" CHECK ("app"."radian_deadline_rules"."anchor_field" in ('dian_registered_at', 'generated_at')),
	CONSTRAINT "radian_deadline_rules_start_mode_check" CHECK ("app"."radian_deadline_rules"."start_mode" in ('next_business_day', 'same_instant')),
	CONSTRAINT "radian_deadline_rules_unit_start_mode_check" CHECK (("app"."radian_deadline_rules"."unit" = 'business_days') = ("app"."radian_deadline_rules"."start_mode" = 'next_business_day')),
	CONSTRAINT "radian_deadline_rules_non_working_isodow_check" CHECK ("app"."radian_deadline_rules"."non_working_isodow" <@ '{1,2,3,4,5,6,7}'::smallint[] and cardinality("app"."radian_deadline_rules"."non_working_isodow") < 7)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "radian_deadline_rules_one_active_idx" ON "app"."radian_deadline_rules" USING btree ("key") WHERE "app"."radian_deadline_rules"."active";--> statement-breakpoint

-- DataDian, subetapa 2.2: calendario de festivos y plazos (ARQUITECTURA_DB_DATADIAN.md §7.4, §7.5 y §9).
-- Reverso documentado y probado: 0010_datadian_calendar.reverse.sql.

-- Telco se conecta con app_worker (§9.1). El rol no lo crea la migración (app_owner no tiene CREATEROLE
-- y las migraciones no manejan contraseñas): lo crean init.sql o infra/compose/postgres/app-worker.sql.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_worker') THEN
    RAISE EXCEPTION 'Falta el rol app_worker de Telco (DataDian)'
      USING HINT = 'Ejecute infra/compose/postgres/app-worker.sql como superusuario y vuelva a migrar.';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_worker' AND (rolbypassrls OR rolsuper)) THEN
    RAISE EXCEPTION 'El rol app_worker no puede tener BYPASSRLS ni SUPERUSER'
      USING HINT = 'Ejecute infra/compose/postgres/app-worker.sql, que lo deja NOBYPASSRLS NOSUPERUSER.';
  END IF;
END
$$;
--> statement-breakpoint

-- Domingo de Pascua del calendario gregoriano: algoritmo anónimo de Meeus/Jones/Butcher (Gauss corregido).
CREATE FUNCTION app.co_easter_sunday(p_year integer) RETURNS date
  LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
  SET search_path = pg_catalog, pg_temp
AS $$
DECLARE
  a integer := p_year % 19;
  b integer := p_year / 100;
  c integer := p_year % 100;
  d integer := b / 4;
  e integer := b % 4;
  f integer := (b + 8) / 25;
  g integer := (b - f + 1) / 3;
  h integer := (19 * a + b - d - g + 15) % 30;
  i integer := c / 4;
  k integer := c % 4;
  l integer := (32 + 2 * e + 2 * i - h - k) % 7;
  m integer := (a + 11 * h + 22 * l) / 451;
  n integer := h + l - 7 * m + 114;
BEGIN
  IF p_year < 1583 THEN
    RAISE EXCEPTION 'Año % anterior al calendario gregoriano', p_year USING ERRCODE = 'invalid_parameter_value';
  END IF;
  RETURN make_date(p_year, n / 31, n % 31 + 1);
END
$$;
--> statement-breakpoint

-- Los 18 festivos de la Ley 51 de 1983 (POR VERIFICAR 7). Ley Emiliani: los de rule = 'emiliani' pasan
-- al lunes siguiente si no caen en lunes; Ascensión, Corpus Christi y Sagrado Corazón ya se cuentan en
-- lunes (Pascua + 43, + 64 y + 71). Si dos festivos caen el mismo día sale una sola fila con los dos
-- nombres: San Pedro y San Pablo coincide con el Sagrado Corazón el 30-jun-2025 y el 1-jul-2030, así que
-- esos años tienen 17 días festivos y no 18.
CREATE FUNCTION app.co_holidays_compute(p_year integer)
  RETURNS TABLE (day date, name text, rule text)
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
  SET search_path = app, pg_temp
AS $$
  WITH easter AS (
    SELECT app.co_easter_sunday(p_year) AS sunday
  ),
  base (ord, day, name, rule) AS (
    VALUES
      (1, make_date(p_year, 1, 1), 'Año Nuevo', 'fixed'),
      (2, make_date(p_year, 1, 6), 'Día de los Reyes Magos', 'emiliani'),
      (3, make_date(p_year, 3, 19), 'Día de San José', 'emiliani'),
      (4, make_date(p_year, 5, 1), 'Día del Trabajo', 'fixed'),
      (5, make_date(p_year, 6, 29), 'San Pedro y San Pablo', 'emiliani'),
      (6, make_date(p_year, 7, 20), 'Día de la Independencia', 'fixed'),
      (7, make_date(p_year, 8, 7), 'Batalla de Boyacá', 'fixed'),
      (8, make_date(p_year, 8, 15), 'Asunción de la Virgen', 'emiliani'),
      (9, make_date(p_year, 10, 12), 'Día de la Raza', 'emiliani'),
      (10, make_date(p_year, 11, 1), 'Todos los Santos', 'emiliani'),
      (11, make_date(p_year, 11, 11), 'Independencia de Cartagena', 'emiliani'),
      (12, make_date(p_year, 12, 8), 'Inmaculada Concepción', 'fixed'),
      (13, make_date(p_year, 12, 25), 'Navidad', 'fixed')
  ),
  moved AS (
    SELECT ord,
           CASE WHEN rule = 'emiliani'
                THEN day + (8 - extract(isodow FROM day)::integer) % 7
                ELSE day END AS day,
           name, rule
      FROM base
    UNION ALL
    SELECT v.ord, easter.sunday + v.offset_days, v.name, 'easter'
      FROM easter,
           (VALUES (14, -3, 'Jueves Santo'),
                   (15, -2, 'Viernes Santo'),
                   (16, 43, 'Ascensión del Señor'),
                   (17, 64, 'Corpus Christi'),
                   (18, 71, 'Sagrado Corazón')) AS v (ord, offset_days, name)
  )
  SELECT moved.day,
         string_agg(moved.name, ' y ' ORDER BY moved.ord),
         (array_agg(moved.rule ORDER BY moved.ord))[1]
    FROM moved
   GROUP BY moved.day
   ORDER BY moved.day
$$;
--> statement-breakpoint

-- Día hábil: ni día de la semana no hábil (ISO: 6 sábado, 7 domingo) ni festivo. Fuera de los años
-- sembrados en co_holiday_years falla con DD006: es preferible a dar por hábil un festivo sin sembrar.
CREATE FUNCTION app.is_business_day(p_day date, p_non_working smallint[]) RETURNS boolean
  LANGUAGE plpgsql STABLE STRICT PARALLEL SAFE
  SET search_path = app, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM app.co_holiday_years y WHERE y.year = extract(year FROM p_day)::integer
  ) THEN
    RAISE EXCEPTION 'El calendario de festivos no cubre el año %', extract(year FROM p_day)::integer
      USING ERRCODE = 'DD006',
            HINT = 'Siembre el año en app.co_holidays y app.co_holiday_years con una migración.';
  END IF;
  RETURN NOT (extract(isodow FROM p_day)::smallint = ANY (p_non_working))
     AND NOT EXISTS (SELECT 1 FROM app.co_holidays h WHERE h.day = p_day);
END
$$;
--> statement-breakpoint

-- Vencimiento del plazo contado desde p_anchor con la regla activa de p_key (o con la versión p_version,
-- para comparar reglas o recalcular). Todo el conteo es en la hora local de la regla (America/Bogota).
--   business_days: desde el día hábil siguiente al ancla cuenta `amount` días hábiles y vence ese día a
--     la hora de corte (cutoff_local).
--   business_hours: consume `amount` horas desde el ancla, solo dentro de días hábiles (24 h por día).
-- Si algún día del recorrido, incluido el del ancla, cae en un año sin sembrar: DD006.
CREATE FUNCTION app.radian_deadline(
  p_anchor timestamptz,
  p_key text DEFAULT 'claim_window',
  p_version integer DEFAULT NULL,
  OUT deadline timestamptz,
  OUT rule_version integer
)
  LANGUAGE plpgsql STABLE PARALLEL SAFE
  SET search_path = app, pg_temp
AS $$
DECLARE
  r app.radian_deadline_rules;
  v_local timestamp;
  v_day date;
  v_counted integer := 0;
  v_remaining interval;
  v_available interval;
BEGIN
  IF p_anchor IS NULL THEN
    RETURN;
  END IF;

  SELECT * INTO r
    FROM app.radian_deadline_rules dr
   WHERE dr.key = p_key
     AND CASE WHEN p_version IS NULL THEN dr.active ELSE dr.version = p_version END;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No existe la regla de plazo % (%)', p_key,
      coalesce('versión ' || p_version, 'versión activa')
      USING ERRCODE = 'no_data_found';
  END IF;

  rule_version := r.version;
  v_local := p_anchor AT TIME ZONE r.timezone;
  v_day := v_local::date;
  PERFORM app.is_business_day(v_day, r.non_working_isodow);

  IF r.unit = 'business_days' THEN
    WHILE v_counted < r.amount LOOP
      v_day := v_day + 1;
      IF app.is_business_day(v_day, r.non_working_isodow) THEN
        v_counted := v_counted + 1;
      END IF;
    END LOOP;
    deadline := (v_day + r.cutoff_local) AT TIME ZONE r.timezone;
    RETURN;
  END IF;

  -- business_hours
  v_remaining := make_interval(hours => r.amount);
  LOOP
    IF app.is_business_day(v_day, r.non_working_isodow) THEN
      v_available := (v_day + 1)::timestamp - v_local;
      IF v_remaining <= v_available THEN
        deadline := (v_local + v_remaining) AT TIME ZONE r.timezone;
        RETURN;
      END IF;
      v_remaining := v_remaining - v_available;
    END IF;
    v_day := v_day + 1;
    v_local := v_day::timestamp;
  END LOOP;
END
$$;
--> statement-breakpoint

-- Semillas. La tabla es la fuente de verdad: una corrección (festivo nuevo por ley) se agrega en otra
-- migración como fila 'manual'. verified_at queda nulo hasta contrastar con el calendario oficial.
INSERT INTO app.co_holidays (day, name, rule, legal_basis)
  SELECT h.day, h.name, h.rule, 'Ley 51 de 1983'
    FROM generate_series(2020, 2035) AS y (year)
    CROSS JOIN LATERAL app.co_holidays_compute(y.year) AS h;
INSERT INTO app.co_holiday_years (year, source)
  SELECT year, 'computed' FROM generate_series(2020, 2035) AS y (year);
--> statement-breakpoint

-- Regla por defecto (decisión del usuario, §12 punto 5) y alternativa inactiva de 72 horas hábiles.
-- Ambas sin verificar (POR VERIFICAR 4).
INSERT INTO app.radian_deadline_rules
  (key, version, unit, amount, anchor_event, anchor_field, start_mode, cutoff_local,
   non_working_isodow, timezone, active, verified, source)
VALUES
  ('claim_window', 1, 'business_days', 3, '032', 'dian_registered_at', 'next_business_day',
   '23:59:59.999', '{6,7}', 'America/Bogota', true, false,
   'Propuesta de ARQUITECTURA_DB_DATADIAN.md §7.4, aceptada por el usuario el 12-nov-2026. Por verificar: Código de Comercio art. 773, Decreto 1074 de 2015 (modificado por el Decreto 1154 de 2020) y Resolución 000085 de 2022.'),
  ('claim_window', 2, 'business_hours', 72, '032', 'dian_registered_at', 'same_instant',
   '23:59:59.999', '{6,7}', 'America/Bogota', false, false,
   'Alternativa de 72 horas hábiles citada en el blueprint de eventos RADIAN. Por verificar con las mismas fuentes de la versión 1.');
--> statement-breakpoint

-- Privilegios (§9.3): las tablas globales son de solo lectura para la aplicación y para Telco.
GRANT SELECT ON app.co_holidays, app.co_holiday_years, app.radian_deadline_rules
  TO app_user, app_worker;

-- PostgreSQL da EXECUTE a PUBLIC por defecto. Solo el día hábil y el plazo quedan para la aplicación;
-- co_holidays_compute y co_easter_sunday quedan para app_owner (migraciones).
REVOKE ALL ON FUNCTION app.co_easter_sunday(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.co_holidays_compute(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.is_business_day(date, smallint[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION app.radian_deadline(timestamptz, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.is_business_day(date, smallint[]) TO app_user, app_worker;
GRANT EXECUTE ON FUNCTION app.radian_deadline(timestamptz, text, integer) TO app_user, app_worker;