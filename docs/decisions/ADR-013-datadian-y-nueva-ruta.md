# ADR-013: DataDian como etapa 2 y nueva ruta de etapas

- **Estado:** Aceptado. Enmendado el 11 de noviembre de 2026 (licencia de APIDIAN). **El diseño técnico de DataDian y la ruta de etapas los reemplaza [ADR-014](ADR-014-arquitectura-datadian-telco.md) (12 de noviembre de 2026).** Siguen vigentes el nombre DataDian, el identificador `documents` y el reemplazo del Centro Documental
- **Fecha:** 10 de noviembre de 2026
- **Decide:** usuario y arquitecto del producto
- **Decisiones:** cambia la ruta de abordaje (documento madre §15) y el módulo 04 (§3, §4.4, §4.7 y §12.2). Reemplaza parcialmente a [ADR-011](ADR-011-alcance-funcional.md) en el momento de RADIAN y el conector Odoo, y a [ADR-002](ADR-002-estilo-arquitectonico.md) en lo que toca a RADIAN como servicio Python aparte. Reemplazado parcialmente por [ADR-014](ADR-014-arquitectura-datadian-telco.md)

## Contexto
El análisis de APIDIAN (FacturaLatam), en `docs/modules/documents/apidian/ANALISIS_APIDIAN.md`, mostró que su edición pública trae eventos RADIAN y la consulta del XML por CUFE, pero no el extractor que lista los documentos recibidos en la DIAN, que es de su edición Enterprise. El usuario decidió priorizar esta herramienta por encima del CRM y darle nombre propio.

## Decisión
1. **Etapa 1 cerrada.** El usuario da por terminada la etapa 1 (Fundaciones) el 10-nov-2026. Los criterios de salida que no se verificaron pasan a `PENDIENTES.md` §3: administración de miembros y roles en la interfaz, E2E autenticado y Lighthouse móvil en la CI.
2. **DataDian es la nueva etapa 2.** El módulo 04 se llama **DataDian** en todo lo que ve el usuario final: menú, títulos y textos. El identificador interno `documents`, las rutas, los permisos y el código no cambian de nombre. *(Vigente. Desde la enmienda de ADR-014 del 12-nov-2026, DataDian ocupa las Etapas 2 a 5: base de datos, frontend, backend y Odoo.)*
3. **Listado de recibidos propio.** No se licencia la edición Enterprise. La suite construye su propio listado de documentos recibidos en la DIAN. APIDIAN Community queda como referencia de comportamiento (ver la enmienda). *(El cómo lo define ADR-014.)*
4. **El Centro Documental desaparece.** DataDian ocupa su lugar en el menú. El cambio de menú se aplica completo de una sola vez. *(Vigente.)*
5. **DataDian vive dentro del monolito NestJS** como el módulo `documents`, no como un servicio Python aparte. ADR-002 suponía que RADIAN era una herramienta Python existente que se integraría por contrato; ahora la suite construye la funcionalidad. LeadGen sigue como servicio aparte. *(ADR-014 propone que el motor Telco sea una aplicación TypeScript aparte, `apps/telco`; la interfaz y la API de DataDian siguen en el monolito.)*
6. **Gestión de archivos como servicio interno.** El almacenamiento de archivos en S3, con metadatos, versiones y hash, sigue existiendo sin pantalla propia. Lo usan DataDian para el XML de las facturas y el CRM para sus adjuntos.

### Ruta de etapas de este ADR

Registro histórico. **La ruta vigente es la de [ADR-014](ADR-014-arquitectura-datadian-telco.md).**

| Etapa | Contenido | Antes era |
|---|---|---|
| 0 | Decisiones y descubrimiento | 0 |
| 1 | Fundaciones (cerrada) | 1 |
| **2** | **DataDian:** listado de recibidos, XML por CUFE, eventos RADIAN, aprobación humana y borrador en Odoo, con el conector Odoo y la custodia de certificados mínimos que necesita | Parte de la 4 (RADIAN) y de la 3 (conector Odoo y Credential Manager) |
| 3 | CRM y notificaciones, con adjuntos | 2, sin el Centro Documental |
| 4 | Integration Hub completo y LeadGen | 3 |
| 5 | Puente Make y módulo de Automatización | Resto de la 4 |
| 6 | Analítica, planes, Panel Global y piloto | 5 |
| 7 | Agentes propios (final) | 6 |

Los ADR anteriores conservan la numeración vieja como registro histórico. Para leerlos se usa la columna "Antes era" de esta tabla y la de ADR-014.

## Enmienda del 11 de noviembre de 2026

**Licencia (corrige el punto 3).** Solo los controladores, las plantillas y los catálogos de APIDIAN Community son MIT. La firma XAdES y el cliente SOAP de la DIAN están en la librería `ubl21dian/torresoftware`, con licencia **LGPL-3.0**, que no viene en el clon. APIDIAN queda como **referencia de comportamiento**. Lo que se construya en TypeScript se escribe a partir del anexo técnico y del WSDL públicos de la DIAN, no como traducción de esa librería. El detalle está en `docs/modules/documents/apidian/ANALISIS_APIDIAN.md` §12.

## Consecuencias
- La especificación del CRM pasó a la etapa siguiente a DataDian. Hoy es `docs/etapas/ETAPA_6_ESPECIFICACION.md` (enmienda de ADR-014) y conserva sus identificadores E2-1 a E2-13.
- El diseño técnico de DataDian está en `docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md` y en los documentos de arquitectura de base de datos, frontend y backend de la misma carpeta, con su ruta en `RUTA_DE_TRABAJO_DATADIAN.md` (ADR-014).
- D-14 (figura ante la DIAN) bloquea el **envío** de eventos. Consultar y descargar documentos solo necesita el certificado de la organización. Con la enmienda de ADR-014 queda en la subetapa 4.4.
- D-16 (versión y hosting de Odoo) pasa a la integración con Odoo, hoy la Etapa 5.
- La custodia cifrada de certificados `.p12` por organización (D-12) llega con DataDian: la tabla de certificados en la Etapa 2 (subetapa 2.3) y el vault en la subetapa 4.1. Telcobras tiene acceso al portal de la DIAN; el certificado para las pruebas se consigue si no está vigente.
- El mapa de etapas que muestran las vistas de reserva (`apps/web/src/features/module-placeholder/stages.ts`) y los textos del menú se actualizan junto con el cambio de menú, no antes.
