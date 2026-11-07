# Prueba de concepto de RLS (ADR-005)

No es código del producto. Comprueba el aislamiento multiempresa con Drizzle.

```bash
docker run -d --name rls-poc -e POSTGRES_PASSWORD=poc -p 55432:5432 postgres:18
docker exec -i rls-poc psql -U postgres -v ON_ERROR_STOP=1 -q < schema.sql
pnpm install && pnpm test
```

## Contenido

- `schema.sql`: esquema SQL mínimo que configura las tablas y políticas usadas por la prueba.
- `rls.test.mjs`: prueba ejecutable que verifica el aislamiento con Row-Level Security.
- `package.json` y `pnpm-lock.yaml`: dependencias y resolución reproducible propias de esta prueba de concepto.
- Este `README.md`: instrucciones para ejecutar el experimento y aclaración de que no es código de producto.
