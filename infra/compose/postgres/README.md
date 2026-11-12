# Inicialización de PostgreSQL

| Archivo | Propósito |
|---|---|
| `init.sql` | SQL de inicialización del servicio PostgreSQL gestionado por Compose: crea los roles `app_owner`, `app_user` y `app_worker` y los esquemas `app` y `drizzle`. Corre una sola vez, al crear el volumen. |
| `app-worker.sql` | Script de operación idempotente para bases ya creadas: crea o ajusta el rol `app_worker` de Telco (DataDian) con `APP_WORKER_PASSWORD`. Debe correr antes de la migración `0010`, que falla si el rol no existe. `pnpm local` lo ejecuta antes de migrar. |
