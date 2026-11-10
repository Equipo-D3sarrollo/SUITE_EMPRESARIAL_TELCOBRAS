# Inicio, instalación, actualización y guías

> Copia íntegra del manual oficial de APIDIAN (FacturaLatam), descargada el 10-nov-2026 desde https://manual.facturalatam.com. Solo se censuraron tokens y secretos, se recortaron los base64 largos y se volvieron absolutos los enlaces e imágenes. Cada página conserva su URL de origen.

Páginas incluidas: 12.

## Contenido
- Bienvenido a la Documentación API DIAN — <https://manual.facturalatam.com/>
- Instalación — <https://manual.facturalatam.com/apidian/instalacion/>
- Actualización — <https://manual.facturalatam.com/apidian/actualizacion/>
- Guías — <https://manual.facturalatam.com/apidian/guias/>
- Novedades APIDIAN 2026 — <https://manual.facturalatam.com/apidian/novedades/>
- Aviso de seguridad: clave de administración del API — <https://manual.facturalatam.com/apidian/aviso-seguridad-rutas/>
- Aviso de seguridad: actualización obligatoria de PHP — <https://manual.facturalatam.com/apidian/aviso-seguridad-php/>
- ⚡ Rendimiento y velocidad — <https://manual.facturalatam.com/apidian/rendimiento/>
- 🗄️ Almacenamiento Externo S3 — <https://manual.facturalatam.com/apidian/almacenamiento-s3/>
- 🧾 Responsabilidades tributarias — <https://manual.facturalatam.com/apidian/responsabilidades-tributarias/>
- Errores frecuentes — <https://manual.facturalatam.com/apidian/errores-frecuentes/>
- Descargar Collection Para POSTMAN — <https://manual.facturalatam.com/apidian/collectionPostman/>

---

## Bienvenido a la Documentación API DIAN

Fuente: <https://manual.facturalatam.com/>

La **API DIAN** es la solución para la emisión y gestión de documentos electrónicos en Colombia: facturas, notas crédito/débito, documentos equivalentes, nómina electrónica y más — todo bajo el estándar UBL 2.1 exigido por la DIAN.

Usa esta documentación para instalar la API, configurarla en Postman y empezar a enviar tus primeros documentos.

---

[📣

Novedades

Nuevas funcionalidades y mejoras de la plataforma, mes a mes.](https://manual.facturalatam.com/apidian/novedades)[🖥️

Manual de la interfaz

Guía visual del panel: empresas, configuración, documentos y extractor.](https://manual.facturalatam.com/interfaz/)[🚀

Instalación

Despliega la API en Windows, Linux (LAMP / Docker) o cPanel paso a paso.](https://manual.facturalatam.com/apidian/instalacion)[🔄

Actualización

Migra desde versiones anteriores y mantén la API al día.](https://manual.facturalatam.com/apidian/actualizacion)[📦

Colección Postman

Descarga la colección oficial con todos los ejemplos listos para importar.](https://manual.facturalatam.com/apidian/collectionPostman)[📖

Guías

Habilitación DIAN, configuración, paso a producción y videos explicativos.](https://manual.facturalatam.com/apidian/guias)

---

## Instalación

Fuente: <https://manual.facturalatam.com/apidian/instalacion/>

Nueva dirección del repositorio

Desde el 19 de octubre de 2026 el repositorio del API vive en
`https://git.buho.la/facturalatam/apidian/co-apidian2026.git`. Úsela en el `git clone` y, si ya
tiene una instalación, en el `git remote` antes de actualizar:

```
git remote set-url origin https://git.buho.la/facturalatam/apidian/co-apidian2026.git
```

* ### Despliegue en local (Windows)")

  + Video de instalación. [Aquí](https://www.youtube.com/watch?v=9Ds2DR3QLGY)
  + [Pasos aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Comandos%20Instalacion%20API%202025%20Windows.md?ref_type=heads)
* ### Despliegue en linux

  + Exclusivo para Ubuntu **20.04** | entorno LAMP | ejecucion de comandos de forma manual.
    - [Video aquí](https://www.youtube.com/watch?v=rEgrHADjsCY)
    - [Comandos aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Comandos%20Instalacion%20API%202025%20Linux%20Ubuntu%2020.md?ref_type=heads)
  + Exclusivo para Ubuntu **20.04** | Entorno LAMP | ejecución de script.
    - [Pasos y script aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/snippets/47)
  + Linux | Entorno **Docker** | *Aporte de usuario de la comunidad*
    - [Descarga aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/api_docker.zip?ref_type=heads)
* ### Despliegue con Docker

  + Ubuntu 20.04 , 22.04 y 24.04 | sólo API | sin dominio | proceso manual
    - [Pasos aquí](https://git.buho.la/-/snippets/31)
* ### Base de datos PostgreSQL (opcional)")

  + El API funciona con MySQL/MariaDB (por defecto) o **PostgreSQL**; el motor se elige solo con el `.env`.
    - **Conexión y puesta en marcha** (requisitos, `.env`, migraciones): [Ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/MANUAL_POSTGRESQL.md?ref_type=heads)
    - **PostgreSQL en Docker** con instalador interactivo (`instalar-postgres-docker.sh`, genera su `docker-compose.postgres.yml`): [Ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/MANUAL_POSTGRESQL_DOCKER.md?ref_type=heads)
* ### Extractor DIAN (Factura de compras)")

  + **Despliegue e integración** — cómo conectar el worker del extractor a una instalación del API (Docker o LAMP): [Ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/EXTRACTOR_INTEGRACION.md?ref_type=heads)
  + **API del extractor** — rutas, autenticación y ejemplos para consumirlo desde sistemas externos: [Ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/API_EXTRACTOR.md?ref_type=heads)
* ### CPanel

  + [Ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/snippets/48)
* ### Migracion Api2025 a Api2026 windows:

  + [Pasos aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/snippets/49)
* ### Migracion Api2025 a Api2026 Docker:

  + [Pasos aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/snippets/50)

---

## Actualización

Fuente: <https://manual.facturalatam.com/apidian/actualizacion/>

Aviso de seguridad (octubre 2026)

PHP publicó parches para dos vulnerabilidades críticas con ejecución remota de código. Toda
instalación propia del API debe actualizar PHP: con Docker, reconstruyendo la imagen; en Ubuntu
22.04, con `apt`. Procedimiento completo en [Aviso de seguridad PHP](https://manual.facturalatam.com/apidian/aviso-seguridad-php/).

Aviso de seguridad (27 de octubre de 2026)

Crear, consultar y eliminar empresas, los planes, los administradores y el correo general exigen
ahora una **clave de administración** en el header `X-Admin-Token`. Después del `git pull` hay que
crearla con `php artisan api:admin-token` y entregarla a las integraciones que administran
empresas; si no, esas peticiones responden `403`. Pasos por tipo de instalación en
[Aviso de seguridad: clave de administración del API](https://manual.facturalatam.com/apidian/aviso-seguridad-rutas/).

* Actualizar repositorio de gitlab de una versión antigua a la actual. [Video aquí](https://www.youtube.com/watch?v=6lwLKQCYvNY)
* Comandos para actualizar repositorio **Pto. 1** y comandos para actualizar **Pto.2**. [Aquí](https://git.buho.la/facturalatam/apidian/apidian/co-apidian2026/-/blob/master/docs/Proceso%20de%20actualizacion%20APIDIAN.md?ref_type=heads)

### Si la instalación corre en Docker

La imagen PHP del API **se construye en su propio servidor** desde el `Dockerfile` del
repositorio (desde el 21 de octubre de 2026, sobre la imagen oficial `php:8.3.36-fpm-bookworm`).
Por eso, cada vez que el `git pull` traiga cambios en el `Dockerfile` o en la carpeta `docker/`,
hay que **reconstruir** la imagen y no solo reiniciar los contenedores. Los comandos de
`composer` y de `php artisan` se ejecutan dentro del contenedor:

```
cd /ruta/del/api && git pull origin master   # carpeta del código del API  
cd /ruta/del/compose                         # carpeta donde está el docker-compose.yml (ver nota)  
docker compose build --no-cache php_api scheduling_api  
docker compose up -d php_api scheduling_api  
docker restart nginx_api  
docker compose exec php_api php -v                 # debe mostrar PHP 8.3.36  
docker compose exec php_api composer install  
docker compose exec php_api php artisan migrate --seed  
docker compose exec php_api php artisan config:cache
```

El docker-compose.yml no siempre está en la carpeta del API

El `git pull` y la edición del `.env` se hacen en la carpeta del API, pero los comandos
`docker compose` se ejecutan **desde la carpeta donde está el `docker-compose.yml`**, porque leen
el archivo del directorio actual. Según cómo se instaló, ese archivo puede estar dentro de la
carpeta del API o fuera de ella (en la carpeta padre o en otra ruta): ubíquelo antes de empezar.
Si no sabe dónde quedó, `docker compose ls` muestra la ruta en la columna `CONFIG FILES`. Si
prefiere no cambiar de carpeta, agregue `-f /ruta/docker-compose.yml` a cada comando. Más detalle
en [Aviso de seguridad PHP](https://manual.facturalatam.com/apidian/aviso-seguridad-php/).

Los nombres de los servicios cambian según el instalador

Véalos con `docker compose ps` (o `docker-compose ps`, con guion, en instalaciones antiguas) y
reemplácelos en los comandos: el contenedor PHP del API, el del programador de tareas y el de
nginx. En algunas instalaciones llevan el dominio como sufijo, por ejemplo
`php_api_api_midominio_com`.

El `docker restart` de nginx evita un `502 Bad Gateway` que aparece cuando el contenedor PHP
cambia de IP interna al recrearse. Más detalle en
[Aviso de seguridad PHP](https://manual.facturalatam.com/apidian/aviso-seguridad-php/).

---

## Guías

Fuente: <https://manual.facturalatam.com/apidian/guias/>

#### Proceso de habilitación DIAN Validación Previa UBL 2.1

* Ver video explicativo [Aquí](https://www.youtube.com/watch?v=csTmbd1Ere8)

#### Configuración / Habilitación / Producción API

* Ver video explicativo [Aquí](https://www.youtube.com/watch?v=TSF2nHN4W1I)
* Paso a paso con capturas del panel: [Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/)

#### Cómo pasar a producción

* Ver video explicativo [Aquí](https://www.youtube.com/watch?v=gBtd4XqwWtg)
* Paso a paso con capturas del panel: [Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/)

#### Extractor de documentos de compra

Módulo que se conecta al catálogo de la DIAN y descarga automáticamente los documentos electrónicos de la empresa (recibidos y enviados) en un rango de fechas, extrayendo CUFE, emisor, totales, impuestos y detalle de ítems. Puede usarse de dos formas:

* **Desde la interfaz** de la plataforma, en la sección de documentos de la empresa: [ver la guía visual aquí](https://manual.facturalatam.com/interfaz/extractor-compras/).
* **Vía API**, con autenticación por token de empresa y modos de consumo síncrono o asíncrono: [ver documentación aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/API_EXTRACTOR.md?ref_type=heads)

### APP

* Aplicación movil en formato web [visitar URL](https://facturalatam.com/app/)

### Extras

* Para habilitar la carga de **Fichas RUT** al crear empresas (autocompleta el formulario desde el PDF del RUT): [ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Configurar%20PDF%20Fichas%20RUT.md?ref_type=heads)
* Cómo informar las **responsabilidades tributarias** de la empresa, del cliente y de las demás partes (una o varias por tercero): [ver manual aquí](https://manual.facturalatam.com/apidian/responsabilidades-tributarias/)
* Para deshabilitar registro de nuevas empresas por API:
  + ubicarse en la raiz del proyecto
  + editar el archivo .env (*utilizar nano o un editor en consola*)
  + añadir si no existe el parametro `ENABLE_API_REGISTER` con el valor en `false`
  + eliminar la cache de la aplicacion `php artisan config:cache & php artisan cache:clear`
    Los cambios podrán decargarse a partir de enero del 2025 progresivamente, con la nueva documentación respectiva.
* Para añadir un correo para envio de los documentos a los clientes:
  + ubicarse en la raiz del proyecto y editar el archivo .env (*utilizar nano o un editor en consola*)
  + ajustar los siguientes valores de acuerdo a su proveedor de correos

  ```
  MAIL_DRIVER=smtp  
  MAIL_HOST=smtp.gmail.com  
  MAIL_PORT=465  
  MAIL_USERNAME=username@gmail.com  
  MAIL_PASSWORD=password  
  MAIL_ENCRYPTION=ssl  
  MAIL_FROM_ADDRESS=username@gmail.com  
  MAIL_FROM_NAME=username
  ```

  + eliminar la cache de la aplicacion `php artisan config:clear && php artisan config:cache & php artisan optimize:clear`

---

## Novedades APIDIAN 2026

Fuente: <https://manual.facturalatam.com/apidian/novedades/>

Boletín de actualizaciones de la API de Facturación Electrónica DIAN. Aquí encontrará, mes a mes, las nuevas funcionalidades y mejoras más importantes de la plataforma. Las novedades más recientes aparecen primero.

### Octubre 2026

#### Confirmación antes de anular una factura y búsqueda por número exacta

Interfaz

Dos ajustes en el **Listado** de documentos electrónicos:

* **El botón Nota de crédito pide confirmación.** Elegir la resolución ya no envía nada: aparece
  un aviso con la factura que se va a anular, la resolución elegida y el motivo, y la nota sale
  solo al pulsar **Sí, enviar nota crédito**. Mientras se envía, la ventana no se puede cerrar
  con la **X**, con `Esc` ni haciendo clic afuera, para que el resultado se vea siempre y no se
  envíen dos notas por la misma factura; al cerrarla, el listado se recarga con el documento
  nuevo.
* **Buscar por Número encuentra el consecutivo exacto.** Se escribe el número solo o con su
  prefijo (`1015` o `NC1015`). Buscar `1` ya no devuelve `10`, `21` ni `100`.

Lo explica [Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/#anular-una-factura-con-nota-de-cr%C3%A9dito).

#### Los scripts de instalación crean la clave de administración

Instalación

En una instalación nueva con los scripts de Docker (`scripapi.sh` y `scripapi20.sh`) ya no hay
que crear a mano la clave de administración del API: el script la genera, la escribe en el `.env`
como `PLATFORM_ADMIN_TOKEN` y la deja en `setup/private.txt`, bajo el título **CLAVE DE
ADMINISTRACION DEL API**, junto a las demás claves de la instalación. Antes de terminar comprueba
que el API la reconozca (`COMPROBACION: TODO CORRECTO`), y el aviso final de la consola recuerda
copiar dos cosas: esa clave y el enlace que registra al administrador.

Solo queda entregarla a los sistemas que crean, consultan o eliminan empresas. Para volver a
verla, `docker exec -ti php_api php artisan api:admin-token`. El detalle está en
[Aviso de seguridad: clave de administración del API](https://manual.facturalatam.com/apidian/aviso-seguridad-rutas/).

#### Descargar facturas recibidas ya no exige registrar el software

APIInterfaz

Quien emite sus ventas con otro proveedor y solo usa la plataforma para traerse sus facturas de
compra ya no tiene que registrar un ID y un PIN de software que no usa. Consultar a la DIAN y
descargar documentos recibidos solo necesita el **certificado**; el ambiente de los eventos lo
decide la propia empresa.

* **Consulta y descarga sin software.** La consulta por CUFE y el enriquecimiento de CUFEs
  (`POST /api/cufes/enrich` y `POST /api/extractor/company`), el XML del documento con `is_event`
  (`POST /api/ubl2.1/xml/document/{trackId}`) y la consulta de estado de eventos
  (`POST /api/ubl2.1/status/events-document/{trackId}`) ya no responden *La empresa no tiene configurado el software de facturación*. Si falta el certificado,
  el mensaje es el que corresponde: *La empresa no tiene un certificado (.p12) configurado.* En
  esa misma ruta del XML, cuando **no** es un evento y falta el software, la respuesta es ahora
  `success: false` con *La empresa no tiene un software de facturación electrónica configurado.
  Registre su ID y PIN en Ver configuración.*, en lugar de un error técnico.
* **Ambiente de eventos sin software.** El selector **Estado del Ambiente** de **Eventos RADIAN**
  y `PUT /api/ubl2.1/config/environment` con solo `eventos_radian` (o `event_type_environment_id`)
  guardan el cambio aunque la empresa no tenga software. Si se envía cualquier otro ambiente
  (`factura_ventas`, `nomina`, `pos`, `documentos_soporte`), la validación de siempre se mantiene.
  Cuando la empresa sí tiene software, se respeta la URL registrada en él.
* **Enviar eventos sigue necesitando el software.** `POST /api/ubl2.1/send-event` y
  `POST /api/ubl2.1/send-event-data` se firman con el SoftwareID y el SoftwareSecurityCode del
  software de facturación. Si falta —o si el ID o el PIN están vacíos— responden, antes de
  contactar a la DIAN, `success: false` con el mensaje *Para enviar eventos RADIAN la empresa
  necesita un software de facturación electrónica propio, habilitado ante la DIAN. Registre su ID
  y PIN en Ver configuración. Para descargar facturas recibidas no es necesario.*, en vez de un
  error técnico.
* **En el panel.** La sub-pestaña **Paso a Producción** de **Eventos RADIAN** explica ahora que los
  eventos usan el software de facturación de la empresa y, cuando falta, avisa en naranja con un
  enlace a **Ver configuración**. Las pestañas de factura, documento equivalente, nómina y
  documento soporte siguen pidiendo el software para cambiar de ambiente.

El detalle está en [Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/#el-caso-aparte-eventos-radian)
y en [Extractor de documentos de compra](https://manual.facturalatam.com/interfaz/extractor-compras/).

#### Aviso de seguridad: rutas del API que pasan a exigir credenciales

APIInterfazInstalación

Importante

Varias rutas que antes respondían sin credenciales ahora las exigen. **Al actualizar hay que crear
la clave de administración** con `php artisan api:admin-token` y entregarla a los sistemas que
crean, consultan o eliminan empresas. Los pasos para copiar y pegar, por tipo de instalación,
están en [Aviso de seguridad: clave de administración del API](https://manual.facturalatam.com/apidian/aviso-seguridad-rutas/).

* **Administración de la plataforma.** Crear (`POST /api/ubl2.1/config/{nit}/{dv}`), consultar
  (`GET /api/ubl2.1/config/query/{nit}`) y eliminar empresas
  (`POST /api/ubl2.1/config/delete/{nit}/{email}`), el correo general
  (`PUT /api/ubl2.1/config/smtp-global`), los planes (`/api/ubl2.1/plan`) y los administradores
  (`/api/ubl2.1/administrator`) piden la clave de administración en el header `X-Admin-Token`.
  Mientras actualiza sus integraciones, `ALLOW_PUBLIC_API_REGISTER=true` deja pasar crear y
  consultar sin la clave (eliminar la sigue pidiendo siempre) y anota cada llamada en el log.
* **Firma y consulta con certificado.** `signdocument`, `senddocument`, `statusdocument` y
  `statuszip` exigen el `api_token` de la empresa, y el `.p12` que se envía se guarda con un
  nombre que genera el servidor y se borra al terminar.
* **Un token solo opera sobre su empresa.** Las rutas que reciben un NIT (descargas, resoluciones,
  recarga de PDF, borrar empresa) responden `403` si el NIT no es el de la empresa del token.
  `POST /api/download-file` ahora exige `api_token`, dentro del mismo periodo de gracia de
  `ALLOW_PUBLIC_DOWNLOAD` que `/api/download`.
* **Eventos.** `POST /api/accept-reject-document` desaparece del API: las integraciones envían los
  eventos por `POST /api/ubl2.1/send-event`. El botón *Aceptar y/o Rechazar documento* del correo
  viaja ahora con un enlace firmado que caduca a los 30 días; los correos anteriores abren el
  portal del adquiriente y piden su clave.
* **Portales y panel.** Los portales de propietario, vendedor, cliente y empleado piden la clave
  en cada sesión nueva (ya no se pueden abrir sus listados sin ingresar), **Logs** solo lo ve el
  administrador de la plataforma, y la clave de panel de una empresa nueva ya no es el NIT: es
  aleatoria y se muestra **una sola vez** al final del asistente **Empresa › Nuevo**.
* **Registros.** El log del API enmascara los campos sensibles (certificado, contraseñas, PIN) y
  `certificates-listing` ya no devuelve la contraseña del certificado.

#### Empaques por cajas en el PDF de la factura

API

Para quien vende por cajas, las líneas de la factura aceptan tres campos opcionales que el PDF
imprime: `package_quantity` (unidades que trae cada caja), `packages` (cantidad de cajas) y
`loose_units` (unidades sueltas). Solo se imprimen si alguna línea trae `package_quantity` mayor
que 1; si no, el PDF sale igual que siempre.

* Plantillas **1** y **2**: tres columnas nuevas —**Und x Caja**, **Cajas** y **Unds**— y la fila
  **Total Cajas** en el bloque de totales.
* Plantillas **3** y **9**: una línea bajo la descripción del ítem (*Cajas: 10 x 12 + 3 und*) y el
  **Total Cajas** al final del detalle.

Es información de impresión: la columna **Cantidad** sigue siendo la que se declara a la DIAN, y el
XML y los totales del documento no cambian.

#### Envíos cortados: la respuesta ya es JSON y trae el CUFE

API

Cuando el envío a la DIAN se corta a medio camino (se agota el tiempo de espera, se cae la conexión
o la respuesta llega ilegible), los endpoints de **documento equivalente**
(`POST /api/ubl2.1/eqdoc`), **documento soporte** (`/api/ubl2.1/support-document`) y su **nota de
ajuste** (`/api/ubl2.1/sd-credit-note`) devolvían un texto plano con el mensaje del error, que el
sistema que factura no podía procesar. Ahora responden con el JSON de siempre:

* **`502`** cuando la DIAN no llegó a dar veredicto —los clientes ya tratan cualquier `5xx` como
  "sin respuesta"— y **`200`** cuando sí lo dio y el corte ocurrió después.
* `success: false`, un `message` con el prefijo y número del documento y el motivo, `ResponseDian`
  (un objeto vacío si la DIAN no contestó, para poder recorrerlo sin errores), `urlinvoicexml`,
  `urlinvoicepdf`, `QRStr` y el `cufe` (documento equivalente) o `cuds` (documento soporte y su nota
  de ajuste), que además queda guardado en el documento para consultarlo o reenviarlo después.

En facturas, notas crédito y notas débito, que ya respondían en JSON, el `message` dice ahora el
prefijo y número del documento y el motivo del corte, en vez de *Problema con el documento*.

Estos son los documentos que quedan **Sin confirmar** en el listado: cómo consultarlos y reenviarlos
está en [Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/#documentos-sin-confirmar).

#### Varias responsabilidades tributarias por tercero

APIInterfaz

Un cliente puede ser a la vez gran contribuyente y autorretenedor, y el anexo técnico de la DIAN
permite informarlo. Además del campo de siempre `type_liability_id`, las partes del documento aceptan
`type_liability_ids` con **todas** las responsabilidades que marque el tercero: `customer` en facturas,
notas y documentos equivalentes, `seller` en el documento soporte y su nota de ajuste, y
`deliveryparty` en la parte de entrega. Los códigos salen juntos en el `cbc:TaxLevelCode`
(`O-13;O-15;O-23`) del XML, del `AttachedDocument` y de los eventos RADIAN, y sus nombres se imprimen
en el PDF.

En el panel, el formulario de empresa (**Nueva empresa** y **Editar Empresa**) tiene el campo
**Responsabilidades adicionales** de selección múltiple, que la carga de la **Ficha RUT** rellena sola
con lo que encuentre en la casilla 53. Ya no aparece *No aplica – Otros* entre las opciones
adicionales: solo tiene sentido cuando el tercero no cumple ninguna, así que el API lo descarta si se
envían varias.

El detalle, con el catálogo de códigos, los ejemplos de JSON y cómo queda el XML, está en
[Responsabilidades tributarias](https://manual.facturalatam.com/apidian/responsabilidades-tributarias/).

#### Carga de XML recibidos: ya admite documentos de más de 100 millones

APIInstalación

Al cargar el XML de una factura recibida (recepción de documentos / Eventos RADIAN) cuyos totales
pasaban de 99.999.999,99, el archivo no se guardaba y la respuesta terminaba en
`SQLSTATE[22003]: Numeric value out of range: 1264 Out of range value for column 'sale' at row 1`.
La tabla de documentos recibidos guardaba los montos con un tipo que solo llegaba hasta esa cifra;
ahora son `decimal(18,2)` y el documento se carga con normalidad. **El XML del proveedor no tenía
ningún error**: era el límite de la columna.

note

**Al actualizar:** esta versión incluye una migración. Después del `git pull` ejecute
`php artisan migrate` (en Docker, `docker compose exec php_api php artisan migrate`); si no, el
error se sigue viendo. El procedimiento completo está en [Actualización](https://manual.facturalatam.com/apidian/actualizacion/).

El síntoma, la causa y el `ALTER TABLE` de respaldo para quien no pueda migrar de inmediato quedan
documentados como entrada 18 del manual que enlaza [Errores frecuentes](https://manual.facturalatam.com/apidian/errores-frecuentes/).

#### Notas crédito y débito: el prefijo basta para elegir la resolución

API

Cuando la empresa tiene **varias resoluciones del mismo tipo de documento**, las notas crédito,
las notas débito y la nota de ajuste de documento soporte exigían enviar `resolution_number` para
saber cuál usar, aunque el `prefix` ya lo dejara claro. Ahora, si el `prefix` enviado corresponde
a **una sola** de esas resoluciones, se usa esa y `resolution_number` deja de ser obligatorio. Las
notas suelen numerarse por prefijo y sin número de resolución propio, así que en la práctica basta
con `prefix`.

Sigue siendo obligatorio indicar `resolution_number` cuando el `prefix` no identifica una sola
resolución (porque no se envía o porque hay varias con ese mismo prefijo); en ese caso el mensaje
de error lo dice: *"…envíe resolution\_number o un prefix que corresponda a una sola de ellas"*. No
cambia nada para las empresas con una sola resolución por tipo de documento ni para quien ya envía
`resolution_number`.

#### El panel ya se puede usar desde el celular

Interfaz

Hasta ahora el panel solo era cómodo en el computador: en el celular no había forma de abrir el
menú lateral y la barra superior se salía de la pantalla. Ahora la barra superior ocupa una sola
franja con el botón **☰** a la izquierda —abre y cierra el menú a pantalla completa— y la
campanita de avisos y el avatar a la derecha, y el título de la pantalla ya no queda tapado.

En el **Listado de Empresas**, cada empresa se muestra como una tarjeta con sus datos uno debajo
de otro, en vez de obligar a desplazarse en horizontal por la tabla. Además, el botón flotante del
asistente deja de montarse sobre la última fila del listado. Lo explican
[Introducción y acceso al panel](https://manual.facturalatam.com/interfaz/) y [Listado de empresas](https://manual.facturalatam.com/interfaz/empresas/).

#### El correo pasa debajo del nombre en el listado de empresas

Interfaz

La columna **Correo de usuario** desaparece del **Listado de Empresas**: el correo se lee ahora
bajo el nombre de la empresa, en letra más pequeña y atenuada. Con una columna menos, la tabla
respira y la columna **Configuración** se ve completa sin desplazarse. Los filtros no cambian:
**Nombre** y **Correo** siguen buscando cada uno en su línea.

#### El buscador del listado de empresas ya no se autorrellena solo

Interfaz

Al entrar a **Empresas**, Chrome y algunos gestores de contraseñas tomaban la caja **Búsqueda**
como si fuera el campo de usuario de un formulario de acceso —la pantalla tiene un campo de
contraseña, el del certificado— y la rellenaban con el correo guardado. El listado quedaba
filtrado por ese correo y parecía que la cuenta no tuviera empresas. Ahora la caja arranca
bloqueada y se habilita con el primer clic, y si pese a todo llega un valor autorrellenado (al
volver con el botón *atrás*, por ejemplo) se descarta y el listado vuelve a mostrarse completo.
El filtro responde además cuando se **pega** el texto con el ratón o se elige una sugerencia del
navegador, no solo al teclear.

#### Referencia API: cada endpoint con su propia documentación y nombres en español

API

La colección de Postman de la que se genera la **Referencia API** se revisó de punta a punta. Hasta
ahora muchos endpoints mostraban la documentación copiada de otro servicio: el envío de tiquete de
transporte terrestre explicaba la factura de mandato, las notas crédito y débito repetían el texto
de "primer envío de factura", los documentos equivalentes se documentaban como facturas y la
configuración del software de nómina describía el de facturación. Cada endpoint pasa a tener el
texto que le corresponde, con su URL real, la resolución que necesita y los campos propios
(`billing_reference`, `discrepancyresponsecode`, el `type_document_id` de cada documento
equivalente, etc.), y los que no tenían ninguna descripción ya la traen.

Además:

* Los **nombres** de las carpetas y de todos los requests pasan a frases en español que dicen qué
  hace cada uno. Donde antes se leía *Dos Lineas,Una Tarifa de Iva, Receipt Documnet Ref* ahora se
  lee **Factura con referencia a documento de recepcion**, y *Config-Software Payroll* es
  **Paso 1 - Registrar el software de nomina electronica**. Los nombres van sin tildes, tal como
  los exporta Postman, así que búsquelos así en el buscador del manual.
* Las secciones quedan numeradas **01 a 14** sin huecos. Se retiraron tres carpetas que ya no
  aplicaban: *Consumidor Final*, *Pruebas* y *Batch Sends* (12 requests en total), con lo que la
  colección queda en **185 requests** repartidos en **14 secciones**.
* Cada descripción sigue ahora la misma estructura: la URL equivalente en una instalación propia
  (`http://midominio.com/api/ubl2.1/...`), si el endpoint pide token y de dónde sale, y qué
  resolución hay que tener registrada antes de usarlo.
* Los requests que son **variantes de un ejemplo** ya no repiten media página de texto: remiten al
  envío base del que heredan la documentación ("Aplica la misma documentacion que el PRIMER ENVIO
  DE FACTURA de la seccion 02 - PRIMEROS ENVIOS") y explican únicamente el caso que ilustran —AIU,
  exportación, transporte, varias líneas de detalle, cargos en el encabezado o los impuestos ICUI,
  IBUA, INC e ICL, entre otros—.
* Los requests de **09 - Planes** que administran los planes (crear, modificar, listar y consultar
  por id, y listar las empresas de un plan) advierten que el endpoint **no está autenticado** y que
  solo lo debe usar el administrador de la API: no se deben exponer a los clientes.
* La **vista preliminar** de la factura deja claro lo que hace: devuelve el PDF en base64 sin
  firmar, sin transmitir a la DIAN y sin consumir consecutivo ni cupo del plan.
* El **documento soporte** y su nota de ajuste documentan qué tipos de identificación admiten para
  el vendedor en `seller.type_document_identification_id`: NIT (`6`) para residentes y, para no
  residentes, tarjeta de extranjería (`4`), cédula de extranjería (`5`), pasaporte (`7`), documento
  de identificación extranjero (`8`), NIT de otro país (`9`) y PEP (`11`). Se envía el **ID**, no el
  código DIAN; cualquier otro valor lo rechaza la validación.

No cambia ningún endpoint, URL ni cuerpo JSON: es una corrección de la documentación. Como el
listado de la Referencia API se arma a partir de esa colección, los nombres del menú lateral
cambian y los enlaces guardados a alguna de esas páginas pueden quedar desactualizados; use el
buscador del manual para volver a encontrarlas. Si trabaja con la colección en Postman, descargue
la versión nueva desde [Descargar Collection Para POSTMAN](https://manual.facturalatam.com/apidian/collectionPostman/).

#### Configuración de la empresa: accesos directos, prueba de factura y una pestaña por tipo de documento

Interfaz

La columna **Configuración** del listado de empresas deja de tener un solo enlace *Ver detalle* y
pasa a una fila de botones: **Ver resumen** (la misma ventana de antes), **Ver configuración**,
**Resoluciones** —si la empresa ya tiene alguna— y **Probar factura**. Cada uno entra directo a su
pantalla, sin pasar por el menú ⋮.

**Probar factura** es una pantalla nueva: muestra el `POST /api/ubl2.1/invoice`, el token de la
empresa y un JSON de factura ya precargado con su prefijo, su resolución y el consecutivo
siguiente al último documento emitido. Se edita, se envía y la respuesta de la DIAN aparece
debajo. Es la misma prueba opcional del asistente de creación de empresa, ahora disponible para
cualquier empresa ya registrada.

En **Completar configuración**, el software y las resoluciones quedaron en una sola tarjeta con
**una pestaña por tipo de documento**: Facturas, Notas crédito/débito, Nómina electrónica,
Documento soporte y Documentos equivalentes. Cada pestaña trae su software, sus resoluciones y su
formulario para registrar más, así que ya no hay que salir de la pantalla; la de notas es nueva y
es donde se registran las **notas débito**, que antes no tenían dónde.

La pestaña **Información de la Empresa** de *Editar Empresa* incorpora el campo **Organización**,
que hasta ahora solo se podía elegir al crear la empresa.

El **asistente de ayuda** cambia de forma: en lugar de una ventana flotante se abre como **panel
lateral derecho** a todo el alto de la pantalla, con un botón nuevo con icono de diadema. Se
cierra con la **×**, pulsando fuera o con **Esc**, y sigue conservando la conversación al cambiar
de pantalla. Los verdes del panel se unificaron con los del facturador web.

note

**Al actualizar:** esta versión no incluye migraciones. Si tras actualizar el panel se ve con el
estilo anterior, recargue forzando la caché del navegador (Ctrl+F5).

Lo explican [Listado de empresas](https://manual.facturalatam.com/interfaz/empresas/),
[Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/) y
[Asistente IA](https://manual.facturalatam.com/interfaz/asistente-ia/).

#### Aviso de seguridad: actualización obligatoria de PHP

Instalación

Importante

El 21 de octubre de 2026 PHP publicó parches para dos vulnerabilidades críticas (CVE-2026-109618 y
CVE-2026-109619) que permiten **ejecutar código de forma remota sin autenticación** en cualquier
instalación que atienda peticiones web. **Toda instalación propia del API debe actualizarse cuanto
antes.** El procedimiento para cada tipo de instalación está en
[Aviso de seguridad PHP](https://manual.facturalatam.com/apidian/aviso-seguridad-php/).

La imagen Docker del API pasa a la imagen oficial `php:8.3.36-fpm-bookworm`, ya parcheada; la
anterior era una imagen de terceros con PHP 8.2.5 de 2023 que no recibía actualizaciones. Con
Docker hay que **reconstruir** la imagen (`docker compose build --no-cache php_api scheduling_api`); en servidores Ubuntu 22.04 basta actualizar PHP con `apt` y reiniciar Apache.
Ningún endpoint ni respuesta del API cambia.

#### La emisión va más rápida y ahora se puede medir

Instalación

Se corrigió una consulta repetida que se disparaba cientos de veces al armar cada documento: la
empresa del usuario ahora se resuelve **una sola vez por petición** en lugar de consultarse en cada
acceso. El resultado es el mismo documento, con menos consultas a la base de datos.

Además, el API cronometra cada emisión y guarda el **reparto de su tiempo por etapa** —arranque,
DIAN, PDF, firma del XML, AttachedDocument, correo y S3— en la tabla `monitoring_slow_requests`.
Es una medición interna, no aparece en ninguna pantalla, y sirve para saber en qué se va el tiempo
de una factura antes de suponerlo. Se controla con tres variables nuevas del `.env`:
`MONITOR_SLOW_REQUEST_MS` (ponerlo en `0` registra todas las peticiones mientras dure la medición),
`MONITOR_TRACK_QUERIES` y `MONITOR_RETENTION_DAYS`.

Las imágenes de Docker llevan **OPcache activo de fábrica**, que es la causa más frecuente de que
una instalación 2026 se sienta más lenta que la 2025: PHP 8.3 sin OPcache recompila el proyecto en
cada petición.

note

**Al actualizar:** esta versión incluye migraciones de base de datos. Después de actualizar el
código ejecute `php artisan migrate`. Con Docker, **reconstruya la imagen**
(`docker compose build php_api scheduling_api`) y no solo la reinicie: si no, OPcache queda
apagado.

Lo explica [Rendimiento y velocidad](https://manual.facturalatam.com/apidian/rendimiento/).

#### Asistente IA que responde con el manual

InterfazInstalación

El panel incorpora un **asistente de ayuda** en una burbuja fija en la esquina inferior derecha de
todas las pantallas. Se le pregunta con palabras propias —*¿cómo configuro mi empresa?*, *¿qué JSON
envío para una factura?*— y responde el paso a paso **usando únicamente este manual**: cada
respuesta trae los enlaces a las páginas de la documentación de donde salió y, cuando existen, la
captura de esa pantalla y el JSON de ejemplo del servicio, con botones para ampliarlo y copiarlo.
Cuando lo que explica se hace en una pantalla del panel, añade además el enlace que la abre.
Lo puede usar cualquier cuenta del panel.

La pregunta también se puede **dictar**, con el botón del micrófono: lo reconocido queda escrito en
la caja de texto para revisarlo antes de enviarlo (necesita Chrome o Edge y el panel por `https`).
Mientras el asistente redacta se ve una burbuja con **tres puntos animados**, y la conversación
**se conserva al cambiar de pantalla** del panel: el botón **Limpiar** la borra cuando se quiera.

El asistente no tiene pantalla de configuración: lo único que se configura es el **token de Claude
(Anthropic)** en el `.env`, con `MANUAL_AI_API_KEY`. El resto son valores por defecto que casi
nunca se tocan: `MANUAL_URL` (el manual que se indexa), `MANUAL_AI_PROVIDER`, `MANUAL_AI_MODEL` y
`MANUAL_AI_EMBEDDINGS_API_KEY`, esta última opcional y solo para mejorar la búsqueda; sin ella el
asistente busca por palabras. El índice se rehace solo cada día a las 3:30 —con el cron de
`schedule:run` activo— y también a mano con `php artisan manual:index`.

note

**Al actualizar:** esta versión incluye migraciones de base de datos. Después de actualizar el
código ejecute `php artisan migrate`, ponga `MANUAL_AI_API_KEY=sk-ant-...` en el `.env`, ejecute
`php artisan config:clear` y construya el índice con `php artisan manual:index`. Mientras no haya
token, la burbuja no aparece y nada cambia.

Lo explica [Asistente IA](https://manual.facturalatam.com/interfaz/asistente-ia/).

#### Las credenciales del administrador se registran al instalar

InstalaciónInterfaz

Una instalación nueva ya no viene con un usuario administrador fijo ni deja sus credenciales en
un archivo de texto en el servidor: ahora las define quien instala, desde el navegador.

Después de `php artisan migrate --seed`, en el servidor se genera el enlace del asistente:

```
php artisan setup:token
```

El comando imprime una URL del tipo `https://su-dominio/setup/XXXXXXXX`, resaltada en la consola
porque **sirve una sola vez y vence en 60 minutos**. Al abrirla, el API muestra la pantalla
**Configuración Inicial**, que pide nombre, correo y contraseña; al guardarlas se crea el
administrador de la plataforma, el enlace queda invalidado y la sesión arranca ya iniciada.

| Comando | Para qué |
| --- | --- |
| `php artisan setup:token` | Genera el enlace del asistente. Solo funciona mientras no haya ningún usuario. |
| `php artisan setup:reset` | Genera un enlace equivalente para **cambiar** el correo y la contraseña del administrador actual, cuando se perdieron. Acepta `--email=` si hay varios. |
| `php artisan setup:admin --name="Admin" --email=correo@dominio.com --password=CLAVE` | Crea el administrador sin navegador. |

En un hosting sin consola, donde no se puede leer el enlace, se puede abrir el asistente sin
token poniendo `SETUP_REQUIRE_TOKEN=false` en el `.env` (y `php artisan config:clear`): mientras
no exista ningún usuario, `https://su-dominio/setup` muestra el formulario directamente.

El enlace se arma con `APP_URL`

Si el dominio o el `https` del `.env` todavía no son los definitivos, corríjalos, ejecute
`php artisan config:clear` y vuelva a generar el enlace. Si venció o ya se usó, el asistente lo
avisa y basta con generar otro.

Los scripts de instalación con Docker muestran el mismo enlace destacado al terminar.

#### Consecutivo por ambiente

API

Las consultas de numeración aceptan ahora el parámetro opcional **`type_environment_id`**
(`1` Producción, `2` Habilitación). Al enviarlo, se toma la resolución de ese ambiente y el
siguiente número se cuenta **solo entre los documentos de ese ambiente**, en lugar de mezclar
los de habilitación con los de producción. Aplica a
[próximo consecutivo](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-next-consecutive-v-1/) y a los endpoints
`current_number` de facturación y de nómina. Si no se envía, el comportamiento es el de siempre.

Para que ese conteo sea posible, los documentos de **nómina** quedan guardados con el ambiente en
el que se emitieron. Las nóminas anteriores no lo tienen y se siguen contando con normalidad.

note

**Al actualizar:** esta versión incluye una migración de base de datos. Después de actualizar el
código ejecute `php artisan migrate`.

#### Nuevo diseño del panel

Interfaz

El panel se renovó por completo para usar el mismo lenguaje visual del facturador web: fondo
claro, cada bloque dentro de una tarjeta blanca con esquinas redondeadas, menú lateral con la
opción activa resaltada, e insignias, tablas, paginación y ventanas con una paleta única. **No
cambia dónde está nada ni cómo se usa**: son las mismas pantallas, los mismos botones y los
mismos datos.

Lo único que cambia de sitio está en **Documentos Electrónicos**:

* El nombre y el NIT de la empresa, el badge de ambiente y el botón **Volver** se muestran una
  sola vez, en una tarjeta arriba de las pestañas. El tipo de documento y el badge de ambiente
  que ahí se ven cambian con la pestaña activa, en lugar de repetirse en cada una.
* Los botones **Subida Masiva** y **Consultar pendientes en la DIAN** pasaron del encabezado a
  la derecha de la barra de búsqueda del listado.

Las pantallas de inicio de sesión —la del panel y las de adquiriente, empleado, vendedor y
owner— también adoptan el nuevo diseño.

note

**Al actualizar:** esta versión no incluye migraciones. El diseño viaja en los archivos de
`public/`; si después de actualizar el panel se ve con el estilo anterior, recargue la página
forzando la caché del navegador (Ctrl+F5).

Las capturas del [manual de la interfaz](https://manual.facturalatam.com/interfaz/) ya están tomadas con el diseño nuevo.

#### Seguridad: las consultas y descargas por NIT ahora exigen token

API

Requiere acción si su sistema consume estas rutas

Hasta ahora, varias rutas de la API respondían **sin ninguna autenticación**: bastaba conocer el NIT de una empresa (dato público, impreso en cada factura) y el nombre del archivo para consultar o descargar sus documentos. Desde esta versión todas exigen el **`api_token` del usuario dueño de la empresa**, el mismo que ya se usa para emitir documentos en `/api/ubl2.1/...`. Si su sistema las llama sin token, dejará de recibir respuesta al actualizar.

**Rutas afectadas.** Las URL no cambian; solo hay que agregar el token.

| Ruta | Para qué sirve |
| --- | --- |
| `GET /api/information/{nit}` y sus variantes `/{desde}`, `/{desde}/{hasta}` y `/page/{page}/page` | Listado de documentos emitidos |
| `GET /api/total_documents/{nit}` y sus variantes `/{desde}` y `/{desde}/{hasta}` | Totales de documentos por tipo |
| `GET /api/invoice/{nit}/{archivo}` | Descarga del XML o PDF de un documento |
| `GET /api/receivedfile/{nit}/{archivo}` | Descarga de archivos de documentos recibidos |
| `GET /api/view/{nit}/{archivo}` | Visualización de XML o PDF en el navegador |
| `GET /api/invoice/xml/{archivo}` y `GET /api/invoice/pdf/{archivo}` (también sin el prefijo `/api`) | Descarga por nombre de archivo. Rutas antiguas: prefiera `/api/invoice/{nit}/{archivo}` |
| `GET /api/download/{nit}/{archivo}/{BASE64|INLINE}` | Descarga con opción BASE64 o INLINE. **Por ahora sigue aceptando llamadas sin token**; se cerrará en una próxima versión, agregue el token desde ya |

**Cómo enviar el token**, de cualquiera de las dos formas:

```
Authorization: Bearer SU_TOKEN        (cabecera HTTP, recomendada)  
?api_token=SU_TOKEN                   (al final de la URL)
```

**Respuestas si falta o no corresponde**, siempre en JSON:

* Sin token: `401` `{"success": false, "message": "No autenticado. Esta consulta requiere un api_token valido."}`
* Con el token de otra empresa: `403` `{"success": false, "message": "No tienes acceso a esta empresa."}`

Con el token correcto la respuesta es **exactamente la misma de siempre**: no cambió el formato, los campos ni los filtros.

**Qué no cambia:**

* Las rutas `/api/ubl2.1/...` ya exigían token y no requieren ningún ajuste.
* El panel de administración y los portales de adquiriente, vendedor, empleado y owner siguen funcionando igual. Sus botones de descarga ahora usan **enlaces firmados con caducidad de 2 horas**; si uno caduca, basta recargar la página.

**Recomendaciones:**

* No incluya enlaces a `/api/download/...` ni a `/api/invoice/...` en correos o páginas dirigidas a terceros (por ejemplo en el `html_buttons` del correo al adquiriente): dejarán de funcionar sin token, y el `api_token` **nunca debe compartirse** con el cliente final. Los correos que envía la plataforma ya adjuntan el PDF y el XML.
* Si administra su propia instalación y algún sistema todavía no puede enviar el token, puede abrir un **periodo de gracia temporal** en el `.env`: `ALLOW_PUBLIC_RESUME=true` para las consultas y `ALLOW_PUBLIC_FILES=true` para los archivos, seguido de `php artisan config:clear`. Cada llamada sin token queda registrada en `storage/logs/laravel.log` con el texto "periodo de gracia", para identificar qué sistema falta por adaptar. Ciérrelo tan pronto termine.

note

**Al actualizar:** esta versión no incluye migraciones. Limpie las cachés de configuración, rutas y vistas (`php artisan config:clear`, `route:clear` y `view:clear`). Las rutas afectadas y la forma de enviar el token son las de la tabla de arriba, y las páginas de la Referencia API de esas rutas ya las muestran como autenticadas. En la colección de Postman, en cambio, la descripción de `GET /api/receivedfile/{nit}/{archivo}` todavía dice que no requiere autenticación: ignórela y envíe el token. `GET /api/download/...` sigue siendo la única que por ahora acepta llamadas sin token.

#### Avisos de vencimiento de certificados y resoluciones

Interfaz

La plataforma ahora avisa con anticipación cuando el **certificado de firma digital** o alguna **resolución de facturación** está por vencer, para que no se interrumpa la emisión:

* **Campanita en el encabezado** del panel con los vencimientos de las empresas del usuario conectado: aparecen los que vencen en los próximos **30 días** y se resaltan en rojo los que vencen en **7 días o menos** o ya vencieron. Cada aviso lleva a la pantalla donde se renueva.
* **Correo diario de aviso** a la dirección del usuario dueño de cada empresa, con el detalle de lo que vence. Sale con el servidor de correo propio de la empresa si lo tiene configurado, no se repite para el mismo vencimiento y puede lanzarse a mano con `php artisan expirations:notify` (requiere tener activo el cron de `schedule:run`).
* El listado de empresas muestra el estado del certificado y las resoluciones vencidas o por vencer, con un resumen de lo pendiente en las tarjetas de arriba.
* Los avisos de resolución dicen de **qué servicio** son (facturación, documento soporte, nómina…) y con qué prefijo, y solo se marcan en rojo las de facturación, que son las que impiden emitir. Una resolución **reemplazada** por otra del mismo tipo, ambiente y prefijo ya no se avisa: antes una resolución vieja de documento soporte hacía ver la empresa en rojo aunque su facturación estuviera al día.
* La campanita avisa además qué empresa tiene **documentos sin confirmar** por la DIAN y abre su listado ya filtrado.

#### Listado de empresas: estado del certificado y de la configuración

Interfaz

El listado de empresas incorpora dos columnas nuevas y una pantalla para completar lo que falta:

* **Certificado**: Vigente, Por vencer, Vencido, Sin fecha o Sin certificado. Los certificados antiguos que no tenían fecha de vencimiento registrada la recuperan automáticamente del archivo `.p12`.
* **Configuración**: una pastilla dice si la configuración está completa o pendiente y, al lado, la alerta de vigencia más urgente. El enlace **Ver detalle** abre una ventana con el software por tipo de documento y todas las resoluciones vigentes de la empresa (tipo, prefijo, número, rango, vigencia, ambiente y estado), así que la fila no se llena aunque la empresa tenga muchas. Ambas columnas se pueden filtrar.
* **Completar configuración**: nueva pantalla que reúne certificado, software y resolución de factura (y opcionalmente la de nota crédito) en un solo lugar, para las empresas creadas por la API o por el asistente a las que se les saltó algún paso. En habilitación viene precargada con la resolución de pruebas de la DIAN.

#### Reenvíos duplicados que quedaban "en proceso"

APIInterfaz

Cuando un facturador reenviaba un número mientras la DIAN todavía validaba el primer envío, quedaban dos registros: uno validado y otro "en proceso" para siempre, que bloqueaba el consecutivo y confundía en el listado. Ahora el registro repetido se marca como **DUPLICADO** con el CUFE del que sí quedó validado, deja de verse "en proceso" y la API responde con los datos del documento validado (CUFE, cliente y total) en lugar de pedir que se consulte un documento que la DIAN nunca procesó.

**Rechazos por la regla 90.** El mismo estado se usa ahora cuando la DIAN rechaza el envío con la regla 90 *"Documento procesado anteriormente"*, aunque el otro documento no esté en esta plataforma (por ejemplo, porque ese número se emitió antes con otro software). El documento queda con `dian_status` **DUPLICADO** —antes quedaba `RECHAZADA` o `NO_ENCONTRADO`— y el mensaje dice que no se reenvíe, que se emita con otro número. Ese número **cuenta como usado**: el siguiente consecutivo lo salta, tanto en [`POST /api/ubl2.1/next-consecutive`](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-next-consecutive-v-1/) como en `GET /api/ubl2.1/current_number/{type}`, así que el siguiente documento no vuelve a pedir el número que la DIAN ya tiene. La consulta de estado por CUFE llega a la misma conclusión y lo deja igual.

#### Responsabilidades fiscales en los PDF

InterfazAPI

Todas las plantillas de factura, POS, notas, documento soporte, nómina y eventos imprimen en el encabezado las **responsabilidades fiscales de la empresa** (campo `type_liability_names` registrado en la configuración de la empresa; si no está, se usa la obligación principal). Cuando la obligación es "R-99-PN No aplica" el texto se omite en lugar de imprimir "No aplica".

#### Correcciones destacadas

API

* **Documento soporte con proveedor del exterior**: tanto la vista previa como el **envío definitivo** resuelven el país por su `country_code` y toman `municipality_name` y `state_name` como texto libre. Si no se envía país, se asume Colombia.
* **Documento soporte**: el XML declara el perfil `10` cuando el proveedor se identifica con NIT y `11` en los demás casos, como pide el anexo técnico. Antes se enviaba el código del tipo de operación y la DIAN podía rechazar el documento.
* **Eventos RADIAN**: el XML del evento declara el **ambiente configurado para eventos** —antes usaba siempre el de facturación— e incluye el CUFE/CUDE del documento referenciado en su `UUID`, que viajaba vacío.
* **Registro de ajuste de consecutivo**: el registro que crea `PUT /config/generateddocuments` para marcar un número como usado ya no se confunde con la factura real que lleva ese mismo prefijo y número. El envío del correo, la regeneración del PDF y la del AttachedDocument lo descartan (antes fallaban con *No existe el PDF para el correo: INITIAL\_NUMBER.PDF*), y en el listado de documentos se ve como una fila gris **Ajuste de consecutivo** que explica qué es.
* **Fecha de emisión en el PDF**: la plantilla 6 de factura imprime la fecha de emisión además de la fecha y hora de validación de la DIAN.

#### Documentos sin confirmar: consulta y reenvío a la DIAN

InterfazAPI

Cuando el envío a la DIAN se corta a medio camino (la DIAN no responde o se cae la conexión), el documento quedaba guardado sin respuesta y se veía igual que uno rechazado, aunque podía estar validado o no haber llegado nunca. Ahora ese caso tiene nombre y solución:

* Esos documentos quedan marcados como **SIN\_ESTADO** y en el listado se resaltan con el estado **Sin confirmar**, con la explicación de qué pasó y qué hacer. El filtro **Válido** tiene el valor **Sin confirmar por la DIAN** para encontrarlos.
* **Consultar DIAN** aclara si el documento está allá; si el envío se cortó antes de guardar el CUFE, este se recupera del XML firmado que quedó en disco.
* Botón **Reenviar a la DIAN**: vuelve a enviar el mismo documento ya firmado, sin generar uno nuevo, para que el CUFE siga siendo el que ya salió impreso en el PDF y en el QR del adquiriente. Solo se habilita cuando la DIAN no tiene nada validado ni en proceso con ese número, para evitar el rechazo por la regla 90. Desde un sistema propio, el mismo reenvío está en `POST /api/ubl2.1/resend-document`, indicando el documento por `id`, por `cufe` o por `prefix` y `number`.
* La **consulta automática** cada 10 minutos también revisa estos documentos y deja al día los que la DIAN ya resolvió.
* La campanita del panel avisa qué empresa tiene documentos sin confirmar y lleva a su listado ya filtrado.

Lo explica [Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/).

### Septiembre 2026

#### Documentos "en proceso" en la DIAN (código 98)")

APIInterfaz

La DIAN comenzó a responder muchos envíos con el estado **"En proceso"** (código 98) en lugar de validar o rechazar el documento en el momento. Antes ese caso se veía como un documento no válido, sin AttachedDocument ni correo, y al reenviarlo la DIAN lo rechazaba por la regla 90 *"Documento procesado anteriormente"*. La plataforma ahora reconoce ese estado y lo resuelve de punta a punta:

* Toda respuesta de la API incluye el campo **`dian_status`** (`VALIDADA`, `RECHAZADA`, `EN_PROCESO` o `NO_ENCONTRADO`) con un mensaje de qué hacer. Si el documento quedó en proceso, la respuesta trae además la URL exacta de consulta y la espera sugerida. Los envíos del set de pruebas y por lote también lo reportan, con la URL de consulta por ZipKey.
* El **número queda reservado** mientras la DIAN decide: un reenvío con el mismo prefijo y número no sale a la DIAN, y los endpoints de consecutivo saltan los números en proceso. El reenvío puede forzarse con `ignore_document_in_process`.
* La [consulta de estado por CUFE](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-status-document-cufe-v-1/) cierra el ciclo cuando la DIAN confirma: genera el AttachedDocument, marca el documento como válido y envía el correo. Ya no falla con documentos cuyo adquiriente no está registrado en la plataforma.
* En la interfaz los documentos en proceso se resaltan en **amarillo**, con el botón **Consultar DIAN** por documento y **Consultar pendientes en la DIAN** para toda la página. El botón ESTADO desaparece: solo se marca como válido lo que la DIAN confirma.
* **Consulta automática**: una tarea programada revisa cada 10 minutos los documentos en proceso y los deja al día (requiere tener activo el cron de `schedule:run`).

note

**Al actualizar:** esta versión incluye migraciones de base de datos. Después de actualizar el código ejecute `php artisan migrate`. Vea el proceso completo en [Actualización](https://manual.facturalatam.com/apidian/actualizacion/).

#### Correo al adquiriente y AttachedDocument desde el listado

InterfazAPI

El envío del correo y la consulta del AttachedDocument ahora funcionan igual para todos los tipos de documento desde el listado de la empresa:

* Estado del correo y botón **Enviar / Reenviar** en facturas, notas, documentos equivalentes y documento soporte, mostrando a qué dirección se envía.
* Si el cliente no tiene correo registrado, la plataforma lo indica en lugar de fallar, y cualquier error de envío queda guardado y visible.
* Corregido el envío del correo al **empleado en nómina electrónica**, tanto al generar la nómina como desde la interfaz.
* Botón **Attached** para ver el AttachedDocument de cualquier tipo de documento, incluido el documento soporte. Para documentos anteriores a esta versión, la respuesta de la DIAN se recupera del archivo en disco.

#### Paso a producción: espera automática del set de pruebas

Interfaz

El asistente de paso a producción ahora acompaña toda la validación del set de pruebas sin intervención manual:

* Ya no se detiene cuando la DIAN responde "consulte más tarde": espera 25 segundos, reintenta cada 15 segundos hasta por 15 minutos y muestra el intento y el tiempo transcurrido.
* El **ZipKey se conserva en el navegador**: puede cerrar la página y retomar después con «Consultar ahora», o pegar el ZipKey de un envío anterior, sin reenviar el documento de prueba ni gastar consecutivos.
* El ambiente cambia a Producción **solo cuando la DIAN aprueba**. Si el tipo de documento ya está en producción, el asistente lo advierte, porque un ZipKey del set de pruebas nunca resolvería contra ese ambiente.
* La consulta del ZipKey usa la bandera del tipo de documento correcto (facturas o documentos equivalentes). Antes las facturas se consultaban como POS y quedaban "en proceso" indefinidamente en empresas con POS en producción.

#### Nueva plantilla gráfica para factura de venta

Interfaz

Se incorpora la **plantilla 14** para factura de venta, con datos completos del adquiriente, **lote y fecha de vencimiento por ítem**, atributos del producto y plan de pagos con su frecuencia. Los campos de lote y vencimiento se agregaron también a las plantillas existentes.

#### Fabricante del software en el lateral de la factura

API

Enviando `software_manufacturer` (razón social, NIT y nombre del software) en el JSON de la factura, la representación gráfica imprime en el margen lateral el texto "Fabricante Software y Proveedor tecnológico" en todas las plantillas de factura.

#### Mejoras para quienes integran desde su propio sistema

API

Ajustes en los endpoints más usados desde sistemas externos:

* Las notas crédito y débito, y la nota de ajuste de documento soporte, aceptan **`billing_reference.prefix`** con el prefijo de la factura referenciada, que se refleja en el XML y en el PDF.
* El endpoint de [próximo consecutivo](https://manual.facturalatam.com/apidian-1/post-api-ubl-2-1-next-consecutive-v-1/) compara el prefijo sin distinguir mayúsculas ni espacios y, cuando no existe la resolución, responde con un mensaje claro y la **lista de prefijos disponibles**.
* Nuevo endpoint `GET /api/ubl2.1/config/query/{nit}` que devuelve la configuración de la empresa (identificación, responsabilidades, ubicación, ambientes por tipo de documento y certificado), pensado para que el **facturador web (PRO3)** y otros sistemas importen la empresa desde la API.
* **Servidor de correo (SMTP) configurable por API**: `PUT /api/ubl2.1/config/smtp` registra el SMTP propio de la empresa del token (si se envía sin `mail_host`, la empresa vuelve al SMTP general). Para el SMTP general del servidor, `PUT /api/ubl2.1/config/smtp-global` lo escribe en el `.env`, autenticado con la clave `SMTP_ADMIN_TOKEN`.
* **Mensajes de error más claros**: la API ya no responde "Internal Server Error" genérico. Cada error llega con el código HTTP que le corresponde y una explicación en español de la causa (errores de base de datos, resoluciones con rango de numeración vacío, datos inválidos). Además, **toda respuesta fallida queda registrada** en `storage/logs/laravel.log` con la ruta, el usuario y los datos enviados (sin certificados ni contraseñas), para que soporte pueda ubicar el caso.
* **Adquirientes del exterior**: la dirección en el XML y en el PDF usa municipio y departamento en texto libre (`municipality_name`, `state_name`). Si no se envían, los campos quedan vacíos en lugar de mostrar datos de otro registro.

#### Correcciones destacadas

APIInterfaz

* **Evento RADIAN de reclamo (rechazo)**: la DIAN respondía AAH10 por los códigos del motivo; se restauraron los códigos `01` a `04` del anexo técnico.
* **Municipios**: se corrigió el código del facturador para todos los municipios del catálogo, alineándolos con el facturador web.
* **Notas de ajuste de documento soporte**: ya se guardan con el ambiente correcto.
* **Nómina electrónica**: se corrigió el nombre del empleador en el XML.
* **Anulación de factura desde la interfaz**: la nota crédito automática toma prefijo, número y fecha correctos y describe "Anulación de la factura" con el número anulado.
* **Extractor de documentos de compra**: la DIAN cambió el formato de fechas de su catálogo (ahora solo acepta `YYYY-MM-DD`) y las consultas devolvían cero documentos sin error. El extractor ya envía el formato nuevo.
* **Envío de correo por API** con copias (`email_cc_list`): corregido el error que impedía enviarlo.

### Agosto 2026

#### Mejoras en la API

API

* Nuevo endpoint `GET /api/ubl2.1/config/certificate` que devuelve el **certificado `.p12` de la empresa** autenticada en base64, con su nombre y fecha de vencimiento. Útil para respaldos y para sincronizarlo con otros sistemas.
* **Ambiente por tipo de documento**: los documentos equivalentes y la nómina se envían a la URL del ambiente de **su propio tipo de documento**, y la regeneración del AttachedDocument de notas y documento soporte consulta la URL del tipo correspondiente. Antes se usaba siempre la de factura, y una empresa con facturación en producción y nómina en habilitación (o al revés) obtenía errores de ambiente.
* **Nota de ajuste de nómina**: los datos bancarios (`bank_name`, `account_type`, `account_number`) solo se exigen con medios de pago bancarios; en efectivo ya no son obligatorios aunque sea una nota de reemplazo.
* **Resoluciones con rango vacío**: si la resolución registrada no tiene `from`/`to` válidos, la API lo indica con un mensaje claro en lugar de un error genérico de validación numérica.

#### Ajustes en las plantillas PDF

Interfaz

* **Base AIU** con el porcentaje calculado al lado del valor, en todas las plantillas de factura.
* Las plantillas tipo **ticket** (3 y 7) ocultan la fila de IVA cuando el valor es cero.
* Nuevo campo para mostrar los **atributos del producto** en las plantillas.

#### Compatibilidad con PostgreSQL

#### Compatibilidad con PostgreSQL

Instalación

La API ahora puede instalarse tanto sobre **MySQL/MariaDB** como sobre **PostgreSQL**. Si su infraestructura ya está montada sobre PostgreSQL, ya no necesita un servidor de base de datos adicional para operar la facturación electrónica.

La actualización incluye manuales de instalación paso a paso para ambos escenarios:

* [Manual PostgreSQL](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/MANUAL_POSTGRESQL.md?ref_type=heads) (instalación directa)
* [Manual PostgreSQL con Docker](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/MANUAL_POSTGRESQL_DOCKER.md?ref_type=heads)

#### Scripts y manuales de instalación renovados

Instalación

Se actualizó todo el proceso de instalación de la plataforma:

* Los scripts de instalación con Docker ahora instalan el **extractor de documentos de compra junto con la API**, sin configuración manual adicional — tanto en la instalación de solo API como en la de API + facturador web.
* Manuales de instalación **versión 2026** actualizados: [Linux Ubuntu 22.04/24.04](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Comandos%20Instalacion%20API%202026%20Linux%20Ubuntu%2022.md?ref_type=heads) y [Windows](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Comandos%20Instalacion%20API%202026%20Windows.md?ref_type=heads).
* En instalaciones sobre servidor LAMP (Ubuntu 22.04/24.04), el ajuste de compatibilidad de los **certificados digitales (.p12)** con las versiones recientes de OpenSSL ahora se aplica automáticamente durante la instalación.

Más detalle en la sección [Instalación](https://manual.facturalatam.com/apidian/instalacion/) del manual.

### Julio 2026

#### Extractor de documentos de compra disponible desde la API

API

El Extractor de documentos de compra (lanzado en mayo para la interfaz) ahora también puede consumirse **desde la API mediante nuevos endpoints**, pensado para quienes integran la plataforma desde sus propios sistemas:

* Autenticación con el **token de la empresa**: no es necesario enviar el certificado en cada llamada; se usa el que la empresa ya tiene configurado.
* Dos modos de consumo: una **llamada única** que devuelve toda la información procesada al terminar, o modo **asíncrono** con consulta de avance, ideal para rangos de fechas grandes.
* Permite extraer tanto los documentos **recibidos** (compras) como los **enviados**, y la respuesta entrega la información ya procesada: CUFE, emisor, totales, impuestos y detalle de ítems.
* Documentación de integración incluida para conectar el extractor a una instalación existente de la API: [despliegue e integración](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/EXTRACTOR_INTEGRACION.md?ref_type=heads) y [API del extractor](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/API_EXTRACTOR.md?ref_type=heads).

#### Eventos RADIAN indicando solo el CUFE

Interfaz

Desde la interfaz ahora es posible **registrar eventos RADIAN** (acuse de recibo, recibo del bien, aceptación, etc.) de una factura recibida **ingresando únicamente su CUFE**. Ideal para gestionar eventos de documentos que no fueron emitidos desde la plataforma.

#### Plantillas PDF configurables por tipo de documento

Interfaz

Cada empresa puede ahora asignar una **plantilla gráfica distinta para cada tipo de documento**: factura de venta, documento equivalente, nómina electrónica y documento soporte, todo desde la sección *Documentos Electrónicos* de la interfaz. Las notas crédito y débito usan automáticamente la plantilla configurada para facturas.

#### Proceso de habilitación de empresas más guiado

Interfaz

Mejoras en el asistente de creación de empresas desde la interfaz:

* Creación de resoluciones directamente desde la interfaz.
* Envío del set de pruebas de habilitación incluyendo **nota crédito**.
* Vista de JSON de ejemplo para facilitar la integración.
* Ejecución **automática** de los ajustes técnicos de habilitación (scripts URN), que antes requerían intervención manual.

### Junio 2026

#### Módulo de copias de seguridad

Interfaz

Nuevo módulo de **backups** en el panel de administración: los respaldos se generan en segundo plano sin afectar la operación, se administran desde la interfaz y el sistema depura automáticamente los archivos antiguos para no agotar el espacio en disco.

#### Monitoreo de recursos del servidor

InterfazInstalación

Nuevo sistema de **monitoreo** (contenedor independiente) que registra la saturación del servidor, las peticiones lentas y el **consumo de recursos por empresa**. Permite diagnosticar problemas de rendimiento y dimensionar el servidor con datos reales.

#### Estado del envío de correos al adquiriente

APIInterfaz

Ahora puede saber si el correo con la factura **llegó, falló o está pendiente**:

* Indicador visual del estado del envío en la interfaz.
* La respuesta de la API al emitir el documento incluye el resultado del envío del correo.
* Cada empresa puede configurar el **nombre y la dirección del remitente** con que salen sus correos.

#### Buscador y filtros en los documentos de cada empresa

Interfaz

El listado de documentos de la empresa incorpora una **barra de búsqueda con filtros** (facturas, nómina, documentos recibidos y eventos), con paginación mejorada. Encontrar un documento específico ahora toma segundos.

#### Regeneración de AttachedDocument

API

Nuevo endpoint de la API para **regenerar el AttachedDocument** (el XML que empaqueta la factura con la respuesta de la DIAN) de un documento ya emitido. Útil cuando el adjunto original no se generó correctamente, sin necesidad de reenviar el documento.

#### Sector salud: facturación sin contrato

API

Soporte para operaciones del sector salud **sin contrato asociado**, con los nuevos campos requeridos en la información adicional. En julio se complementó con la posibilidad de informar **varios pacientes** en un mismo documento (validación RIPS).

### Mayo 2026

#### Extractor de documentos de compra

InterfazAPI

Lanzamiento del **Extractor de documentos de compra**: un módulo que se conecta al catálogo de la DIAN y descarga automáticamente los documentos electrónicos de la empresa en un rango de fechas — tanto los **recibidos** (facturas de compra de sus proveedores) como los **enviados** — extrayendo su información completa: CUFE, emisor, fechas, totales, impuestos y detalle de ítems. Los documentos recibidos pueden además registrarse en **eventos RADIAN**.

Disponible **desde la interfaz** de la plataforma y también **vía API** (habilitado en julio): [ver documentación de la API del extractor](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/API_EXTRACTOR.md?ref_type=heads).

---

## Aviso de seguridad: clave de administración del API

Fuente: <https://manual.facturalatam.com/apidian/aviso-seguridad-rutas/>

Importante

Desde la actualización del **27 de octubre de 2026**, crear, consultar y eliminar empresas por el
API exige una **clave de administración**. Después de actualizar hay que crear esa clave: es un
solo bloque para copiar y pegar en la consola.

Facturar, enviar notas, nómina y eventos sigue funcionando igual.

Si su API está alojada por FacturaLatam, nosotros nos encargamos y no tiene que hacer nada.

Si acaba de instalar con el script de Docker

Desde el **30 de octubre de 2026** los scripts de instalación (`scripapi.sh` y `scripapi20.sh`)
crean la clave solos: la escriben en el `.env` como `PLATFORM_ADMIN_TOKEN` y la dejan en
`setup/private.txt`, bajo el título **CLAVE DE ADMINISTRACION DEL API**, junto a las demás claves
de la instalación. Antes de terminar, el script la comprueba y debe mostrar
`COMPROBACION: TODO CORRECTO`.

En una instalación así no hay que hacer los pasos 1 y 2: basta con
[entregar la clave](#paso-3-entregar-la-clave). Para volver a verla, ejecute
`docker exec -ti php_api php artisan api:admin-token`.

### Antes de empezar

Necesita entrar por consola (SSH) al servidor del API o, en Windows, abrir la **Terminal** de
Laragon. Son tres pasos: actualizar el API, crear la clave y entregarla.

En cada bloque, **cambie solo lo que está en MAYÚSCULAS** antes de pegarlo. Pegue un bloque a la
vez y espere a que termine antes de pegar el siguiente:

| En el bloque dice | Cámbielo por |
| --- | --- |
| `/RUTA/DEL/API` | La carpeta del API, donde está el archivo `artisan`. Por ejemplo `/var/www/html/apidian` |
| `CARPETA-DEL-API` | Solo en Windows: la carpeta del API dentro de `C:\laragon\www`. Por ejemplo `apidian` |
| `https://SU-DOMINIO-DEL-API` | La dirección de su API, por ejemplo `https://api.miempresa.com` |

En Docker los bloques usan `docker exec -ti php_api`, que funciona desde cualquier carpeta del
servidor: no hace falta buscar el `docker-compose.yml`. `php_api` es el nombre que el instalador le
da al contenedor del API; si un comando responde `No such container`, vea los nombres con
`docker ps --format "{{.Names}}"` y use el del contenedor PHP del API, no el de `nginx`, el de
`scheduling` ni el de la base de datos.

### Paso 1. Actualizar el API

**Docker**

```
cd /RUTA/DEL/API  
git pull origin master  
docker exec -ti php_api sh -c "php artisan optimize:clear && php artisan config:cache && php artisan migrate --force"
```

Si el git pull trajo cambios en el Dockerfile o en la carpeta docker/

Hay que reconstruir la imagen antes de seguir, como explica
[Actualización](https://manual.facturalatam.com/apidian/actualizacion/#si-la-instalaci%C3%B3n-corre-en-docker).

**Servidor Linux (LAMP)**

```
cd /RUTA/DEL/API  
git pull origin master  
php artisan optimize:clear  
php artisan config:cache  
php artisan migrate --force
```

**Windows con Laragon**

Abra Laragon, pulse el botón **Terminal** y pegue:

```
cd /d C:\laragon\www\CARPETA-DEL-API  
git pull origin master  
php artisan optimize:clear  
php artisan config:cache  
php artisan migrate --force
```

### Paso 2. Crear la clave

Un solo comando guarda una copia del `.env`, crea la clave, la muestra y comprueba la instalación.
Si lo ejecuta dos veces no crea una clave nueva: la vuelve a mostrar, así que sirve también para
consultarla más adelante.

**Docker**

```
docker exec -ti php_api php artisan api:admin-token
```

**Servidor Linux (LAMP)**

```
cd /RUTA/DEL/API  
php artisan api:admin-token
```

**Windows con Laragon**

```
cd /d C:\laragon\www\CARPETA-DEL-API  
php artisan api:admin-token
```

Copie la clave que aparece entre las dos líneas de `=====` y guárdela en un lugar seguro. El
comando termina con la comprobación: debe decir `COMPROBACIÓN: TODO CORRECTO`. Si dice otra cosa,
vea [Si algo falla al ejecutar los comandos](#si-algo-falla-al-ejecutar-los-comandos).

Si ya usaba el correo general

Si el `.env` ya tenía una clave en `SMTP_ADMIN_TOKEN` (la que pide el correo general,
`PUT /api/ubl2.1/config/smtp-global`), el comando reutiliza ese valor en lugar de crear otro y lo
avisa con `Se reutiliza la clave que ya estaba en SMTP_ADMIN_TOKEN`. Los sistemas que ya la
enviaban no tienen que cambiarla: basta con que la envíen también al crear, consultar y eliminar
empresas.

### Paso 3. Entregar la clave

Entregue la clave a quien administra los sistemas que crean, consultan o eliminan empresas en su
API. Esos sistemas deben enviarla en cada una de esas peticiones; las instrucciones para ellos
están en [Para quien desarrolla integraciones](#para-quien-desarrolla-integraciones).

Cuando la tengan configurada, crear o consultar una empresa desde ese sistema debe funcionar como
antes. Para volver a ver la clave sin cambiarla, repita el paso 2.

### Si su hosting no tiene consola

1. Abra el archivo `.env` del API con el administrador de archivos del hosting y agregue al final
   esta línea, con una clave larga inventada por usted, de letras y números, sin espacios:

   ```
   PLATFORM_ADMIN_TOKEN=UNA-CLAVE-LARGA-DE-LETRAS-Y-NUMEROS
   ```

   Si el `.env` ya tiene una línea `SMTP_ADMIN_TOKEN=` con algo escrito después del `=`, use ese
   mismo texto como clave.
2. Borre el archivo `bootstrap/cache/config.php` del API, si existe.
3. Entregue la clave como dice el paso 3.

### Si algo falla al ejecutar los comandos

| Lo que ve | Qué hacer |
| --- | --- |
| `REVISAR: el API todavía no ve la clave` o `REVISAR: el API rechaza su propia clave` | Ejecute `php artisan config:cache` y repita el paso 2 |
| `AVISO: la clave funciona, pero el modo temporal está activado` | Si no lo activó a propósito, siga [Volver a activar la seguridad](#volver-a-activar-la-seguridad) |
| `Command "api:admin-token" is not defined.` | El código no se actualizó. Revise el mensaje del `git pull` y vea [Actualización](https://manual.facturalatam.com/apidian/actualizacion/) |
| `Could not open input file: artisan` | No está en la carpeta del API. En Docker, entre al contenedor y escriba `cd /var/www/html` |
| `No such container: php_api` | Vea el nombre del contenedor como indica [Antes de empezar](#antes-de-empezar) |
| `Composer detected issues in your platform` | La consola usa una versión de PHP anterior a la del API. En Laragon: **Menú › PHP › Versión**, elija la versión del API y abra otra Terminal |

### Si un sistema deja de crear o consultar empresas

Es porque ese sistema todavía no envía la clave. Mientras lo actualizan, puede activar un **modo
temporal** que deja crear y consultar empresas sin la clave. Eliminar empresas la sigue pidiendo y
cada llamada sin la clave queda anotada en el log del API.

Docker:

```
cd /RUTA/DEL/API  
[ -n "$(tail -c1 .env)" ] && echo >> .env  
sed -i '/^ALLOW_PUBLIC_API_REGISTER=/d' .env  
echo 'ALLOW_PUBLIC_API_REGISTER=true' >> .env  
docker exec -ti php_api php artisan config:cache
```

Servidor Linux (LAMP):

```
cd /RUTA/DEL/API  
[ -n "$(tail -c1 .env)" ] && echo >> .env  
sed -i '/^ALLOW_PUBLIC_API_REGISTER=/d' .env  
echo 'ALLOW_PUBLIC_API_REGISTER=true' >> .env  
php artisan config:cache  
echo "Modo temporal activado"
```

Windows con Laragon: abra el `.env` del API con `notepad .env` desde la Terminal, agregue al final
la línea `ALLOW_PUBLIC_API_REGISTER=true`, guarde y cierre. Después ejecute `php artisan config:cache`.

Úselo solo mientras actualizan ese sistema. Cuando ya envíe la clave, vuelva a activar la
seguridad.

#### Volver a activar la seguridad

Docker:

```
cd /RUTA/DEL/API  
sed -i '/^ALLOW_PUBLIC_API_REGISTER=/d' .env  
docker exec -ti php_api sh -c "php artisan config:cache && php artisan api:admin-token --check"
```

Servidor Linux (LAMP):

```
cd /RUTA/DEL/API  
sed -i '/^ALLOW_PUBLIC_API_REGISTER=/d' .env  
php artisan config:cache  
php artisan api:admin-token --check
```

En Windows, borre esa línea del `.env` con `notepad .env` y ejecute los dos últimos comandos. En
los tres casos debe terminar con `COMPROBACIÓN: TODO CORRECTO`.

### Cambios que va a notar

* **Empresas nuevas:** al crear una empresa, la clave para entrar al panel ya no es el NIT. Aparece
  **una sola vez** al final del asistente de nueva empresa: guárdela.
* **Panel:** el asistente **Empresa › Nuevo** sigue funcionando sin la clave de administración.
* **Portales de clientes y empleados:** piden la clave cada vez que se abre una sesión nueva.
* **Correos antiguos:** el botón "Aceptar y/o Rechazar documento" de los correos enviados antes de
  esta actualización abre el portal del cliente y pide su clave.

### Para quien desarrolla integraciones

Cómo enviar la clave de administración en las peticiones

Envíe la clave en el header `X-Admin-Token` en estas peticiones:

| Ruta | Qué hace |
| --- | --- |
| `POST /api/ubl2.1/config/{nit}/{dv}` | Crear o actualizar una empresa |
| `GET /api/ubl2.1/config/query/{nit}` | Consultar los datos de una empresa |
| `POST /api/ubl2.1/config/delete/{nit}/{email}` | Eliminar una empresa |

Ejemplos:

```
## Crear o actualizar una empresa (datos.json lleva el cuerpo de siempre)  
curl -X POST "https://SU-DOMINIO-DEL-API/api/ubl2.1/config/900123456/7" \  
  -H "Accept: application/json" -H "Content-Type: application/json" \  
  -H "X-Admin-Token: <CLAVE_DE_ADMINISTRACION>" \  
  -d @datos.json  
  
## Consultar una empresa  
curl "https://SU-DOMINIO-DEL-API/api/ubl2.1/config/query/900123456" \  
  -H "Accept: application/json" -H "X-Admin-Token: <CLAVE_DE_ADMINISTRACION>"  
  
## Eliminar una empresa  
curl -X POST "https://SU-DOMINIO-DEL-API/api/ubl2.1/config/delete/900123456/correo@empresa.com" \  
  -H "Accept: application/json" -H "X-Admin-Token: <CLAVE_DE_ADMINISTRACION>"
```

Sin la clave, o con otra, la respuesta es `403` y el campo `message` dice qué falta:

| `message` empieza por | Qué hacer |
| --- | --- |
| `La instalación no tiene clave de administración.` | Ejecutar `php artisan api:admin-token` en el servidor del API |
| `Falta la clave de administración en el header X-Admin-Token.` | Agregar el header a la petición |
| `La clave de administración (X-Admin-Token) no es válida.` | Usar la misma clave que muestra `php artisan api:admin-token` |

También exigen el `X-Admin-Token` el correo general (`PUT /api/ubl2.1/config/smtp-global`), los
planes (`/api/ubl2.1/plan`) y los administradores (`/api/ubl2.1/administrator`).

### Detalle técnico

Para el equipo de sistemas: rutas que cambian, nombres de las claves y comandos opcionales

**Claves del `.env` del API**

| Clave | Qué hace |
| --- | --- |
| `PLATFORM_ADMIN_TOKEN` | Clave de administración. Debe llegar en el header `X-Admin-Token`. La crea `php artisan api:admin-token`, y `php artisan api:admin-token --check` solo comprueba que el API la vea y que la seguridad esté activa |
| `SMTP_ADMIN_TOKEN` | Nombre anterior de la misma clave. Se sigue aceptando |
| `ALLOW_PUBLIC_API_REGISTER` | Modo temporal. Sin definir o en `false`, crear y consultar empresas exigen la clave. En `true` también aceptan llamadas sin ella |

**Rutas que cambian**

| Rutas | Desde esta versión |
| --- | --- |
| Crear, consultar y eliminar empresa, rotar token, correo general, planes y administradores | Exigen el header `X-Admin-Token`. Crear y consultar dejan de exigirlo con `ALLOW_PUBLIC_API_REGISTER=true` |
| `signdocument`, `senddocument`, `statusdocument` y `statuszip` | Exigen el `api_token` de la empresa |
| Rutas que reciben un NIT: descargas, resoluciones, recarga de PDF y borrar por NIT | Solo responden si el NIT es de la empresa del token |
| `POST /api/accept-reject-document` | Eliminada. Los eventos se envían por `POST /api/ubl2.1/send-event` |
| `POST /api/send-email-customer` | Sin token, el correo va siempre al correo registrado del adquiriente |

**Quién sigue llamando sin la clave**

Mientras el modo temporal esté activado, cada creación o consulta de empresa sin el header queda
anotada en el log del día, con la ruta y la IP:

```
cd /RUTA/DEL/API  
grep -h "periodo de gracia" storage/logs/laravel-*.log | tail -20
```

**Opcional: cambiar el token de una empresa**

Las empresas nuevas reciben un `api_token` aleatorio. Las creadas antes de esta versión conservan
el suyo, que se calculó a partir del NIT. Cambiarlo lo vuelve aleatorio, pero el token anterior
deja de funcionar en ese momento: no lo ejecute sin coordinar antes con cada integración. El
comando pide confirmación y muestra el token nuevo de cada empresa.

```
cd /RUTA/DEL/API  
php artisan api:rotate-token 900123456  
php artisan api:rotate-token --derived
```

En Docker: `docker exec -ti php_api php artisan api:rotate-token --derived`.

Por API: `PUT /api/ubl2.1/config/rotate-token/{nit}` con el `X-Admin-Token`.

---

## Aviso de seguridad: actualización obligatoria de PHP

Fuente: <https://manual.facturalatam.com/apidian/aviso-seguridad-php/>

Importante

El **21 de octubre de 2026** el proyecto PHP publicó parches para dos vulnerabilidades críticas
(CVE-2026-109618 y CVE-2026-109619, puntuación CVSS 9.2) que permiten **ejecutar código de forma
remota, sin usuario ni contraseña**, en cualquier servidor PHP que atienda peticiones web. Afectan
a todas las versiones de PHP y no existe una mitigación completa: la única solución es actualizar.

**Toda instalación propia del API debe actualizarse cuanto antes.** Si su API está alojada por
FacturaLatam, nosotros nos encargamos y no tiene que hacer nada.

### Qué pasó

Las versiones corregidas son PHP 8.2.35, 8.3.36, 8.4.27 y 8.5.12. Las vulnerabilidades están en
el propio motor de PHP y afectan a PHP-FPM, Apache con mod\_php, php-cgi, FrankenPHP y LiteSpeed.
El equipo de PHP demostró un ataque completo contra Apache con mod\_php que se dispara antes de que
corra una sola línea de la aplicación. PHP 8.1 y anteriores ya no reciben versiones del proyecto.

Referencias oficiales: [aviso del proyecto PHP](https://www.php.net/archive/2026.php#2026-10-21-5)
y [aviso del NCSC del Reino Unido](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php).

### Qué cambia en el API

* La imagen Docker pasa a la imagen oficial `php:8.3.36-fpm-bookworm`. La anterior era una imagen
  de terceros con PHP 8.2.5 de 2023 que no recibía actualizaciones. Se eligió PHP 8.3 porque 8.2
  deja de recibir parches el 31 de diciembre de 2026.
* La imagen nueva conserva las mismas extensiones, Composer y los límites de PHP del API, y
  activa la compatibilidad con los certificados `.p12` de la DIAN en OpenSSL 3.
* **Ningún endpoint, campo ni respuesta cambia.** Sus integraciones siguen funcionando igual.
* No hace falta reinstalar las dependencias: todas cumplen con PHP 8.3.

### Cómo actualizar, según su instalación

#### Docker (instalación 2026)")

Hay que actualizar el código y **reconstruir** la imagen; un `pull` de imágenes no sirve porque
la imagen se construye en su servidor.

```
cd /ruta/del/api            # carpeta del código del API (donde está artisan y el .env)  
git pull origin master  
cd /ruta/del/compose        # carpeta donde está el docker-compose.yml (ver más abajo)  
docker compose build --no-cache php_api scheduling_api  
docker compose up -d php_api scheduling_api  
docker restart nginx_api  
docker compose exec php_api php artisan migrate      # cambios de base de datos que trajo el git pull  
docker compose exec php_api php artisan config:cache  
docker compose exec php_api php -v  
docker compose exec php_api php-fpm -i | grep -E '^(memory_limit|max_execution_time|pcre.backtrack_limit) '
```

El `php -v` debe mostrar `PHP 8.3.36` y la última línea, `4000M`, `800` y `5000000`: son los
límites de PHP que necesita el API, que la imagen fija en `docker/php-api.ini`. Si en cambio sale
`128M`, `30` y `1000000`, la imagen se construyó sin ese archivo y fallarán los PDF largos, la
nómina y los reportes con *Allowed memory size exhausted* o muriendo a los 30 segundos:
reconstruya con el código al día. El build descarga unos 500 MB y compila extensiones: cuente con
tres a cinco minutos.

Ubique primero su docker-compose.yml

Los comandos `docker compose` leen el archivo de la carpeta desde la que se ejecutan. El `git pull`
se hace en la carpeta del API, pero el `docker-compose.yml` con el que se levantó el API puede estar
**dentro de esa misma carpeta o fuera de ella** (por ejemplo en la carpeta padre, con el API en una
subcarpeta, o en otra ruta del servidor), según cómo se instaló. Ubíquelo y ejecute los comandos
`docker compose` desde allí.

Si no recuerda dónde quedó, pregúnteselo a Docker (reemplace `php_api` por el nombre de su
contenedor PHP si es distinto):

```
docker compose ls      # columna CONFIG FILES: ruta del .yml de cada proyecto levantado (solo Compose v2)  
docker inspect php_api --format '{{ index .Config.Labels "com.docker.compose.project.working_dir" }}'
```

También puede indicar el archivo en cada comando en vez de cambiar de carpeta:
`docker compose -f /ruta/docker-compose.yml build --no-cache php_api scheduling_api`. Si en su
servidor hay más de un `docker-compose.yml` (por ejemplo el del proxy o el de PostgreSQL), el que
hay que usar es el que define el servicio PHP del API.

Compruebe los nombres de sus contenedores

Los comandos de arriba usan los nombres del compose de ejemplo (`php_api`, `scheduling_api`,
`nginx_api`). En su instalación pueden llamarse distinto, por ejemplo con el dominio como sufijo
(`php_api_api_midominio_com`). Antes de ejecutarlos, vea los suyos con `docker compose ps` (o
`docker-compose ps`, con guion, si su instalación usa esa versión) y reemplace los nombres en los
comandos: el contenedor PHP del API, el del scheduler y el de nginx.

El `docker restart` de nginx evita un `502 Bad Gateway` que aparece cuando el contenedor PHP
cambia de IP interna al recrearse.

**No omita el `php artisan migrate`.** El `git pull` trae el código nuevo, pero las tablas y los
catálogos nuevos solo se aplican con ese comando, que se ejecuta **dentro del contenedor** PHP y
no en el servidor. Si no hay nada pendiente responde `Nothing to migrate` y no toca nada; si pide
confirmación por estar en producción, responda `yes`.

Si su instalación estaba muy atrasada y el `git pull` modificó `composer.lock`, ejecute además
`docker compose exec php_api composer install` **antes** del `php artisan migrate`. Para este
cambio de PHP en sí no hace falta: `vendor/` ya cumple con PHP 8.3. La rutina completa de
actualización está en [Actualización](https://manual.facturalatam.com/apidian/actualizacion/).

#### Ubuntu 22.04 con Apache y mod\_php (instalador LAMP)")

Es el caso de mayor riesgo. El repositorio de ondrej ya tiene PHP 8.3.36. Actualice **solo los
paquetes de PHP 8.3 que ya tiene instalados**:

```
sudo apt update  
sudo apt install --only-upgrade -y $(dpkg -l '*php8.3*' | awk '/^ii/{print $2}')  
sudo systemctl restart apache2               # o php8.3-fpm, si su servidor usa PHP-FPM  
php -v  
dpkg -l '*php8.3*' | awk '/^ii/{print $2, $3}'
```

`php -v` debe mostrar `PHP 8.3.36` y la última línea debe listar todos los paquetes, incluido
`libapache2-mod-php8.3`, en la versión `8.3.36`.

Este parche no toca el código del API, así que no exige migraciones. Si aprovecha para actualizar
también el código (`git pull origin master` en la carpeta del API), aplique allí mismo
`php artisan migrate` y después `php artisan config:cache`.

No use comodines con apt upgrade

Un comando como `apt upgrade 'php8.3*'` no actualiza lo instalado: apt aplica el comodín a
**todos** los paquetes del repositorio e intenta instalar decenas de extensiones que no tiene,
varias de las cuales se excluyen entre sí, y termina en error después de `Calculating upgrade...`.
Si prefiere actualizar todo el servidor, `sudo apt upgrade -y` sin argumentos también trae PHP
8.3.36; si después `php -v` sigue mostrando la versión anterior, use el comando de arriba.

#### Ubuntu 20.04, o imagen Docker antigua con PHP 7.2

No existe parche: el repositorio de ondrej ya no publica para Ubuntu 20.04 y PHP 7.2 no tiene
corrección. Hay que migrar, subiendo el servidor a Ubuntu 22.04 y reinstalando PHP 8.3, o pasando
a la instalación Docker 2026. Mientras tanto, restrinja el acceso al API por IP en el firewall.

#### Hosting compartido (Hostinger y similares)")

En hosting compartido la versión de PHP la administra el proveedor y usted no puede instalar
parches. En Hostinger **no hay que ejecutar nada**: según su página de estado, la corrección quedó
instalada en todos los servidores de hosting administrado el 22 de octubre de 2026 y los planes
Web, Agency y cPanel no requieren acción del cliente. Lo que sí debe hacer es **comprobar que su
sitio ya la tiene**:

1. En hPanel entre a *Websites*, pulse *Dashboard* junto al sitio donde corre el API y abra
   *PHP Info* en el menú lateral (puede escribirlo en el buscador del menú).
2. Arriba aparecen la versión de PHP y el campo **Build Date**. Una fecha del **21 de octubre de
   2026 o posterior** significa que el parche está aplicado.
3. Si el API está en una subcarpeta o en un subdominio, cree en esa carpeta un archivo
   `phpinfo.php` con el contenido `<?php phpinfo(); ?>`, ábralo en el navegador y revise los
   mismos datos. **Bórrelo al terminar.**
4. Si la fecha es anterior al 21 de octubre de 2026, abra un chat con el soporte de Hostinger y
   pida la actualización citando *php2shell* (CVE-2026-109618 y CVE-2026-109619).

No se guíe por el número de versión

Hostinger incorporó la corrección a la versión que ya corría cada sitio, así que PHP Info puede
seguir mostrando la versión anterior (su página de estado pone el ejemplo de 8.5.11 en vez de
8.5.12) y estar parcheada. Lo que cuenta es el *Build Date*. Tampoco sirve `php -v` por SSH:
muestra la versión del plan, no la de la carpeta donde corre el API.

Aproveche para revisar la rama de PHP en *PHP Configuration* (mismo menú lateral): el API funciona
en 8.3. hPanel ya no permite elegir 8.1 ni anteriores, y 8.2 deja de recibir parches el 31 de
diciembre de 2026. El cambio aplica a todos los sitios del plan, tarda un par de minutos y no se
puede deshacer fuera de la misma sesión; después emita un documento de prueba.

En otros proveedores de hosting compartido el procedimiento es equivalente: busque en su panel la
página de información de PHP, verifique la fecha de compilación o la versión (8.3.36 / 8.2.35) y,
si no está, pídale al proveedor que actualice. Los planes **VPS** de Hostinger no están cubiertos:
ahí PHP lo administra usted y aplica la sección de Docker o la de Ubuntu 22.04.

Fuentes: [estado de Hostinger](https://statuspage.hostinger.com/),
[cómo comprobar la versión de PHP en Hostinger](https://www.hostinger.com/support/5920192-how-to-check-the-php-version-in-hostinger/)
y [Hostinger deploys protections against php2shell](https://www.hostinger.com/blog/protecting-php2shell/).

#### Windows local (Laragon)")

No está expuesto a internet, por lo que el riesgo es bajo. Cuando pueda, sustituya el zip de PHP
por 8.2.35 o 8.3.36 desde [windows.php.net](https://windows.php.net/download/).

### Mientras no pueda actualizar

El equipo de PHP indica dos mitigaciones **parciales**, que reducen la exposición pero no dejan
la instalación segura: `session.upload_progress.enabled = 0` y `memory_limit = -1`, fijadas en
`php.ini` o con `php_admin_value` (nunca con `ini_set()` ni `.user.ini`) y reiniciando todos los
procesos de PHP. Si no puede ni actualizar ni mitigar, el NCSC recomienda desconectar el sistema
y revisarlo antes de volver a exponerlo.

### Cómo verificar que quedó bien

1. `php -v` muestra 8.3.36 (o 8.2.35). En Hostinger, el *Build Date* de *PHP Info* es del 21 de
   octubre de 2026 o posterior.
2. Emitir un documento de prueba y descargar su PDF.
3. Enviar el correo de ese documento.

Si en Docker aparece `Error al leer la fecha del certificado - datos corruptos` al emitir, la
imagen se construyó con un `Dockerfile` anterior al 21 de octubre de 2026: haga `git pull` y
reconstruya.

### Más detalle

* [Comunicado y detalle técnico](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Comunicado%20seguridad%20PHP%20oct-2026.md?ref_type=heads)
* [Errores frecuentes, entradas 16 y 17](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Errores%20frecuentes%20APIDIAN.md?ref_type=heads)

---

## ⚡ Rendimiento y velocidad

Fuente: <https://manual.facturalatam.com/apidian/rendimiento/>

Guía para responder con datos —y no con suposiciones— a la pregunta *¿por qué una factura tarda
más que antes?*, sobre todo al pasar de una instalación 2025 a la 2026.

El API cronometra cada emisión y reparte su tiempo por etapa (arranque, DIAN, PDF, firma,
AttachedDocument, correo, S3). La medición es **interna**: no aparece en ninguna pantalla, queda
guardada en la tabla `monitoring_slow_requests` para consultarla cuando haga falta.

Al actualizar

Esta versión incluye migraciones de base de datos. Después de actualizar el código ejecute
`php artisan migrate`. Si usa Docker, además hay que **reconstruir la imagen** para que quede
activo OPcache (ver el punto 1).

### 1. Active OPcache antes que nada

PHP 8.3 **sin** OPcache es más lento que PHP 7.4 **con** OPcache: recompila las clases del
proyecto en cada petición. Es la primera causa de que el 2026 se sienta más lento que el 2025.

En **Docker** ya viene activo de fábrica, pero hay que reconstruir la imagen, no solo reiniciarla:

```
docker compose build php_api scheduling_api  
docker compose up -d  
docker compose exec php_api php -i | grep -E "opcache.enable|memory_consumption"
```

**Sin Docker**, agregue estos valores al `php.ini` y reinicie php-fpm
(`systemctl restart php8.3-fpm`):

```
opcache.enable=1  
opcache.enable_cli=0  
opcache.memory_consumption=256  
opcache.interned_strings_buffer=16  
opcache.max_accelerated_files=20000  
opcache.validate_timestamps=1  
opcache.revalidate_freq=2
```

En Windows (Laragon, solo para pruebas) además hay que descomentar
`zend_extension=php_opcache.dll` en el `php.ini` de la versión 8.3 y reiniciar Apache.

Compruebe sobre php-fpm, no sobre la CLI

`php -i | grep opcache` ejecutado en consola siempre dirá que está apagado: en la CLI lo está a
propósito. Verifíquelo dentro del contenedor del API o con un `phpinfo()` temporal.

### 2. Mida la emisión por etapas

1. En el `.env`, baje el umbral para que se registren **todas** las peticiones y no solo las que
   pasan de 3 segundos:

   ```
   MONITOR_SLOW_REQUEST_MS=0
   ```

   ```
   php artisan config:clear
   ```
2. Emita **3 o 4 facturas reales**, mejor desde su software de facturación que desde Postman, para
   que el tiempo incluya la red.
3. Consulte el resultado en la base de datos:

   ```
   SELECT created_at, route, duration_ms, bootstrap_ms, query_count, query_time_ms,  
          stages, top_queries  
     FROM monitoring_slow_requests  
    ORDER BY id DESC  
    LIMIT 10;
   ```
4. Devuelva el umbral a su valor normal (`MONITOR_SLOW_REQUEST_MS=3000` o quite la línea) y vuelva
   a ejecutar `php artisan config:clear`.

Con el umbral en 0 se escribe una fila por petición

Déjelo así solo el rato que dure la medición. Las filas antiguas se borran solas a los días que
indique `MONITOR_RETENTION_DAYS` (7 por defecto).

#### Cómo leer el reparto

La columna `stages` trae los milisegundos de cada etapa y `top_queries` las consultas que más se
repitieron en esa petición.

| Etapa | Qué incluye | Si es la más alta |
| --- | --- | --- |
| **Arranque** (`bootstrap_ms`) | Desde que php-fpm recibe la petición hasta el primer middleware | Es entorno, no código: revise OPcache |
| **`dian`** | El envío completo al servicio de la DIAN, ida y vuelta | No depende del API: es la DIAN o la red del servidor |
| **`pdf`** | Plantilla, QR, logo y escritura del PDF | Plantillas con muchas líneas o un logo demasiado pesado |
| **`firma_xml`** | Guardar el XML firmado y comprimirlo | Disco lento |
| **`attacheddocument`** | Armar y firmar el AttachedDocument | Es otra firma XML: cientos de milisegundos son normales |
| **`correo`** | El envío del documento al cliente, que es **sincrónico** | Un SMTP lento hace esperar a quien factura |
| **`s3`** | La subida de los archivos del documento | La empresa tiene el almacenamiento en `s3` o `dual` |
| `query_time_ms` | La suma del tiempo de todas las consultas | La base de datos está lejos, saturada o con tablas enormes |

Si la suma de las etapas es mucho menor que `duration_ms`, el tiempo se está yendo en el arranque
y en el trabajo que no es etapa (validaciones, guardado del documento y armado de la respuesta con
los base64).

| Variable del `.env` | Para qué |
| --- | --- |
| `MONITOR_SLOW_REQUEST_MS` | Milisegundos a partir de los cuales se registra una petición. Por defecto `3000`; `0` registra todas. |
| `MONITOR_TRACK_QUERIES` | En `false` se siguen registrando las peticiones lentas, pero sin el detalle de consultas. |
| `MONITOR_RETENTION_DAYS` | Días que se conservan los registros. Por defecto `7`. |

### 3. Qué descartar antes de culpar al API

* **Dónde está la base de datos.** Una emisión lanza muchas consultas; lo que las convierte en
  segundos es que cada una viaje lejos. Con la base en otro host, en Docker Desktop o detrás de
  una VPN, el mismo trabajo puede costar segundos en lugar de décimas. Mírelo en `query_time_ms`.
* **El correo.** Para comprobar cuánto pesa, emita una factura con `"sendmail": false`.
* **El almacenamiento S3.** Con `storage_mode` en `s3` o `dual`, cada documento sube sus archivos
  **dentro** de la petición. Se ve en la etapa `s3`.
* **El ambiente de la DIAN.** Habilitación responde más lento que producción, así que no compare
  una instalación en habilitación contra otra en producción.
* **El límite de peticiones.** El grupo `api` admite 60 peticiones por minuto; en facturación
  masiva aparecen respuestas `429` y reintentos que se viven como lentitud.
* **Las tablas de auditoría.** `logs` guarda el cuerpo de cada llamada al API y no se purga sola.
* **Contenedores que no usa.** El `docker compose` del 2026 levanta también el programador de
  tareas y el worker del extractor (con Chrome). En un VPS pequeño le quitan CPU y memoria al API:
  si no usa el extractor, conviene no levantar ese servicio.
* **`pm.max_children` de php-fpm.** Si es muy bajo, las emisiones se encolan.

No use `config:cache` ni `route:cache` todavía

El proyecto aún lee algunos valores con `env()` en tiempo de ejecución y define rutas con
*closures*: con la configuración cacheada esas funciones se apagarían sin avisar. Después de
cambiar el `.env` ejecute únicamente `php artisan config:clear`.

### 4. Comparar con el API 2025

En el 2025 no existe el módulo de monitoreo, así que la comparación se hace sobre el tiempo total
que reporta su software de facturación, emitiendo **el mismo tipo de documento, con el mismo
número de líneas y en el mismo ambiente de la DIAN**.

El detalle completo del diagnóstico, con la comparación entre ambas versiones,
está en [esta guía](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Rendimiento%20y%20velocidad%20APIDIAN.md?ref_type=heads).

---

## 🗄️ Almacenamiento Externo S3

Fuente: <https://manual.facturalatam.com/apidian/almacenamiento-s3/>

Configura el almacenamiento externo de facturas en **Amazon S3** dentro del proyecto.
Sigue los pasos a continuación para dejarlo funcionando.

### 1. Ajustar las dependencias respectivas

Asegúrese de tener la API actualizada.

Antes de ejecutar los comandos, ingrese al contenedor Docker del API o al directorio del
proyecto. Por ejemplo, para acceder al contenedor use:

```
docker exec -ti (nombre_del_contenedor) bash
```

Ejecute luego los siguientes comandos:

```
composer update  
composer install  
chmod -R 777 storage bootstrap/cache vendor/mpdf/mpdf
```

### 2. Configurar las variables en el archivo `.env`

Agregue los siguientes campos y configure las credenciales respectivas:

```
FILESYSTEM_DRIVER=local   #local|s3 Configure el tipo de almacenamiento, en este caso s3  
  
AWS_ACCESS_KEY_ID=  
AWS_SECRET_ACCESS_KEY=  
AWS_DEFAULT_REGION=  
AWS_BUCKET=  
AWS_ENDPOINT=  
AWS_USE_PATH_STYLE_ENDPOINT=false
```

### 3. Limpiar y regenerar la configuración

Luego de guardar los cambios en el archivo `.env`, ejecute:

```
php artisan config:clear  
php artisan cache:clear  
php artisan config:cache
```

Estos comandos permitirán aplicar correctamente la nueva configuración y activar los
cambios en el proyecto.

---

## 🧾 Responsabilidades tributarias

Fuente: <https://manual.facturalatam.com/apidian/responsabilidades-tributarias/>

Las responsabilidades tributarias son las obligaciones fiscales que declara cada parte del documento
electrónico: la empresa emisora, el adquiriente, el proveedor del documento soporte y las partes de
entrega. En el RUT salen en la **casilla 53 – Responsabilidades, Calidades y Atributos** y el anexo
técnico de la DIAN las pide en el elemento `cbc:TaxLevelCode` de `cac:PartyTaxScheme`.

Un tercero puede cumplir **varias a la vez** (por ejemplo gran contribuyente y autorretenedor). Por eso,
además del campo de siempre `type_liability_id` —una sola—, existe `type_liability_ids`, un arreglo con
todas las que marque ese tercero.

### El catálogo

Son los registros de la tabla `type_liabilities` del API. Los ids de una instalación estándar:

| id | Código | Nombre |
| --- | --- | --- |
| 7 | O-13 | Gran contribuyente |
| 9 | O-15 | Autorretenedor |
| 14 | O-23 | Agente de retención en el impuesto sobre las ventas |
| 112 | O-47 | Régimen Simple de Tributación – SIMPLE |
| 117 | R-99-PN | No aplica – Otros |

note

`R-99-PN` es el valor que se usa cuando el tercero no informa ninguna responsabilidad, así que **no
acompaña a las demás**: cuando se envían varias responsabilidades reales, el API lo descarta del
`cbc:TaxLevelCode`.

### Responsabilidades de la empresa emisora

Se registran una sola vez en la configuración de la empresa y valen para todos sus documentos.

`POST`/`PUT` `/api/ubl2.1/config/{nit}/{dv}`

```
{  
    "type_document_identification_id": 6,  
    "type_organization_id": 1,  
    "type_regime_id": 1,  
    "type_liability_id": 14,  
    "type_liability_ids": [7, 9],  
    "business_name": "EMPRESA DE PRUEBA SAS",  
    "merchant_registration": "0000000-00"  
}
```

* `type_liability_id`: la responsabilidad principal. Sigue siendo obligatoria.
* `type_liability_ids`: las demás. Se combinan con la principal y se eliminan los repetidos, así que no
  hace falta volver a incluirla en el arreglo.
* Si no hay responsabilidades adicionales envíe `null`, `[]` o no envíe el campo: las tres formas se
  entienden como "ninguna" y el documento sale con la responsabilidad principal.

Las responsabilidades guardadas también se devuelven en la consulta de configuración de la empresa
(`GET /api/ubl2.1/config/query/{nit}`), con la que otros sistemas importan la empresa desde el API.

#### Desde el panel

En **Empresa › Nueva empresa**, la principal se elige en **Tipo Responsabilidad** y las demás en
**Responsabilidades adicionales**, un campo de selección múltiple debajo de la fila
**Tipo Responsabilidad / Organización / Régimen**. Para quitar una se pulsa la **×** de su etiqueta.

![Campo Responsabilidades adicionales desplegado en el primer paso del asistente de nueva empresa](https://manual.facturalatam.com/assets/images/44-nueva-empresa-responsabilidades-42b1c58b211a516094ce9bb49e5f93c9.png)

El mismo campo está en **Editar Empresa**, pestaña *Información de la Empresa*, del listado de empresas.
Y al cargar la **Ficha RUT** en el asistente, el API lee la casilla 53 y marca solas todas las
responsabilidades que encuentre: la de mayor prioridad queda en **Tipo Responsabilidad** y el resto en
**Responsabilidades adicionales**.

### Responsabilidades del cliente y de las demás partes

Van en el cuerpo de cada documento, dentro del objeto de la parte que corresponda:

| Parte | Campo |
| --- | --- |
| Adquiriente (facturas, notas, documentos equivalentes) | `customer.type_liability_ids` |
| Proveedor (documento soporte y su nota de ajuste) | `seller.type_liability_ids` |
| Tercero de entrega | `deliveryparty.type_liability_ids` |

Ejemplo de una factura (`POST /api/ubl2.1/invoice`):

```
{  
    "number": 990000001,  
    "type_document_id": 1,  
    "customer": {  
        "identification_number": "900428042",  
        "dv": "1",  
        "name": "TAMPAC TECNOLOGIA EN AUTOMATIZACION SAS",  
        "phone": "3001234567",  
        "address": "CALLE 1 # 1 - 1",  
        "email": "cliente@ejemplo.com",  
        "type_document_identification_id": 6,  
        "type_organization_id": 1,  
        "type_regime_id": 1,  
        "municipality_id": 1006,  
        "type_liability_id": 14,  
        "type_liability_ids": [7, 9]  
    }  
}
```

El campo es opcional y se valida igual en todos los tipos de documento: factura, factura de exportación,
mandato, transporte, AIU, contingencias, notas crédito y débito, documento equivalente, documento soporte
y la regeneración de PDF. Si alguno de los ids no existe en el catálogo, el API responde con el error de
validación del campo.

### Cómo queda en el XML

Los códigos se envían en un solo `cbc:TaxLevelCode`, separados por punto y coma y ordenados por el id del
catálogo, no por el orden en que se enviaron. El atributo `listName` es el código del régimen
(`type_regime_id`): `48` responsable de IVA, `49` no responsable.

Con el `customer` del ejemplo anterior (`type_liability_id: 14` más `type_liability_ids: [7, 9]`):

```
<cac:PartyTaxScheme>  
    <cbc:RegistrationName>TAMPAC TECNOLOGIA EN AUTOMATIZACION SAS</cbc:RegistrationName>  
    <cbc:CompanyID schemeID="1" schemeName="31">900428042</cbc:CompanyID>  
    <cbc:TaxLevelCode listName="48">O-13;O-15;O-23</cbc:TaxLevelCode>  
    ...  
</cac:PartyTaxScheme>
```

El mismo valor se informa en el `AttachedDocument` (`ad*.xml`), en la parte de entrega, en el emisor del
documento soporte y en los eventos RADIAN.

### Cómo queda en el PDF

La representación gráfica imprime los **nombres** de las responsabilidades separados por coma, tanto en
los datos del emisor del encabezado como en los del adquiriente:

```
Responsabilidad: Gran contribuyente, Autorretenedor, Agente de retención en el impuesto sobre las ventas
```

Si el tercero solo informó `type_liability_id`, se imprime el nombre de esa única responsabilidad.

Si su sistema guarda una sola responsabilidad por tercero

El API acepta varias por tercero, pero quien envía los documentos tiene que guardarlas y mandarlas. Si el
sistema que integra (por ejemplo el Facturador PRO) guarda **una sola** responsabilidad en la ficha del
cliente, en los documentos llegará solo esa aunque el cliente cumpla varias: hay que habilitar el campo
múltiple también allá y enviarlo en `type_liability_ids`.

---

## Errores frecuentes

Fuente: <https://manual.facturalatam.com/apidian/errores-frecuentes/>

Soluciones a los problemas más comunes de instalación y operación del API.

* [Ver manual aquí](https://git.buho.la/facturalatam/apidian/co-apidian2026/-/blob/master/docs/Errores%20frecuentes%20APIDIAN.md?ref_type=heads)

---

## Descargar Collection Para POSTMAN

Fuente: <https://manual.facturalatam.com/apidian/collectionPostman/>

#### Ejemplos para la API / Collection POSTMAN

* Descargar Postman [Aquí](https://www.postman.com/downloads/)
* Ver ejemplos en sitio web. [Aquí](https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ)
  (Puede descargar los ejemplos a Postman desde el boton superior derecho "RUN in postman")
