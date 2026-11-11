# Etapa 2 — DataDian

| Campo | Valor |
|---|---|
| Estado | **Alcance aprobado y verificado contra la DIAN y el código de APIDIAN (11-nov-2026). Plan propuesto en §4, pendiente de aprobación.** No se implementa hasta que el usuario lo ordene |
| Fecha | 10 de noviembre de 2026. Revisado el 11 de noviembre de 2026 |
| Base | [ADR-013](../decisions/ADR-013-datadian-y-nueva-ruta.md) y su enmienda, [ADR-011](../decisions/ADR-011-alcance-funcional.md), Documento madre §4.4, §4.7, §10, §14 y §19, `docs/modules/documents/apidian/ANALISIS_APIDIAN.md` (incluye la auditoría del código, §12, y la verificación oficial, §13) |
| Módulo | 04 del menú. Nombre visible: **DataDian**. Identificador interno: `documents` (no cambia) |
| Criterio de salida | Una factura recibida real de Telcobras se trae de la DIAN, queda en la suite con su PDF y su XML, se revisa, se aprueba y queda como **borrador en Odoo con el PDF adjunto**, con auditoría completa y aislamiento entre organizaciones probado |

## 1. Qué hace DataDian (flujo real)

Así lo definió el usuario el 11-nov-2026. Es el proceso que hoy se hace a mano:

| Paso | Qué se hace hoy a mano | Qué hace DataDian |
|---|---|---|
| 1. Listado | Entrar al portal de la DIAN y exportar a Excel el listado de facturas recibidas pendientes | Carga ese listado en la suite: un registro por factura, con su CUFE |
| 2. Descarga | En el portal, módulo Documentos, descargar una por una cada factura por su CUFE. Viene en PDF | Obtiene el PDF y el XML de cada CUFE y los guarda en el servicio interno de archivos |
| 3. Gestión | Revisar y pasar a contabilidad | Bandeja para auditar, registrar y **aprobar o rechazar**, con trazabilidad de cada acción |
| 4. Odoo | Digitar o cargar la factura en Odoo | Al aprobar, crea la factura de proveedor como **borrador en Odoo 19** y le adjunta el PDF de la DIAN |

**Dos precisiones de nombres**, para no confundir:

- El listado y la descarga se hacen en el **catálogo de factura electrónica de la DIAN** (`catalogo-vpfe.dian.gov.co`), no en RADIAN. **RADIAN** es el registro de eventos sobre la factura (acuse, recibo, aceptación, reclamo). En el uso diario se le dice "portal RADIAN" a todo.
- "Aprobar o rechazar" en este flujo es una **decisión interna** de la suite. No es lo mismo que enviar a la DIAN el evento de aceptación (033) o de reclamo (031). Eso es la fase C y depende de D-14.

## 2. Decisiones tomadas

| ID | Decisión | Fuente |
|---|---|---|
| DD-1 | La herramienta se llama **DataDian** en todo lo que ve el usuario final. El código, las rutas y los permisos siguen usando `documents` | Usuario, 10-nov-2026 |
| DD-2 | **El Centro Documental desaparece.** DataDian ocupa su lugar en el menú | Usuario, 10-nov-2026 |
| DD-3 | **Listado de recibidos propio.** No se licencia la edición Enterprise de APIDIAN | Usuario, 10-nov-2026 |
| DD-4 | APIDIAN Community es **referencia de comportamiento**, no código para copiar. Sus controladores, plantillas y catálogos son MIT; la firma y el cliente SOAP están en una librería aparte con licencia **LGPL-3.0** que no viene en el clon. Lo que se construya en TypeScript se escribe a partir del anexo técnico y del WSDL públicos de la DIAN | ADR-013 enmendado, 11-nov-2026 |
| DD-5 | Los eventos RADIAN 030, 031, 032 y 033 siguen en el alcance (ADR-011), pero como **fase C**, después del flujo de §1 y sujetos a D-14 | ADR-011; usuario, 11-nov-2026 |
| DD-6 | **Primero el diseño, después el menú.** El cambio del menú se aplica completo de una sola vez | Usuario, 10-nov-2026 |
| DD-7 | Telcobras **tiene acceso al portal de la DIAN**. El certificado digital `.p12` se consigue si no está vigente | Usuario, 10-nov-2026 |
| DD-8 | El flujo de la etapa 2 es el de §1: listado, descarga por CUFE, gestión con trazabilidad y borrador en Odoo con el PDF adjunto | Usuario, 11-nov-2026 |
| DD-9 | El conector Odoo usa **Odoo 19 Online** por su API JSON-2 (petición HTTP con API key) | Usuario, 11-nov-2026; ADR-011 |

## 3. Lo que se verificó (11-nov-2026)

### 3.1 En la DIAN

| Hecho | Consecuencia para DataDian | Fuente |
|---|---|---|
| Al catálogo se entra con un **enlace con token** que la DIAN envía al correo registrado en el RUT. Para una empresa, al correo del representante legal. Dura **60 minutos** | El paso 1 no se puede dejar desatendido: cada sesión necesita que una persona pida el token | Portal DIAN; guías de proveedores (Dataico, Forvis Mazars) |
| Dentro del catálogo hay consulta de documentos enviados y recibidos, y una opción **Descargar listados** por rango de fechas | Es el Excel del paso 1 | Portal DIAN |
| Desde el **28-jul-2026**, la opción *Buscar documento* pide el **NIT del emisor o del receptor** para consultar, y otra vez para descargar | Es la validación con el NIT de Telcobras del paso 2. No es un cifrado del PDF: no se encontró ninguna fuente oficial que hable de un PDF cifrado. **Por confirmar con el usuario** | Comunicado DIAN del 23-jul-2026 |
| El mismo comunicado advierte que el sistema **bloquea robots, automatizaciones y agentes de IA** con el mensaje *Solicitud bloqueada por controles de seguridad* y pide una comprobación humana | Automatizar el portal con un robot es frágil y va contra un control expreso de la DIAN. No puede ser la única vía | Comunicado DIAN del 23-jul-2026 |
| El **web service oficial** de la DIAN (`WcfDianCustomerServices.svc`, operación `GetXmlByDocumentKey`) entrega el **XML** de un documento por su CUFE, autenticado con el certificado `.p12` de la empresa. **No entrega PDF** | Es la vía estable para el contenido de la factura. El PDF de la DIAN solo sale del portal | Código de APIDIAN y su librería; anexo técnico de factura electrónica 1.9 (Resolución 000165 de 2023) |
| Las facturas reales de proveedores solo existen en **producción** | Listar y descargar son operaciones de lectura: se prueban en producción. Habilitación solo sirve para probar el envío de eventos (fase C) | Manual de APIDIAN: "el ambiente manda" |

### 3.2 En Odoo

| Hecho | Consecuencia | Fuente |
|---|---|---|
| La API JSON-2 de Odoo 19 recibe `POST /json/2/<modelo>/<método>` con la API key en `Authorization: Bearer` | El borrador se crea con `account.move` y el PDF se adjunta con `ir.attachment` | Documentación oficial de Odoo 19 |
| En Odoo Online, el acceso a la API externa **solo está en el plan Custom** | **Hay que confirmar el plan de Telcobras antes de construir el conector** | Documentación oficial de Odoo 19 |
| Las API key tienen vencimiento | El conector debe avisar antes de que venza | Documentación oficial de Odoo 19 |
| Odoo 19 trae RADIAN nativo | Sigue abierta la comparación de D-16 para no duplicar funciones | Documento madre H-11 |

### 3.3 En APIDIAN

El detalle está en `ANALISIS_APIDIAN.md` §12. En resumen:

- La edición Community **no trae el listado de recibidos** ni nada que entre al catálogo con token.
- Sí muestra cómo consultar el XML por CUFE, cómo leer la factura y cómo armar y enviar los eventos.
- Su código tiene errores y prácticas de seguridad que no se deben heredar. Se replica el comportamiento, no el código.

## 4. Plan propuesto — pendiente de aprobación

### 4.1 Cómo se resuelve cada paso

| Paso | Vía principal | Respaldo | Por qué |
|---|---|---|---|
| 1. Listado | **Importar el Excel** que el usuario exporta del catálogo de la DIAN | Sesión asistida: el usuario pega el enlace con token y la suite lee el listado mientras dure | El Excel no depende de robots ni del formato de pantalla del portal, y ya es parte del trabajo de hoy. El token exige a una persona en cualquier caso |
| 2a. XML por CUFE | **Web service oficial** `GetXmlByDocumentKey`, con el `.p12` de la organización | Carga manual del XML | Canal oficial, estable y sin intervención humana. Da los datos exactos para validar y para armar el borrador |
| 2b. PDF por CUFE | Descarga del portal dentro de la **sesión asistida** con token, validando con el NIT | Carga manual del PDF (uno o varios) | El PDF de la DIAN solo existe en el portal. Si el control anti-robots lo bloquea, el flujo no se detiene: el usuario lo sube |
| 3. Gestión | Bandeja propia con estados, comentarios, aprobación o rechazo y auditoría de cada acción | — | No depende de terceros |
| 4. Odoo | Conector JSON-2: crea `account.move` en borrador y adjunta el PDF | Reintento con idempotencia por CUFE | Una factura aprobada nunca se crea dos veces en Odoo |

**Regla de diseño:** ningún paso depende solo del robot sobre el portal. Cada uno tiene una vía que funciona aunque la DIAN cambie la pantalla o bloquee la automatización.

### 4.2 Fases

| Fase | Contenido | Depende de |
|---|---|---|
| **0. Pruebas de concepto** (antes de diseñar pantallas) | (a) `GetXmlByDocumentKey` en TypeScript con el `.p12` de Telcobras, sobre un CUFE real. (b) Leer un Excel real exportado del catálogo y fijar sus columnas. (c) Descargar un PDF en una sesión con token y medir si el control anti-robots lo permite. (d) Crear un borrador con adjunto en el Odoo de Telcobras | Certificado `.p12` vigente; un Excel real; plan de Odoo confirmado |
| **A. Flujo completo con carga asistida** | Importar Excel, XML por web service, PDF por sesión o carga manual, bandeja con aprobación y rechazo, auditoría, borrador en Odoo. Cumple el criterio de salida | Fase 0 |
| **B. Menos pasos manuales** | Sesión asistida con token para listar y bajar los PDF en bloque; avisos de vencimiento del certificado y de la API key | Resultado de la prueba (c); revisión legal del acceso automatizado |
| **C. Eventos RADIAN** | Envío de 030, 031, 032 y 033 con su historial | **D-14** y un software habilitado ante la DIAN |

### 4.3 Submódulos propuestos

| Submódulo | Para qué |
|---|---|
| Recibidos | Importar el listado, ver el estado de descarga de cada factura y abrir su ficha con el PDF y el XML |
| Aprobaciones | Auditar, aprobar o rechazar, y ver el resultado del envío a Odoo |
| Trazabilidad | Historial de cada factura: quién la importó, descargó, revisó, aprobó o rechazó, y cuándo |
| Eventos RADIAN | Fase C |
| Configuración DIAN y Odoo | Certificado, NIT, ambiente, conexión a Odoo y vencimientos |

Por diseñar para cada submódulo: el contenido de las Zonas 2, 3 y 4, los permisos y los estados vacíos.

## 5. Por diseñar antes de implementar

| Tema | Nota |
|---|---|
| Modelo de datos | Importaciones, documentos recibidos, líneas, impuestos, archivos, aprobaciones, sincronización con Odoo y, en fase C, eventos. Todos con `organization_id` y RLS. Clave única por organización y CUFE |
| Máquinas de estado | Estado interno del documento (importado, descargado, en revisión, aprobado, rechazado, enviado a Odoo, error) y, por separado, eventos ante la DIAN (Documento madre §4.4) |
| Permisos | Ver, importar, aprobar, rechazar, enviar a Odoo, enviar eventos y configurar. Quien importa no debería ser el único que aprueba |
| API | Endpoints REST, trabajos en BullMQ y errores problem+json |
| Custodia de secretos | Certificado `.p12`, su contraseña y la API key de Odoo con cifrado envolvente (D-12). Nunca en texto plano ni en registros |
| Pruebas obligatorias y criterio de salida detallado | Incluye el recorrido completo con una factura real |

**Lo que falta en la suite para construirlo:** el módulo `documents` en `apps/api`, BullMQ, el cifrado envolvente, las librerías de XML, firma y PKCS#12, el conector Odoo y las pantallas. Ya existen S3, Valkey, RLS, RBAC, auditoría, idempotencia y errores problem+json.

## 6. Alcance

**Entra:** el flujo de §1 (fases 0, A y B), la custodia cifrada del certificado y el conector Odoo mínimo. Los eventos RADIAN 030 a 033 entran como fase C.

**No entra:**
- emisión de facturas propias;
- aceptación tácita (034, la registra el emisor) y eventos de título valor (035 a 051);
- OCR o IA para extraer datos;
- el Integration Hub completo (etapa 4);
- el puente con Make (etapa 5).

## 7. Bloqueos y decisiones abiertas

| Tema | Bloquea | Fuente |
|---|---|---|
| Certificado `.p12` vigente de Telcobras | El XML por web service (fase 0 y A). Sin certificado, solo queda la vía del portal | DD-7 |
| Plan de Odoo Online de Telcobras: la API externa exige el plan Custom | El borrador en Odoo | Documentación de Odoo 19; D-16 |
| Confirmar qué significa "PDF desencriptado con el NIT": validación del portal o archivo protegido con clave | El diseño de la descarga del PDF | §3.1 |
| Columnas reales del Excel de la DIAN y qué significa "pendiente" en ese listado | El importador | Fase 0 (b) |
| Control anti-robots del catálogo y revisión legal del acceso automatizado | Solo la fase B. La fase A funciona con carga asistida | Comunicado DIAN del 23-jul-2026 |
| D-14: figura ante la DIAN para **enviar** eventos | Solo la fase C | Documento madre §14 |
| D-16: comparar con el RADIAN nativo de Odoo 19 | No bloquea; evita duplicar funciones | Documento madre §14 |
| Retención legal de XML y PDF de facturas | El borrado definitivo de documentos | `PENDIENTES.md` |

## 8. Fuentes oficiales consultadas

- DIAN, comunicado del 23-jul-2026 sobre la seguridad del catálogo de factura electrónica: <https://www.dian.gov.co/Prensa/Paginas/ng-dian-fortalece-seguridad-de-catalogo-de-factura-electronica.aspx>
- DIAN, catálogo de factura electrónica: <https://catalogo-vpfe.dian.gov.co/User/Login> y <https://catalogo-vpfe.dian.gov.co/User/SearchDocument>
- DIAN, micrositio del sistema de factura electrónica: <https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/>
- DIAN, Resolución 000165 de 2023 (anexo técnico de factura electrónica 1.9) y Resolución 000085 de 2022 (RADIAN)
- Odoo 19, External JSON-2 API: <https://www.odoo.com/documentation/19.0/developer/reference/external_api.html>
