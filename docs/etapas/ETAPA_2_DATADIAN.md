# Etapa 2 — DataDian

| Campo | Valor |
|---|---|
| Estado | **Alcance aprobado y verificado contra la DIAN y el código de APIDIAN (11-nov-2026). Plan propuesto en §4, ajustado con las respuestas del usuario del mismo día, pendiente de aprobación.** No se implementa hasta que el usuario lo ordene |
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

### 1.1 Campos del listado (Excel real de Telcobras, 11-nov-2026)

El usuario entregó una captura del Excel y confirmó tres reglas:

- **Todas las columnas vienen de la DIAN.** El Excel trae más, pero la suite **solo guarda las 18 de esta tabla** e ignora el resto.
- **Los datos no se modifican.** Lo que viene de la DIAN se guarda tal cual y se muestra en solo lectura.
- **El identificador único de cada factura es el CUFE.**

| # | Campo | Ejemplo de formato |
|---|---|---|
| 1 | Tipo de documento | Factura electrónica |
| 2 | **CUFE/CUDE** | Código de 96 caracteres. **Identificador único** |
| 3 | Folio | Número de la factura |
| 4 | Prefijo | Letras o código antes del folio |
| 5 | Medio de pago | Código DIAN (1, 47, 49…) |
| 6 | Fecha de emisión | dd/mm/aaaa |
| 7 | NIT emisor | NIT del proveedor |
| 8 | Nombre emisor | Razón social del proveedor |
| 9 | IVA | Valor |
| 10 | INC | Valor |
| 11 | Total | Valor |
| 12 | Estado | "Aprobado con notificación" |
| 13 | Grupo | "Recibido" |
| 14 | Centro de costos | Proyecto o área |
| 15 | Tipo | Crédito o contado |
| 16 | Estado (acuse…) | Encabezado recortado en la captura; el nombre completo se toma del archivo real |
| 17 | Factura | Consecutivo tipo `FACTU/aaaa/mm/0001` |
| 18 | Observaciones | Texto |

**"Pendiente"** es un estado que define la DIAN y significa que la factura **aún no se ha pagado**. La suite no lo calcula: lo recibe en el listado.

El importador busca las columnas **por su nombre de encabezado**, no por su posición, porque el archivo trae columnas intermedias que se ignoran. El archivo Excel real queda pendiente; con él se fijan los nombres exactos.

### 1.2 El PDF de la DIAN

Es la **Representación Gráfica** estándar de la DIAN, igual para todos los proveedores. Trae los datos del documento (CUFE, número, fechas, forma y medio de pago), los datos del emisor y del adquiriente, el detalle de productos con impuestos por línea y las notas finales. Llega **protegido con clave, y la clave es el NIT** (DD-11).

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
| DD-9 | El conector Odoo usa **Odoo 19 Online** por su API (petición HTTP). El plan de Telcobras **sí permite el envío**: hoy una automatización en **Make.com** envía los PDF y los datos a Odoo con una petición HTTP. La suite **usa la misma lógica** desde su propio conector; Make queda solo como ejemplo, no como parte del flujo | Usuario, 11-nov-2026; ADR-011 |
| DD-10 | El certificado `.p12` queda **pendiente**. El flujo principal no depende de él: funciona con el Excel y el PDF. El XML por web service es una mejora opcional para cuando haya certificado | Usuario, 11-nov-2026 |
| DD-11 | El NIT de Telcobras se usa **dos veces**: se escribe en el portal para descargar, y es la **clave para abrir el PDF**, que llega protegido. La suite guarda y envía a Odoo el PDF **ya abierto**, sin clave | Usuario, 11-nov-2026 |
| DD-12 | Del Excel de la DIAN solo se guardan los 18 campos de §1.1; los demás se ignoran. Todos vienen de la DIAN y **no se modifican** en la suite. El identificador único de cada factura es el **CUFE** | Usuario, 11-nov-2026 |
| DD-13 | "Pendiente" lo define la DIAN y significa que la factura aún no se ha pagado | Usuario, 11-nov-2026 |

## 3. Lo que se verificó (11-nov-2026)

### 3.1 En la DIAN

| Hecho | Consecuencia para DataDian | Fuente |
|---|---|---|
| Al catálogo se entra con un **enlace con token** que la DIAN envía al correo registrado en el RUT. Para una empresa, al correo del representante legal. Dura **60 minutos** | El paso 1 no se puede dejar desatendido: cada sesión necesita que una persona pida el token | Portal DIAN; guías de proveedores (Dataico, Forvis Mazars) |
| Dentro del catálogo hay consulta de documentos enviados y recibidos, y una opción **Descargar listados** por rango de fechas | Es el Excel del paso 1 | Portal DIAN |
| Desde el **28-jul-2026**, la opción *Buscar documento* pide el **NIT del emisor o del receptor** para consultar, y otra vez para descargar | Es la primera validación con el NIT del paso 2. Además, el usuario confirmó que el PDF descargado **llega protegido y se abre con el mismo NIT** (DD-11) | Comunicado DIAN del 23-jul-2026; usuario, 11-nov-2026 |
| El mismo comunicado advierte que el sistema **bloquea robots, automatizaciones y agentes de IA** con el mensaje *Solicitud bloqueada por controles de seguridad* y pide una comprobación humana | Automatizar el portal con un robot es frágil y va contra un control expreso de la DIAN. No puede ser la única vía | Comunicado DIAN del 23-jul-2026 |
| El **web service oficial** de la DIAN (`WcfDianCustomerServices.svc`, operación `GetXmlByDocumentKey`) entrega el **XML** de un documento por su CUFE, autenticado con el certificado `.p12` de la empresa. **No entrega PDF** | Es la vía estable para el contenido de la factura. El PDF de la DIAN solo sale del portal | Código de APIDIAN y su librería; anexo técnico de factura electrónica 1.9 (Resolución 000165 de 2023) |
| Las facturas reales de proveedores solo existen en **producción** | Listar y descargar son operaciones de lectura: se prueban en producción. Habilitación solo sirve para probar el envío de eventos (fase C) | Manual de APIDIAN: "el ambiente manda" |

### 3.2 En Odoo

| Hecho | Consecuencia | Fuente |
|---|---|---|
| La API JSON-2 de Odoo 19 recibe `POST /json/2/<modelo>/<método>` con la API key en `Authorization: Bearer` | El borrador se crea con `account.move` y el PDF se adjunta con `ir.attachment` | Documentación oficial de Odoo 19 |
| En Odoo Online, el acceso a la API externa solo está en el plan Custom | **Resuelto:** el usuario confirmó que el Odoo 19 Online de Telcobras permite el envío, porque una automatización en Make.com ya lo hace con una petición HTTP (DD-9). La suite replica esa lógica | Documentación oficial de Odoo 19; usuario, 11-nov-2026 |
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
| 2a. PDF por CUFE | **Carga del PDF** descargado del portal (uno o varios a la vez). La suite lo **abre con el NIT de la organización**, lo asocia a su factura por el CUFE que trae impreso y guarda la copia sin clave | Sesión asistida con token: la suite descarga los PDF escribiendo el NIT en el portal | El PDF de la DIAN solo existe en el portal. La carga manual no depende del control anti-robots |
| 2b. XML por CUFE (**opcional, pendiente del certificado**, DD-10) | Web service oficial `GetXmlByDocumentKey`, con el `.p12` de la organización | Carga manual del XML | Cuando haya certificado, da el detalle exacto de líneas e impuestos sin intervención humana. Sin él, el flujo sigue con el Excel y el PDF |
| 3. Gestión | Bandeja propia. Los datos de la DIAN se ven en **solo lectura**. Lo único que agrega la suite es la decisión (aprobar o rechazar), su motivo y la auditoría de cada acción | — | No depende de terceros |
| 4. Odoo | Petición HTTP a Odoo, con la misma lógica de la automatización actual de Make: crea la factura de proveedor en borrador con los datos del listado, sin alterarlos, y adjunta el PDF sin clave. Guarda la respuesta de Odoo como parte de la trazabilidad | Reintento con idempotencia por CUFE | Una factura aprobada nunca se crea dos veces en Odoo |

**Regla de diseño:** ningún paso depende solo del robot sobre el portal. Cada uno tiene una vía que funciona aunque la DIAN cambie la pantalla o bloquee la automatización.

### 4.2 Fases

| Fase | Contenido | Depende de |
|---|---|---|
| **0. Pruebas de concepto** (antes de diseñar pantallas) | (a) Leer el archivo Excel real y fijar sus columnas, incluidas las ocultas. (b) Abrir con el NIT un PDF real protegido, guardarlo sin clave y leer su CUFE. (c) Crear un borrador con adjunto en el Odoo de Telcobras, por la misma vía que usa la automatización actual. (d) Descargar un PDF en una sesión con token y medir si el control anti-robots lo permite | Archivo Excel y PDF reales; datos de la automatización actual de Odoo |
| **A. Flujo completo con carga asistida** | Importar Excel, cargar los PDF y abrirlos con el NIT, bandeja en solo lectura con aprobación y rechazo, auditoría, borrador en Odoo con el PDF. Cumple el criterio de salida. **No necesita certificado** | Fase 0 |
| **B. Menos pasos manuales** | Sesión asistida con token para listar y bajar los PDF en bloque. XML por web service cuando haya certificado. Avisos de vencimiento | Resultado de la prueba (d); revisión legal del acceso automatizado; certificado `.p12` |
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
| Modelo de datos | Importaciones, documentos recibidos con los 18 campos de §1.1 (inmutables tras importar), archivos, aprobaciones, sincronización con Odoo y, en fase C, eventos. Todos con `organization_id` y RLS. Clave única por organización y CUFE. Qué pasa al reimportar un CUFE que ya existe queda por diseñar |
| Máquinas de estado | Estado interno del documento (importado, descargado, en revisión, aprobado, rechazado, enviado a Odoo, error) y, por separado, eventos ante la DIAN (Documento madre §4.4) |
| Permisos | Ver, importar, aprobar, rechazar, enviar a Odoo, enviar eventos y configurar. Quien importa no debería ser el único que aprueba |
| API | Endpoints REST, trabajos en BullMQ y errores problem+json |
| Custodia de secretos | Certificado `.p12`, su contraseña y la API key de Odoo con cifrado envolvente (D-12). Nunca en texto plano ni en registros |
| Pruebas obligatorias y criterio de salida detallado | Incluye el recorrido completo con una factura real |

**Lo que falta en la suite para construirlo:** el módulo `documents` en `apps/api`, BullMQ, el cifrado envolvente, un lector de Excel, una herramienta que abra PDF protegidos con clave, el conector Odoo y las pantallas. Las librerías de XML, firma y PKCS#12 solo hacen falta para el XML por web service y los eventos. Ya existen S3, Valkey, RLS, RBAC, auditoría, idempotencia y errores problem+json.

### 5.1 Avance de implementación

| Fecha | Qué quedó hecho | Dónde |
|---|---|---|
| 11-nov-2026 | **Paso 1 y paso 3 en el backend.** Importación del Excel de la DIAN (solo los 18 campos, columnas por nombre, CUFE como clave, sin duplicar ni sobrescribir), bandeja con paginación y filtro por estado, aprobación o rechazo una sola vez (el rechazo exige motivo) e historial por factura. RLS por organización; la base de datos impide modificar los datos de la DIAN y borrar facturas. Permisos nuevos `documents:import` y `documents:decide` (dueño y contador). 10 pruebas | `apps/api/src/modules/documents/`, migración `0005_received_documents.sql`, `packages/contracts/src/schemas/received-document.ts`, `apps/api/test/documents.test.ts` |

**Endpoints** (`/api/v1/documents/received`): `POST /imports` (cuerpo `.xlsx`, máximo 10 MB), `GET /`, `GET /:id`, `POST /:id/decision`, `GET /:id/history`.

**Siguiente:** paso 2 (carga del PDF y apertura con el NIT), paso 4 (envío a Odoo) y las pantallas.

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
| Certificado `.p12` de Telcobras: **pendiente** (DD-10) | Solo el XML por web service (fase B) y los eventos (fase C). No bloquea la fase A | Usuario, 11-nov-2026 |
| Detalle de la petición HTTP que hace hoy el escenario de Make: URL, modelo, campos y credencial de Odoo | El diseño del conector. El acceso y la lógica ya están confirmados (DD-9) | Usuario, 11-nov-2026 |
| El archivo Excel real y un PDF real protegido: **pendientes por decisión del usuario** | Los nombres exactos de los encabezados y la prueba de apertura del PDF (fase 0) | Usuario, 11-nov-2026 |
| Si el PDF de una factura con **otro NIT adquiriente** usa otra clave | La apertura del PDF en otras organizaciones | DD-11 |
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
