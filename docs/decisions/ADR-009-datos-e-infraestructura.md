# ADR-009: Cola, archivos y secretos

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-10, D-11, D-12 (documento madre §14)

## Contexto
El blueprint propone Redis Cluster, MinIO (archivado) y Vault (licencia BSL).

## Decisión
Cola: BullMQ sobre una instancia de Valkey + outbox en PostgreSQL, con consumidores idempotentes. Valkey también sirve de caché, con llaves por organización, y no sustituye a PostgreSQL. Archivos: S3 gestionado a través de la API S3, con versionado (en local, un contenedor S3-compatible). Secretos de los clientes: cifrado envolvente AES-256-GCM en la app, con la llave maestra fuera de la BD.

## Consecuencias
El proveedor S3 exacto se elige junto con el VPS (ADR-010).
