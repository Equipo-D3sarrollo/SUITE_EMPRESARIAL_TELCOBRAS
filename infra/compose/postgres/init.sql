-- Se ejecuta una sola vez, como superusuario, al crear el volumen de datos (base telcobras).
-- Mismo modelo de roles que poc/rls (ADR-004, ADR-005):
--   app_owner: dueño del esquema app; corre las migraciones.
--   app_user:  rol de la API; sin BYPASSRLS y sin permisos sobre las tablas hasta que cada migración los otorgue.
--   app_worker: rol de Telco (DataDian); sin BYPASSRLS y, como app_user, sin permisos hasta las migraciones.
-- En una base ya creada, app_worker se agrega con app-worker.sql (script de operación idempotente).
\set ON_ERROR_STOP on

-- Las contraseñas llegan por variables de entorno del contenedor, no se escriben aquí.
\getenv app_owner_password APP_OWNER_PASSWORD
\getenv app_user_password APP_USER_PASSWORD
\getenv app_worker_password APP_WORKER_PASSWORD

CREATE ROLE app_owner LOGIN PASSWORD :'app_owner_password';
CREATE ROLE app_user LOGIN PASSWORD :'app_user_password' NOBYPASSRLS;

-- Sin APP_WORKER_PASSWORD el rol nace sin LOGIN: existe (la migración 0010 lo exige) pero nadie entra
-- con él hasta que app-worker.sql le asigne contraseña.
\if :{?app_worker_password}
\else
\set app_worker_password ''
\endif
SELECT :'app_worker_password' = '' AS app_worker_nologin \gset
\if :app_worker_nologin
CREATE ROLE app_worker NOLOGIN NOBYPASSRLS;
\else
CREATE ROLE app_worker LOGIN PASSWORD :'app_worker_password' NOBYPASSRLS;
\endif

REVOKE ALL ON DATABASE telcobras FROM PUBLIC;
REVOKE CONNECT ON DATABASE postgres FROM PUBLIC;
GRANT CONNECT ON DATABASE telcobras TO app_owner, app_user, app_worker;
-- El migrador de Drizzle ejecuta CREATE SCHEMA IF NOT EXISTS "drizzle" en cada corrida, y PostgreSQL
-- exige CREATE sobre la base aunque el esquema ya exista.
GRANT CREATE ON DATABASE telcobras TO app_owner;

-- Nadie crea objetos en public; todo vive en el esquema app.
REVOKE ALL ON SCHEMA public FROM PUBLIC;

CREATE SCHEMA app AUTHORIZATION app_owner;
-- drizzle-kit guarda su historial de migraciones en el esquema drizzle.
CREATE SCHEMA drizzle AUTHORIZATION app_owner;

-- Solo uso del esquema: los GRANT de SELECT/INSERT/UPDATE/DELETE van tabla por tabla en cada migración,
-- para que, por ejemplo, la auditoría quede sin UPDATE ni DELETE para app_user.
GRANT USAGE ON SCHEMA app TO app_user, app_worker;
