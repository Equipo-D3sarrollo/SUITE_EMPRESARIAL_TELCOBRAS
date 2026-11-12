# Análisis de APIDIAN (FacturaLatam): referencia técnica para DataDian

> **Documento de referencia.** DataDian no usa ni despliega APIDIAN. Su edición Community sirve
> como referencia de comportamiento ([ADR-013](../../../decisions/ADR-013-datadian-y-nueva-ruta.md),
> enmienda; [ADR-014](../../../decisions/ADR-014-arquitectura-datadian-telco.md)). La arquitectura de
> DataDian y Telco está en [`../ARQUITECTURA_DATADIAN_TELCO.md`](../ARQUITECTURA_DATADIAN_TELCO.md).
>
> - **Las secciones 1 a 7 describen la edición completa** de APIDIAN, según su manual y su
>   colección Postman. **El código clonado es la edición Community del 14-ago-2026 y difiere** en
>   versión, seguridad y rutas (§12).
> - **La firma y el cliente SOAP no son MIT ni están en el clon.** Están en una librería
>   LGPL-3.0 (§12.1). No se copia ni se traduce código.

| Campo | Valor |
|---|---|
| Fecha | 10 de noviembre de 2026. Depurado el 12 de noviembre de 2026 para dejar solo el análisis técnico |
| Elaborado | Claude Code, a pedido del usuario |
| Módulo | `documents`, visible como **DataDian** (04) |
| Estado | Referencia técnica. No define el flujo de DataDian |
| Fuentes | Manual oficial completo (290 páginas), colección Postman pública (185 requests), transcripción del video del extractor y el código de la edición Community. Copias en `referencia/` y `repositorio-original/` |

**Resumen en cinco puntos**

1. APIDIAN es un **API de facturación electrónica en PHP (Laravel)**. Su foco es **emitir**
   documentos ante la DIAN.
2. Su listado de documentos recibidos es el **Extractor V2**, de la edición Enterprise. No está en
   el código público y DataDian no lo usa (§4).
3. **Consultar** el XML de un documento por su CUFE y sus eventos solo exige el certificado.
   **Enviar eventos RADIAN** exige además el ID y el PIN de un software de facturación habilitado
   ante la DIAN. Eso toca la decisión abierta D-14 (§5.1).
4. **APIDIAN no habla con Odoo** ni tiene aprobación humana.
5. **La edición Community es pública.** Sus controladores, plantillas y catálogos son MIT; la firma
   y el cliente SOAP están en una librería LGPL-3.0 que el clon no trae (§12.1). Su código muestra
   que la operación real para enviar eventos es `SendEventUpdateStatus` (§12.3).

---

## 1. Qué es APIDIAN

| Aspecto | Detalle | Fuente |
|---|---|---|
| Propósito | Emisión y gestión de documentos electrónicos de Colombia bajo UBL 2.1: facturas, notas crédito y débito, documentos equivalentes (POS, transporte, cine, servicios públicos), nómina electrónica y su ajuste, documento soporte y su nota de ajuste, contingencia, exportación, AIU, mandato, transporte de carga y sector salud con RIPS | Manual: inicio; Postman 02, 04 y 07 |
| Versión de la documentación | 2.1.0, generada desde la colección Postman «FacturaLatam ApiDianV2.1» | Manual: Referencia API |
| Lenguaje y framework | PHP 8.3 con Laravel. Desde el 21-oct-2026 la imagen Docker usa `php:8.3.36-fpm-bookworm` | Manual: Actualización |
| Base de datos | MySQL/MariaDB por defecto, o PostgreSQL desde agosto de 2026, elegido en el `.env` | Manual: Instalación; Novedades ago-2026 |
| Contenedores | `php_api` (API), `scheduling_api` (tareas programadas) y `nginx_api` (proxy) | Manual: Actualización |
| Tareas programadas | Consulta cada 10 minutos los documentos "en proceso" y envía avisos diarios de vencimientos | Novedades sep y oct-2026 |
| Almacenamiento | Disco local o S3 | Manual: Almacenamiento S3 |
| PDF | mPDF, con plantillas numeradas configurables por tipo de documento | Manual: Almacenamiento S3; Novedades jul-2026 |
| Interfaz | Panel web por empresa, portales de propietario, vendedor, cliente y empleado, asistente IA, monitoreo y copias de seguridad | Manual de la interfaz |
| Multiempresa | Una instalación sirve a varias empresas. El aislamiento es por credencial de empresa (§6) | Manual de la interfaz: Qué ve cada rol |
| Extras | Planes y consumo por empresa, envío por WhatsApp, API RIPS de salud, app móvil web, carga de Ficha RUT en PDF | Postman 09, 11, 12 y 13 |

### 1.1 Las 14 secciones del API y su relevancia para DataDian

| Sección | Qué hace | Relevancia |
|---|---|---|
| 01 Configuraciones básicas | Registrar empresa, certificado `.p12`, software, resoluciones, logo, SMTP, ambiente | **Media.** Muestra qué datos de la organización hacen falta: certificado, software y ambiente |
| 02 Primeros envíos | Emitir facturas, notas, nómina, documento soporte y equivalentes | No aplica: DataDian no emite documentos |
| 03 Consultas de estado | Estado por CUFE, por ZipKey y eventos de un documento | **Alta** para los eventos de un documento recibido |
| 04 Casuísticas de envíos | Variantes de factura con impuestos, descuentos y cargos | No aplica |
| 05 Utilidades | Listados, descargas, consecutivos, rangos de numeración, clientes y productos | Baja. Razón social por NIT |
| 06 Paso a producción | Set de pruebas y cambio de ambiente | **Media.** Referencia del paso de habilitación a producción de un software propio (D-14) |
| 07 Otros tipos de facturas | Exportación, AIU, mandato, transporte y salud | No aplica |
| 08 Generador de eventos | Enviar eventos RADIAN y cargar un documento recibido por CUFE | **Alta** |
| 09 Planes | Planes y consumo de la instalación | No aplica |
| 10 Regenerar PDFs | PDF y AttachedDocument | Baja |
| 11 Servicios APP | Login, documentos y clientes para la app | No aplica |
| 12 API RIPS | Sector salud | No aplica |
| 13 WhatsApp | Configuración y envío | No aplica |
| 14 Extractor V2 | Descarga masiva de documentos de la DIAN | Ninguna: es Enterprise y DataDian no lo usa (§4) |

El índice de los 185 endpoints está en `referencia/indice-de-endpoints.md`.

---

## 2. Disponibilidad del código y licencia

| Hecho | Detalle |
|---|---|
| Edición Community | Pública en `https://github.com/facturalatam/apidian`. Clonada en `repositorio-original/apidian/` (commit `da4ed764`, 14-ago-2026) |
| Licencia | El archivo `LICENSE` es MIT (Copyright (c) 2026 Factura Latam), pero el `composer.json` declara `LGPL-3.0`. Las clases que firman y hablan con la DIAN (`ubl21dian\XAdES\SignEvent`, `ubl21dian\Templates\SOAP\GetXmlByDocumentKey`, `SendEvent`, `GetStatusEvents`) son del paquete `ubl21dian/torresoftware`, **LGPL-3.0**, que no está en el clon porque no trae `vendor/` (§12.1) |
| Fuera de la Community | Módulo Extractor de facturas de compras, nómina, documentos equivalentes, RIPS y salud, app móvil, roles avanzados y almacenamiento en la nube (edición Enterprise, de pago) |
| Dentro de la Community | Eventos RADIAN (`RadianEventController`, `SendEventController`), XML por CUFE (`XmlDocumentController`), estados (`StateController`) |
| Edición completa | Repositorio privado `https://git.buho.la/facturalatam/apidian/co-apidian2026.git` desde el 19-oct-2026. Pide inicio de sesión. Sus manuales internos (`docs/API_EXTRACTOR.md`, `docs/EXTRACTOR_INTEGRACION.md` y otros) tampoco son públicos |
| Documentación pública | Colección Postman: `documenter.getpostman.com/view/50442293/2sBYHUSfRJ`. Es la fuente más completa sin acceso al código |

---

## 3. Cómo obtiene APIDIAN los documentos de la DIAN

- **Edición Community:** solo por CUFE. `load-document-by-cufe` consulta un documento recibido
  con la operación `GetXmlByDocumentKey` del servicio web de la DIAN, autenticada con el
  certificado de la empresa (§5.2 y §12.3). No tiene forma de descubrir documentos que no conoce.
- **Edición completa:** el Extractor V2 (§4) primero lista los documentos del portal de la DIAN y
  después pide el XML de cada CUFE por el mismo servicio web.

La parte estable es el servicio web oficial. La parte frágil es todo lo que depende del formato
de pantalla del portal (§4.1).

---

## 4. Extractor V2 (edición Enterprise, fuera de alcance)

Servicio aparte del API, de la edición de pago. Desde agosto de 2026 los scripts de instalación con
Docker lo instalan junto con el API. Trabaja por etapas (`getting_cufes` → `enriching` → `done`):
lista los CUFE del portal en un rango de fechas, pide el XML de cada uno con `GetXmlByDocumentKey`
y devuelve un reporte. La transcripción del video de `referencia/` presenta su primera versión
(Python, Flask, PostgreSQL y Docker, con acceso por certificado).

**DataDian no lo usa ni lo replica.** La ingesta de DataDian es el RPA de Telco con certificado y
`GetXmlByDocumentKey` ([arquitectura](../ARQUITECTURA_DATADIAN_TELCO.md) §4.1).

### 4.1 Lecciones útiles para Telco

| Lección | Detalle | Dónde aplica |
|---|---|---|
| El portal cambia sin aviso | En septiembre de 2026 la DIAN cambió el formato de fechas a `YYYY-MM-DD` y las consultas devolvieron cero documentos **sin error** hasta que el extractor se corrigió | RPA de la subetapa 4.3: alertar cuando un rango devuelva cero documentos de forma inesperada |
| Ruta del XML en la respuesta | `Envelope → Body → GetXmlByDocumentKeyResponse → GetXmlByDocumentKeyResult → XmlBytesBase64` | Cliente SOAP, subetapa 4.2 |
| La factura va dentro del contenedor | Si el XML es un `AttachedDocument`, la factura real va embebida en un `cbc:Description` | Lectura del `AttachedDocument`, subetapa 4.3 |
| Vencimiento del certificado | La respuesta de la consulta por CUFE trae `certificate_days_left` | Aviso de vencimiento del `.pfx` |
| Solo el NIT adquirente | Solo se registran documentos cuyo adquirente es el NIT de la empresa. Es una protección, no un fallo | Validación de la ingesta, subetapa 4.3 |
| El ambiente manda | Un CUFE de producción no se encuentra si la empresa está en habilitación, y al revés | Configuración DIAN por organización |
| Trabajo por etapas con avance | `status`, `stage`, `total` (CUFE encontrados) y `processed` (CUFE consultados) | Cola de trabajos de Telco, subetapas 2.7 y 4.1 |

Su salida normaliza el XML en emisor, receptor, totales, impuestos por tarifa e ítems. La lista de
campos está en `referencia/postman/14-extractor-v2.md`.

---

## 5. Documentos recibidos y eventos RADIAN

### 5.1 Qué exige cada operación

| Operación | Certificado `.p12` | ID y PIN del software de facturación |
|---|---|---|
| Cambiar el ambiente de los eventos | No | No |
| Consultar por CUFE y descargar XML o JSON | **Sí** | No (desde octubre de 2026) |
| **Enviar eventos** (acuse, recibo del bien o servicio, aceptación, reclamo) | **Sí** | **Sí.** Se firman con el `SoftwareID` y el `SoftwareSecurityCode` |

Sin software, el envío de eventos responde antes de llegar a la DIAN con: *Para enviar eventos
RADIAN la empresa necesita un software de facturación electrónica propio, habilitado ante la DIAN.*

### 5.2 Endpoints de APIDIAN

| Endpoint | Para qué | Cuerpo |
|---|---|---|
| `POST /api/load-document-by-cufe` | Consulta un documento recibido por CUFE. Con `save: true` lo guarda en su tabla `received_documents`. **No envía eventos** | `{ "cufe": "...", "save": true }`. El ejemplo oficial manda `saved`, que el API **ignora** |
| `POST /api/ubl2.1/send-event` | Envía un evento a partir del `AttachedDocument` del proveedor | `event_id`, `allow_cash_documents`, `sendmail`, `base64_attacheddocument_name`, `base64_attacheddocument`, `type_rejection_id`, `resend_consecutive` |
| `POST /api/ubl2.1/send-event-data` | Envía un evento indicando solo el CUFE | `event_id`, `document_reference.cufe`, `issuer_party` (`identification_number`, `first_name`, `last_name`, `organization_department`, `job_title`) |
| `POST /api/ubl2.1/status/events-document/{cufe}` | Eventos registrados de un documento | — |
| `POST /api/ubl2.1/status/document/{cufe}` | Validez de un documento (CUFE, CUDE o CUNE) | — |
| `GET /api/receivedfile/{nit}/{archivo}` | Descarga un archivo recibido (XML, PDF o ZIP) | Exige autenticación desde octubre de 2026, aunque la colección diga lo contrario |

- `POST /api/accept-reject-document` **ya no existe** en la edición completa. Los eventos van por
  `send-event`.
- El parámetro `allow_cash_documents` sugiere que los eventos sobre facturas de contado se tratan
  aparte (arquitectura §10, punto 8).
- Para el reclamo, el API usa los códigos de motivo `01` a `04`. Se corrigieron en septiembre de
  2026 porque la DIAN respondía `AAH10`.
- Los eventos llevan las responsabilidades tributarias en `cbc:TaxLevelCode`, varias separadas por
  `;` desde octubre de 2026.

**Catálogo de `event_id`.** La documentación no lo publica, pero el código Community sí, en
`public/csv/events.csv`:

| `event_id` | Evento | Código DIAN |
|---|---|---|
| 1 | Acuse de recibo de Factura Electrónica de Venta | 030 |
| 2 | Reclamo de la Factura Electrónica de Venta | 031 |
| 3 | Recibo del bien y/o prestación del servicio | 032 |
| 4 | Aceptación expresa | 033 |
| 5 | Aceptación tácita | 034 |
| 6 | Documento validado por la DIAN | 02 |
| 7 | Documento rechazado por la DIAN | 04 |

Los motivos de reclamo (`type_rejection_id`) están en la tabla `type_rejections`:

| `type_rejection_id` | Motivo | Código |
|---|---|---|
| 1 | Documento con inconsistencias | 01 |
| 2 | Mercancía no entregada totalmente | 02 |
| 3 | Mercancía entregada parcialmente | 03 |
| 4 | Servicio no prestado | 04 |

La aceptación tácita (034) la registra el emisor, no el receptor (Documento madre §4.4). DataDian
solo enviará 030, 031, 032 y 033 (ADR-011).

### 5.3 Estados de la DIAN que devuelve el API

| `dian_status` | Significado |
|---|---|
| `VALIDADA` | La DIAN lo aceptó |
| `RECHAZADA` | Tiene veredicto negativo. Los motivos vienen en la respuesta |
| `EN_PROCESO` | Código 98: la DIAN aún no decide. Una tarea lo consulta cada 10 min |
| `NO_ENCONTRADO` | La DIAN no tiene el documento |

Cuando el envío se corta sin respuesta, el API devuelve **`502`** con `success: false` y el CUFE.
La regla 90 de la DIAN, *Documento procesado anteriormente*, indica que ese documento ya existe.

---

## 6. Autenticación y seguridad de APIDIAN

Credenciales de su propio API (no de la DIAN):

| Credencial | Uso | Detalle |
|---|---|---|
| `api_token` de empresa | Todo lo que opera sobre una empresa | Se entrega al registrar la empresa y va en `Authorization: Bearer`. Se puede rotar |
| `X-Admin-Token` | Crear, consultar y eliminar empresas, planes, administradores y SMTP general | Es `PLATFORM_ADMIN_TOKEN` del `.env`. Obligatorio desde el 27-oct-2026 |

Con la credencial de otra empresa, el API responde `403` *No tienes acceso a esta empresa.*

**Medidas de octubre de 2026 que sirven de lección para la suite:**

- el registro enmascara el certificado, las contraseñas y el PIN;
- el listado de certificados ya no devuelve la contraseña;
- las descargas del panel usan enlaces firmados que caducan a las 2 horas.

**Antecedente:** hasta octubre de 2026 varias rutas respondían sin autenticación. Bastaba conocer
el NIT y el nombre del archivo para descargar documentos de una empresa. El clon todavía tiene ese
problema (§12.2).

---

## 7. Instalación y operación

No aplica: DataDian no despliega APIDIAN. El detalle está en
`referencia/manual/01-inicio-instalacion-y-guias.md`.

Un dato útil: desde octubre de 2026 su tabla `received_documents` guarda los montos en
`decimal(18,2)`, porque fallaba con totales mayores a 99.999.999,99. La suite usa `numeric(18,2)`.

---

## 8. Qué toma DataDian de APIDIAN

| Pieza de APIDIAN | Qué toma DataDian | Dónde |
|---|---|---|
| Consulta por CUFE (`XmlDocumentController`, `RadianEventController`) | El comportamiento de `GetXmlByDocumentKey` y la lectura del `AttachedDocument` | Telco, subetapas 4.2 y 4.3 |
| Estado de eventos (`StateController`) | El comportamiento de `GetStatusEvent` | Telco, subetapas 4.2 y 4.5 |
| Envío de eventos (`SendEventController`, plantilla `88.blade.php`) | Estructura del `ApplicationResponse`, empaquetado en ZIP, operación `SendEventUpdateStatus` y manejo de la regla 90 | Telco, subetapa 4.4 |
| Catálogos (`events.csv`, `type_rejections`) | Códigos 030 a 034 y conceptos `01` a `04` del reclamo | Etapas 2 y 3 |
| Firma XAdES y cliente SOAP (`ubl21dian`, LGPL-3.0) | Nada. Se escriben desde el anexo técnico y el WSDL de la DIAN | Telco, subetapas 4.1 y 4.2 |
| Extractor V2 (Enterprise) | Nada. La ingesta es el RPA de Telco | Subetapa 4.3 |
| Aprobación humana y Odoo | APIDIAN no los tiene | Etapas 3 y 5 |

---

## 9. Riesgos de usar APIDIAN como referencia

| # | Riesgo | Qué hacer |
|---|---|---|
| R2 | El envío de eventos exige un software habilitado por organización | Resolver D-14 antes de prometer el envío en producción. Consultar y descargar no lo necesitan |
| R4 | Lo que depende del portal se rompe en silencio cuando la DIAN cambia la pantalla | Alertar cuando un rango devuelva cero documentos de forma inesperada (§4.1) |
| R5 | Términos de uso del portal de la DIAN | Revisión legal del acceso automatizado (arquitectura §10, punto 7) |
| R6 | Catálogo de `event_id` no publicado en el manual | Resuelto: está en `public/csv/events.csv` del código Community (§5.2) |
| R10 | Datos de terceros en la documentación | Los ejemplos traen razones sociales y nombres reales. No se usan como datos de prueba |
| R11 | La firma y el cliente SOAP son de una librería LGPL-3.0 que no está en el clon | Traducirla sería obra derivada. La firma se escribe desde el anexo técnico y el WSDL (§12.1) |
| R12 | El clon es anterior a las correcciones de seguridad de octubre de 2026 | No desplegarlo; solo leerlo (§12.2) |

---

## 10. Pendiente de leer

- `SignInvoice.php` de la librería `ubl21dian`, donde están el cálculo del CUDE y la política
  XAdES. No se revisó. Leerlo como referencia de comportamiento (sin copiarlo) ayuda con los puntos
  2 y 3 de la §10 de la arquitectura.
- La estructura completa de la respuesta de `GetStatusEvent`.

---

## 11. Qué contiene `referencia/`

| Archivo | Contenido |
|---|---|
| `manual/01-inicio-instalacion-y-guias.md` | Inicio, instalación, actualización, guías, novedades 2026, avisos de seguridad, rendimiento, S3, responsabilidades tributarias, errores frecuentes y colección Postman (12 páginas) |
| `manual/02-manual-de-la-interfaz.md` | Manual completo del panel, incluido el extractor de compras y el paso a producción (11 páginas) |
| `manual/03-referencia-api.md` | Referencia de todos los endpoints (133 páginas) |
| `manual/04-variantes-de-ejemplo.md` | Variantes de ejemplo de las secciones 2 a 45 (133 páginas) |
| `postman/01-…` a `postman/14-…` | Los 185 requests con descripción, headers, cuerpo, scripts y respuestas de ejemplo |
| `indice-de-endpoints.md` | Tabla de los 185 endpoints por sección |
| `video-extractor-dian-python-flask.md` | Transcripción del video de la primera versión del extractor |

**Tratamiento aplicado:**

- Se censuraron credenciales, valores cifrados, contraseñas, PIN, claves técnicas y los CUFE de
  ejemplo que gitleaks detecta como secretos.
- Se recortaron los base64 de más de 400 caracteres.
- Los enlaces e imágenes del manual quedaron absolutos.
- Gitleaks, con la configuración del proyecto, no encuentra hallazgos en la carpeta.

---

## 12. Auditoría del código clonado (11-nov-2026)

Se leyó el clon `repositorio-original/apidian/` (commit `da4ed76`, 14-ago-2026) y los archivos
públicos de la librería `ubl21dian/torresoftware`.

### 12.1 Dónde está cada cosa y con qué licencia

| Pieza | Dónde está | Licencia |
|---|---|---|
| Controladores, modelos, plantillas XML y catálogos CSV | En el clon | `LICENSE` MIT (su `composer.json` dice LGPL-3.0) |
| Cliente SOAP con WS-Security, firma XAdES, cálculo del CUDE | Paquete `ubl21dian/torresoftware`, fuente `gitlab.com/torresoftware/ubl21dian`. **No está en el clon** | **LGPL-3.0** según Packagist y su `composer.json`. El repositorio no tiene archivo de licencia |
| Extractor de facturas de compras | En ninguna parte del código público | Enterprise |

**Consecuencia:** APIDIAN es referencia de comportamiento. La firma se escribe a partir del anexo
técnico y del WSDL públicos de la DIAN. Esto no es asesoría legal; si se quisiera traducir la
librería, hay que revisarlo con un abogado.

### 12.2 Diferencias entre el clon y lo que describen las secciones 1 a 7

| Tema | Edición completa (manual, oct-2026) | Clon Community (ago-2026) |
|---|---|---|
| Versión | PHP 8.3 | PHP ^8.1, Laravel 10 |
| Descargas por NIT (`receivedfile`, `invoice`, `download`, `view`, `information`) | Exigen autenticación | **Sin autenticación.** `ALLOW_PUBLIC_DOWNLOAD=true` por defecto |
| Rutas de planes y administradores | Exigen `X-Admin-Token` | Sin autenticación |
| `POST /api/accept-reject-document` | Ya no existe | Existe y es pública |
| Credencial `api_token` | — | Se guarda sin hash (`'hash' => false`) |
| Certificado | Contraseña enmascarada en respuestas y registros | Contraseña en texto plano en la base de datos; `.p12` en disco local |
| TLS contra la DIAN | — | Verificación desactivada, en la librería y en `verificarEstadoDIAN` |
| Consultar por CUFE sin software registrado | Permitido desde octubre de 2026 | Exige que exista el registro `software`, aunque solo usa su URL |
| Pruebas automáticas | — | Ninguna |

Además, el parámetro `GuardarEn` deja que quien llama elija la ruta del servidor donde se escriben
archivos. **El clon no se despliega.**

### 12.3 Cómo habla con la DIAN

| Operación | Detalle técnico |
|---|---|
| Canal | SOAP 1.2 contra `https://vpfe.dian.gov.co/WcfDianCustomerServices.svc` (producción) o `vpfe-hab` (habilitación) |
| Seguridad | WS-Addressing (`Action`, `To`) y WS-Security: `Timestamp`, `BinarySecurityToken` X509v3 y firma RSA-SHA256 sobre `wsa:To`, con canonicalización exclusiva y digest SHA-256 |
| XML por CUFE | Operación `GetXmlByDocumentKey` con `trackId` = CUFE. La respuesta trae `Code` (`100` es éxito) y `XmlBytesBase64`. **No entrega PDF** |
| Eventos de un documento | Operación `GetStatusEvent`: el código lee `GetStatusEventResponse → GetStatusEventResult` con `IsValid`, `XmlDocumentKey` y `XmlBase64Bytes` (`app/Http/Controllers/Api/StateController.php:888`). La clase de la librería se llama `GetStatusEvents` |
| Enviar un evento | `ApplicationResponse` UBL 2.1, firmado con XAdES, con CUDE-SHA384 calculado con el PIN del software, comprimido en ZIP y enviado en Base64 por la operación **`SendEventUpdateStatus`**. El código lee `SendEventUpdateStatusResponse → SendEventUpdateStatusResult` con `IsValid`, `StatusMessage` y `ErrorMessage` (`app/Http/Controllers/AcceptRejectDocumentController.php:169` y `app/Http/Controllers/Api/SendEventController.php`). La clase de la librería se llama `SendEvent`, que no es el nombre de la operación |
| Estructura del evento | La plantilla `resources/templates/xml/88.blade.php` pone `cbc:CustomizationID` = 1, el código del evento en `cac:DocumentResponse/cac:Response/cbc:ResponseCode` y, en el reclamo, el concepto en el atributo `listID` de ese nodo. La referencia a la factura va en `cac:DocumentReference` (`cbc:ID`, `cbc:UUID` y `cbc:DocumentTypeCode`) |
| Solo necesita certificado | `GetXmlByDocumentKey` y `GetStatusEvent` |
| Necesita además ID y PIN de software | Enviar eventos |

Lo que este código muestra es comportamiento de referencia: el nombre de cada operación y la
estructura del evento se confirman contra el WSDL y el anexo técnico (arquitectura §10, puntos 1
y 3).

### 12.4 Errores del código que no se deben heredar

En `SendEventController::sendeventdata` y `RadianEventController`:

- la validación de que el XML es una factura nunca se cumple;
- hay un `case` duplicado y una variable sin definir;
- al `switch` de planes le faltan los `break`;
- el reenvío usa un dígito al azar como consecutivo;
- el impuesto total se calcula como `TaxInclusiveAmount − LineExtensionAmount`;
- los duplicados se detectan por NIT, prefijo y número, no por CUFE;
- el aislamiento entre empresas es solo una columna con el NIT;
- la consulta de eventos por CUFE en el portal lee posiciones fijas de una tabla HTML.
