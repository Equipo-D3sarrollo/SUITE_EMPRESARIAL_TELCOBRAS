# Video: extractor de facturas de compras de la DIAN (Python + Flask)

> Transcripción entregada por el usuario el 10-nov-2026. El original son subtítulos autogenerados
> de YouTube, ya limpiados y sin marcas de tiempo. El usuario corrigió términos mal captados (DIAN,
> scraping, Flask, Docker Compose, PostgreSQL, ERP, RADIAN). El enlace del video y del repositorio
> no venían en la transcripción.
>
> Relación con APIDIAN: el video presenta la **primera versión** de la utilidad. La documentación
> oficial la incorpora después como **Extractor V2**, un servicio aparte del API (ver
> `../ANALISIS_APIDIAN.md` §4). Los registros de ejemplo de la colección Postman muestran rutas
> de una carpeta llamada `facturalatam-scraperv2`.

## Introducción

Esta nueva utilidad sirve para extraer facturas de compras desde el portal de la DIAN.
Desarrollamos este pequeño script porque algunos usuarios nos pedían un proceso que les permitiera
acceder a sus facturas de compras de manera rápida, sin tener que entrar directamente al portal de
la DIAN. Con este mecanismo las facturas de compra se pueden descargar directamente.

## Requisitos

El primer requisito es tener el certificado digital de la empresa de la que se quiere extraer la
información. Para entrar al portal de la DIAN hay que cargar el certificado digital, el NIT de la
empresa, etcétera. Por eso el script lo necesita para loguearse.

Preparamos un script que hace algo similar, pero desde una aplicación externa, con una técnica
llamada scraping. Esta técnica permite conectarse o loguearse en una página con un robot o script.
Para entrar al portal se requiere el certificado digital y su contraseña.

Si facturan con el portal gratuito de la DIAN, ese certificado no sirve: tiene que ser un
certificado para software propio. Con eso ya se puede extraer la data de las facturas.

## Tecnologías utilizadas

- **Python**, porque ofrece herramientas muy sencillas para extraer datos de páginas web mediante
  scraping.
- **Docker**, para empaquetar y desplegar la aplicación.
- **PostgreSQL** como base de datos. Se puede cambiar por MySQL u otra.
- **Flask**, un pequeño framework (MVC) que permite crear rápidamente un mini servidor web. Con él
  se expone en una página sencilla la información extraída de la DIAN.

## Casos de uso

- **Reportes e indicadores de inteligencia de negocios.** Un usuario necesitaba la data para
  generar reportes con herramientas como Power BI, Tableau o QlikView. La empresa ya generaba
  facturas electrónicas con otro proveedor. Él solo quería extraer la información para hacer
  reportes estadísticos, ya que era especialista en Power BI.
- **Extracción 100 % efectiva.** Otro usuario extraía las facturas de compras desde los correos
  con tecnologías de Microsoft, pero no era totalmente efectivo. Algunas facturas no llegaban al
  correo, aunque sí figuraban en el portal de la DIAN. Con esta utilidad se trae la data
  directamente del portal, como si entraras a loguearte. Por eso sí es efectivo al 100 %.
- **Eventos RADIAN más automáticos.** Si ya tienes las facturas de compra extraídas y en una
  bandeja, puedes generar los eventos RADIAN rápidamente. Ya no tienes que extraer los correos ni
  cargar los XML.
- **Carga de compras al ERP.** Normalmente hay que digitar el contenido de las facturas en el
  módulo de compras del ERP, o cargar el XML que llega de la factura. Con este script puedes tomar
  directamente los registros extraídos de la DIAN y enviarlos a la base de datos del ERP, al
  módulo de compras.

## Demo

### Acceso al código e instalación

Todo el código está en un repositorio. El acceso está en la descripción del video. En el README
del repositorio se ven las tecnologías usadas y la funcionalidad, incluido el certificado digital
de la empresa como requisito.

Como todo está dockerizado, se puede levantar en Linux o en Windows. Para Windows existe Docker
Desktop, que se instala como cualquier programa y permite ver los contenedores en ejecución desde
un panel.

Pasos del manual de instalación:

1. Clonar el repositorio.
2. Entrar a la carpeta del repositorio.
3. Construir según el docker-compose, que tiene mapeados todos los servicios del proyecto
   (servidor web, base de datos, etcétera).
4. Levantar el proyecto con `docker compose up`. Se detiene con `down`.

Los comandos son los mismos en Windows y en Linux. Esa es la ventaja de Docker: empaquetar
aplicaciones para desplegarlas en distintos entornos.

Al ejecutar el comando, Docker Desktop lista el nuevo contenedor. Tiene dos servicios: uno para la
base de datos y otro para el scraper o servicio de extracción. El panel muestra el puerto de
acceso, y al abrirlo ya está cargada la aplicación.

### Uso de la utilidad

Una vez levantado el servicio, solo hay que configurar:

- el certificado digital,
- su contraseña,
- el NIT de la empresa,
- y el rango de fechas a extraer.

Para comparar la data, el presentador también entra al portal de la DIAN con el NIT de la empresa
y revisa la sección de documentos. Allí se ven todos los documentos enviados y recibidos. Son
bandejas muy similares, con la misma estructura de columnas, paginación y filtros. Por eso el
script sirve tanto para compras como para ventas.

### Ejemplo

En el portal se ven facturas del 19 de mayo de 2025: la 127, 126, 125, 124 y 123. Luego, al
retroceder en las páginas, el listado salta del 19 al 15, y así sucesivamente.

En el extractor se carga el certificado, se escribe la contraseña y se filtra desde el 18 hasta el
día de hoy (20). Si las credenciales son correctas, tarda unos 3 o 4 segundos en extraer la
información y además agrega un pequeño gráfico estadístico.

Resultado:

- Extrajo tres páginas en ese rango de fechas.
- La primera factura que trae es la 127 del día 19, incluso con la hora. Coincide con la del
  portal.
- Las siguientes son la 126, la 125 y la que termina en 124, también iguales al portal.
- El gráfico de torta discrimina por tipo de documento: 20 de tipo factura y 1 de documento
  equivalente POS. Al buscarlo en el portal, es el documento equivalente POS 281, también del 19
  de mayo de 2025.

Con esto se comprueba que la utilidad extrae todos los documentos que estén en el portal, no solo
las facturas: facturas, documentos POS, nómina electrónica, etcétera. Es decir, hace un barrido de
todo lo que encuentre en el portal de la DIAN.

El proceso es muy rápido: no demora ni 3 o 4 segundos. También se puede elegir un rango de fechas
más amplio, que tardará algo más pero funciona. Una recomendación es extraer la información una
vez a la semana, barriendo cada semana y almacenándola en la base de datos.

## Cierre

La utilidad y el acceso al repositorio están en el primer comentario del video. Esta es la primera
versión del script. Van a seguir actualizándolo y agregando las mejoras que los usuarios
recomienden.
