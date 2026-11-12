# ADR-014: Arquitectura de DataDian y Telco

- **Estado:** Aceptado en la adopción del blueprint, el retiro de la implementación anterior y la integración con Odoo. Las adaptaciones al stack (punto 5) están **propuestas, pendientes de confirmar**, salvo la cola en PostgreSQL y el rol de Telco, aceptados con la Etapa 2. **Enmendado el 12 de noviembre de 2026: el orden de etapas definitivo reemplaza la tabla del punto 2 (ver [Enmienda](#enmienda-12-de-noviembre-de-2026-orden-de-etapas-definitivo))**
- **Fecha:** 12 de noviembre de 2026
- **Decide:** usuario y arquitecto del producto
- **Decisiones:** cambia el módulo 04 (documento madre §4.4) y la ruta de abordaje (§15). Reemplaza parcialmente a [ADR-013](ADR-013-datadian-y-nueva-ruta.md) en el diseño técnico de DataDian y en la ruta de etapas. Propone extraer el motor Telco del monolito ([ADR-002](ADR-002-estilo-arquitectonico.md)). Relacionada con D-12, D-14, D-15 y D-16

## Contexto
El 12 de noviembre de 2026 el usuario entregó su investigación sobre RADIAN, la facturación electrónica y el certificado digital, en cuatro informes guardados en `docs/modules/documents/DataDian/`. Fijó uno como blueprint oficial: `arquitectura Eventos RADIAN DIAN.md`. Los otros tres son soporte técnico.

El blueprint divide el módulo en dos componentes: **DataDian**, la interfaz, y **Telco**, un motor en segundo plano que hace la interoperabilidad con la DIAN (RPA con certificado, IMAP y SOAP), la criptografía (SHA-384 y XAdES-EPES) y el cumplimiento UBL 2.1. Pone los eventos RADIAN 030 a 033 en el centro del flujo, toma el XML oficial como fuente de cada factura y controla el plazo de la aceptación tácita. La implementación anterior de la obtención de facturas seguía otra vía y queda reemplazada.

La lectura de los informes mostró datos que no se pueden copiar como hechos: el nombre de la operación SOAP de envío, la fórmula del CUDE, la ubicación del código del evento, el cómputo del plazo, la normativa vigente y el acceso automatizado al portal, entre otros.

## Decisión
1. **Blueprint oficial.** La arquitectura del módulo 04 es la del blueprint, adaptada a la suite en [`docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md`](../modules/documents/ARQUITECTURA_DATADIAN_TELCO.md). Siguen vigentes de ADR-013 el nombre **DataDian**, el identificador interno `documents` y el reemplazo del Centro Documental.

2. **Ruta de etapas.** *(Reemplazado por la enmienda del 12-nov-2026; se conserva como registro.)* El plan del blueprint (sus etapas 1 a 6) ocupa las Etapas 2 a 7. Odoo pasa a la 8 y el CRM a la 9. Las etapas que seguían al CRM solo cambian de número.

   | Etapa | Contenido | Especificación | Antes era (ADR-013) |
   |---|---|---|---|
   | 0 | Decisiones y descubrimiento | — | 0 |
   | 1 | Fundaciones (cerrada) | — | 1 |
   | **2** | **Núcleo criptográfico (Telco)** | `ETAPA_2_NUCLEO_CRIPTOGRAFICO.md` | Parte de la 2 (DataDian) |
   | **3** | **Interoperabilidad SOAP DIAN** | `ETAPA_3_INTEROPERABILIDAD_SOAP.md` | Parte de la 2 |
   | **4** | **Ingesta automatizada RPA** | `ETAPA_4_INGESTA_RPA.md` | Parte de la 2 |
   | **5** | **Base de datos y lógica de restricciones** | `ETAPA_5_DATOS_Y_RESTRICCIONES.md` | Parte de la 2 |
   | **6** | **Ensamble UBL y transmisión** | `ETAPA_6_UBL_Y_TRANSMISION.md` | Parte de la 2 |
   | **7** | **Frontend DataDian y E2E** | `ETAPA_7_FRONTEND_DATADIAN.md` | Parte de la 2 |
   | **8** | **Integración con Odoo 19** | `ETAPA_8_INTEGRACION_ODOO.md` | Parte de la 2 (borrador en Odoo) |
   | 9 | CRM y notificaciones | `ETAPA_9_ESPECIFICACION.md` (antes `ETAPA_3_ESPECIFICACION.md`; conserva E2-1 a E2-13) | 3 |
   | 10 | Integration Hub completo y LeadGen | — | 4 |
   | 11 | Puente Make y módulo de Automatización | — | 5 |
   | 12 | Analítica, planes, Panel Global y piloto | — | 6 |
   | 13 | Agentes propios (final) | — | 7 |

   Las especificaciones están en `docs/etapas/`. La especificación anterior de DataDian se elimina; lo que seguía vigente de ella queda en el punto 1 y en el punto 4.

3. **Retiro de la implementación anterior.** Se retira el código de la vía anterior de obtención de facturas, que el blueprint reemplaza, y su herramienta de apoyo (`tools/dian`). Una migración nueva, la `0009`, elimina sus tablas (`dian_sessions` y `dian_extraction_jobs`) con sus políticas, permisos y tipos. Las migraciones `0005` a `0008`, ya aplicadas, no se editan ni se borran. La columna `received_documents.received_at`, que agregó la `0008`, se conserva.

   **Se conservan para adaptarlos en etapas posteriores:** el cliente de Odoo (`odoo.client.ts`, `odoo-vendor-bill.ts`), la configuración de Odoo (`documents-settings.*`, `settings-page.tsx`), `xlsx-reader.ts` y la base de recibidos (`received-documents.*`, las tablas `received_documents` y `odoo_connections`, la decisión de aprobar o rechazar y el tablero). El papel de cada pieza está en la §8 de la arquitectura.

4. **Odoo es la Etapa 8** *(desde la enmienda, Etapa 5)*. La integración con Odoo 19 Online crea el borrador de la factura de proveedor por la API JSON-2 (ADR-011, D-16). El disparador propuesto es la **aceptación expresa (033) registrada por la DIAN**, pendiente de confirmar con el usuario.

5. **Adaptaciones al stack (propuestas, pendientes de confirmar).**
   - **Telco es una aplicación TypeScript aparte del monolito, `apps/telco`.** La API de DataDian sigue en el módulo `documents` de NestJS. Motivos para separar Telco, como pide ADR-002: el RPA carga Chromium y Playwright, que no deben vivir en el proceso de la API; la llave privada del certificado solo se descifra en el proceso de Telco; los trabajos largos y sus reintentos no bloquean la API. El informe del certificado recomienda Node.js/TypeScript con Playwright 1.46 o superior, porque su opción `clientCertificates` resuelve el acceso con certificado (mTLS) sin el diálogo nativo del sistema operativo.
   - **La cola de Telco es una tabla de PostgreSQL**, opción que el blueprint admite en RNF2. La API inserta el evento y su trabajo en la misma transacción. Telco reclama trabajos con `FOR UPDATE SKIP LOCKED` y reintenta con espera exponencial. Es el mismo patrón de outbox de ADR-009 y E2-13, sin un broker nuevo. Telco no necesita Valkey ni BullMQ.
   - **Modelo multiempresa.** Las tablas `datadian_empresa`, `datadian_factura` y `datadian_evento` del blueprint se mapean a `dian_settings`, `received_documents` (conservada y adaptada) y `radian_events`. Todas llevan `organization_id` con RLS forzada (ADR-004) y nombres en inglés (ADR-008). La factura es única por `(organization_id, cufe)`. Telco trabaja dentro del contexto de la organización de cada trabajo, sin `BYPASSRLS`.
   - **Custodia del certificado (D-12).** El `.pfx` se guarda cifrado con cifrado envolvente en un prefijo privado de S3. Su contraseña y el PIN del software se guardan con `CredentialsCipher` (AES-256-GCM, llave maestra fuera de la base de datos). Telco los descifra solo en memoria.
   - **El XML de cada factura va a S3** con su SHA-256, por el servicio interno de archivos, en lugar de guardarse en Base64 dentro de la fila.

6. **Enviar eventos exige certificado y software habilitado.** Para enviar eventos a la DIAN hacen falta el certificado `.p12`/`.pfx` de la organización y un **software habilitado ante la DIAN**, con su `SoftwareID` y su PIN. Consultar el XML por CUFE, consultar los eventos de una factura y entrar al portal con certificado solo necesitan el certificado. **La figura exacta ante la DIAN (D-14) sigue abierta:** proveedor tecnológico tercero, mandato (evento 043), habilitación propia o solo descarga. De ella dependen quién firma y el `SignerRole` de la firma.

7. **Los errores conocidos del blueprint no se copian.** Quedan como puntos por verificar contra fuentes primarias en la §10 de la arquitectura: la operación de envío es `SendEventUpdateStatus`, no `SendEvent`; la fórmula del CUDE del blueprint parece la del CUFE; la ubicación del código del evento difiere entre informes; el plazo aparece como "3 días hábiles" y como "72 horas hábiles"; falta confirmar si el 031 exige el 032; la normativa vigente es la Resolución 000227 de 2025 (anexo T5.1); el acceso automatizado al portal tiene un bloqueo de robots desde el 28-jul-2026 y una revisión legal abierta, y no se resuelven captchas con servicios de terceros; los eventos solo son obligatorios en ventas a crédito.

## Consecuencias

*Los números de etapa de esta sección son los del punto 2. Con la enmienda del 12-nov-2026 rigen las consecuencias de la [enmienda](#enmienda-12-de-noviembre-de-2026-orden-de-etapas-definitivo).*

- Cada etapa nueva tiene su especificación en `docs/etapas/`. La especificación del CRM pasa a `ETAPA_9_ESPECIFICACION.md` sin cambiar sus identificadores.
- APIDIAN sigue como referencia de comportamiento, sin copiar ni traducir su código (enmienda de ADR-013). Su análisis conserva solo lo técnico útil.
- D-12 (custodia del certificado) llega en la Etapa 2. D-14 bloquea la transmisión de eventos de la Etapa 6. D-16 pasa a la Etapa 8. El calendario de días hábiles de Colombia se define en la Etapa 5. La revisión legal del acceso automatizado al portal bloquea la Etapa 4 en producción.
- ADR-011 sigue vigente: la suite registra 030, 031, 032 y 033; el 034 lo registra el emisor y la suite solo calcula su plazo y lo detecta.
- Si se confirma `apps/telco`, Telco es el primer componente fuera del monolito y este ADR es su justificación (ADR-002).
- Los riesgos que siguen vigentes en el código conservado (llamada a Odoo dentro de una transacción de la base de datos, SSRF por la URL de Odoo configurable y objeto huérfano en S3 si se revierte la transacción) quedan en `PENDIENTES.md`, asignados a su etapa.
- El mapa de etapas de las vistas de reserva (`apps/web/src/features/module-placeholder/stages.ts`) y el documento madre §15 se actualizan con la ruta nueva.

## Enmienda (12 de noviembre de 2026): orden de etapas definitivo

- **Decide:** usuario.
- **Contexto:** con los documentos de arquitectura de base de datos, frontend y backend, el usuario fijó el orden en que se construye DataDian: primero la base de datos, después el frontend contra contratos y mocks, y por último el backend. El orden del punto 2, que seguía el roadmap del blueprint, queda reemplazado. Las decisiones 1 y 3 a 7 siguen vigentes; solo cambian los números de etapa que citan.
- **Decisión:**

  | Etapa | Contenido | Especificación completa | Ficha | Antes (punto 2) |
  |---|---|---|---|---|
  | 1 | Fundaciones (cerrada) | — | — | 1 |
  | **2** | **Base de datos de DataDian** (2.1 a 2.9) | [`ARQUITECTURA_DB_DATADIAN.md`](../modules/documents/ARQUITECTURA_DB_DATADIAN.md) | [`ETAPA_2_BASE_DE_DATOS.md`](../etapas/ETAPA_2_BASE_DE_DATOS.md) | 5 |
  | **3** | **Frontend de DataDian** (3.1 a 3.8), contra contratos y mocks | [`ARQUITECTURA_FRONTEND_DATADIAN.md`](../modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md) | [`ETAPA_3_FRONTEND.md`](../etapas/ETAPA_3_FRONTEND.md) | 7 (interfaz) |
  | **4** | **Backend: Telco y API** (4.1 a 4.6) | [`ARQUITECTURA_BACKEND_DATADIAN.md`](../modules/documents/ARQUITECTURA_BACKEND_DATADIAN.md) | [`ETAPA_4_BACKEND.md`](../etapas/ETAPA_4_BACKEND.md) | 2, 3, 4, 6 y 7 (API y E2E) |
  | **5** | **Integración con Odoo 19** | [`ETAPA_5_INTEGRACION_ODOO.md`](../etapas/ETAPA_5_INTEGRACION_ODOO.md) | La misma | 8 |
  | 6 | CRM y notificaciones | [`ETAPA_6_ESPECIFICACION.md`](../etapas/ETAPA_6_ESPECIFICACION.md) (conserva E2-1 a E2-13) | La misma | 9 |
  | 7 | Integration Hub completo y LeadGen | — | — | 10 |
  | 8 | Puente Make y módulo de Automatización | — | — | 11 |
  | 9 | Analítica, planes, Panel Global y piloto | — | — | 12 |
  | 10 | Agentes propios (final) | — | — | 13 |

  La ruta con subetapas, dependencias, bloqueos y estado está en [`RUTA_DE_TRABAJO_DATADIAN.md`](../modules/documents/RUTA_DE_TRABAJO_DATADIAN.md). Las fichas de la numeración del punto 2 se retiraron; su contenido útil pasó a las fichas nuevas y a los documentos de arquitectura.
- **Decisiones de la Etapa 2 aceptadas** (§12 de la arquitectura de base de datos): rol `app_worker`; cola de Telco en PostgreSQL (confirma la propuesta del punto 5); NIT único entre organizaciones; certificados en tabla propia con historial; regla de plazo por defecto (3 días hábiles desde el registro del 032); la base no bloquea un 031 fuera de plazo; el 031 exige el 032; expandir ahora y contraer en la Etapa 4; festivos de 2020 a 2035.
- **Consecuencias con la numeración nueva:** D-12 (custodia del certificado) llega con la tabla `dian_certificates` en la Etapa 2 (subetapa 2.3) y con el vault en la 4.1. D-14 bloquea la transmisión de eventos de la subetapa 4.4. D-16 pasa a la Etapa 5. El calendario de días hábiles se implementó en la subetapa 2.2. La revisión legal del acceso automatizado bloquea la subetapa 4.3 en producción. Los riesgos del código conservado de Odoo se corrigen en la Etapa 5. El mapa de etapas de las vistas de reserva (`apps/web/src/features/module-placeholder/stages.ts`) sigue con la numeración del punto 2 y queda pendiente de actualizar (`PENDIENTES.md` §3).
