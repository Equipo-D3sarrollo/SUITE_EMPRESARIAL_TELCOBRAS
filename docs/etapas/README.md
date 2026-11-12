# Especificaciones por etapa

La ruta vigente es la del [documento madre](../DOCUMENTO_MADRE_SUITE_TELCOBRAS.md) §15, con el orden que fijó el usuario el 12-nov-2026 ([ADR-014](../decisions/ADR-014-arquitectura-datadian-telco.md), enmienda del 12-nov-2026). Ese orden reemplaza cualquier otra numeración.

DataDian ocupa las etapas 2 a 5. Tiene dos componentes:
- **DataDian:** la interfaz y la API que usan las personas (módulo 04, identificador interno `documents`).
- **Telco:** el motor en segundo plano que habla con la DIAN (RPA con certificado, SOAP con WS-Security, firma XAdES-EPES, CUDE con SHA-384 y UBL 2.1).

En las etapas 2, 3 y 4 la ficha de esta carpeta es corta: **la especificación completa es su documento de arquitectura**, en `docs/modules/documents/`. La ruta de trabajo con subetapas, dependencias, bloqueos externos y estado está en [RUTA_DE_TRABAJO_DATADIAN.md](../modules/documents/RUTA_DE_TRABAJO_DATADIAN.md). Los pendientes y los puntos por verificar contra fuentes primarias (PV-1 a PV-20) están en [PENDIENTES.md](../PENDIENTES.md) §7.

| Etapa | Nombre | Ficha | Especificación completa | Estado |
|---|---|---|---|---|
| 1 | Fundaciones | — | [PLAN_IMPLEMENTACION_INICIAL.md](../PLAN_IMPLEMENTACION_INICIAL.md) | Cerrada el 10-nov-2026 (ADR-013); criterios sin verificar en `PENDIENTES.md` §3 |
| 2 | Base de datos de DataDian (2.1 a 2.9) | [ETAPA_2_BASE_DE_DATOS.md](ETAPA_2_BASE_DE_DATOS.md) | [ARQUITECTURA_DB_DATADIAN.md](../modules/documents/ARQUITECTURA_DB_DATADIAN.md) | **En curso:** 2.1 y 2.2 implementadas y en auditoría; sigue la 2.3 |
| 3 | Frontend de DataDian (3.1 a 3.8), contra contratos y mocks | [ETAPA_3_FRONTEND.md](ETAPA_3_FRONTEND.md) | [ARQUITECTURA_FRONTEND_DATADIAN.md](../modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md) | Pendiente; diseño propuesto |
| 4 | Backend: Telco y API (4.1 a 4.6) | [ETAPA_4_BACKEND.md](ETAPA_4_BACKEND.md) | [ARQUITECTURA_BACKEND_DATADIAN.md](../modules/documents/ARQUITECTURA_BACKEND_DATADIAN.md) | Pendiente; diseño propuesto. El envío real depende de D-14 y del software habilitado; el RPA en producción, de la revisión legal (PV-7) |
| 5 | Integración con Odoo 19 | [ETAPA_5_INTEGRACION_ODOO.md](ETAPA_5_INTEGRACION_ODOO.md) | La misma ficha | Pendiente; disparador (033) por confirmar; D-16 |
| 6 | CRM y notificaciones | [ETAPA_6_ESPECIFICACION.md](ETAPA_6_ESPECIFICACION.md) | La misma | Aprobada (decisiones E2-1 a E2-13 del 6-nov-2026) |

Las etapas 7 a 10 (Integration Hub y LeadGen; puente Make y Automatización; analítica, planes, Panel Global y piloto; agentes propios) solo están en el documento madre §15 y en el plan inicial, como referencia.

## Numeración anterior

Los ADR conservan la numeración de su fecha. Para leerlos:

| Contenido | Original (ADR-001 a ADR-012) | ADR-013 | ADR-014 (primera versión, 12-nov-2026) | **Vigente** (enmienda de ADR-014, 12-nov-2026) |
|---|---|---|---|---|
| Fundaciones | 1 | 1 | 1 | **1** |
| Base de datos de DataDian | 4 (RADIAN) | 2 | 5 | **2** |
| Frontend de DataDian | 4 | 2 | 7 | **3** |
| Backend: Telco y API (núcleo criptográfico, SOAP, RPA, UBL y E2E) | 4 | 2 | 2, 3, 4, 6 y 7 | **4** (4.1 a 4.6) |
| Integración con Odoo 19 | 4 | 2 | 8 | **5** |
| CRM y notificaciones | 2 | 3 | 9 | **6** |
| Integration Hub y LeadGen | 3 | 4 | 10 | **7** |
| Puente Make y Automatización | 4 | 5 | 11 | **8** |
| Analítica, planes, Panel Global y piloto | 5 | 6 | 12 | **9** |
| Agentes propios | 6 | 7 | 13 | **10** |

Fichas retiradas el 12-nov-2026 (su contenido útil pasó a las fichas nuevas o a los documentos de arquitectura): `ETAPA_2_NUCLEO_CRIPTOGRAFICO.md`, `ETAPA_3_INTEROPERABILIDAD_SOAP.md`, `ETAPA_4_INGESTA_RPA.md`, `ETAPA_5_DATOS_Y_RESTRICCIONES.md`, `ETAPA_6_UBL_Y_TRANSMISION.md` y `ETAPA_7_FRONTEND_DATADIAN.md`. `ETAPA_8_INTEGRACION_ODOO.md` pasó a ser `ETAPA_5_INTEGRACION_ODOO.md` y `ETAPA_9_ESPECIFICACION.md` (antes `ETAPA_3_ESPECIFICACION.md`), `ETAPA_6_ESPECIFICACION.md`.
