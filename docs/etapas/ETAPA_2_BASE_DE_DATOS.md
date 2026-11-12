# Etapa 2 — Base de datos de DataDian

> Primera etapa de DataDian (2 a 5), según el orden fijado por el usuario el 12-nov-2026. Esta ficha es un resumen: **la especificación completa es [ARQUITECTURA_DB_DATADIAN.md](../modules/documents/ARQUITECTURA_DB_DATADIAN.md)**. Dependencias, bloqueos y estado de todas las etapas: [RUTA_DE_TRABAJO_DATADIAN.md](../modules/documents/RUTA_DE_TRABAJO_DATADIAN.md).

| Campo | Valor |
|---|---|
| Estado | **En curso.** 2.1 y 2.2 implementadas y en auditoría (12-nov-2026); siguiente: 2.3. Decisiones 1 a 9 de la §12 del documento aceptadas el 12-nov-2026 |
| Componente | PostgreSQL con RLS forzada: esquemas Drizzle, migraciones `0010` a `0017`, funciones, disparadores, políticas, privilegios y semillas. Rol de Telco `app_worker` |
| Especificación | [ARQUITECTURA_DB_DATADIAN.md](../modules/documents/ARQUITECTURA_DB_DATADIAN.md) (§10: migraciones y subetapas; §10.3: desviaciones de la implementación; §11: puntos por verificar; §12: decisiones) |
| Criterio de salida | Las migraciones `0010` a `0017` aplicadas en la CI, con las pruebas de RLS, de restricciones, de cola concurrente y de plazos en verde |

## Subetapas

| Sub | Migración | Contenido | Estado |
|---|---|---|---|
| 2.1 | — | Preparación: rol `app_worker`, `workerDatabase()`, convención `DD0xx`, actor `SYSTEM_ACTOR_TELCO` | Implementada; en auditoría |
| 2.2 | `0010` | Calendario de festivos de Colombia (2020 a 2035) y reglas de plazo | Implementada; en auditoría |
| 2.3 | `0011` | `dian_settings`, `dian_certificates`, `imap_mailboxes` | Pendiente |
| 2.4 | `0012` | `dian_files`, `dian_sync_runs` | Pendiente |
| 2.5 | `0013` | `received_documents` evolucionada y `received_document_taxes` | Pendiente |
| 2.6 | `0014` | `radian_event_rules`, `radian_events`, `radian_event_attempts` | Pendiente |
| 2.7 | `0015` | Cola de Telco: `telco_jobs`, `telco_backoff` | Pendiente |
| 2.8 | `0016` | `odoo_document_links` y privilegios de `app_worker` | Pendiente |
| 2.9 | `0017` | Vistas, permisos `documents:events` y `documents:sync`, cierre | Pendiente |

## Aportes de la especificación anterior

La antigua `ETAPA_5_DATOS_Y_RESTRICCIONES.md` (numeración del 12-nov-2026 previa al orden definitivo) se retiró. Lo que tenía de valor ya está en el documento de arquitectura (modelo, calendario, máquina de estados, cola, inmutabilidad), salvo estos puntos, que se conservan aquí:

- **Notas crédito y débito:** con 033 o 034 aceptados la factura es título valor y no admite notas. Es un aviso para el usuario (vista `notes_blocked`, §7.3); la suite no emite notas.
- **Sincronizaciones extra en los cierres de mes,** además de la diaria, como regla del programador de Telco (Etapa 4, subetapa 4.3).
- **Después del plazo:** falta confirmar si, vencido el plazo y sin un 034 registrado, el adquirente todavía puede enviar el 033 o el 031. La base no bloquea el 031 fuera de plazo (decisión 6); la interfaz lo decide con `expiryIsTerminal` (frontend, decisión 5).
- **Retención legal** del XML, de los eventos y de la auditoría: ninguna factura ni evento se borra (punto 11 de la §11 del documento); el plazo legal sigue en [`PENDIENTES.md`](../PENDIENTES.md).
