# Análisis de APIDIAN (FacturaLatam) para DataDian (módulo 04)

> **Decisiones tomadas después de este análisis (10-nov-2026, [ADR-013](../../../decisions/ADR-013-datadian-y-nueva-ruta.md)):**
> - La herramienta se llama **DataDian** y ocupa el lugar del Centro Documental, que desaparece.
> - Se construye un **listado de recibidos propio**; no se licencia la edición Enterprise.
> - DataDian se construye en TypeScript dentro del monolito, con APIDIAN Community como referencia de comportamiento. Eso equivale a la opción B de §8.2, no a la A que recomendaba este análisis.
> - DataDian es la **etapa 2**. Donde este texto dice "etapa 4", hoy es la etapa 2.
> - Especificación: `docs/etapas/ETAPA_2_DATADIAN.md`.
>
> **Correcciones del 11-nov-2026, tras auditar el código clonado y consultar a la DIAN y a Odoo:**
> - **Las secciones 1 a 7 describen la edición completa** de APIDIAN, según su manual y su colección Postman. **El código clonado es la edición Community del 14-ago-2026 y difiere** en versión, seguridad y rutas. Las diferencias están en §12.
> - **La firma y el cliente SOAP no son MIT ni están en el clon.** Están en una librería LGPL-3.0 (§12.1). No se copia ni se traduce código.
> - El flujo que definió el usuario y lo que se verificó en las fuentes oficiales están en §13.

| Campo | Valor |
|---|---|
| Fecha | 10 de noviembre de 2026 |
| Elaborado | Claude Code, a pedido del usuario |
| Módulo destino | `documents`, visible como **DataDian** (04). Submódulos por definir en `docs/etapas/ETAPA_2_DATADIAN.md`; sale `document-center` |
| Estado | Análisis. No hay código del módulo todavía |
| Fuentes | Manual oficial completo (290 páginas), colección Postman pública (185 requests) y la transcripción del video del extractor. Copias en `referencia/` |

**Encargo del usuario.** Analizar APIDIAN, incorporar dentro de la suite su herramienta que
descarga de la DIAN los documentos electrónicos, y adaptarla a nuestro flujo. Ese flujo es:
documentos descargados → panel → aprobación humana → borrador en Odoo.

**Resumen en cinco puntos**

1. APIDIAN es un **API de facturación electrónica en PHP (Laravel)**. Su foco es **emitir**
   documentos ante la DIAN. La descarga de documentos recibidos es un complemento, el **Extractor
   V2**, que se despliega como servicio aparte.
2. El extractor **combina dos técnicas**. Lista los documentos del catálogo de la DIAN con un
   **enlace de acceso por token** que emite el portal de la DIAN. Después baja el XML de cada CUFE
   por el **web service oficial** de la DIAN, firmado con el certificado `.p12` de la empresa.
3. **Descargar** documentos recibidos solo exige el certificado. **Enviar eventos RADIAN** exige
   además el ID y el PIN de un software de facturación propio, habilitado ante la DIAN. Eso toca
   directamente la decisión abierta D-14.
4. **APIDIAN no habla con Odoo.** La aprobación humana y el borrador en Odoo son nuestros. Así lo
   fija ADR-011: Odoo 19/20, API JSON-2, sin XML-RPC.
5. **Hay una edición pública con licencia MIT**, la Community, en
   `github.com/facturalatam/apidian`. Ya está clonada en `repositorio-original/apidian/`. **No
   incluye el Extractor de facturas de compras**, que es de la edición Enterprise. Sí incluye los
   eventos RADIAN y la consulta de XML por CUFE (§2). **Corrección:** la licencia MIT cubre los
   controladores y las plantillas; la firma y el cliente SOAP están en una librería LGPL-3.0 que
   el clon no trae (§12.1).

---

## 1. Qué es APIDIAN

| Aspecto | Detalle | Fuente |
|---|---|---|
| Propósito | Emisión y gestión de documentos electrónicos de Colombia bajo UBL 2.1: facturas, notas crédito y débito, documentos equivalentes (POS, transporte, cine, servicios públicos), nómina electrónica y su ajuste, documento soporte y su nota de ajuste, contingencia, exportación, AIU, mandato, transporte de carga y sector salud con RIPS | Manual: inicio; Postman 02, 04 y 07 |
| Versión de la documentación | 2.1.0, generada desde la colección Postman «FacturaLatam ApiDianV2.1» | Manual: Referencia API |
| Lenguaje y framework | PHP 8.3 con Laravel. Desde el 21-oct-2026 la imagen Docker usa `php:8.3.36-fpm-bookworm` | Manual: Actualización |
| Base de datos | MySQL/MariaDB por defecto, o PostgreSQL desde agosto de 2026, elegido en el `.env` | Manual: Instalación; Novedades ago-2026 |
| Contenedores | `php_api` (API), `scheduling_api` (tareas programadas) y `nginx_api` (proxy). Los nombres pueden llevar el dominio como sufijo | Manual: Actualización |
| Tareas programadas | Necesita el cron de `schedule:run`: consulta cada 10 minutos los documentos "en proceso" y envía avisos diarios de vencimientos | Novedades sep y oct-2026 |
| Almacenamiento | Disco local o S3 (`FILESYSTEM_DRIVER=s3`, `AWS_*`, `AWS_ENDPOINT`, path style configurable) | Manual: Almacenamiento S3 |
| PDF | mPDF, con plantillas numeradas configurables por tipo de documento | Manual: Almacenamiento S3; Novedades jul-2026 |
| Interfaz | Panel web por empresa, portales de propietario, vendedor, cliente y empleado, asistente IA que responde con el manual, monitoreo del servidor y copias de seguridad | Manual de la interfaz |
| Multiempresa | Una instalación sirve a varias empresas. Cada empresa tiene su `api_token`. El administrador de la plataforma ve todas; el usuario de una empresa solo la suya | Manual de la interfaz: Qué ve cada rol |
| Extras | Planes y consumo por empresa, envío por WhatsApp, API RIPS de salud, app móvil web, carga de Ficha RUT en PDF | Postman 09, 11, 12 y 13 |

### 1.1 Las 14 secciones del API y su relevancia para nosotros

| Sección | Qué hace | Relevancia para el módulo 04 |
|---|---|---|
| 01 Configuraciones básicas | Registrar empresa, certificado `.p12`, software, resoluciones, logo, SMTP, ambiente | **Media.** Solo registrar la empresa, su certificado y el ambiente de eventos |
| 02 Primeros envíos | Emitir facturas, notas, nómina, documento soporte y equivalentes | No aplica: DataDian no emite documentos |
| 03 Consultas de estado | Estado por CUFE, por ZipKey y eventos de un documento | **Alta** para los eventos de un documento recibido |
| 04 Casuísticas de envíos | Variantes de factura con impuestos, descuentos y cargos | No aplica |
| 05 Utilidades | Listados, descargas, consecutivos, rangos de numeración, clientes y productos | **Media.** Descarga de archivos recibidos y razón social por NIT |
| 06 Paso a producción | Set de pruebas y cambio de ambiente | **Baja.** Solo si una organización envía eventos con su propio software |
| 07 Otros tipos de facturas | Exportación, AIU, mandato, transporte y salud | No aplica |
| 08 Generador de eventos | Enviar eventos RADIAN y cargar un documento recibido por CUFE | **Alta** |
| 09 Planes | Planes y consumo de la instalación | No aplica: tenemos nuestro propio modelo de planes |
| 10 Regenerar PDFs | PDF y AttachedDocument | Baja |
| 11 Servicios APP | Login, documentos y clientes para la app | Baja |
| 12 API RIPS | Sector salud | No aplica |
| 13 WhatsApp | Configuración y envío | No aplica: lo cubre nuestro Integration Hub |
| 14 Extractor V2 | Descarga masiva de documentos de la DIAN | **Alta. Es el núcleo del encargo** |

El índice de los 185 endpoints está en `referencia/indice-de-endpoints.md`.

---

## 2. Disponibilidad del código y licencia

> **Actualización del 10-nov-2026.** El usuario indicó el repositorio público
> `https://github.com/facturalatam/apidian`, ya clonado en `repositorio-original/apidian/` (commit
> `da4ed764`, 14-ago-2026). Es la **edición Community con licencia MIT** (Copyright (c) 2026
> Factura Latam): se puede usar, modificar y redistribuir conservando el aviso de licencia.
>
> Su README declara **fuera de la Community**, solo en la edición Enterprise de pago: el
> **Módulo Extractor de facturas de compras**, nómina, documentos equivalentes, RIPS y salud, la
> app móvil, roles avanzados y almacenamiento en la nube. **Sí incluye** los eventos RADIAN
> (`RadianEventController`, `SendEventController`), la consulta del XML por CUFE
> (`XmlDocumentController`, web service `GetXmlByDocumentKey`) y los estados (`StateController`).
>
> **Consecuencia para el encargo:** el paso de **listar** los documentos recibidos en la DIAN no
> se puede copiar de este código. Hay que construirlo nosotros o licenciar la Enterprise. Todo lo
> demás del flujo (XML por CUFE, almacenamiento de recibidos y eventos) tiene en este código una
> referencia de comportamiento. La tabla de abajo describe el repositorio privado de la edición
> completa.
>
> **Corrección del 11-nov-2026.** El archivo `LICENSE` es MIT, pero el `composer.json` del mismo
> repositorio declara `LGPL-3.0`. Y las clases que firman y hablan con la DIAN
> (`ubl21dian\XAdES\SignEvent`, `ubl21dian\Templates\SOAP\GetXmlByDocumentKey`, `SendEvent`,
> `GetStatusEvents`) pertenecen al paquete `ubl21dian/torresoftware`, **LGPL-3.0**, que no está en
> el clon porque no trae `vendor/`. Ver §12.1.

| Hecho comprobado el 10-nov-2026 | Consecuencia |
|---|---|
| Desde el 19-oct-2026 el repositorio es `https://git.buho.la/facturalatam/apidian/co-apidian2026.git` | Es la dirección que habría que clonar |
| Esa ruta y sus archivos `docs/*.md` responden con la pantalla de inicio de sesión de GitLab | **El repositorio no es público.** No se pudo leer el código ni los manuales internos del extractor |
| El manual y la colección Postman no mencionan ninguna licencia, ni de código abierto ni comercial | No hay base para afirmar que sea código abierto. Hay que confirmarlo con FacturaLatam |
| Un snippet público de instalación con Docker sí responde (`git.buho.la/-/snippets/31`) | Solo describe la instalación |
| La colección Postman es pública: `documenter.getpostman.com/view/50442293/2sBYHUSfRJ` | Es la fuente más completa disponible sin acceso al código |

**Documentos que quedaron fuera por estar en el repositorio privado:**

- `docs/API_EXTRACTOR.md`: rutas, autenticación y la sección "Estructura de los documentos" del
  extractor. El manual público la cita, pero no la publica.
- `docs/EXTRACTOR_INTEGRACION.md`: cómo conectar el worker del extractor a una instalación del API.
- `docs/MANUAL_POSTGRESQL.md` y `docs/MANUAL_POSTGRESQL_DOCKER.md`.
- `docs/Errores frecuentes APIDIAN.md` y `docs/Proceso de actualizacion APIDIAN.md`.
- Los comandos de instalación 2025 y 2026 para Windows y Ubuntu, y la configuración de Fichas RUT.

**Antes de incorporar código** hace falta:

1. una cuenta con acceso de lectura a `co-apidian2026`, y al repositorio del extractor si es otro;
2. la licencia por escrito. Si fuera comercial o restrictiva, copiar su código dentro de un SaaS
   multiempresa de terceros podría no estar permitido.

---

## 3. Cómo obtiene los documentos de la DIAN

```
                ┌──────────────────────── Extractor V2 (servicio aparte) ────────────────────────┐
 Portal DIAN    │ 1. getting_cufes: entra al catálogo con el "enlace de acceso por token"       │
 (catálogo de   │    y recorre las páginas de "Recibidos" o "Enviados" en el rango de fechas    │
 documentos) ───┼──▶ lista de CUFE                                                               │
                │ 2. enriching: por cada CUFE pide el XML al web service de la DIAN             │
 Web service    │    (GetXmlByDocumentKey), firmado con el certificado .p12 de la empresa       │
 DIAN (SOAP) ◀──┼──▶ XML UBL → JSON normalizado (emisor, totales, impuestos, ítems)              │
                │ 3. done: reporte JSON y Excel; el panel deja "registrar en Eventos RADIAN"     │
                └─────────────────────────────────────────────────────────────────────────────────┘
```

- **Paso 1, listado.** Depende del portal de la DIAN y de su formato de pantalla. Se probó frágil:
  en septiembre de 2026 la DIAN cambió el formato de fechas a `YYYY-MM-DD` y las consultas
  devolvían cero documentos **sin error** hasta que el extractor se corrigió.
- **Paso 2, enriquecimiento.** Usa un servicio oficial de la DIAN. Es más estable. Hace una
  consulta por documento, así que el tiempo crece con el rango de fechas.
- **El enlace por token.** El usuario lo pega en el panel o lo envía en el campo `url`. Es "el
  enlace de autenticación que emite el portal de la DIAN" y debe ser del mismo ambiente que la
  empresa. El manual no dice cuánto dura ni cómo se pide. Por lo que se sabe del portal, lo
  solicita una persona autorizada de la empresa y llega por correo; **esto no está verificado**.
  Si es así, cada barrido necesita a una persona que pida un enlace nuevo, y la extracción semanal
  no se puede automatizar del todo.
- **Modo por certificado `.p12`.** Subir el certificado y su contraseña para consultar sin enlace.
  El manual dice que **existe pero está oculto porque sigue en pruebas**. Es el modo del video de
  la primera versión.
- **Relación con el video.** La transcripción presenta la primera versión: Python, Flask,
  PostgreSQL y Docker, con acceso por certificado y scraping. Los registros de ejemplo de Postman
  muestran rutas de una carpeta `facturalatam-scraperv2`. Lo más probable es que el Extractor V2
  sea la evolución de ese script. Su lenguaje actual no está documentado.

---

## 4. Extractor V2 en detalle

### 4.1 Despliegue

- Es **independiente del proyecto APIDIAN**. El panel y el API hablan con él como servicio.
- Desde agosto de 2026, los scripts de instalación con Docker lo instalan junto con el API.
- El panel tiene un botón **Probar conexión**. Si falla o aparece *Extractor no configurado*, el
  problema es del proveedor del servicio, no del certificado ni de las credenciales.

### 4.2 Endpoints

Todos usan `Authorization: Bearer <api_token de la empresa>`. El extractor usa el certificado que
la empresa ya tiene cargado; no se envía en cada llamada.

| Modo | Método y ruta | Uso |
|---|---|---|
| 1 Extracción completa | `POST /api/extractor/company/stream` | Una sola llamada. Devuelve todo al final; **no** es un stream en vivo. Espera interna máxima de unos 10 min |
| 2 Iniciar en segundo plano | `POST /api/extractor/company` | Devuelve `202` con `jobId` y `statusUrl` |
| 3 Avance y resultado | `GET /api/extractor/company/jobs/{jobId}` | Polling hasta `done` o `error` |
| 4 XML por CUFE | `POST /api/ubl2.1/xml/document/{cufe}` | XML en base64 de un documento |

**Cuerpo de los modos 1 y 2:**

```json
{
  "url": "<enlace de acceso por token de la DIAN>",
  "tipo": "Received",
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-01-31"
}
```

- `tipo` admite `Received` (documentos recibidos, las compras) y `Sent` (enviados).
- Las fechas van en `YYYY-MM-DD`.

**Comportamientos que hay que respetar al integrarlo:**

| Comportamiento | Detalle |
|---|---|
| El job avanza solo con el polling | Cada consulta al modo 3 procesa **5 documentos**. Sin polling el job no progresa. La recomendación es consultar cada 3 a 5 segundos |
| Vida del job | 2 horas en caché. Después, `404` |
| Aislamiento | `404` si el job es de otra empresa |
| Error de cuerpo | Un cuerpo inválido devuelve **`502`, no `422`**, con *No se pudo iniciar la extracción: ...* |
| Rango vacío o tiempo agotado | `200` con `data: []` y el motivo en `log` |
| Estados | `status`: `running`, `done` o `error`. `stage`: `getting_cufes` → `enriching` → `done` o `error`. Con `error` viene `message` |
| Contadores | `total` (CUFE encontrados) y `processed` (CUFE ya consultados) |

**Inconsistencia de la documentación:** la colección Postman pone el modo 2 en
`POST /api/certificate`, pero su propia descripción dice `POST /api/extractor/company`. Las
novedades de octubre de 2026 confirman la segunda. Usar `/api/extractor/company` y comprobarlo.

**Endpoint no documentado:** las novedades de octubre de 2026 nombran
`POST /api/cufes/enrich`, que enriquece CUFE sin pasar por el catálogo. No aparece ni en la
colección ni en el manual.

### 4.3 Estructura de cada documento extraído

Tomada de la respuesta de ejemplo del modo 1. La especificación completa está en el
`API_EXTRACTOR.md` privado. Los nombres de campo llevan espacios y tildes, tal como los devuelve.

| Campo | Ejemplo | Nota |
|---|---|---|
| `TipoDocumento` | `Invoice` | Tipo UBL |
| `TipoBusqueda` | `Sent` o `Received` | Bandeja de origen |
| `Numero de Factura` | `FEBC24` | Prefijo y consecutivo |
| `CUFE` | 96 caracteres hexadecimales | Clave única |
| `Fecha de Creación`, `Fecha de Vencimiento` | `2025-08-05` | |
| `Moneda` | `COP` | |
| `NIT del Emisor`, `Razon Social del Emisor` | | Proveedor, en recibidos |
| `NIT del Receptor`, `Razon Social del Receptor` | | Nuestra organización, en recibidos |
| `Metodo de Pago` | `10`, `31` | Código DIAN del medio de pago |
| `Sub Total`, `Impuestos Cabecera`, `Retenciones`, `Total a Pagar` | números | |
| `TaxBreakdown[]` | `code`, `name`, `percent`, `taxable_amount`, `amount` | Impuestos por tarifa |
| `LineItems[]` | `Nombre del Producto`, `Referencia`, `Unidad de Medida`, `Cantidad`, `Precio Unitario`, `Total`, `taxes[]`, `total_tax_line` | Detalle de ítems |

La vista previa del panel muestra además el folio, el estado RADIAN y el resultado de la
extracción de cada fila. El reporte se descarga en Excel y en JSON.

### 4.4 Modo 4: el XML de un documento

- Cuerpo `{ "is_event": true }` para consultar por el endpoint de eventos, el de documentos
  recibidos.
- El XML viene en
  `ResponseDian → Envelope → Body → GetXmlByDocumentKeyResponse → GetXmlByDocumentKeyResult → XmlBytesBase64`.
- Si el XML es un `AttachedDocument`, la factura real va embebida dentro de un `cbc:Description`.
- La respuesta trae `certificate_days_left`, útil para avisar vencimientos del certificado.
- Si la DIAN rechaza la consulta: `success: false` y el detalle en `ResponseDian`.

### 4.5 Reglas del panel que conviene copiar

- **Solo se registran documentos cuyo adquiriente es el NIT de la empresa.** Las filas de otro
  NIT quedan fuera. Es una protección, no un fallo.
- **El ambiente manda.** Un CUFE de producción no se encuentra si la empresa tiene los eventos en
  habilitación, y un enlace de un ambiente no sirve en el otro.
- **Registrar válidos** carga de una vez todas las filas que admiten registro.

---

## 5. Documentos recibidos y eventos RADIAN

### 5.1 Qué exige cada operación

| Operación | Certificado `.p12` | ID y PIN del software de facturación |
|---|---|---|
| Cambiar el ambiente de los eventos | No | No |
| Extraer, consultar por CUFE y descargar XML o JSON | **Sí** | No (desde octubre de 2026) |
| **Enviar eventos** (acuse, recibo del bien o servicio, aceptación, rechazo) | **Sí** | **Sí.** Se firman con el `SoftwareID` y el `SoftwareSecurityCode` |

Sin software, el envío de eventos responde antes de llegar a la DIAN con: *Para enviar eventos
RADIAN la empresa necesita un software de facturación electrónica propio, habilitado ante la DIAN.*

### 5.2 Endpoints

| Endpoint | Para qué | Cuerpo |
|---|---|---|
| `POST /api/load-document-by-cufe` | Consulta un documento recibido por CUFE. Con `save: true` lo guarda en la tabla `received_documents` (listado de Eventos RADIAN). **No envía eventos** | `{ "cufe": "...", "save": true }`. El ejemplo oficial manda `saved`, que el API **ignora** |
| `POST /api/ubl2.1/send-event` | Envía un evento a partir del `AttachedDocument` del proveedor | `event_id`, `allow_cash_documents`, `sendmail`, `base64_attacheddocument_name`, `base64_attacheddocument`, `type_rejection_id`, `resend_consecutive` |
| `POST /api/ubl2.1/send-event-data` | Envía un evento indicando solo el CUFE | `event_id`, `document_reference.cufe`, `issuer_party` (`identification_number`, `first_name`, `last_name`, `organization_department`, `job_title`) |
| `POST /api/ubl2.1/status/events-document/{cufe}` | Eventos registrados de un documento | — |
| `POST /api/ubl2.1/status/document/{cufe}` | Validez de un documento (CUFE, CUDE o CUNE) | — |
| `GET /api/receivedfile/{nit}/{archivo}` | Descarga un archivo recibido (XML, PDF o ZIP) | Exige token desde octubre de 2026, aunque la colección diga lo contrario |

- `POST /api/accept-reject-document` **ya no existe**. Los eventos van por `send-event`.
- Para el reclamo, el API usa los códigos de motivo `01` a `04` del anexo técnico. Se corrigieron
  en septiembre de 2026 porque la DIAN respondía `AAH10`.
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

La aceptación tácita (034) la registra el emisor, no el receptor (Documento Madre §4.4). Nuestro
módulo solo enviará 030, 031, 032 y 033 (ADR-011).

### 5.3 Estados de la DIAN que devuelve el API

| `dian_status` | Significado |
|---|---|
| `VALIDADA` | La DIAN lo aceptó |
| `RECHAZADA` | Tiene veredicto negativo. Los motivos vienen en la respuesta |
| `EN_PROCESO` | Código 98: la DIAN aún no decide. El número queda reservado y una tarea lo consulta cada 10 min |
| `NO_ENCONTRADO` | La DIAN no tiene el documento |

Cuando el envío se corta sin respuesta, el API devuelve **`502`** con `success: false` y el CUFE.
La regla 90 de la DIAN, *Documento procesado anteriormente*, indica que ese número ya existe.

---

## 6. Autenticación y seguridad

| Credencial | Uso | Detalle |
|---|---|---|
| `api_token` de empresa | Todo lo que opera sobre una empresa | Se entrega al registrar la empresa. Va en `Authorization: Bearer` o en `?api_token=`. Se rota con `PUT /api/ubl2.1/config/rotate-token/{nit}` (con `X-Admin-Token`) o con `php artisan api:rotate-token {nit}` |
| `X-Admin-Token` | Crear, consultar y eliminar empresas, planes, administradores y SMTP general | Es `PLATFORM_ADMIN_TOKEN` del `.env`. Se crea con `php artisan api:admin-token`. Obligatorio desde el 27-oct-2026 |

**Respuestas de error de acceso:**

- sin token: `401` *No autenticado. Esta consulta requiere un api_token valido.*
- con el token de otra empresa: `403` *No tienes acceso a esta empresa.*

**Otras medidas de seguridad de octubre de 2026:**

- Las descargas del panel usan enlaces firmados que caducan a las 2 horas.
- El botón del correo para aceptar o rechazar usa un enlace firmado que caduca a los 30 días.
- El log enmascara el certificado, las contraseñas y el PIN.
- `certificates-listing` ya no devuelve la contraseña del certificado.
- Periodos de gracia temporales en el `.env`: `ALLOW_PUBLIC_API_REGISTER`, `ALLOW_PUBLIC_RESUME`,
  `ALLOW_PUBLIC_FILES` y `ALLOW_PUBLIC_DOWNLOAD`. En nuestra instalación deben quedar en `false`.
- PHP publicó dos vulnerabilidades críticas de ejecución remota el 21-oct-2026. Toda instalación
  debe reconstruir la imagen con `php:8.3.36-fpm-bookworm`.

**Antecedente a tener en cuenta:** hasta octubre de 2026 varias rutas respondían sin
autenticación. Bastaba conocer el NIT y el nombre del archivo para descargar documentos de una
empresa. Cualquier instalación debe estar en la versión corregida.

---

## 7. Instalación y operación

| Tema | Detalle |
|---|---|
| Opciones | Windows local, Ubuntu 20.04 LAMP manual o por script, Docker en Ubuntu 20.04, 22.04 y 24.04, y cPanel |
| Docker | `docker compose build --no-cache php_api scheduling_api`, `up -d`, `docker restart nginx_api` para evitar un `502` por cambio de IP interna, luego `composer install`, `php artisan migrate --seed` y `config:cache` dentro del contenedor |
| Actualizar | `git pull`, reconstruir si cambió el `Dockerfile` o `docker/`, y migrar cuando la versión lo pida |
| Rendimiento | Activar OPcache. Medir por etapas en `monitoring_slow_requests` con `MONITOR_SLOW_REQUEST_MS`, `MONITOR_TRACK_QUERIES` y `MONITOR_RETENTION_DAYS` |
| Correo | SMTP por `.env` (`MAIL_*`), por empresa con `PUT /api/ubl2.1/config/smtp` o general con `PUT /api/ubl2.1/config/smtp-global` |
| Registro público | `ENABLE_API_REGISTER=false` desactiva el alta de empresas por API |
| Montos | Desde octubre de 2026, `received_documents` guarda montos en `decimal(18,2)`. Antes fallaba con totales mayores a 99.999.999,99 |

---

## 8. Cómo encaja en OrveX.IA

### 8.1 Correspondencia de funciones

| Nuestro flujo (Documento Madre §4.4) | Lo que aporta APIDIAN | Lo que construimos nosotros |
|---|---|---|
| Obtención | Extractor V2 (modos 1 a 3) y XML por CUFE (modo 4) | Disparo programado o manual en BullMQ, por organización |
| Almacenamiento | Su tabla `received_documents` y su disco o S3 | XML y PDF en nuestro S3. Metadatos y hash en PostgreSQL con RLS (Document Manager) |
| Extracción y normalización | JSON con emisor, totales, impuestos e ítems | Mapeo a nuestro modelo. Validación determinística propia |
| Validación y reglas | Solo filtra por NIT del adquiriente | Validation Engine: campos, duplicados por CUFE, coherencia de totales |
| Revisión y aprobación humana | No existe | Submódulo `odoo-approvals` con permisos, auditoría y separación de funciones |
| Borrador en Odoo | No existe | Conector Odoo JSON-2 del Integration Hub (ADR-011) |
| Eventos RADIAN 030, 031, 032 y 033 | `send-event-data` y `status/events-document` | Tabla de eventos aparte del estado interno, y la decisión D-14 sobre quién firma |

### 8.2 Opciones de incorporación

| Opción | Cómo | A favor | En contra |
|---|---|---|---|
| **A. Servicio externo** | Desplegar APIDIAN y su extractor en contenedores propios. La suite lo consume desde un adaptador NestJS del Integration Hub. Cada organización se registra como "empresa" de APIDIAN y su `api_token` se guarda cifrado en el Credential Manager | Respeta el Documento Madre: integrar por contrato sin reescribir. Recibe las correcciones de FacturaLatam ante cambios de la DIAN | Suma PHP, MySQL o PostgreSQL y un worker a la operación. Duplica datos. Depende de la licencia y del acceso al repositorio |
| **B. Reimplementar lo necesario** | Escribir en TypeScript solo la consulta al web service de la DIAN (`GetXmlByDocumentKey`), el parser UBL y el envío de eventos, con APIDIAN como referencia funcional | Un solo stack y multiempresa nativa con RLS. Sin dependencia de licencia si no se copia código | Más trabajo. Hay que mantener la firma XAdES y seguir los cambios de la DIAN. El listado por catálogo sigue dependiendo del portal |
| **C. Mixta** | Empezar con A y reemplazar por B la parte que más pese | Entrega valor antes | Dos integraciones durante un tiempo |

**Recomendación preliminar (superada por ADR-013, que eligió la opción B):** la opción A para arrancar la etapa 4. El Documento Madre exige
inspeccionar antes de reescribir, y un servicio externo se reemplaza sin tocar el resto. La
decisión final depende de §2 y de D-14, y la toma el arquitecto.

### 8.3 Requisitos de multiempresa

- Una organización de OrveX.IA equivale a una "empresa" en APIDIAN, con su propio `api_token`.
- El `X-Admin-Token` lo usa solo un proceso interno del servidor. Nunca llega al navegador.
- El certificado `.p12` y su contraseña se cargan una vez, cifrados con nuestro cifrado envolvente
  (D-12). Vigilar `certificate_days_left` y avisar con 30 y 7 días de antelación.
- Ningún enlace de descarga de APIDIAN se muestra al usuario. Los archivos se copian a nuestro S3
  y se sirven con nuestras URL prefirmadas.

---

## 9. Riesgos y vacíos

| # | Riesgo o vacío | Impacto | Qué hacer |
|---|---|---|---|
| R1 | La edición pública no trae el extractor (es Enterprise) | El listado de documentos recibidos hay que construirlo o licenciarlo | Decidido: listado propio a partir del Excel que exporta el catálogo de la DIAN (§13). El resto del flujo se construye con el código como referencia, sin copiarlo |
| R11 | La firma y el cliente SOAP son de una librería LGPL-3.0 que no está en el clon | Traducirla a TypeScript sería obra derivada | Escribir la firma desde el anexo técnico y el WSDL de la DIAN (§12.1) |
| R12 | El clon es anterior a las correcciones de seguridad de octubre de 2026 | Desplegarlo expondría documentos y credenciales | No desplegarlo; solo leerlo (§12.2) |
| R13 | Desde el 28-jul-2026 el catálogo de la DIAN bloquea robots y pide validación humana | Un robot sobre el portal puede dejar de funcionar sin aviso | Ningún paso depende solo del robot: Excel importado, XML por web service y carga manual como respaldo (§13) |
| R14 | En Odoo Online la API externa exige el plan Custom | Sin ese plan no hay borrador por API | Confirmar el plan de Telcobras antes de construir el conector |
| R2 | El envío de eventos exige un software propio habilitado por organización | Choca con D-14, abierta: figura ante la DIAN | Decidir D-14 antes de prometer eventos. Descargar sí es posible sin software |
| R3 | El listado depende de un enlace por token que pide una persona | La extracción semanal no se automatiza del todo | Confirmar cómo se emite y cuánto dura. Evaluar el modo `.p12` cuando salga de pruebas |
| R4 | Scraping del portal | Un cambio de la DIAN rompe el listado en silencio, como en septiembre de 2026 | Alertar cuando un rango devuelva cero documentos de forma inesperada. Conciliar con el modo 4 |
| R5 | Términos de uso del portal de la DIAN | Uso automatizado no revisado legalmente | Revisión legal, en línea con D-14 y D-21 |
| R6 | Catálogo de `event_id` no publicado en el manual | Resuelto: está en `public/csv/events.csv` del código Community (§5.2) | Usar esa tabla |
| R7 | El job avanza con el polling, 5 documentos por llamada | Un worker que no consulte deja el job detenido | Polling cada 3 a 5 segundos desde un job de BullMQ, con tope de 2 horas |
| R8 | Errores no estándar (`502` por cuerpo inválido, `200` con `data: []`) | Errores mal clasificados | Normalizarlos en el adaptador |
| R9 | Stack PHP fuera del nuestro | Operación y parches de seguridad extra | Imagen fijada por digest, red interna y actualizaciones vigiladas |
| R10 | Datos de terceros en la documentación | Los ejemplos traen razones sociales y nombres reales | No usarlos como datos de prueba |

---

## 10. Preguntas abiertas para el arquitecto

1. El extractor solo está en la edición Enterprise. ¿Construimos nuestro propio listado de
   documentos recibidos, o se licencia la Enterprise de FacturaLatam?
2. ¿Qué opción de §8.2 prefiere: servicio externo, reimplementación o mixta?
3. Para D-14: ¿cada organización enviará los eventos con su propio software o lo hará Telcobras
   como proveedor tecnológico o mandatario? ¿O la etapa 4 arranca solo con descarga y aprobación?
4. ¿Quién de cada organización pedirá el enlace por token de la DIAN, y cada cuánto?
5. ¿Se incluyen los documentos **enviados** o solo los recibidos, como dice ADR-011?

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

- Se censuraron tokens, JWT, valores cifrados, contraseñas, PIN, claves técnicas y los CUFE de
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
| Extractor de facturas de compras (listado del catálogo, token) | En ninguna parte del código público | Enterprise |

**Consecuencia:** APIDIAN es referencia de comportamiento. La firma se escribe a partir del anexo
técnico y del WSDL públicos de la DIAN. Esto no es asesoría legal; si se quisiera traducir la
librería, hay que revisarlo con un abogado.

### 12.2 Diferencias entre el clon y lo que describen las secciones 1 a 7

| Tema | Edición completa (manual, oct-2026) | Clon Community (ago-2026) |
|---|---|---|
| Versión | PHP 8.3 | PHP ^8.1, Laravel 10 |
| Descargas por NIT (`receivedfile`, `invoice`, `download`, `view`, `information`) | Exigen token | **Sin autenticación.** `ALLOW_PUBLIC_DOWNLOAD=true` por defecto |
| Rutas de planes y administradores | Exigen `X-Admin-Token` | Sin autenticación |
| `POST /api/accept-reject-document` | Ya no existe | Existe y es pública |
| `api_token` | — | Se guarda sin hash (`'hash' => false`) |
| Certificado | Contraseña enmascarada en respuestas y registros | Contraseña en texto plano en la base de datos; `.p12` en disco local |
| TLS contra la DIAN | — | Verificación desactivada, en la librería y en `verificarEstadoDIAN` |
| Consultar por CUFE sin software registrado | Permitido desde octubre de 2026 | Exige que exista el registro `software`, aunque solo usa su URL |
| Pruebas automáticas | — | Ninguna |

Además, el parámetro `GuardarEn` deja que quien llama elija la ruta del servidor donde se escriben
archivos. **El clon no se despliega.**

### 12.3 Cómo habla con la DIAN (lo que hay que construir)

| Operación | Detalle técnico |
|---|---|
| Canal | SOAP 1.2 contra `https://vpfe.dian.gov.co/WcfDianCustomerServices.svc` (producción) o `vpfe-hab` (habilitación) |
| Seguridad | WS-Addressing (`Action`, `To`) y WS-Security: `Timestamp`, `BinarySecurityToken` X509v3 y firma RSA-SHA256 sobre `wsa:To`, con canonicalización exclusiva y digest SHA-256 |
| XML por CUFE | Operación `GetXmlByDocumentKey` con `trackId` = CUFE. La respuesta trae `Code` (`100` es éxito) y `XmlBytesBase64`. **No entrega PDF** |
| Eventos de un documento | Operación `GetStatusEvents` |
| Enviar un evento | `ApplicationResponse` UBL 2.1 (plantilla `resources/templates/xml/88.blade.php`), firmado con XAdES, con CUDE-SHA384 calculado con el PIN del software, comprimido en ZIP y enviado en base64 por `SendEventUpdateStatus` |
| Solo necesita certificado | `GetXmlByDocumentKey` y `GetStatusEvents` |
| Necesita además ID y PIN de software | Enviar eventos |

No se revisó `SignInvoice.php` de la librería, donde están el cálculo del CUDE y la política XAdES.
Hay que leerlo antes de diseñar el envío de eventos.

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

---

## 13. Flujo definido por el usuario y verificación oficial (11-nov-2026)

El plan completo está en `docs/etapas/ETAPA_2_DATADIAN.md`. Aquí queda lo que se verificó.

**Flujo:** listado de facturas recibidas exportado a Excel desde el catálogo de la DIAN, descarga
del PDF de cada factura por su CUFE, gestión en la suite con aprobación o rechazo y trazabilidad,
y borrador en Odoo 19 Online con el PDF adjunto.

| Hecho | Fuente |
|---|---|
| Al catálogo (`catalogo-vpfe.dian.gov.co`) se entra con un enlace con token que llega al correo del RUT; para una empresa, al del representante legal. Dura 60 minutos. Esto resuelve la duda de §3 y de R3 | Portal DIAN; guías de Dataico y Forvis Mazars |
| El catálogo ofrece documentos enviados y recibidos y la opción *Descargar listados* por rango de fechas | Portal DIAN |
| Desde el 28-jul-2026, *Buscar documento* pide el NIT del emisor o del receptor para consultar y otra vez para descargar | Comunicado DIAN del 23-jul-2026 |
| El catálogo bloquea robots, automatizaciones y agentes de IA y pide una comprobación humana | Comunicado DIAN del 23-jul-2026 |
| El anexo técnico vigente de factura electrónica es el 1.9 (Resolución 000165 de 2023). RADIAN se rige por la Resolución 000085 de 2022 | DIAN |
| Odoo 19: API JSON-2 en `/json/2/<modelo>/<método>` con API key como `Bearer`. En Odoo Online solo en el plan Custom | Documentación oficial de Odoo 19 |
| Otros proveedores resuelven el token con una persona: Dataico pide reenviar el correo del token y limita cada consulta a 7 días | Dataico |

**No verificado:** las columnas del Excel de la DIAN, si la descarga del portal entrega PDF suelto
o ZIP con PDF y XML, y si existe algún PDF protegido con clave. Se resuelve en la fase 0 con
archivos reales.
