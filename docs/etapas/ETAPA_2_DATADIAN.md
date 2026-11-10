# Etapa 2 — DataDian

| Campo | Valor |
|---|---|
| Estado | **Alcance aprobado; diseño de submódulos pendiente.** No se implementa hasta completar las secciones marcadas "Por diseñar" |
| Fecha | 10 de noviembre de 2026 |
| Base | [ADR-013](../decisions/ADR-013-datadian-y-nueva-ruta.md), [ADR-011](../decisions/ADR-011-alcance-funcional.md) (alcance de RADIAN v1), Documento madre §4.4, §4.7, §10, §14 y §19, `docs/modules/documents/apidian/ANALISIS_APIDIAN.md` |
| Módulo | 04 del menú. Nombre visible: **DataDian**. Identificador interno: `documents` (no cambia) |
| Criterio de salida | En habilitación: una factura recibida se lista desde la DIAN, se revisa, se aprueba y queda como **borrador en Odoo**, con su XML guardado, su auditoría y aislamiento entre organizaciones probado |

## 1. Decisiones tomadas

| ID | Decisión | Fuente |
|---|---|---|
| DD-1 | La herramienta se llama **DataDian** en todo lo que ve el usuario final. El código, las rutas y los permisos siguen usando `documents` | Usuario, 10-nov-2026 |
| DD-2 | **El Centro Documental desaparece.** DataDian ocupa su lugar en el menú, y dentro de DataDian van los servicios replicados de APIDIAN | Usuario, 10-nov-2026 |
| DD-3 | **Listado de recibidos propio.** No se licencia la edición Enterprise de APIDIAN | Usuario, 10-nov-2026 |
| DD-4 | Del código **MIT** de APIDIAN Community se replican en TypeScript la consulta del XML por CUFE, los documentos recibidos, los eventos RADIAN y sus catálogos, conservando el aviso de licencia de Factura Latam | ADR-013 |
| DD-5 | RADIAN v1 es **solo recepción**: facturas de proveedores, eventos 030, 031, 032 y 033, aprobación humana y borrador en Odoo 19/20 con API JSON-2 | ADR-011 |
| DD-6 | **Primero el diseño, después el menú.** Los submódulos se definen en este documento y el cambio del menú se aplica completo de una sola vez | Usuario, 10-nov-2026 |
| DD-7 | Para las pruebas, Telcobras **tiene acceso al portal de la DIAN**. El certificado digital `.p12` se consigue si no está vigente. Todo se prueba en habilitación | Usuario, 10-nov-2026 |

## 2. Alcance

**Entra:**
- listado de documentos recibidos en la DIAN por rango de fechas, construido por la suite;
- consulta del XML de un documento por su CUFE;
- almacenamiento del XML y del PDF en el servicio interno de archivos;
- normalización (emisor, totales, impuestos e ítems) y validaciones determinísticas;
- eventos RADIAN 030, 031, 032 y 033, con su historial;
- revisión y aprobación humana;
- borrador de la factura de proveedor en Odoo;
- configuración DIAN por organización: certificado, ambiente y software;
- custodia cifrada del certificado (D-12) y conector Odoo mínimo.

**No entra:**
- emisión de facturas propias;
- aceptación tácita (034, la registra el emisor) y eventos de título valor (035 a 051);
- OCR o IA para extraer datos;
- el Integration Hub completo (etapa 4);
- el puente con Make (etapa 5).

## 3. Submódulos — Por diseñar

Propuesta de partida, sin aprobar:

| Submódulo | Para qué |
|---|---|
| Recibidos | Listado de facturas de proveedores y extracción por rango de fechas |
| Consulta por CUFE | Ficha de un documento, descarga del XML y del PDF |
| Eventos RADIAN | Acuse, recibo del bien o servicio, aceptación y reclamo, con su historial |
| Aprobaciones Odoo | Revisión humana y envío del borrador |
| Configuración DIAN | Certificado, ambiente, software y vencimientos |

Por diseñar para cada submódulo: el contenido de las Zonas 2, 3 y 4, los permisos y los estados vacíos.

## 4. Por diseñar antes de implementar

| Tema | Nota |
|---|---|
| Técnica del listado de recibidos | Evaluar el catálogo del portal con el enlace por token, el certificado `.p12` y el buzón de correo de recepción de facturas. Probarlo en habilitación |
| Modelo de datos | Documentos recibidos, líneas, impuestos, eventos, trabajos de extracción, aprobaciones y sincronización con Odoo, todos con `organization_id` y RLS |
| Máquinas de estado | Estado interno del documento y eventos ante la DIAN, por separado (Documento madre §4.4) |
| Permisos | Ver, extraer, aprobar, enviar eventos y configurar, con alcance propio o de todos |
| API | Endpoints REST, trabajos en BullMQ y errores problem+json |
| Pruebas obligatorias y criterio de salida detallado | Incluye el recorrido completo en habilitación |

## 5. Bloqueos y decisiones abiertas

| Tema | Bloquea | Fuente |
|---|---|---|
| D-14: figura ante la DIAN para **enviar** eventos | Solo el envío de eventos. Consultar y descargar no lo necesitan | Documento madre §14 |
| D-16: versión exacta, edición y hosting de Odoo | El borrador en Odoo | Documento madre §14 |
| Certificado `.p12` vigente de Telcobras | Las pruebas contra la DIAN | DD-7 |
| Retención legal de XML y PDF de facturas | El borrado definitivo de documentos | `PENDIENTES.md` |
| Revisión legal del acceso automatizado al portal de la DIAN | El listado por el portal | `ANALISIS_APIDIAN.md` §9 |
