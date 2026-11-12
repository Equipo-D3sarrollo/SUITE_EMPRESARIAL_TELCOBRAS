# Metadatos de migraciones

| Archivo | Propósito |
|---|---|
| `0000_snapshot.json` | Snapshot del esquema tras la migración inicial. |
| `0001_snapshot.json` | Snapshot del esquema tras habilitar Row-Level Security. |
| `0002_snapshot.json` | Snapshot del esquema tras añadir tablas de autenticación. |
| `0003_snapshot.json` | Snapshot del esquema tras ajustar las cuentas de Better Auth. |
| `0004_snapshot.json` | Snapshot del esquema tras retirar las estructuras de passkeys. |
| `0005_snapshot.json` a `0010_snapshot.json` | Snapshots del esquema tras cada migración de DataDian (0005 a 0010). |
| `_journal.json` | Diario que registra el orden y las etiquetas de las migraciones de Drizzle. |
