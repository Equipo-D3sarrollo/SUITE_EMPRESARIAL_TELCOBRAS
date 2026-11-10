# ADR-013: DataDian como etapa 2 y nueva ruta de etapas

- **Estado:** Aceptado
- **Fecha:** 10 de noviembre de 2026
- **Decide:** usuario y arquitecto del producto
- **Decisiones:** cambia la ruta de abordaje (documento madre §15) y el módulo 04 (§3, §4.4, §4.7 y §12.2). Reemplaza parcialmente a [ADR-011](ADR-011-alcance-funcional.md) en el momento de RADIAN y el conector Odoo, y a [ADR-002](ADR-002-estilo-arquitectonico.md) en lo que toca a RADIAN como servicio Python aparte

## Contexto
El análisis de APIDIAN (FacturaLatam), en `docs/modules/documents/apidian/ANALISIS_APIDIAN.md`, mostró que su edición pública es MIT y trae eventos RADIAN y la consulta del XML por CUFE, pero no el extractor que lista los documentos recibidos en la DIAN, que es de su edición Enterprise. El usuario decidió priorizar esta herramienta por encima del CRM y darle nombre propio.

## Decisión
1. **Etapa 1 cerrada.** El usuario da por terminada la etapa 1 (Fundaciones) el 10-nov-2026. Los criterios de salida que no se verificaron pasan a `PENDIENTES.md` §3: administración de miembros y roles en la interfaz, E2E autenticado y Lighthouse móvil en la CI.
2. **DataDian es la nueva etapa 2.** El módulo 04 se llama **DataDian** en todo lo que ve el usuario final: menú, títulos y textos. El identificador interno `documents`, las rutas, los permisos y el código no cambian de nombre.
3. **Listado de recibidos propio.** No se licencia la edición Enterprise. La suite construye su propio listado de documentos recibidos en la DIAN. Del código MIT de APIDIAN se replican en TypeScript las piezas útiles, conservando su aviso de licencia: XML por CUFE, documentos recibidos, eventos RADIAN y catálogos.
4. **El Centro Documental desaparece.** DataDian ocupa su lugar en el menú. Dentro de DataDian van los servicios replicados de APIDIAN. Los submódulos se diseñan en la especificación de la etapa 2 antes de tocar el menú. El cambio de menú se aplica completo de una sola vez.
5. **DataDian vive dentro del monolito NestJS** como el módulo `documents`, no como un servicio Python aparte. ADR-002 suponía que RADIAN era una herramienta Python existente que se integraría por contrato; ahora la suite construye la funcionalidad. LeadGen sigue como servicio aparte.
6. **Gestión de archivos como servicio interno.** El almacenamiento de archivos en S3, con metadatos, versiones y hash, sigue existiendo sin pantalla propia. Lo usan DataDian para el XML y el PDF, y el CRM para sus adjuntos.

### Nueva ruta de etapas

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

Los ADR anteriores conservan la numeración vieja como registro histórico. Para leerlos se usa la columna "Antes era".

## Consecuencias
- La especificación del CRM pasa a `docs/etapas/ETAPA_3_ESPECIFICACION.md`. Conserva sus identificadores E2-1 a E2-13.
- Hay que escribir `docs/etapas/ETAPA_2_DATADIAN.md`, con los submódulos, el modelo de datos, los permisos y el criterio de salida, antes de implementar.
- D-14 (figura ante la DIAN) pasa a bloquear la etapa 2 en lo que toca a **enviar** eventos. Consultar y descargar documentos solo necesita el certificado de la organización.
- D-16 (versión y hosting de Odoo) pasa a la etapa 2.
- La custodia cifrada de certificados `.p12` por organización (D-12) llega en la etapa 2. Telcobras tiene acceso al portal de la DIAN; el certificado para las pruebas se consigue si no está vigente.
- El mapa de etapas que muestran las vistas de reserva (`apps/web/src/features/module-placeholder/stages.ts`) y los textos del menú se actualizan junto con el cambio de menú, no antes.
