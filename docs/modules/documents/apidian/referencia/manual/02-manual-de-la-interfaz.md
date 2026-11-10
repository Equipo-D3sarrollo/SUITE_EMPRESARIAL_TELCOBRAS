# Manual de la interfaz (panel)

> Copia íntegra del manual oficial de APIDIAN (FacturaLatam), descargada el 10-nov-2026 desde https://manual.facturalatam.com. Solo se censuraron tokens y secretos, se recortaron los base64 largos y se volvieron absolutos los enlaces e imágenes. Cada página conserva su URL de origen.

Páginas incluidas: 11.

## Contenido
- Introducción y acceso al panel — <https://manual.facturalatam.com/interfaz/>
- Asistente IA — <https://manual.facturalatam.com/interfaz/asistente-ia/>
- Completar la configuración — <https://manual.facturalatam.com/interfaz/configuracion-inicial/>
- Crear una empresa — <https://manual.facturalatam.com/interfaz/crear-empresa/>
- Documentos electrónicos — <https://manual.facturalatam.com/interfaz/documentos-electronicos/>
- Listado de empresas — <https://manual.facturalatam.com/interfaz/empresas/>
- Extractor de documentos de compra — <https://manual.facturalatam.com/interfaz/extractor-compras/>
- Monitoreo y Backups — <https://manual.facturalatam.com/interfaz/monitoreo-backups/>
- Paso a producción — <https://manual.facturalatam.com/interfaz/paso-a-produccion/>
- Resoluciones y plantillas — <https://manual.facturalatam.com/interfaz/resoluciones-plantillas/>
- Usuarios, correo y almacenamiento — <https://manual.facturalatam.com/interfaz/usuarios-correo-almacenamiento/>

---

## Introducción y acceso al panel

Fuente: <https://manual.facturalatam.com/interfaz/>

El panel es la parte visual de la plataforma de facturación electrónica. Desde ahí registras
empresas, cargas su certificado digital, registras el software y las resoluciones de la DIAN,
revisas los documentos que se han emitido, descargas sus PDF y XML, y gestionas usuarios, correo
y almacenamiento.

Este manual solo habla de pantallas: qué hay en cada una, qué significa cada columna y qué hace
cada botón. Si lo que buscas es integrar tus propios sistemas con la plataforma, eso se explica
en la **Referencia API**, no aquí.

Todo este manual está hecho en Habilitación

Las capturas se tomaron con una empresa de pruebas en el ambiente de **Habilitación**, el
ambiente que la DIAN usa para validar que tu facturación funciona antes de permitirte emitir de
verdad. Nunca pruebes nada de lo que leas aquí en una empresa que ya esté en **Producción**:
cada documento que se envía en producción es una factura real y consume un consecutivo que no se
puede recuperar.

### Cómo entrar

Abre la dirección del panel en tu navegador. Verás la pantalla **Iniciar Sesión**, con el aviso
*Acceso solo para administradores de cuentas*.

![Pantalla Iniciar Sesión con los campos Dirección de Correo y Contraseña y el botón Iniciar Sesión](https://manual.facturalatam.com/assets/images/01-login-4470d35c89570b277bff51f9e051a852.png)

| Control | Qué hace |
| --- | --- |
| **Dirección de Correo** | El correo de tu cuenta del panel. |
| **Contraseña** | La contraseña de esa cuenta. |
| **Recordarme** | Mantiene la sesión abierta en ese navegador. |
| **Iniciar Sesión** | Entra al panel. |

Fíjate en lo que **no** hay: no hay enlace para registrarse ni para recuperar la contraseña. Las
cuentas del panel las crea quien administra la plataforma; si no puedes entrar, pídele a esa
persona que te restablezca el acceso.

La primera vez: Configuración Inicial

En una instalación recién hecha todavía no existe ningún administrador, así que el panel no
muestra el login sino la pantalla **Configuración Inicial**, donde se registran el nombre, el
correo y la contraseña del administrador de la plataforma. Se abre con el enlace temporal que
genera `php artisan setup:token` en el servidor, y al guardar las credenciales se entra al panel.
El detalle está en [Novedades](https://manual.facturalatam.com/apidian/novedades/).

### El menú lateral

Una vez dentro, el menú de la izquierda es tu punto de partida.

![Menú lateral del panel con Empresas, Documentación, Monitoreo, Backups y Logs](https://manual.facturalatam.com/assets/images/34-menu-lateral-fc834d3208f59f9a0dc94c49c588f0e2.png)

| Opción | Para qué sirve |
| --- | --- |
| **Empresas** | El listado de tus empresas. Es la pantalla principal y desde ella se llega a todo lo demás. |
| **Documentación** | Accesos de ayuda y herramientas de la plataforma, y este mismo manual embebido en el panel. |
| **Monitoreo** | Estado del servidor y de los servicios. |
| **Backups** | Respaldos de las empresas. |
| **Logs** | Registro técnico de errores. |

Solo administrador de la plataforma

**Monitoreo**, **Backups** y **Logs** solo aparecen si entras como administrador de la
plataforma. El usuario de una empresa no los ve, y es normal: su menú es más corto; si escribe
la dirección `/logs` a mano, el panel responde *403*.

En el celular el menú no está fijo a la izquierda: arriba a la izquierda aparece el botón **☰**,
que lo abre a pantalla completa y lo vuelve a cerrar. La campanita y tu avatar quedan en esa misma
barra, a la derecha.

![Menú lateral abierto en el celular, con el botón de menú, la campanita y el avatar en la barra superior](https://manual.facturalatam.com/assets/images/47-menu-movil-75eee5f82ad74a6c290094784353f1e4.png)

Cuando entras en una empresa concreta, el menú lateral cambia y muestra **Listado de
documentos**, **Eventos RADIAN** y **Nominas emitidas**, que son las vistas de esa empresa. Para
volver al listado general usa el botón **Volver** de la esquina superior derecha o haz clic en
**Apidian** arriba del menú.

### La campanita de avisos

Arriba a la derecha, en el encabezado, hay una campanita con un contador. Reúne lo que conviene
revisar de tus empresas: el administrador de la plataforma ve los avisos de todas; cualquier otro
usuario, solo los de las suyas.

![Panel de avisos desplegado con dos avisos de documentos sin confirmar por la DIAN](https://manual.facturalatam.com/assets/images/36-campanita-avisos-0adb576b6a29e2f09a59f6a60e47a49c.png)

| Aviso | Cuándo aparece y a dónde lleva |
| --- | --- |
| **Certificado** | El certificado de firma vence en los próximos 30 días o ya venció. Abre [Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/). |
| **Resolución** | Una resolución en uso vence en los próximos 30 días o ya venció. Dice de qué servicio es y con qué prefijo, y abre [Resoluciones](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/). |
| **Documentos sin confirmar** | La empresa tiene documentos de los últimos 30 días que la DIAN nunca confirmó. Abre el [listado de documentos](https://manual.facturalatam.com/interfaz/documentos-electronicos/) ya filtrado por ese estado. |

Cada aviso trae el nombre y el NIT de la empresa, así que sabes sobre cuál hay que actuar. El
contador se pone en rojo cuando algo ya venció o le quedan 7 días o menos. Las resoluciones que
ya fueron reemplazadas por otra del mismo tipo y prefijo no se avisan.

También llega por correo

Los vencimientos de certificado y resolución se avisan además por correo al usuario dueño de la
empresa, con el servidor de correo propio de la empresa si lo tiene configurado. Los documentos
sin confirmar solo se avisan en pantalla.

### Qué ve cada rol

El panel es el mismo para todos, pero no todos ven lo mismo.

| Rol | Qué ve |
| --- | --- |
| Administrador de la plataforma | Todas las empresas registradas, el botón **Nueva empresa**, la acción **Eliminar** de una empresa y las opciones **Monitoreo** y **Backups**. |
| Usuario de una empresa | Solo su empresa. Si intenta abrir otra, el panel responde *No tienes acceso a esta empresa*. |

A lo largo del manual, cada vez que una pantalla sea exclusiva del administrador de la
plataforma lo verás marcado con un aviso como el de arriba.

### Por dónde seguir

1. [Listado de empresas](https://manual.facturalatam.com/interfaz/empresas/) — buscar, filtrar, leer los estados y abrir el menú de acciones de una empresa.
2. [Crear una empresa](https://manual.facturalatam.com/interfaz/crear-empresa/) — el asistente de cinco pasos y la carga de la Ficha RUT.
3. [Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/) — certificado, software y resolución, los tres requisitos para poder emitir.
4. [Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/) — las pestañas por tipo de documento y el listado con sus descargas y acciones.
5. [Resoluciones y plantillas](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/) — numeración autorizada por la DIAN y diseño del PDF.
6. [Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/) — qué hace el asistente y por qué conviene no tocarlo hasta estar seguro.
7. [Extractor de documentos de compra](https://manual.facturalatam.com/interfaz/extractor-compras/) — traer de la DIAN las facturas que te emitieron y registrar eventos RADIAN.
8. [Usuarios, correo y almacenamiento](https://manual.facturalatam.com/interfaz/usuarios-correo-almacenamiento/) — quién entra a la empresa, desde qué correo salen los documentos y dónde se guardan los archivos.
9. [Monitoreo y Backups](https://manual.facturalatam.com/interfaz/monitoreo-backups/) — estado del servidor, picos de saturación y copias de seguridad de los archivos. Solo administrador de la plataforma.
10. [Asistente IA](https://manual.facturalatam.com/interfaz/asistente-ia/) — el panel lateral de ayuda que responde con este manual, cómo preguntarle por voz y cómo se activa con su token en el `.env`.

---

## Asistente IA

Fuente: <https://manual.facturalatam.com/interfaz/asistente-ia/>

El panel tiene un asistente que responde preguntas sobre la plataforma **usando únicamente este
manual**: el de las pantallas y el de los servicios. No inventa: cada respuesta trae el enlace a la
página de la documentación de donde salió y, cuando la hay, la captura de esa pantalla o el JSON
que se envía al servicio.

Lo usa cualquier cuenta con la sesión iniciada. Configurarlo, en cambio, es cosa de quien
administra el servidor: se hace en el archivo `.env` y hasta que no se ponga el token el asistente
no aparece.

### El botón y el panel

Cuando el asistente está activo, en la esquina inferior derecha de **todas** las pantallas del
panel hay un botón redondo con una diadema de soporte, acompañado al principio del aviso
*¿Necesita ayuda? Pregúntele al asistente*.

![Listado de empresas con el botón del asistente en la esquina inferior derecha](https://manual.facturalatam.com/assets/images/40-asistente-burbuja-0546d5c9d9ac41b733fc4b1a02293b3d.png)

Al hacer clic, el chat entra deslizándose desde el borde derecho y ocupa todo el alto de la
pantalla, sin sacarte de donde estabas. El resto del panel queda atenuado detrás.

![Listado de empresas con el panel del asistente abierto a la derecha, con el saludo, las preguntas frecuentes, el micrófono y la caja para escribir](https://manual.facturalatam.com/assets/images/40-asistente-panel-56a7e5d44a56b1bab66bd1b957dd05de.png)

Se cierra de tres formas: con la **×** del encabezado, pulsando fuera del panel o con la tecla
**Esc**.

| Control | Qué hace |
| --- | --- |
| **Preguntas frecuentes** | Cinco preguntas de ejemplo. Al hacer clic en una se envía tal cual. Desaparecen con la primera pregunta. |
| La caja de texto | Escribe tu pregunta con tus palabras, hasta 500 caracteres. **Enter** la envía y **Mayús + Enter** salta de línea. |
| El micrófono | Dicta la pregunta en vez de escribirla. Ver [Preguntar por voz](#preguntar-por-voz). |
| **Enviar** | Envía la pregunta. Mientras el asistente redacta, el chat muestra una burbuja con tres puntos animados y la palabra *Pensando...* |
| **Limpiar** | Borra la conversación y vuelve el saludo con las preguntas frecuentes. |
| El icono de la esquina del encabezado | Abre el manual completo en una pestaña nueva. |
| **×** | Cierra el panel. La conversación **no** se pierde: ver [La conversación te sigue](#la-conversaci%C3%B3n-te-sigue). |

Desde la pantalla **Documentación** hay además un botón **Preguntar al asistente**, que abre ese
mismo chat.

![Pantalla Documentación con el botón Preguntar al asistente y el manual embebido](https://manual.facturalatam.com/assets/images/38-asistente-documentacion-5c1a3b4fc45ad7e0a6293067ada0b6b0.png)

#### Cómo son las respuestas

Todas siguen la misma estructura, y las partes que no aplican simplemente no aparecen:

1. Una frase que resume **qué se hace y dónde**.
2. **En el panel**: el paso a paso, con el nombre exacto de cada menú, botón y campo.
3. **Por el API**: la ruta y el método del servicio, **qué cabecera lleva**
   (`Authorization: Bearer {api_token}`, o `X-Admin-Token` en las rutas de administración de la
   plataforma) y el **JSON de ejemplo** recortado a los campos de los que habla.
4. **Tenga en cuenta**: las advertencias del manual (lo que no se puede deshacer, lo que conviene
   probar primero en Habilitación).

Lo del panel va primero, salvo que preguntes por un JSON, una ruta, un token o una integración.
Si una de las dos vías no existe, el asistente lo dice en una línea y sigue con la que sí existe.

Debajo de la respuesta puede aparecer:

* El enlace que abre la pantalla del panel donde se hace lo que explica (por ejemplo *Cargue el
  certificado, el software y la resolución en* **Empresas → ⋮ → Configuración inicial**).
* La línea **En la documentación:** con los enlaces a las páginas de este manual que se usaron para
  responder. Se abren en una pestaña nueva.
* La captura de pantalla del apartado, si la tiene.
* Los bloques de código con los botones **Ajustar** (parte las líneas largas), **Ampliar** (lo abre
  en grande) y **Copiar**.

El asistente recuerda **tu pregunta anterior y la respuesta que te dio**, lo justo para entender un
seguimiento del tipo *¿y cómo la anulo?* o *¿y por el API?*. No es una conversación con memoria
larga.

Pregunta de una cosa a la vez

Las preguntas concretas —*¿cómo cargo el certificado?*, *¿qué JSON envío para una nota crédito?*—
dan mejores respuestas que las generales. Si el asistente no encuentra el tema, lo dice y te
sugiere reformular o escribir a soporte: no se inventa la respuesta.

#### Preguntar por voz

El botón del **micrófono**, a la derecha de la caja de texto, dicta la pregunta:

1. Púlsalo: la caja se reemplaza por una barra roja con un punto que parpadea, el tiempo de
   grabación y lo que se va reconociendo.
2. Habla con normalidad.
3. Pulsa el **✓** (o el micrófono otra vez) para dar por terminada la grabación: lo dictado queda
   **escrito en la caja de texto**, para que lo revises y lo corrijas antes de enviarlo. La
   papelera de la barra descarta la grabación sin escribir nada.

El dictado lo pone el propio navegador, así que solo funciona en **Google Chrome y Microsoft Edge**
y con el panel abierto por **https** (o en `localhost`). Si no se cumple, al pulsar el micrófono el
asistente te explica en el chat por qué no puede grabar. Lo mismo si falta el permiso del
micrófono, si no hay micrófono conectado o si no te escuchó.

#### La conversación te sigue

Las preguntas y respuestas se guardan en el navegador, así que **cambiar de pantalla del panel no
borra el chat**: al volver a abrir el panel siguen ahí, y si lo dejaste abierto vuelve abierto.
Se conservan los últimos 20 mensajes de la pestaña; las capturas incrustadas en una respuesta no se
guardan, por lo que al recuperar la conversación esa respuesta se ve sin imagen.

La conversación es de esa pestaña del navegador: se pierde al cerrarla, en otra pestaña empieza en
blanco y el botón **Limpiar** la borra cuando quieras.

#### Mensajes que puedes ver

| Mensaje | Qué pasa |
| --- | --- |
| *El asistente todavía no está activo...* | Falta el token en el `.env`. La caja de texto queda deshabilitada. |
| *Todavía no tengo cargada la documentación...* | Está activo pero sin índice: hay que correr `php artisan manual:index` en el servidor. |
| *Va muy rápido: espere un minuto y vuelva a preguntar.* | Hay un tope de 20 preguntas por minuto y por usuario. |
| *Su sesión se cerró...* | Vuelve a entrar al panel. |
| *No pude responderle porque...* | El proveedor de IA no respondió: sin saldo, llave vencida o modelo inexistente. Avisa al administrador. |

### Configurarlo

Se configura en el servidor

El asistente no tiene pantalla de configuración: todo va en el archivo `.env` de la instalación. El
token y el índice son de la plataforma, no de una empresa.

| Variable del `.env` | Qué se pone |
| --- | --- |
| `MANUAL_AI_API_KEY` | El token de la cuenta de **Claude (Anthropic)** con el que responde el asistente; empieza por `sk-ant-`. **Vacío deja el asistente apagado**: no aparece el botón. |
| `MANUAL_URL` | La dirección pública del manual que el asistente indexa. De fábrica, `https://manual.facturalatam.com`; quien tenga su propio manual lo pone aquí. |
| `MANUAL_AI_PROVIDER` | Opcional. `anthropic` (lo normal) u `openai`, si prefieres responder con OpenAI. |
| `MANUAL_AI_MODEL` | Opcional. El modelo que responde. Sin él se usa el que trae el sistema para ese proveedor. |
| `MANUAL_AI_EMBEDDINGS_API_KEY` | Opcional. Llave de OpenAI que se usa solo para encontrar el apartado que responde la pregunta. Sin ella la búsqueda es por palabras. |

#### Puesta en marcha

Hace falta que el servidor tenga **salida a internet** hacia el manual (`MANUAL_URL`) y hacia el
proveedor de IA (`api.anthropic.com` o `api.openai.com`): el índice se arma descargando el manual
y cada respuesta se pide al proveedor.

1. Aplica las migraciones de esta versión en el servidor: `php artisan migrate`.
2. Pon el token en el `.env`:

   ```
   MANUAL_AI_API_KEY=sk-ant-...
   ```
3. Recarga la configuración: `php artisan config:clear`.
4. Construye el índice del manual: `php artisan manual:index`. Descarga el manual completo, así que
   tarda; al terminar informa cuántas secciones, capturas y ejemplos quedaron indexados.
5. Entra al panel: el botón del asistente ya aparece en todas las pantallas.

Cada cambio del `.env` necesita `config:clear`

Si cambias el token o cualquiera de las otras variables, ejecuta `php artisan config:clear` o el
API seguirá usando el valor anterior.

#### Los embeddings son opcionales

Con solo el token de Claude, el asistente busca el apartado **por palabras** y responde igual.
`MANUAL_AI_EMBEDDINGS_API_KEY` mejora la búsqueda: mide el parecido entre la pregunta y el texto
del manual, así que encuentra el apartado aunque lo preguntes con otras palabras. Se puede agregar
después; basta volver a construir el índice para que los calcule.

Si el cálculo se corta a medias (sin saldo, por ejemplo), el mensaje lo dice y el asistente sigue
funcionando por palabras. Vuelve a correr `php artisan manual:index` para completar los que falten:
lo ya calculado se conserva y no se vuelve a pagar.

#### Mantener el índice al día

El índice es una copia del manual, así que envejece cuando la documentación cambia. La plataforma
lo rehace **todos los días a las 3:30**, siempre que el cron de `schedule:run` esté activo. También
puedes lanzarlo a mano en el servidor:

```
php artisan manual:index
```

Con el asistente apagado el comando no hace nada; `php artisan manual:index --force` lo reconstruye
de todos modos.

Si no tiene el cron de `schedule:run`, vuelva a construir el índice cada vez que se actualice el
manual. La línea del cron es:

```
* * * * * cd /ruta/del/api && php artisan schedule:run >> /dev/null 2>&1
```

En Docker, los comandos son los mismos dentro del contenedor del API:

```
docker compose exec php_api php artisan manual:index --force
```

Si algo no responde, mire el log

Los errores del asistente quedan en `storage/logs/laravel.log` y empiezan por
`ManualAssistant:`. Si el modelo de `MANUAL_AI_MODEL` no existe en el proveedor, responde con el
modelo por defecto y lo deja anotado ahí.

---

## Completar la configuración

Fuente: <https://manual.facturalatam.com/interfaz/configuracion-inicial/>

Una empresa puede emitir documentos electrónicos cuando tiene tres cosas registradas:
certificado, software y resolución. Esta pantalla las reúne en un solo sitio y te dice de un
vistazo qué falta.

Llegas a ella de dos formas, desde **Empresas**:

* por el menú de la fila: **⋮ → Configuración inicial**;
* o pulsando el botón **Ver configuración** de la columna *Configuración*.

![Pantalla Completar configuración con los tres pasos en verde y el contador Pasos completados 3 de 3](https://manual.facturalatam.com/assets/images/11-setup-resumen-e37578006e878a63cf1cc0a33e3faf9c.png)

### Cómo se lee la pantalla

Arriba, junto al nombre de la empresa, está el badge **Ambiente: Habilitación** o
**Ambiente: Producción**. A la derecha tienes tres botones: **Volver** al listado,
**Resoluciones** y **Documentos Electrónicos**.

Debajo, la barra de progreso: **Pasos completados: N de 3** y una etiqueta por paso
(*1. Certificado*, *2. Software*, *3. Resolución*), verde si está hecho y roja si falta. Cuando
los tres están en verde aparece el mensaje *La empresa ya puede emitir documentos.* y, si la
empresa sigue en habilitación, el enlace **Continuar con el Paso a Producción**.

Debajo hay dos tarjetas, cada una con una franja de color a la izquierda: la del **certificado**
(paso 1) y la de **software y resoluciones**, que reúne los pasos 2 y 3 en pestañas por tipo de
documento.

| Franja | Significado |
| --- | --- |
| Verde | El paso está completo. |
| Rojo | Falta ese paso. La empresa no puede emitir. |
| Amarillo | Hecho, pero hay que actuar pronto: el certificado está por vencer. |

### Paso 1 · Certificado digital de firma

Es el archivo .p12 o .pfx con el que se firman los documentos, el que entrega una entidad
certificadora autorizada. Hacen falta dos cosas: el archivo y su contraseña.

![Tarjeta del paso 1, Certificado digital de firma, con el aviso del certificado cargado y su vencimiento](https://manual.facturalatam.com/assets/images/12-setup-certificado-8009f37cc7f7aa9570b74239a87e3c08.png)

Si ya hay uno cargado, el aviso verde te dice el nombre del archivo, la fecha exacta de
vencimiento y cuántos días faltan. Si está vencido o a punto de vencer, el aviso cambia de color.

| Control | Qué hace |
| --- | --- |
| **Contraseña del certificado** | La contraseña del archivo. |
| **Archivo (.p12 / .pfx)** | Selecciona el certificado en tu equipo. |
| **Cargar certificado** / **Reemplazar certificado** | Guarda el certificado. Si ya había uno, lo sustituye. |

Qué pasa si falta o está vencido

Sin certificado válido no se puede firmar ni enviar nada a la DIAN. No es un aviso cosmético: los
envíos empiezan a fallar el mismo día en que caduca. Revisa la columna **Certificado** del
[listado de empresas](https://manual.facturalatam.com/interfaz/empresas/) de vez en cuando para no llevarte la sorpresa.

### Pasos 2 y 3 · Software y resoluciones, pestaña por pestaña

Cada tipo de documento tiene su propio software y su propia numeración, así que la segunda
tarjeta, **Software y resoluciones**, se divide en pestañas: se configuran todas sin salir de
esta pantalla.

![Tarjeta Software y resoluciones con las cinco pestañas por tipo de documento y el panel de Facturas abierto](https://manual.facturalatam.com/assets/images/42-setup-pestanas-84b841478661f7ca994ce926e9b48fa7.png)

| Pestaña | Qué documentos cubre |
| --- | --- |
| **Facturas** | Facturas de venta nacionales y de exportación. Es la única que cuenta para los pasos 2 y 3. |
| **Notas crédito/débito** | La numeración de las notas que corrigen o ajustan una factura ya emitida. |
| **Nómina electrónica** | Nómina individual y sus ajustes. |
| **Documento soporte** | Documento soporte de compras a no obligados y sus notas de ajuste. |
| **Documentos equivalentes** | POS, transporte terrestre, boleta de cine, servicios públicos y los demás equivalentes. |

Cada pestaña lleva un icono de estado a la derecha del nombre: verde cuando tiene software y
resolución, rojo cuando falta algo en **Facturas**, amarillo cuando el tipo está a medias y gris
cuando no se ha configurado nunca. Dentro, la píldora **Ambiente: Habilitación** o
**Ambiente: Producción** es la de ese tipo de documento, que no tiene por qué ser la misma que la
de facturación.

Las notas no tienen software propio

Las notas crédito y débito se firman con el **software de Facturas**, así que su pestaña solo
tiene el bloque de resoluciones. Es ahí donde se registran las **notas débito**.

Los **eventos RADIAN** tampoco tienen software propio: se firman también con el de **Facturas**.
Por eso no hay pestaña para ellos. Descargar facturas recibidas, en cambio, solo necesita el
certificado; lo explica
[Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/#qu%C3%A9-necesitas-seg%C3%BAn-lo-que-vayas-a-hacer).

#### El bloque Software

El **ID** y el **PIN** identifican tu software ante la DIAN. Los genera la DIAN, no la
plataforma.

Cuando ya están registrados, la píldora del bloque dice **Registrado** y debajo se ven el
identificador y el PIN guardados; si faltan, dice **Sin registrar**. En las pestañas distintas de
*Facturas* el aviso es informativo: regístralo solo si la empresa va a emitir ese tipo de
documento.

| Control | Qué hace |
| --- | --- |
| **Identificador del software (ID)** | El identificador que te dio la DIAN. |
| **PIN** | El PIN del software, de cinco dígitos. |
| **Guardar software** / **Actualizar software** | Registra o cambia los datos. |

El aviso azul te indica el camino exacto dentro del portal de la DIAN:
**Habilitación → Configuración → Configurar modos de operación**, tomando las columnas **Id** y
**Pin** de la fila con modo **Software propio**. Y el enlace **Ver guía con imágenes** abre una
ventana con capturas reales del portal, en cuatro pasos que puedes recorrer con las flechas.

![Ventana de ayuda Cómo crear el software y obtener el ID y PIN, mostrando el paso 1 de 4 en el portal de la DIAN](https://manual.facturalatam.com/assets/images/15-setup-ayuda-software-e00b82a9ccd6bcb05f1632f37cb8ab6c.png)

Qué pasa si falta

Sin ID y PIN la DIAN rechaza los documentos, aunque el certificado sea correcto.

#### El bloque Resoluciones

Es la numeración autorizada por la DIAN. La píldora del bloque te dice cuántas resoluciones de
ese tipo de documento hay registradas, y la tabla resume lo que ya existe:

| Columna | Qué muestra |
| --- | --- |
| **Tipo** | El tipo de documento concreto al que pertenece la resolución. |
| **Ambiente** | Si la resolución es de Habilitación o de Producción. |
| **Prefijo** | Las letras que van delante del número del documento. |
| **Número** | El número de la resolución de la DIAN. |
| **Rango** | Desde y hasta qué consecutivo autoriza. |
| **Vigencia** | Entre qué fechas sirve. |
| **Vence** | Si está vigente, por vencer o vencida, y cuántos días faltan. |
| **Clave técnica** | El código secreto que acompaña a la resolución. Se muestra recortado a propósito. |

En la pestaña **Facturas**, si todavía no hay resolución de nota crédito aparece un aviso
amarillo: sin ella no se pueden emitir notas crédito, y la única forma de corregir una factura ya
enviada es con una nota crédito.

| Control | Qué hace |
| --- | --- |
| **Registrar otra resolución** | Despliega el formulario para añadir una resolución nueva de ese tipo de documento. |
| **Ver y editar todas las resoluciones** | Lleva a la pantalla completa de resoluciones, explicada en [Resoluciones y plantillas](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/). |

El formulario cambia según la pestaña:

* En **Facturas** el tipo de documento es fijo (*Factura de Venta Nacional*) y la **clave técnica**
  es obligatoria. Cuando la empresa está en **Habilitación**, los campos vienen precargados con la
  resolución de pruebas que la DIAN asigna (prefijo **SETP**) y tienes un enlace **Restablecer
  datos de pruebas** para volver a esos valores; en **Producción** el aviso cambia a amarillo y te
  recuerda registrar la resolución real. Debajo, la casilla **Crear también la resolución para
  Nota Crédito** registra las dos de una vez.
* En las demás pestañas eliges el **tipo de documento** de una lista con los que cubre esa pestaña
  y la clave técnica es opcional, porque la DIAN solo la exige en la factura. En **Notas
  crédito/débito** los campos llegan precargados con valores de uso general: la DIAN no exige
  numeración autorizada para las notas.

La resolución queda registrada en el ambiente que tenga configurado ese tipo de documento, y al
guardar vuelves a la misma pestaña.

Qué pasa si falta

Sin resolución no hay numeración que poner en la factura, así que no se puede generar ningún
documento.

### Cuando los tres pasos están en verde

La empresa ya puede emitir en **Habilitación**, que es donde se hacen todas las pruebas. Para
comprobarlo sin montar nada, envía una factura de prueba desde la pantalla siguiente. El
siguiente movimiento, cuando de verdad esté todo revisado, es el paso a producción: lee antes
[Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/), porque es una operación que no se puede
deshacer.

### Probar factura (JSON)")

Es la misma prueba opcional del asistente de creación de empresa, pero para una empresa ya
registrada. Se abre con el botón **Probar factura** de la columna *Configuración* del
[listado de empresas](https://manual.facturalatam.com/interfaz/empresas/), y solo aparece si la empresa tiene token del API.

![Pantalla Probar factura (JSON) con los detalles de la petición y el JSON precargado](https://manual.facturalatam.com/assets/images/43-probar-factura-json-ec2b53048261f88df428b84f04daa473.png)

La pantalla tiene tres partes:

| Bloque | Qué muestra |
| --- | --- |
| **Detalles de la petición** | El método y la URL (`POST /api/ubl2.1/invoice`), el encabezado `Authorization` con el token de la empresa y los `Content-Type` y `Accept`. Cada uno con su botón **Copiar**. |
| **JSON de la factura** | El prefijo, el número de resolución, el consecutivo propuesto y el rango autorizado, y debajo el JSON completo, editable. |
| **Respuesta de la DIAN** | Aparece al enviar, con la respuesta tal cual la devolvió el API. |

El JSON llega precargado con los datos de la empresa: el prefijo y la resolución de facturación
del ambiente en el que factura y, como consecutivo, **el siguiente al último documento emitido con
ese prefijo**. Si la DIAN responde que el número ya existe, súbelo y vuelve a enviar.

| Botón | Qué hace |
| --- | --- |
| **Enviar factura de prueba** | Envía el JSON al API con el token de la empresa. Si el JSON está mal escrito, avisa antes de enviar. |
| **Restablecer ejemplo** | Devuelve el JSON al que venía precargado. |
| **Copiar JSON** | Copia el contenido del editor al portapapeles. |

Si falta el ID y PIN del software o la resolución de facturación, la pantalla lo avisa en rojo y
enlaza de vuelta a **Completar configuración**: la DIAN rechazaría el envío.

En producción la factura es real

Si la empresa ya está en **Producción**, la factura se envía de verdad a ese ambiente y consume un
consecutivo de su resolución. La pantalla lo advierte arriba. Para probar sin consecuencias,
hazlo en **Habilitación**.

---

## Crear una empresa

Fuente: <https://manual.facturalatam.com/interfaz/crear-empresa/>

Para registrar una empresa nueva ve a **Empresas** y pulsa **Nueva empresa**, arriba a la
derecha. Se abre un asistente que te lleva de la mano por cinco pasos.

![Primer paso del asistente de nueva empresa, con la barra de pasos y el formulario de datos de la empresa](https://manual.facturalatam.com/assets/images/08-nueva-empresa-paso1-eaa1d318b386b304d2d800b9aacd494e.png)

### La barra de pasos

Arriba siempre ves en qué punto estás. El paso en negro es el actual y los que quedan atrás se
marcan como completados.

![Barra de pasos del asistente: Empresa, Certificado, Software, Resolución y Factura Json opcional](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABCcAAABACAIAAACm6YoCAAAQAElEQVR4nOzd…[base64 recortado, 12000 caracteres])

| Paso | Qué se registra |
| --- | --- |
| **Empresa** | Identificación, nombre, domicilio y clasificación tributaria. |
| **Certificado** | El archivo de firma digital y su contraseña. |
| **Software** | El ID y el PIN que la DIAN asigna al software de facturación. |
| **Resolución** | La numeración autorizada: prefijo, rango y vigencia. |
| **Factura Json(opcional)** | Un paso de cortesía para quien va a integrar sus propios sistemas. |

Cada paso se guarda al pulsar **Siguiente**, así que puedes dejar la creación a medias y
terminarla más tarde desde [Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/): la
empresa ya existe en cuanto completas el primer paso.

### Paso 1 · Empresa

A la izquierda está el recuadro **Subir Ficha RUT (PDF)**. Arrastra ahí el PDF del RUT de la
empresa, o haz clic para buscarlo en tu equipo.

![Recuadro Subir Ficha RUT con la zona de arrastrar y soltar y el aviso Solo archivos PDF](https://manual.facturalatam.com/assets/images/09-nueva-empresa-rut-3f0cc831f9900dc362508f5bdea7e360.png)

Cuando el archivo termina de procesarse, la plataforma rellena sola la mayor parte del
formulario de la derecha: identificación, razón social, dirección, municipio y clasificación
tributaria. Revisa siempre lo que quedó escrito antes de continuar.

Si no tienes la Ficha RUT a mano

El recuadro es opcional. Puedes escribir el formulario a mano; los campos son los mismos.

| Campo | Qué escribir |
| --- | --- |
| **Tipo de Documento** y **Número de documento** | La identificación de la empresa. El **DV** se calcula solo. |
| **Empresa** | La razón social, tal como figura en el RUT. |
| **Registro Mercantil** | La matrícula mercantil, si la tiene. |
| **Teléfono** y **Correo Electrónico** | Datos de contacto. El correo será el del usuario dueño de la empresa. |
| **Dirección**, **Departamento** y **Municipio** | El domicilio fiscal. |
| **Tipo Responsabilidad**, **Organización** y **Régimen** | La clasificación tributaria del RUT. Si te equivocas aquí, los documentos salen mal ante la DIAN. |
| **Responsabilidades adicionales** | Las demás responsabilidades que cumple la empresa, si cumple más de una. Es opcional. |

#### Si la empresa cumple varias responsabilidades

Una empresa puede ser a la vez gran contribuyente y autorretenedor, por ejemplo. La principal va en
**Tipo Responsabilidad** y las demás en **Responsabilidades adicionales**, el campo de selección
múltiple que está debajo. Marca las que apliquen; para quitar una, pulsa la **×** de su etiqueta.

![Campo Responsabilidades adicionales desplegado en el primer paso del asistente de nueva empresa](https://manual.facturalatam.com/assets/images/44-nueva-empresa-responsabilidades-42b1c58b211a516094ce9bb49e5f93c9.png)

Si cargaste la Ficha RUT, el campo ya viene marcado con lo que diga la **casilla 53** del RUT: revísalo
igual que el resto del formulario. Si la empresa solo cumple una responsabilidad, deja el campo vacío.

Todas las responsabilidades marcadas salen juntas en el XML y en el PDF de los documentos que emita la
empresa. Lo técnico se explica en
[Responsabilidades tributarias](https://manual.facturalatam.com/apidian/responsabilidades-tributarias/).

Pulsa **Siguiente** para guardar la empresa y pasar al certificado.

### Paso 2 · Certificado

Dos campos: **Password** (la contraseña del certificado) y **File**, donde arrastras el archivo
de firma digital. Solo se aceptan certificados .pfx o .p12.

A la derecha hay un recuadro de ayuda, **¿No tienes certificado digital?**, con un enlace para
adquirir uno. El certificado lo emite una entidad certificadora autorizada y es obligatorio: sin
él no se puede firmar ningún documento, y por tanto la empresa no puede emitir nada.

Sin certificado no sigas a ciegas

Si todavía no tienes el certificado, puedes dejar la empresa creada e ir completando el resto
después. Lo que no debes hacer es cargar un certificado vencido o de otra empresa: la DIAN
rechaza todo lo que se firme con él.

### Paso 3 · Software

Aquí van el **Identificador del Software (ID)** y el **PIN**. Son dos datos que no se inventan:
los genera la DIAN cuando registras tu software de facturación en su portal.

El propio asistente te dice dónde encontrarlos: en el portal de la DIAN, en
**Habilitación → Configuración → Configurar modos de operación**, tomando las columnas **Id** y
**Pin** de la fila con modo **Software propio**. El enlace **Vista Previa** del aviso azul abre
una guía con capturas del portal de la DIAN, paso por paso.

### Paso 4 · Resolución

Es la numeración que la DIAN autoriza para facturar. En **Habilitación**, los campos vienen
precargados con la resolución de pruebas que la DIAN asigna a todo el mundo (prefijo **SETP**):
solo cámbialos si la DIAN te entregó una distinta.

| Campo | Qué es |
| --- | --- |
| **Tipo de Documento** | Queda fijo en *Factura de Venta Nacional*. |
| **Prefijo** | Las letras que van delante del número de la factura. |
| **Número de Resolución** y **Fecha Resolución** | Los datos del acto administrativo de la DIAN. |
| **Clave Técnica** | El código que la DIAN entrega junto con la resolución. Es secreto: no lo compartas. |
| **Rango Inicial (desde)** y **Rango Final (hasta)** | El intervalo de consecutivos autorizado. |
| **Vigencia desde** y **Vigencia hasta** | El periodo en que la resolución sirve. |

Debajo hay un bloque opcional para crear además la resolución de **Nota Crédito**, con sus
propios prefijo, número, rango y vigencia. Conviene marcarlo: sin resolución de nota crédito no
se pueden anular ni corregir facturas.

Si la empresa ya tenía una resolución registrada, el asistente lo detecta y te ofrece el botón
**Omitir este paso**.

### Paso 5 · Factura Json (opcional)")

Este último paso no hace falta para usar el panel. Está pensado para la persona que va a conectar
un programa propio con la plataforma, y muestra los datos técnicos de esa conexión junto con
ejemplos. Todo eso se explica en la **Referencia API**.

Copia la clave de ingreso antes de cerrar

En este paso aparece el bloque **Clave de ingreso al panel**, con el correo de la empresa y una
clave aleatoria. **Solo se muestra esta vez**: cópiala y entrégala a la empresa. Desde el 27 de
octubre de 2026 la clave ya no es el NIT. Junto a ella está el **token** con el que se conecta un
programa propio.

Si no vas a integrar nada, pulsa **Cerrar** y listo: la empresa ya aparece en el listado.

### Después de crear la empresa

Vuelve a **Empresas** y busca la empresa nueva. Revisa la columna **Configuración**: si todavía
dice **Configuración pendiente**, falta algo por registrar. Pulsa **Ver configuración** y sigue en
[Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/).

---

## Documentos electrónicos

Fuente: <https://manual.facturalatam.com/interfaz/documentos-electronicos/>

Es el centro de trabajo de una empresa: aquí ves lo que se ha emitido, lo descargas, consultas a
la DIAN qué pasó con un documento y configuras cada tipo de documento. Llegas desde **Empresas**
por el menú de la fila: **⋮ → Documentos Electrónicos**.

![Pantalla de Documentos Electrónicos con el encabezado de la empresa, las cinco pestañas de tipo de documento y el badge Ambiente Habilitación](https://manual.facturalatam.com/assets/images/16-documentos-tabs-e46f2f3acb8f915080f4be900a423c67.png)

Arriba del todo, en una tarjeta propia, está el encabezado de la pantalla: el nombre y el NIT de
la empresa, el tipo de documento en el que estás, su badge de ambiente y el botón **Volver**. Es
un único encabezado para toda la pantalla: cuando cambias de pestaña, el tipo de documento y el
badge de ambiente que muestra cambian con ella.

### Las cinco pestañas de tipo de documento

La fila superior separa los tipos de documento. Cada uno tiene su propia configuración, su propia
numeración y su propio ambiente.

| Pestaña | Para qué |
| --- | --- |
| **Factura electrónica** | Facturas de venta y sus notas crédito y débito. |
| **Nómina electrónica** | Documentos de nómina individual y sus ajustes. |
| **Documento soporte** | Documentos soporte en adquisiciones a no obligados a facturar. |
| **Eventos RADIAN** | Acuses y eventos sobre facturas recibidas, y el extractor de documentos de compra. |
| **Documentos equivalentes** | Tiquetes y documentos equivalentes (POS). |

Debajo aparece una segunda fila de pestañas, dentro del tipo de documento elegido:

| Sub-pestaña | Qué contiene |
| --- | --- |
| **Listado** | Los documentos ya emitidos de ese tipo. |
| **Paso a Producción** | El asistente para dejar de facturar en pruebas, descrito en [Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/). |
| **Resoluciones** | La numeración autorizada para ese tipo. |
| **Plantilla PDF** | El diseño del PDF de ese tipo. Ambas, en [Resoluciones y plantillas](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/). |

**Eventos RADIAN** es la excepción: sus sub-pestañas son **Listado**, **Paso a Producción** y
**Factura de compras**, que es el extractor explicado en
[Extractor de documentos de compra](https://manual.facturalatam.com/interfaz/extractor-compras/).

### El badge de ambiente

En el encabezado, junto al tipo de documento, hay un badge que dice **Ambiente: Habilitación**
(amarillo) o **Ambiente: Producción** (verde). Es la señal más importante de la pantalla: te dice
si lo que emitas ahí cuenta como una factura real.

El badge rojo que avisa del destino real

Si además del badge de ambiente aparece uno rojo que dice **Envía a Producción** o
**Envía a Habilitación**, es que la empresa está marcada en un ambiente pero su software apunta
al otro. Manda lo que diga el software, no la marca de la empresa. Mientras ese aviso esté ahí,
no emitas nada y revisa la configuración del tipo de documento.

Fíjate también en que cada tipo de documento tiene su ambiente **por separado**: una empresa
puede estar en producción para facturas y seguir en habilitación para nómina.

### El listado de documentos

Es la sub-pestaña **Listado** y es la misma tabla para factura, documento soporte y documentos
equivalentes.

![Sub-pestaña Listado de Factura electrónica con la tabla de documentos emitidos](https://manual.facturalatam.com/assets/images/17-factura-listado-5766f21363616e3f666b61de46c28145.png)

Arriba tienes la barra de búsqueda: elige el campo en el selector y escribe el valor.

| Buscar por | Qué espera |
| --- | --- |
| **Número** | El consecutivo **exacto**, solo o con su prefijo: `1015` o `NC1015`. Buscar `1` ya no trae `10`, `21` ni `100`. |
| **Prefijo** | El prefijo del documento. |
| **Cliente** | Nombre o identificación del adquiriente. |
| **Fecha** | Una fecha o un rango desde/hasta. |
| **Tipo de documento** | Factura, nota crédito, nota débito, etc. |
| **Válido** | Sí, No o **Sin confirmar por la DIAN**, para los que todavía no tienen veredicto. |
| **Ambiente** | Habilitación o Producción. |

A la derecha de esa misma barra, pueden aparecer dos botones más: **Subida Masiva** (solo en
factura electrónica) y **Consultar pendientes en la DIAN**, con el número de documentos de la
página que todavía no están validados.

#### Las columnas

![Primer plano de la tabla de documentos con las columnas DIAN, Descargas, Ambiente y Válido](https://manual.facturalatam.com/assets/images/26-documentos-listado-7dd85e9c7bb8bad0a43d48cdb8af3dce.png)

| Columna | Qué muestra |
| --- | --- |
| **#** | Posición en la página. |
| **DIAN** | Los botones de consulta sobre el envío (abajo). |
| **Descargas** | Los archivos del documento: **XML**, **PDF** y **Attached**. |
| **Ambiente** | Si ese documento concreto se emitió en Habilitación o en Producción. |
| **Válido** | **Si** cuando la DIAN lo validó, **No** cuando no, **En proceso** cuando aún no contesta y **Sin confirmar** cuando nunca llegó a contestar (más abajo). |
| **Fecha** | Fecha y hora de emisión. |
| **Número** | Prefijo y consecutivo. |
| **Cliente** | Nombre e identificación del adquiriente. |
| **Tipo de Documento** | Factura de venta, nota crédito, etc. |
| **Impuesto**, **Subtotal** y **Total** | Los importes del documento. |
| **Correo** | Si el documento se envió por correo al cliente. |
| **Acciones** | El botón para crear una nota de crédito a partir de la factura. |

#### Los botones de la columna DIAN

| Botón | Qué hace |
| --- | --- |
| **Respuesta DIAN** | Muestra la respuesta que dio la DIAN cuando se envió el documento. |
| **Ver CUFE** | Muestra el código único del documento, el que lo identifica ante la DIAN. |
| **Consultar Xml** | Recupera el XML tal como lo tiene registrado la DIAN. |
| **Consultar DIAN** | Solo sale en documentos sin validar: le pregunta a la DIAN si ese documento quedó validado, rechazado o sigue en proceso, y actualiza el estado con lo que ella responda. |
| **Reenviar a la DIAN** | Solo sale en documentos **sin confirmar** o que la DIAN dice no tener (más abajo). |
| **Rechazo (N)** | Solo sale en documentos rechazados: lista los motivos del rechazo, sin el ruido del resto de la respuesta. |

En la columna **Descargas**, el botón **Attached** solo aparece en documentos validados: es el
AttachedDocument, el XML del documento junto con el acuse de validación de la DIAN. Es el archivo
que se le entrega al cliente.

Documentos en estado En proceso

Cuando la DIAN recibe un documento pero todavía no dice si lo valida o lo rechaza, la fila se
resalta y el estado queda en **En proceso**. Ese consecutivo queda bloqueado: **no vuelvas a
emitirlo**, porque acabarías con dos documentos peleando por el mismo número. Usa
**Consultar DIAN** o espera a que se resuelva.

#### Documentos sin confirmar

A veces el envío se corta antes de que la DIAN conteste: se cae la conexión o la DIAN no
responde. El documento queda guardado en la plataforma sin saber si llegó a validarse, y esas
filas se resaltan con el estado **Sin confirmar**.

![Dos documentos soporte con el estado Sin confirmar y los botones Consultar DIAN y Reenviar a la DIAN](https://manual.facturalatam.com/assets/images/37-documento-sin-confirmar-0382ae85f74fe71f3ebe97cad3b6ef88.png)

Si emites desde tu propio sistema

Cuando el envío se corta, la API responde con `success: false`, el mensaje de lo que pasó y el
`cufe` o `cuds` del documento, con código **502** si la DIAN no alcanzó a dar veredicto. Guarda ese
número: es con el que después se consulta o se reenvía el documento. **No emitas otro documento con
el mismo consecutivo.**

No es lo mismo que **Válido = No**: un documento rechazado sí tiene veredicto. Para encontrarlos,
busca por **Válido** con el valor **Sin confirmar por la DIAN**. En esas filas tienes dos botones:

| Botón | Qué hace |
| --- | --- |
| **Consultar DIAN** | Le pregunta a la DIAN si tiene el documento. Si lo tiene validado, la fila pasa a **Válido = Si**, se genera el AttachedDocument y sale el correo. |
| **Reenviar a la DIAN** | Aparece cuando la DIAN responde que no lo tiene. Vuelve a enviar **el mismo documento ya firmado**: conserva su CUFE, no consume otro consecutivo y no crea otra fila. La ventana te deja marcar si quieres que salga el correo al cliente cuando la DIAN lo valide. |

Consulta antes de reenviar

Reenvía solo si **Consultar DIAN** dice que la DIAN no tiene el documento. Si ya lo tiene, lo
rechazará con la regla 90 *"Documento procesado anteriormente"*. Y nunca lo emitas de nuevo con el
mismo número desde tu sistema: eso genera otro CUFE y el PDF que ya tiene el cliente deja de
corresponder.

Cada 10 minutos la plataforma revisa sola estos documentos y deja al día los que la DIAN ya
resolvió, así que muchos se corrigen sin que tengas que hacer nada.

#### Rechazos por la regla 90

Cuando la DIAN rechaza un envío con la regla 90 *"Documento procesado anteriormente"*, ese número
ya está emitido ante la DIAN, aunque el documento no esté en esta plataforma: puede venir de otro
software que facturó antes con la misma numeración. La fila queda marcada como **duplicado**, con
el aviso de que no se reenvíe y se emita con otro número; el motivo del rechazo se ve en el botón
**Rechazo**.

Ese número queda contado como usado, así que el siguiente documento sale con el número siguiente y
tu sistema tampoco lo vuelve a pedir si consulta el consecutivo por la API.

#### La fila "Ajuste de consecutivo"

En el listado puede aparecer una fila gris con la etiqueta **Ajuste de consecutivo** en lugar de
un documento. No es una factura: es el registro con el que se marca un número como usado, para
que el siguiente documento salga con el que sigue. No se envió a la DIAN y no tiene XML ni PDF,
por eso sus columnas aparecen vacías o con *No aplica*.

#### La columna Correo

| Estado | Qué significa |
| --- | --- |
| **Enviado** (verde) | El correo salió. Al pasar el ratón ves la fecha y hora. |
| **Sin correo** (amarillo) | El cliente no tiene correo registrado. |
| **Error** (rojo) | El envío falló; el botón abre el motivo. |
| **—** | No se solicitó envío de correo. |

En los documentos validados aparece además el botón **Enviar** (o **Reenviar** si ya se mandó
una vez), que manda al cliente el PDF y el AttachedDocument. Desde qué correo sale ese mensaje se
configura en [Usuarios, correo y almacenamiento](https://manual.facturalatam.com/interfaz/usuarios-correo-almacenamiento/).

#### Anular una factura con nota de crédito

En la columna **Acciones**, las facturas que la DIAN validó traen el botón **Nota de crédito**.
Emite una nota crédito de anulación por el total de esa factura, con el motivo *Anulación de
factura electrónica*.

El botón abre la ventana **Seleccionar Resolución para Nota de Crédito** con las resoluciones de
nota crédito de la empresa. Elegir una **todavía no envía nada**: la ventana pasa a un aviso que
te dice qué factura vas a anular y con qué resolución.

![Ventana de confirmación antes de enviar la nota crédito, con la factura que se va a anular, la resolución elegida y los botones Elegir otra resolución y Sí, enviar nota crédito](https://manual.facturalatam.com/assets/images/49-nota-credito-confirmar-9c1614c57d02771687e619a128466171.png)

Desde ahí, **Elegir otra resolución** vuelve a la lista y **Sí, enviar nota crédito** es el que
manda el documento a la DIAN.

La nota sale de inmediato y no se puede deshacer

Mientras se envía, la ventana no se puede cerrar con la **X**, con `Esc` ni haciendo clic afuera:
el resultado solo se ve ahí, y cerrarla antes de tiempo lleva a enviar una segunda nota por la
misma factura. Espera a que aparezca el resultado; al cerrar la ventana el listado se recarga y
verás la nota crédito nueva con su estado.

### Subida masiva por Excel

El botón **Subida Masiva** de la pestaña **Factura electrónica** abre una ventana para emitir
muchas facturas de una vez desde una hoja de cálculo.

![Ventana Subida Masiva de Facturas con las pestañas Facturas de Ventas y Facturas de Salud y el botón Descargar Plantilla](https://manual.facturalatam.com/assets/images/27-documentos-carga-masiva-1e184b8ba24dc1a87598f0afa98385a1.png)

| Control | Qué hace |
| --- | --- |
| **Facturas de Ventas** / **Facturas de Salud** | Elige el tipo de plantilla que vas a cargar. |
| **Descargar Plantilla** | Baja el Excel con las columnas en el orden esperado. Empieza siempre por aquí. |
| **Archivo Excel** | Selecciona el archivo ya diligenciado. |
| **Procesar Facturas** | Lanza el proceso. |
| **Resultado del Procesamiento** | Va mostrando fila por fila qué se emitió y qué falló. |

Pruébalo primero en Habilitación

La subida masiva emite documentos de verdad, uno por fila. Haz la primera carga en Habilitación y
con pocas filas, comprueba el resultado en el listado, y solo entonces repite el proceso con el
archivo completo.

### Las otras pestañas

**Nómina electrónica**, **Documento soporte** y **Documentos equivalentes** funcionan igual: su
**Listado** usa la misma tabla y las mismas acciones. Cuando una empresa todavía no ha emitido
nada de ese tipo, el listado dice simplemente *No hay documentos para mostrar*.

![Pestaña Nómina electrónica con su listado vacío](https://manual.facturalatam.com/assets/images/32-nominas-emitidas-83a248d6cef779e458db0771dcd70908.png)

La pestaña **Eventos RADIAN** no lista documentos emitidos por ti, sino los acuses y eventos
registrados sobre facturas que te emitieron a ti: recibo de la factura, recibo del bien o
servicio y aceptación o rechazo. Si la empresa nunca ha registrado un evento, el listado también
aparece vacío. De dónde salen esos eventos lo explica
[Extractor de documentos de compra](https://manual.facturalatam.com/interfaz/extractor-compras/).

Atajo desde el menú lateral

Mientras estás dentro de una empresa, el menú de la izquierda te ofrece **Listado de
documentos**, **Eventos RADIAN** y **Nominas emitidas** como accesos directos a esos mismos
listados.

---

## Listado de empresas

Fuente: <https://manual.facturalatam.com/interfaz/empresas/>

Es la pantalla principal del panel: **Empresas** en el menú lateral. Desde aquí ves de un vistazo
el estado de cada empresa y entras a todo lo demás.

![Listado de Empresas con las cuatro tarjetas de resumen, el bloque de filtros y la tabla de empresas](https://manual.facturalatam.com/assets/images/02-empresas-listado-f906c9752336a5a071954d3370fc623c.png)

### Las cuatro tarjetas de resumen

Encima del listado hay cuatro tarjetas que resumen el estado de todas tus empresas.

| Tarjeta | Qué cuenta |
| --- | --- |
| **Empresas registradas** | Cuántas empresas ves en el listado. Al pulsarla se quita el filtro y vuelven a verse todas. |
| **Certificados por revisar** | Empresas con el certificado vencido, por vencer o sin cargar. |
| **Configuración incompleta** | Empresas a las que les falta el software o la resolución de facturación. |
| **Resoluciones por vencer** | Empresas con alguna resolución vencida o próxima a vencer. |

Las etiquetas de colores que hay dentro de cada tarjeta (*2 sin certificado*, *2 sin software*,
*2 sin resolución*…) no son solo informativas: al pulsar una, el listado se filtra por ese estado.
Cuando no hay nada pendiente, la tarjeta lo dice: *Todos vigentes*, *Todas configuradas*,
*Ninguna próxima a vencer*.

### Buscar y filtrar

Arriba del listado tienes el bloque **Filtrar por** más **Búsqueda**. Elige primero el criterio y
después escribe en la caja: el listado se va filtrando mientras tecleas, no hace falta pulsar
nada. También puedes pegar el valor con el ratón, y la **x** de la caja limpia la búsqueda y
devuelve el listado completo.

![Bloque Filtrar por con el selector NIT y la caja Búsqueda vacía](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABFEAAABpCAIAAAB9HSsjAAAQAElEQVR4nOzd…[base64 recortado, 8104 caracteres])

| Filtrar por | Qué escribes en Búsqueda |
| --- | --- |
| **NIT** | El número de identificación de la empresa, sin el dígito de verificación. |
| **Correo** | El correo del usuario dueño de la empresa. |
| **Nombre** | El nombre o la razón social. |
| **Certificado** | Un estado: vigente, por vencer, vencido o sin certificado. |
| **Configuración** | Un estado: sin software, sin resolución o completa. |

Empieza siempre filtrando

Si administras muchas empresas, filtra por NIT antes de abrir cualquier acción. Así te aseguras
de estar trabajando sobre la empresa correcta: los menús y los formularios se abren sobre la fila
en la que haces clic.

### Las columnas del listado

| Columna | Qué significa |
| --- | --- |
| **ID** | Número interno de la empresa en la plataforma. |
| **Cliente** | NIT con su dígito de verificación. |
| **Documentos generados** | Cuántos documentos electrónicos ha emitido en total. |
| **Nombre de usuario** | Razón social o nombre del usuario dueño de la empresa y, debajo en letra más pequeña, el correo con el que entra al panel. |
| **Certificado** | Estado del certificado digital de firma y su fecha de vencimiento. |
| **Configuración** | Si ya tiene software y resoluciones registrados. |

El correo no tiene columna propia: se lee bajo el nombre, atenuado. Los filtros **Nombre** y
**Correo** siguen buscando cada uno en su línea, así que no se mezclan.

En la columna **Certificado** el color te dice si hay que actuar:

| Estado | Qué quiere decir |
| --- | --- |
| **Vigente** (verde) | El certificado sirve. Debajo verás la fecha de vencimiento y los días que faltan. |
| **Por vencer** (amarillo) | Se acerca el vencimiento. Consigue el nuevo antes de que caduque. |
| **Vencido** (rojo) | No se puede firmar ni enviar nada a la DIAN hasta cargar uno nuevo. |
| **Sin certificado** (gris) | Nunca se ha cargado. La empresa no puede emitir. |
| **Sin fecha** | El archivo está cargado pero no se pudo leer su vencimiento. |

En la columna **Configuración** hay una píldora verde, **Configuración completa**, cuando la
empresa ya tiene software y resolución de facturación, y una roja, **Configuración pendiente**,
cuando le falta alguno de los dos. Si además hay resoluciones vencidas o por vencer, al lado
aparece una píldora con la más urgente (y un **+N** si hay más). Esa píldora dice de qué servicio
es la resolución y con qué prefijo —*DS SEDS vencida*, por ejemplo—, y solo se pinta en rojo
cuando es de facturación, que es la que impide emitir. Las resoluciones que ya fueron
reemplazadas por otra del mismo tipo, ambiente y prefijo no se tienen en cuenta.

Debajo de las píldoras hay una fila de botones para entrar directo a lo que necesites de esa
empresa, sin pasar por el menú ⋮.

![Columna Configuración del listado con las píldoras de estado y los botones Ver resumen, Ver configuración, Resoluciones y Probar factura](https://manual.facturalatam.com/assets/images/41-empresas-configuracion-botones-413cf6d8e40228e09cca5fbbe44dc30d.png)

| Botón | Qué abre |
| --- | --- |
| **Ver resumen** | La ventana con todo lo que tiene registrado la empresa: certificado, software por tipo de documento y resoluciones vigentes agrupadas. Desde ella también se salta a **Configuración inicial** o a **Resoluciones**. |
| **Ver configuración** | La pantalla [Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/). Se pinta resaltado mientras falte el software o la resolución, para que se vea qué empresa hay que atender. |
| **Resoluciones** | La pantalla completa de resoluciones, explicada en [Resoluciones y plantillas](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/). Solo aparece si la empresa ya tiene alguna registrada. |
| **Probar factura** | La pantalla [Probar factura (JSON)](https://manual.facturalatam.com/interfaz/configuracion-inicial/#probar-factura-json), para enviar una factura de prueba con el JSON del API. Solo aparece si la empresa tiene token. |

Al pie de la tabla queda el total de empresas registradas; el desglose de lo que está pendiente
lo dan las tarjetas de arriba.

### El listado en el celular

En pantallas pequeñas la tabla no cabe a lo ancho, así que cada empresa se muestra como una
tarjeta: los datos quedan uno debajo de otro, con el nombre del campo a la izquierda y su valor a
la derecha. No hay que desplazarse en horizontal para llegar al menú ⋮ ni a los botones de
**Configuración**, que ocupan todo el ancho de la tarjeta.

![Una empresa del listado vista en el celular, como tarjeta con ID, Cliente, Documentos, Empresa, Certificado y Configuración](https://manual.facturalatam.com/assets/images/46-empresas-movil-tarjetas-2897ca3ab56f9ad8dc9af3691320e3f0.png)

Las cuatro tarjetas de resumen y el bloque de filtros se apilan igual, y funcionan como en el
escritorio.

![Listado de Empresas en el celular, con la barra superior, las tarjetas de resumen y los filtros apilados](https://manual.facturalatam.com/assets/images/45-empresas-movil-dadbe602d01f2c169732d9080d7bd23b.png)

### El menú de acciones de una empresa

Cada fila termina en un botón de tres puntos (⋮). Al pulsarlo se despliegan todas las acciones
sobre esa empresa.

![Menú de acciones desplegado sobre una fila del listado de empresas](https://manual.facturalatam.com/assets/images/04-empresas-menu-acciones-04117078e86430bb930e603c65ed5d37.png)

| Acción | Qué abre |
| --- | --- |
| **Editar Empresa** | Una ventana con los datos de la empresa, su logo, su token y su certificado (más abajo en esta página). |
| **Documentos Electrónicos** | La pantalla con las pestañas por tipo de documento: ver [Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/). |
| **Configuración inicial** | Los tres pasos obligatorios: ver [Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/). |
| **Usuarios** | Quién puede entrar a esta empresa: ver [Usuarios, correo y almacenamiento](https://manual.facturalatam.com/interfaz/usuarios-correo-almacenamiento/). |
| **Configurar Correo** | El correo propio desde el que salen los documentos de esta empresa. |
| **Acceso a la App** | Una ventana informativa con las formas de entrar a la aplicación web y el enlace para descargar la app de Android. |
| **Almacenamiento** | Dónde se guardan los archivos de la empresa. |
| **Eliminar** | Borra la empresa y todo lo suyo. Léelo con calma más abajo. |

Arriba a la derecha de la pantalla está el botón **Nueva empresa**, que abre el asistente de
creación. Lo explica [Crear una empresa](https://manual.facturalatam.com/interfaz/crear-empresa/).

### Editar Empresa

La ventana **Editar Empresa** tiene cuatro pestañas. Ojo: cada pestaña se guarda con su propio
botón, y el botón del pie cambia según la pestaña en la que estés.

![Ventana Editar Empresa en la pestaña Información de la Empresa, con los datos de identificación y domicilio](https://manual.facturalatam.com/assets/images/05-editar-empresa-datos-1cfb0bb99e6e339fa26d4591d16e4330.png)

| Pestaña | Qué contiene |
| --- | --- |
| **Información de la Empresa** | Número de identificación, tipo de documento, tipo de régimen, tipo de responsabilidad, **responsabilidades adicionales**, **organización**, municipio, matrícula mercantil, teléfono y dirección. Se guarda con **Guardar Información**. |
| **Logo de la Empresa** | Sube el logo que sale en el PDF de los documentos. Solo JPG y hasta 2 MB; te muestra una vista previa antes de confirmar con **Actualizar Logo**. |
| **API Token** | La credencial de la empresa (más abajo). |
| **Certificado** | Información del certificado actual y los campos para reemplazarlo: contraseña y archivo .pfx o .p12, con el botón **Actualizar Certificado**. |

El **Dígito de verificación** no se escribe: la plataforma lo calcula sola a partir del número de
identificación.

El campo **Responsabilidades adicionales** es una lista de selección múltiple: marca ahí las demás
responsabilidades que cumple la empresa, aparte de la que está en **Tipo de responsabilidad** (con
Ctrl + clic se marcan y se quitan varias). Déjalo vacío si solo cumple una. Es el mismo dato del
asistente de creación; lo explica [Crear una empresa](https://manual.facturalatam.com/interfaz/crear-empresa/).

El select **Organización** —el que distingue persona jurídica de persona natural— llega con el
valor que tiene hoy la empresa y es obligatorio para guardar la pestaña. Es el mismo dato que se
elige al crear la empresa y hace parte de la clasificación tributaria del RUT, así que cámbialo
solo si estaba mal registrado.

#### El token de la empresa

En la pestaña **API Token** aparece el **Token de la Empresa** y, a su derecha, un botón para
copiarlo al portapapeles.

![Pestaña API Token de la ventana Editar Empresa, con el token oculto y el botón de copiar](https://manual.facturalatam.com/assets/images/06-editar-empresa-token-cbf4b9d6a934d4b2fb716370613ec1a2.png)

Es la credencial con la que los sistemas de la empresa se identifican ante la plataforma. Para
trabajar desde el panel no la necesitas en ningún momento: solo hace falta cuando alguien va a
integrar un programa propio, y eso se explica en la **Referencia API**.

El token es una credencial, trátalo como una contraseña

Quien tenga ese token puede emitir documentos en nombre de la empresa. No lo pegues en correos,
chats ni capturas de pantalla, y no lo compartas con nadie que no sea el responsable técnico de
la integración. En este manual aparece oculto a propósito.

### Almacenamiento

La acción **Almacenamiento** abre una ventana con una sola pregunta: *¿Dónde se guardan los
archivos de esta empresa?*

![Ventana Almacenamiento de archivos con las tres opciones de guardado](https://manual.facturalatam.com/assets/images/07-almacenamiento-a0560ac69a9cff7eb48e4b325d1a4526.png)

| Opción | Qué hace |
| --- | --- |
| **Local (servidor)** | Los XML, PDF y ZIP se guardan en el disco del servidor donde corre la plataforma. |
| **Nube — AWS S3** | Los archivos se suben a Amazon S3. No ocupan espacio en el servidor. |
| **Local + Nube (doble copia)** | Se guardan en el servidor y además se suben a S3. Si uno falla, el otro sirve de respaldo. |

Elige la opción y pulsa **Guardar**. El detalle de esta pantalla está en
[Usuarios, correo y almacenamiento](https://manual.facturalatam.com/interfaz/usuarios-correo-almacenamiento/).

### Eliminar una empresa

Eliminar una empresa es irreversible

La ventana de confirmación te dice exactamente qué se va a borrar: los documentos emitidos y sus
registros, las resoluciones, el certificado, el software, los clientes, los ítems, los registros
de eventos RADIAN y los datos RIPS, y el propio usuario dueño si no administra otra empresa. No
hay forma de deshacerlo desde el panel.

Para que nadie la confirme por inercia, el botón **Eliminar definitivamente** nace desactivado y
va contando los segundos antes de habilitarse. La propia ventana te recomienda generar primero un
respaldo de la empresa desde **Backups**.

Quién ve la acción Eliminar

Hoy la acción **Eliminar** del menú ⋮ solo la ve el administrador de la plataforma; lo mismo
ocurre con el botón **Nueva empresa**.

---

## Extractor de documentos de compra

Fuente: <https://manual.facturalatam.com/interfaz/extractor-compras/>

El extractor trae de la DIAN las facturas que **otros te emitieron a ti** y te deja registrar
sobre ellas los eventos RADIAN: el acuse de recibo de la factura, el recibo del bien o servicio y
la aceptación o el rechazo. Es la cara de compras de la plataforma; el resto del panel se ocupa de
lo que tú emites.

Está en **Empresas → ⋮ → Documentos Electrónicos → Eventos RADIAN → Factura de compras**.

![Pestaña Eventos RADIAN con las sub-pestañas Listado, Paso a Producción y Factura de compras](https://manual.facturalatam.com/assets/images/22-radian-tabs-b694f705c71b7baa3aed22ab6cc423ce.png)

| Sub-pestaña | Qué contiene |
| --- | --- |
| **Listado** | Los eventos RADIAN que ya registraste. Si la empresa no ha registrado ninguno, dice *No hay documentos para mostrar*. |
| **Paso a Producción** | El selector de ambiente de los eventos. Cuidado con él: está explicado en [Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/). |
| **Factura de compras** | El extractor. Es lo que explica esta página. |

El extractor depende de un servicio aparte

No vive dentro del panel: habla con un servicio independiente que el administrador de la
plataforma tiene que dejar configurado y encendido. Por eso lo primero de la pantalla es el botón
**Probar conexión**, arriba a la derecha.

Si **Probar conexión** falla, o si ves un aviso amarillo que dice *Extractor no configurado*, no
es algo que puedas resolver desde aquí ni tiene que ver con tu certificado ni con tus
credenciales de la DIAN: **avisa a quien te presta el servicio**. Mientras tanto, los botones de
extracción salen desactivados.

### Antes de empezar: el ambiente manda

Junto al título verás el badge **Ambiente: Habilitación** o **Ambiente: Producción**. El extractor
consulta a la DIAN en **ese** ambiente, y la pantalla te lo recuerda en cada formulario.

Las consecuencias son prácticas: un CUFE de producción no se encuentra si la empresa tiene los
eventos en habilitación, y un enlace de consulta de un ambiente no sirve en el otro. Si una
búsqueda no devuelve nada, lo primero que hay que mirar es el badge.

Para consultar y descargar basta el certificado

Extraer, consultar por CUFE y descargar el XML o el JSON solo necesita el **certificado digital**
de la empresa. No hace falta tener registrado el ID y el PIN del software: una empresa que emite
sus ventas con otro proveedor puede usar el extractor igual. Si falta el certificado, la consulta
responde *La empresa no tiene un certificado (.p12) configurado*.

Lo que sí exige el **software de facturación** es **enviar** los eventos a la DIAN (acuse de
recibo, recibo del bien o servicio, aceptación o rechazo), porque se firman con su ID y su PIN.
Está explicado en [Paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/#qu%C3%A9-necesitas-seg%C3%BAn-lo-que-vayas-a-hacer).

### Modo 1 · Consulta por CUFE

Es el modo directo: ya sabes qué documento quieres y tienes su CUFE, el código único que lo
identifica ante la DIAN.

![Sub-pestaña Consulta por CUFE con el campo CUFE del documento y el botón Consultar](https://manual.facturalatam.com/assets/images/23-extractor-cufe-78bbb716f979bcfbbe3c4f7d4b519ba4.png)

Pega el CUFE en **CUFE del documento** y pulsa **Consultar**. La plataforma lo busca en la DIAN
con el certificado de la empresa y, si lo encuentra, aparece una ficha con los datos del
documento y estos botones:

| Botón | Qué hace |
| --- | --- |
| **Descargar XML** | Baja el XML tal como lo tiene la DIAN. |
| **Descargar JSON** | Baja los mismos datos en el formato del reporte, cómodo para pasarlos a otro sistema. |
| **Registrar en Eventos RADIAN** | Da de alta el documento como evento de compra. Solo aparece cuando el documento admite ese registro. |

Debajo hay dos bloques plegados, **XML** y **JSON**, por si quieres revisar el contenido sin
descargar nada: se abren y se cierran con un clic.

Si el CUFE no es del mismo ambiente que la empresa, la consulta no devuelve el documento. La
propia pantalla lo avisa en naranja justo debajo del campo.

### Modo 2 · Extracción por token

Es el modo masivo: en vez de un documento, traes todo lo que la DIAN tiene en un rango de fechas.

![Sub-pestaña Extracción por token con el tipo de listado, la URL de consulta y las fechas](https://manual.facturalatam.com/assets/images/24-extractor-reporte-a2d6c8c65169c2e6246df743597e49eb.png)

| Campo | Qué poner |
| --- | --- |
| **Tipo de listado DIAN** | **Documentos recibidos**: las facturas que te emitieron; son las que puedes registrar en Eventos RADIAN. **Documentos enviados**: las que emitiste tú; solo generan el reporte, sin eventos. |
| **URL de consulta por Token DIAN** | El enlace de autenticación que emite el portal de la DIAN. Tiene que ser del mismo ambiente que la empresa; si pegas uno del otro, el campo lo rechaza. |
| **Fecha desde** y **Fecha hasta** | El rango que quieres traer. Vienen rellenas con el mes en curso. |
| **Generar reporte por CUFEs** | Lanza la extracción. |

El proceso no es instantáneo: la plataforma consulta a la DIAN una vez por cada documento del
rango, así que cuanto más amplio sea, más tarda. Mientras trabaja verás una barra de **Progreso**
con el porcentaje y los contadores de lo que lleva hecho.

Cuando termina aparecen dos cosas:

* **Descargar reporte**, con los botones **Descargar Excel** y **Descargar JSON**.
* Una **Vista previa** con las primeras filas: número, tipo, folio, fecha, NIT y nombre del
  emisor, total, estado RADIAN y el resultado de la extracción de cada una.

Sobre esa tabla está el botón **Registrar válidos en Eventos RADIAN**, que da de alta de una vez
todas las filas que admiten registro.

Solo se registran las facturas que son tuyas

La plataforma únicamente deja cargar documentos en los que el adquiriente es el NIT de esta
empresa. Si el reporte trae facturas de otro, esas filas se quedan fuera. Es una protección, no
un fallo.

### Un tercer modo que todavía no está disponible

El extractor contempla un modo por **certificado .p12** (subir el certificado digital y su
contraseña para consultar directamente a la DIAN). Hoy está oculto en la interfaz porque sigue en
pruebas, así que no verás esa sub-pestaña ni hay captura de ella en este manual. Cuando se
habilite, se documentará aquí.

### Si algo no sale

| Síntoma | Por dónde empezar |
| --- | --- |
| El botón **Probar conexión** sale desactivado o falla | El servicio del extractor no está disponible. Avisa al proveedor del servicio. |
| La consulta por CUFE no encuentra el documento | Comprueba que el CUFE y la empresa estén en el mismo ambiente, y que el CUFE esté completo. |
| El campo de la URL no acepta el enlace | El enlace es del otro ambiente o no es el de autenticación que emite la DIAN. |
| El reporte sale vacío | Revisa el rango de fechas y el tipo de listado elegido. |
| Una factura no deja registrarse | Lo más común es que su adquiriente no sea el NIT de esta empresa. |

Dónde queda lo registrado

Todo lo que registres aparece en la sub-pestaña **Listado** de Eventos RADIAN y en el acceso
**Eventos RADIAN** del menú lateral mientras estás dentro de la empresa. El resto de listados se
explica en [Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/).

---

## Monitoreo y Backups

Fuente: <https://manual.facturalatam.com/interfaz/monitoreo-backups/>

Las páginas anteriores explican lo que se hace **dentro de una empresa**. Estas dos pantallas
hablan del **servidor**: cómo va de CPU, memoria y disco, y cómo liberar espacio sin perder los
archivos. Se leen juntas, porque la primera te dice que el disco se está llenando y la segunda es
donde se arregla.

Solo administrador de la plataforma

**Monitoreo** y **Backups** son pantallas de la plataforma, no de una empresa. Solo aparecen en el
menú lateral si entras como **administrador de la plataforma**. Si eres usuario de una
empresa no las verás, y escribir `/monitoring` o `/backups` directamente en la barra del navegador
responde **403 No autorizado**: no es un error de tu cuenta, es que esas pantallas no son tuyas. De
ese mantenimiento se encarga quien te presta el servicio.

### Monitoreo del servidor

Responde a una sola pregunta: cómo va el servidor que sostiene la plataforma.

![Pantalla Monitoreo del servidor con las tarjetas de CPU, Memoria y Almacenamiento y la gráfica de consumo histórico](https://manual.facturalatam.com/assets/images/35-monitoreo-c6c92569ea93f46fffd79918bad30333.png)

Arriba, el título **Monitoreo del servidor** con la etiqueta del entorno y el nombre del host al
lado, y a la derecha la hora de la última actualización.

No hace falta recargar la página

La pantalla se refresca sola **cada 10 segundos**. Si la dejas abierta mientras investigas algo,
los números se van moviendo por su cuenta: el valor que ves siempre es el de hace un momento, no el
de cuando abriste.

#### Las tres tarjetas

| Tarjeta | Qué mide |
| --- | --- |
| **CPU** | El porcentaje que está trabajando el procesador, con su barra y, debajo, **Carga** y **Núcleos**. |
| **Memoria** | La RAM usada frente a la total. |
| **Almacenamiento** | El disco usado frente al total. La barra se pone amarilla cuando el uso sube y roja cuando queda poco espacio. |

El disco lleno se nota primero en los documentos nuevos

Cuando **Almacenamiento** se acerca al 100 %, lo primero que falla es el guardado de los PDF y XML
de los documentos que se emiten. Si la ves en rojo, no esperes: pasa a
[Copias de seguridad](#copias-de-seguridad) y mira qué empresas están ocupando el espacio.

#### Consumo histórico

Una gráfica con tres líneas, **CPU %**, **RAM %** y **Disco %**, y un selector de periodo con cinco
opciones:

| Periodo | Para qué sirve |
| --- | --- |
| **Última hora** | Ver si algo está pasando ahora mismo. |
| **Últimas 6 horas** | Es el periodo que viene seleccionado por defecto. |
| **Últimas 24 horas** | Comparar la mañana con la tarde, o ver qué hizo el servidor de noche. |
| **Últimos 7 días** | Detectar si el consumo sube día a día en lugar de ser un pico aislado. |
| **Últimos 30 días** | La tendencia del mes. Útil sobre todo para el disco, que solo crece. |

Si es la primera vez que abres la pantalla, la gráfica avisa de que todavía no hay registros: se van
generando solos mientras el monitoreo esté activo.

#### Consumo por empresa

Una tabla que reparte el espacio ocupado entre las empresas de la instalación.

| Columna | Qué muestra |
| --- | --- |
| **NIT** | El número de identificación de la empresa. |
| **Empresa** | Su nombre o razón social. |
| **Storage** | Cuánto ocupan sus archivos en el disco. |

Tiene un buscador, *Buscar NIT o empresa*, para localizar una fila sin recorrer la lista, y un botón
para recalcular el dato. El cálculo se guarda unos minutos, así que si acabas de borrar archivos y el
número no baja, pulsa el botón de recálculo en lugar de recargar la página.

#### Picos de saturación

El último bloque lista los momentos en que el servidor se saturó, del más reciente al más antiguo.

| Columna | Qué muestra |
| --- | --- |
| **Fecha/hora** | Cuándo ocurrió. |
| **CPU%** | El porcentaje de procesador en ese instante. |
| **RAM%** | La memoria en ese instante. |
| **Disco%** | El disco en ese instante. |
| **Detalles** | Abre la ventana que explica qué lo provocó. |

Su propio selector de periodo tiene tres opciones, **Últimas 24 h**, **Últimos 7 días** y
**Últimos 30 días**, y la tabla muestra **15 filas por página**.

Un pico es un momento en que el CPU pasó del umbral de saturación, que **por defecto es el 85 %**.

Si no hubo picos, la tabla no se queda vacía

Cuando en el periodo elegido no se superó el umbral, la tabla **no sale en blanco: muestra en su
lugar los momentos de más CPU** del periodo. Es deliberado, para que siempre haya algo que
investigar, pero conviene saberlo: si las filas traen un CPU del 20 % o del 40 %, no son picos de
saturación, son simplemente lo más alto que hubo. No hay nada que arreglar.

#### La ventana de detalles de un pico

El botón **Detalles** de una fila abre la ventana **Qué saturó el CPU**, con la hora del pico al
lado del título, un resumen de CPU, memoria y disco de ese instante y tres tablas:

| Bloque | Columnas | Qué te dice |
| --- | --- | --- |
| **Consultas SQL que estaban corriendo** | Tiempo, Estado, Consulta | Qué le estaba pidiendo la plataforma a la base de datos justo entonces. |
| **Procesos que más consumían** | PID, Usuario, CPU%, MEM%, RES, Tiempo, Comando | Una foto del servidor al estilo de `htop`: sirve para ver si quien consumía era la plataforma u otro proceso de la máquina. |
| **Peticiones lentas en ese momento** | Ruta o acción, Duración, Consultas, Consulta más lenta | Qué pantalla o qué llamada de la API tardó, cuántas consultas lanzó y cuál de ellas fue la peor. |

Una petición cuenta como **lenta** cuando pasa de **3 segundos**, que es el valor por defecto.

Para investigar por qué tarda una factura

De cada petición registrada se guarda además, sin que se vea en esta pantalla, el reparto de su
tiempo por etapa: arranque, envío a la DIAN, PDF, firma, AttachedDocument, correo y S3. Cómo
bajar el umbral un rato, consultarlo y leerlo está en
[Rendimiento y velocidad](https://manual.facturalatam.com/apidian/rendimiento/).

El historial se conserva 7 días por defecto

Pasado ese plazo, los registros antiguos se eliminan solos. Un pico de hace diez días ya no se puede
investigar: la fila desaparece y con ella sus consultas, sus procesos y sus peticiones lentas. Si
alguien reporta una lentitud, entra a mirarlo **esa misma semana**.

### Copias de seguridad

La pantalla **Copias de seguridad**, etiquetada *Backups*, sirve para dos cosas a la vez: guardar los
archivos de las empresas en un ZIP descargable y liberar el espacio que ocupan en el servidor.

Esta pantalla se describe sin captura por ahora

Lo que sigue se explica con texto a propósito: la pantalla lista **todas las empresas de la
instalación** con su NIT y su nombre, así que no se publica una captura hasta tenerla con datos de
prueba. Los nombres de botones y columnas son los reales, y están tal cual los verás.

En la cabecera, junto al título, verás el texto **Calculado** con la fecha y hora del último cálculo
y un botón **Recalcular**.

#### Las cuatro tarjetas

| Tarjeta | Qué muestra |
| --- | --- |
| **Espacio ocupado** | Lo que pesan en total los archivos de los documentos de todas las empresas. |
| **Disco libre** | Lo que queda libre en el disco, con el porcentaje usado y una barra. La barra se pone **amarilla a partir del 80 %** y **roja a partir del 90 %**, y en ese caso avisa además con *Espacio crítico*. |
| **Empresas** | Cuántas empresas están ocupando espacio en disco. |
| **Respaldar todo** | Un botón **Generar ZIP** que respalda de golpe los archivos de todas las empresas. |

#### Peso en disco por empresa

La tabla central reparte el espacio empresa por empresa y cierra con una fila de **Total**.

| Columna | Qué muestra |
| --- | --- |
| **NIT** | El número de identificación de la empresa. |
| **Empresa** | Su nombre o razón social. |
| **Tamaño** | Cuánto ocupan sus archivos. |
| **Acciones** | Los dos botones de la fila. |

Cada fila trae dos botones, y conviene no confundirlos:

| Botón | Qué hace |
| --- | --- |
| **Respaldar todo** | Genera un ZIP con **todos** los archivos de esa empresa, sin filtrar por fecha. No borra nada. |
| **Liberar Espacio** | Abre la ventana **Gestionar por fecha**, que es donde se elige un periodo y se decide qué hacer con él. |

El peso no se mide al abrir la pantalla

El tamaño que ves está **precalculado**: se actualiza solo cada pocas horas. Si acabas de respaldar y
purgar, la tabla seguirá mostrando el peso anterior hasta que pulses **Recalcular**. Recargar la
página no basta.

#### Respaldos generados

El listado de los ZIP que se han pedido, con estas columnas:

| Columna | Qué muestra |
| --- | --- |
| **Alcance** | Si el respaldo es de una empresa concreta o de todas. |
| **Empresa** | A quién pertenece, cuando el alcance es de una sola. |
| **Rango** | Las fechas de los archivos incluidos. |
| **Solicitado** | Cuándo se pidió. |
| **Estado** | En qué punto va. |
| **Tamaño** y **Archivos** | Lo que pesa el ZIP y cuántos archivos trae. |
| **Acciones** | Descargar el ZIP o eliminarlo. |

Los respaldos **se generan en segundo plano**: pedir uno no bloquea la pantalla y la tabla se
refresca sola cada pocos segundos mientras haya algo en marcha. Los estados posibles son cuatro:

| Estado | Qué significa |
| --- | --- |
| **En cola** | Se ha pedido y está esperando turno. |
| **Generando** | Se está empaquetando ahora mismo. |
| **Listo** | Terminado. Es cuando el ZIP se puede descargar. |
| **Falló** | No se pudo generar. En lugar del tamaño aparece el motivo del error. |

Eliminar un respaldo de esta tabla **borra solo el ZIP**, no los archivos de la empresa.

#### Purgas realizadas

Debajo, el registro de los borrados que se han hecho. Es el historial que te permite saber qué se
liberó, cuándo y cuánto.

| Columna | Qué muestra |
| --- | --- |
| **Alcance** | Si la purga fue de una empresa concreta o de todas. |
| **Empresa** | A quién pertenece. |
| **Rango** | Las fechas de los archivos borrados. |
| **Solicitado** | Cuándo se pidió. |
| **Estado** | En qué punto va. |
| **Borrados** | Cuántos archivos se eliminaron. |
| **Liberado** | Cuánto espacio se recuperó. |

Las purgas también corren en segundo plano, con sus propios cuatro estados: **En cola**,
**Borrando**, **Hecho** y **Falló**.

#### Gestionar por fecha

Es la ventana que abre el botón **Liberar Espacio** de una fila, y la única desde la que se borra
algo. Arriba, el filtro:

| Control | Qué hace |
| --- | --- |
| **Año** | Un selector en el que cada opción trae ya el número de archivos y su peso. Incluye una opción **Todos**, también con su total. |
| **Desde** y **Hasta** | Un rango de fechas concreto, para cuando el año entero es demasiado. |
| El botón de limpiar | Deja el filtro en blanco. |

El filtro usa la **fecha del archivo**, y hay una regla que conviene tener clara: **si pones un rango
en Desde y Hasta, el rango manda sobre el año seleccionado**.

Debajo del filtro hay una **vista previa** que te dice cuántos archivos coinciden y cuánto pesan
antes de que hagas nada. Y luego, las dos acciones:

| Acción | Qué hace |
| --- | --- |
| **Respaldar este rango** | Su botón **Generar ZIP** empaqueta lo que coincide con el filtro y lo deja descargable en *Respaldos generados*. No borra nada. |
| **Liberar espacio** | La zona roja del pie. Borra del servidor los archivos que coinciden con el filtro. |

##### La doble confirmación del borrado

El botón **Borrar definitivamente** **nace deshabilitado** y no se activa hasta que cumplas los dos
pasos, en este orden:

1. **Escribir el NIT de la empresa** en el campo de confirmación. La propia ventana te muestra cuál
   espera; tiene que coincidir exactamente.
2. **Marcar la casilla** que dice que entiendes que esto borrará los archivos de forma permanente.

Hasta que las dos cosas estén hechas, el botón no responde. Es a propósito: así nadie purga por
inercia creyendo que es un clic más.

Liberar espacio borra archivos y no se deshace

Purgar elimina del servidor los PDF, XML y ZIP del rango elegido, y no hay forma de recuperarlos
desde el panel. El orden correcto es siempre: **respaldar, descargar el ZIP, abrirlo para comprobar
que trae lo que debe y solo entonces purgar**. Descargarlo no es suficiente: un ZIP que no abre no
es un respaldo.

Los documentos siguen existiendo ante la DIAN y sus registros siguen en el panel. Lo que se pierde
es la posibilidad de volver a descargar sus archivos desde aquí.

### Qué revisar y cada cuánto

| Cuándo | Dónde | Qué miras |
| --- | --- | --- |
| Una vez a la semana | Monitoreo, tarjeta **Almacenamiento** | Que el disco no se esté acercando al límite. Es lo único que crece solo y sin avisar. |
| Una vez al mes | Monitoreo, **Consumo histórico** en *Últimos 30 días* | Si el consumo sube mes a mes, el problema no es un pico: es que la instalación se quedó pequeña. |
| Cuando alguien reporte lentitud | Monitoreo, **Picos de saturación** | Esa misma semana, antes de que el registro se borre a los 7 días. |
| Cuando el disco apriete | Backups, **Peso en disco por empresa** | Qué empresas ocupan más, para empezar por ahí. |

Y el camino para liberar espacio sin perder nada, que son siempre los mismos cuatro pasos:

1. En **Peso en disco por empresa**, pulsa **Liberar Espacio** en la empresa más pesada.
2. Elige el año o el rango más antiguo y usa **Respaldar este rango**.
3. Espera a que el respaldo figure como **Listo**, descarga el ZIP y **ábrelo** para comprobarlo.
4. Vuelve a la ventana, repite el mismo filtro y purga con la doble confirmación.

Purga siempre lo más antiguo primero

Los archivos de hace años son los que nadie vuelve a descargar y los que más espacio liberan por
purga. Empieza por el año más viejo de la empresa más pesada: con eso suele bastar, y es la
operación con menos riesgo de que alguien echase en falta algo.

---

## Paso a producción

Fuente: <https://manual.facturalatam.com/interfaz/paso-a-produccion/>

Léelo entero antes de pulsar nada

El paso a producción es **irreversible desde el panel** y **gasta consecutivos reales ante la
DIAN**: el documento de prueba que se envía consume un número de tu numeración y no se recupera.
Al terminar, la empresa deja de facturar en pruebas y cada documento que emita será una factura
de verdad.

Este manual se queda en **Habilitación**: las capturas son del formulario antes de enviar nada.
Lee esta página para entender el proceso, no la uses como una lista para ir pulsando botones. El
paso real se hace una sola vez, con la empresa ya revisada, el certificado vigente, el software
registrado y las resoluciones de producción en la mano.

### Qué es y cuándo toca

Mientras la empresa está en Habilitación, todo lo que emite viaja a un entorno de pruebas de la
DIAN: sirve para comprobar que la facturación funciona, pero no tiene valor fiscal. Para facturar
de verdad, la DIAN pide superar un **set de pruebas**: te entrega un identificador, tú le envías
un documento con él, ella lo valida y entonces te habilita en producción.

El asistente del panel hace ese recorrido por ti. Está en
**Empresas → ⋮ → Documentos Electrónicos →** la pestaña del tipo de documento **→ Paso a
Producción**, y **cada tipo de documento tiene el suyo**: pasar la factura electrónica a
producción no pasa la nómina ni el documento soporte.

Antes de empezar necesitas tener listo:

* el **certificado digital** cargado y vigente;
* el **ID y el PIN del software** que la DIAN te asignó;
* el **TestSetId** (identificador del set de pruebas) que la DIAN te entrega;
* las **resoluciones de producción** ya expedidas por la DIAN.

Si algo de eso falta, lo encuentras en
[Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/) y en
[Resoluciones y plantillas](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/).

### El asistente, paso por paso

![Sub-pestaña Paso a Producción con el asistente de tres pasos y el badge Ambiente Habilitación](https://manual.facturalatam.com/assets/images/18-paso-produccion-f02696cff42ae0b27ab8a9fc106e0750.png)

Arriba ves la barra de los tres pasos: **1 Configuración de Software**, **2 Paso a Producción** y
**3 Resoluciones de Producción**. Los botones **Volver** y **Siguiente** de abajo solo te mueven
entre pasos dentro de la pantalla; no envían nada a la DIAN. Lo que sí envía es el botón de cada
paso.

Fíjate en que el badge de la cabecera sigue diciendo **Ambiente: Habilitación**. Mientras ponga
eso, la empresa está en pruebas.

#### Paso 1 · Configuración de Software

Dos campos: **ID Software** y **PIN Software**, los que la DIAN te dio al registrar tu software.
Si la empresa ya los tiene, el panel muestra un aviso verde *Ya tienes un software configurado*
con los valores cargados, y el botón pasa a llamarse **Actualizar Software** en vez de
**Crear Software**. En ese caso no hay nada que hacer aquí: pulsa **Siguiente**.

El PIN del software es una credencial

No lo compartas ni lo dejes a la vista en capturas. En este manual aparece oculto.

#### Paso 2 · El set de pruebas

Es el corazón del proceso y el único punto que gasta consecutivos.

![Paso 2 del asistente con el campo Set de Pruebas DIAN, el botón Iniciar Paso a Producción y la caja de ZipKey anterior](https://manual.facturalatam.com/assets/images/19-paso-produccion-zipkey-c48775fffe5ea89e37d4dc6fda6e5572.png)

| Control | Qué hace |
| --- | --- |
| **Set de Pruebas DIAN** | Aquí pegas el TestSetId que te entregó la DIAN. |
| **Iniciar Paso a Producción** | Arranca el proceso completo. Es el botón que no conviene pulsar hasta estar seguro. |
| **ZipKey entregado por la DIAN al enviar el set de pruebas** | Una caja aparte para retomar un envío anterior, sin volver a enviar nada. |
| **Consultar ZipKey** | Retoma el proceso con el ZipKey que escribiste en esa caja. |

Al pulsar **Iniciar Paso a Producción** se despliegan tres sub-pasos y verás su estado en vivo:

1. **Enviar Factura de Prueba** — el panel emite el documento del set de pruebas y lo manda a la
   DIAN. **Aquí se consume un consecutivo.** La DIAN responde con un **ZipKey**: el acuse de que
   recibió el envío.
2. **Consultar ZipKey** — con ese código se le pregunta a la DIAN si ya validó el documento.
3. **Cambiar Ambiente a Producción** — solo si la DIAN aprobó, el panel mueve la empresa a
   producción para ese tipo de documento.

#### Qué es el ZipKey y por qué hay que esperar

La DIAN no valida en el momento: pone tu envío en una cola. Mientras tanto responde que el
documento *se encuentra en proceso de validación* y pide consultar más tarde. Eso **no es un
error**, es el funcionamiento normal, y la espera puede ser de minutos.

El ZipKey es el comprobante de ese envío. El panel lo guarda en tu navegador y vuelve a consultar
solo, cada pocos segundos, mostrando el intento en el que va y cuánto lleva esperando. Cuando
aparece el ZipKey, tienes tres botones:

| Botón | Qué hace |
| --- | --- |
| **Consultar ahora** | Fuerza una consulta inmediata en vez de esperar al siguiente reintento. |
| **Detener** | Para la consulta automática. El ZipKey se conserva. |
| **Olvidar** | Borra el ZipKey guardado. Úsalo solo si vas a empezar de cero. |

Si la DIAN tarda demasiado, el panel deja de reintentar y te avisa de que el ZipKey quedó
guardado. No se perdió nada: el documento ya está en la DIAN.

Nunca reenvíes el documento de prueba para desatascar

Reenviarlo gasta **otro** consecutivo y no acelera nada. Si cerraste la página o te cansaste de
esperar, vuelve más tarde y pega el ZipKey en la caja *¿Ya tienes el ZipKey de un envío anterior?*
Con **Consultar ZipKey** el asistente retoma desde el paso 2 sin enviar nada nuevo. Además, si al
abrir la pantalla queda una consulta pendiente de una sesión anterior, el panel te lo dice y
espera a que tú pulses **Consultar ahora**: no continúa solo, precisamente para no cambiarte el
ambiente sin que lo pidas.

Si la DIAN rechaza el documento, el panel muestra los motivos concretos. Eso no se arregla
reintentando: hay que corregir lo que señala y volver a enviar.

#### Paso 3 · Resoluciones de producción

Una vez la empresa está en producción, este paso sirve para confirmar qué numeración le tiene
asignada la DIAN. El botón **Consultar** trae las resoluciones asociadas a la empresa y el enlace
**Vista Previa** abre una ayuda con imágenes de dónde encontrar esos datos en el portal de la
DIAN.

Las resoluciones que aparezcan hay que registrarlas en el panel para poder emitir con ellas; eso
se hace en [Resoluciones y plantillas](https://manual.facturalatam.com/interfaz/resoluciones-plantillas/).

### Cómo saber que ya estás en producción

El badge de la cabecera pasa de **Ambiente: Habilitación** (amarillo) a **Ambiente: Producción**
(verde), y los documentos nuevos salen marcados como de Producción en el listado.

Revisa el aviso rojo

Si junto al badge aparece uno rojo del tipo **Envía a Habilitación**, la marca de la empresa y la
de su software no coinciden. Manda lo que diga el software. Antes de emitir nada, resuelve esa
diferencia; está explicado en
[Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/).

### El caso aparte: Eventos RADIAN

La pestaña **Eventos RADIAN** también tiene una sub-pestaña **Paso a Producción**, pero no es un
asistente: los eventos no tienen set de pruebas ni un software aparte. Lo único que hay es un
selector **Estado del Ambiente** con las opciones *Habilitación* y *Producción*.

![Sub-pestaña Paso a Producción de Eventos RADIAN con el selector Estado del Ambiente y el aviso de que falta el software](https://manual.facturalatam.com/assets/images/48-radian-ambiente-sin-software-3394d68688fd2e4e078c77d01c665b8e.png)

Ese selector se aplica al instante

No hay botón de confirmación: en cuanto cambias la opción, el cambio queda guardado. Y decide
contra qué entorno de la DIAN trabaja el [extractor de documentos de
compra](https://manual.facturalatam.com/interfaz/extractor-compras/). No lo toques para mirar.

#### Qué necesitas según lo que vayas a hacer

Los eventos no tienen software propio: usan el **software de facturación electrónica** de la
empresa. Pero no todo lo que hay en la pestaña lo necesita:

| Lo que haces | Qué necesita |
| --- | --- |
| Cambiar el **Estado del Ambiente** de los eventos | Nada más. Funciona aunque la empresa no tenga software registrado. |
| **Consultar y descargar** facturas recibidas (el extractor, la consulta por CUFE) | Solo el **certificado digital** vigente. |
| **Enviar eventos** (acuse de recibo, recibo del bien o servicio, aceptación o rechazo) | El **ID y el PIN del software de facturación**, además del certificado. |

Por eso una empresa que factura con otro proveedor y solo usa la plataforma para traerse sus
facturas de compra puede trabajar sin registrar software.

Si la empresa no lo tiene registrado, el selector muestra un aviso naranja: *Esta empresa no tiene
software de facturación configurado. Puede cambiar el ambiente y descargar facturas, pero para
enviar eventos debe registrar el ID y el PIN en Ver configuración*. El enlace lleva a
[Completar la configuración](https://manual.facturalatam.com/interfaz/configuracion-inicial/), a la pestaña **Facturas**.

Las demás pestañas sí piden el software

En **Factura electrónica**, **Nómina electrónica**, **Documento soporte** y **Documentos
equivalentes**, cambiar
el ambiente sin software sigue respondiendo *La empresa no tiene software configurado. Configure
el software antes de cambiar el ambiente*: ahí la marca de la empresa y la URL de envío del
software tienen que moverse juntas.

---

## Resoluciones y plantillas

Fuente: <https://manual.facturalatam.com/interfaz/resoluciones-plantillas/>

Una resolución es el permiso de la DIAN para numerar documentos: te dice con qué prefijo, desde
qué número hasta qué número y entre qué fechas puedes facturar. La plantilla es otra cosa muy
distinta: es el diseño del PDF que ve tu cliente. Las dos se configuran en la misma pantalla, una
en cada sub-pestaña.

### Dónde están las resoluciones

Hay dos sitios y muestran los mismos datos:

| Camino | Qué te da |
| --- | --- |
| **Empresas → ⋮ → Documentos Electrónicos →** la pestaña del tipo de documento **→ Resoluciones** | Solo las resoluciones de ese tipo, separadas por ambiente. Es el camino normal. |
| **Empresas → ⋮ → Configuración inicial → Resoluciones** | La pantalla **Listado de Resoluciones**, con todas las resoluciones de la empresa juntas. |

### La sub-pestaña Resoluciones

![Sub-pestaña Resoluciones de Factura electrónica con el conmutador Habilitación y Producción y la tabla de resoluciones](https://manual.facturalatam.com/assets/images/20-resoluciones-tab-3a17fb959688580c48570f824e91455b.png)

Arriba del todo hay dos botones azules, **Habilitación** y **Producción**. Son un conmutador de
**vista**: cambian la lista que estás mirando, nada más. Pulsarlos no mueve de ambiente a la
empresa ni a ninguna resolución. La pantalla se abre en el ambiente actual de la empresa, que es
donde tiene sentido trabajar.

Debajo, el título **Resoluciones en Habilitación** (o en Producción) y la tabla:

| Columna | Qué muestra |
| --- | --- |
| **Prefijo** | Las letras que van delante del consecutivo, por ejemplo SETP. |
| **Número** | El número de la resolución que emitió la DIAN. |
| **Tipo de Documento** | Factura de Venta Nacional, Nota Crédito, Documento Soporte Electrónico, etc. |
| **Fecha** | Fecha de la resolución. |
| **Rango** | Desde qué consecutivo hasta cuál puedes emitir. |
| **Vigencia** | Entre qué fechas vale la resolución. |
| **Clave Técnica** | El código secreto que la acompaña. Aparece oculto a propósito en este manual. |
| **Acciones** | El lápiz para editar la resolución. |

A la derecha del título está **Nueva resolución**. Ese botón **solo aparece en el ambiente actual
de la empresa**; en el otro, en su lugar sale el aviso *Solo se pueden crear en el ambiente actual
de la empresa*. Es intencionado: así nadie registra por error una resolución de producción en una
empresa que todavía está en pruebas.

#### Registrar una resolución

**Nueva resolución** abre un formulario con los datos tal como vienen en el documento de la DIAN.

| Campo | Qué poner |
| --- | --- |
| **Tipo de Documento** | Para qué documento sirve esta numeración. |
| **Prefijo** | Hasta cuatro caracteres. Debe ser el mismo del documento de la DIAN. |
| **Número de Resolución** | El número que aparece en la resolución. |
| **Fecha de Resolución** | La fecha en que la DIAN la expidió. |
| **Clave Técnica** | El código que acompaña a la resolución. En **Documento Soporte** el campo está bloqueado, porque la DIAN no lo exige. |
| **Rango Inicial** y **Rango Final** | El primer y el último consecutivo autorizados. |
| **Vigencia Desde** y **Vigencia Hasta** | Las fechas entre las que puedes usarla. |

Pulsa **Guardar** y la resolución queda registrada en el ambiente que indica el título de la
ventana. Si algún dato no cuadra, el campo se marca en rojo con el motivo debajo.

Para corregir una resolución ya registrada usa el lápiz de la columna **Acciones**. El formulario
es el mismo con una diferencia: el **Prefijo** sale bloqueado, porque cambiarlo descuadraría los
documentos ya emitidos con él.

Copia los datos tal cual

El prefijo, el rango y la clave técnica tienen que coincidir carácter por carácter con lo que
emitió la DIAN. Un dígito distinto no se nota aquí: se nota cuando la DIAN rechaza la primera
factura. Si ya emitiste documentos con una resolución, no toques su rango sin comprobar por dónde
va el consecutivo.

### La pantalla completa de resoluciones

Es la misma información sin separar por tipo ni por ambiente, útil para revisar de un vistazo qué
tiene la empresa.

![Pantalla Listado de Resoluciones con la columna Entorno y todas las resoluciones de la empresa](https://manual.facturalatam.com/assets/images/30-resoluciones-pantalla-41aa941620ad6f5e3bd2c2738c4a203a.png)

Cambian dos cosas respecto a la sub-pestaña:

* Aparece la columna **Entorno**, que dice si cada resolución es de **Habilitación** o de
  **Producción**.
* Cuando una resolución antigua no tiene ambiente asignado, en esa celda sale un botón
  **Actualizar** en vez del nombre del ambiente.

El ambiente de una resolución no se cambia a la ligera

Mover una resolución de Habilitación a Producción, o al revés, decide con qué numeración se
emitirán los documentos siguientes. No es un ajuste cosmético. El cambio de ambiente de verdad se
hace al final del [paso a producción](https://manual.facturalatam.com/interfaz/paso-a-produccion/), no desde esta pantalla.

### La sub-pestaña Plantilla PDF

Aquí eliges cómo se ve el PDF que se le entrega al cliente. Es puramente visual: no cambia los
datos del documento ni lo que se envía a la DIAN.

![Sub-pestaña Plantilla PDF con la rejilla de plantillas y el botón Guardar plantilla](https://manual.facturalatam.com/assets/images/21-plantillas-tab-bf418a3ffb5745f10e1052c65adb07ae.png)

Cada tarjeta es una plantilla, con su miniatura y su nombre (**Plantilla 1**, **Plantilla 2**…).
La que está en uso lleva la etiqueta **Actual** en la esquina.

| Control | Qué hace |
| --- | --- |
| La tarjeta | Haz clic en cualquier parte para seleccionarla. |
| **PDF** | Genera un documento de ejemplo con esa plantilla y lo abre en otra pestaña, para que la veas con los datos de tu empresa antes de decidir. El ejemplo no se registra en ningún sitio ni tiene validez fiscal. |
| **Guardar plantilla** | Aplica la plantilla seleccionada. A partir de ahí, los PDF nuevos salen con ese diseño. |

Algunas tarjetas muestran *Vista previa no disponible*: la plantilla existe y se puede usar, solo
que no tiene miniatura cargada. Para verla, usa el botón **PDF**.

La plantilla es **por tipo de documento**: la que elijas en **Factura electrónica** no afecta a la
de **Documento soporte** ni a la de **Nómina electrónica**. Eso sí, la plantilla de factura se
usa también para sus **notas crédito y débito**.

Si no ves el botón PDF

La vista previa necesita que el tipo de documento ya tenga su resolución registrada: sin
numeración no hay con qué armar el ejemplo. En ese caso la pantalla te lo dice con un aviso azul
al final. Registra la resolución en la sub-pestaña anterior y vuelve.

Cambiar la plantilla no rehace los PDF antiguos

Los documentos ya emitidos conservan el diseño con el que se generaron. La plantilla nueva se
aplica a los siguientes.

Si vendes por cajas

Cuando tu sistema envía en cada línea las unidades por caja (`package_quantity`), las cajas
(`packages`) y las unidades sueltas (`loose_units`), el PDF de factura las imprime: las plantillas
**1** y **2** como las columnas **Und x Caja**, **Cajas** y **Unds**, con la fila **Total Cajas**
en los totales, y las plantillas **3** y **9** como una línea bajo la descripción del ítem
(*Cajas: 10 x 12 + 3 und*). Las demás plantillas no cambian, y la columna **Cantidad** sigue siendo
la que se declara a la DIAN.

---

## Usuarios, correo y almacenamiento

Fuente: <https://manual.facturalatam.com/interfaz/usuarios-correo-almacenamiento/>

Tres ajustes que son propios de cada empresa y que se abren desde el menú de su fila en
**Empresas**: quién puede entrar, desde qué dirección salen los correos a los clientes y dónde se
guardan los archivos que se van generando.

### Usuarios de la empresa

**Empresas → ⋮ → Usuarios** abre el **Listado de Usuarios** de esa empresa.

![Pantalla Listado de Usuarios con las columnas Tipo, Nombre, Correo y Documento](https://manual.facturalatam.com/assets/images/28-usuarios-090c00cf7ae9f91754f49298340d5a80.png)

| Columna | Qué muestra |
| --- | --- |
| **Tipo** | Para qué sirve la cuenta: **Facturación**, **RIPS** o **Facturación + RIPS**. |
| **Nombre** | Nombre de la persona o de la empresa. |
| **Correo** | La dirección con la que entra al panel. |
| **Documento** | Tipo y número de documento de identidad. |

La cuenta dueña de la empresa lleva la etiqueta azul **Principal** y **no tiene botón Editar**: es
la cuenta a la que está colgada toda la configuración de la empresa, así que desde esta pantalla
no se toca. Las demás sí traen su botón **Editar**.

#### Añadir o editar un usuario

El botón **Añadir usuario**, arriba a la derecha, abre el mismo formulario que el botón
**Editar**.

| Campo | Para qué |
| --- | --- |
| **Tipo de documento** y **Número de documento** | Identificación de la persona. |
| **Nombre** | Cómo se le llama en el panel. |
| **Correo electrónico** | Con esta dirección entra. No puede repetirse. |
| **Contraseña** y **Confirmar Contraseña** | La clave de acceso. Al editar, déjalas vacías si no la vas a cambiar. |
| **Código de prestador de servicio** | Solo para salud: el código de doce dígitos del prestador. |
| **URL Validador fev-rips** | Solo para salud: la dirección del validador de RIPS que se va a usar. |
| **Tipo de usuario** | **Facturación**, **RIPS** o **Ambos**. Es lo que decide a qué puede entrar. |

Pulsa **Guardar** para terminar. Si algo falla, el formulario se vuelve a abrir con el error
señalado.

Una cuenta por persona

Da de alta un usuario por cada persona que vaya a trabajar con la empresa en vez de compartir una
sola cuenta. Así, cuando alguien deja de necesitar acceso, se le cambia la contraseña a él y no
se queda media oficina fuera.

Esto no es lo mismo que el token

Estos usuarios son para entrar al **panel**. La credencial que usan tus propios sistemas para
integrarse es otra cosa, vive en el modal **Editar Empresa** y se explica en
[Listado de empresas](https://manual.facturalatam.com/interfaz/empresas/).

### Configuración de correo

Cuando se le envía un documento a un cliente, el correo sale desde alguna dirección. Por defecto
es la general de la plataforma; aquí puedes poner la de la empresa, para que el cliente reciba el
mensaje desde un remitente que reconoce.

Se abre con **Empresas → ⋮ → Configurar Correo**.

![Pantalla Configuración de Correo con los campos de servidor SMTP, puerto, encriptación, usuario y contraseña](https://manual.facturalatam.com/assets/images/29-correo-smtp-aac32e57b0d91560d425e746e3c03de9.png)

Lo primero que conviene mirar es la franja gris superior, que dice en qué situación estás:
*Usando configuración general del sistema* o *Configuración personalizada*.

| Campo | Qué poner |
| --- | --- |
| **Servidor SMTP** | El servidor de salida de tu proveedor de correo. |
| **Puerto** | El puerto de ese servidor. |
| **Encriptación** | **TLS** o **SSL**, según lo que pida tu proveedor. Tiene que ir acorde con el puerto. |
| **Usuario** | La cuenta con la que se autentica el envío. |
| **Contraseña** | Su clave. Si ya había una configuración guardada, deja el campo vacío para conservar la contraseña actual. |
| **Correo del remitente (From)** | La dirección que verá el cliente. Si lo dejas vacío se usa el usuario SMTP. |
| **Nombre del remitente** | El nombre visible. Si lo dejas vacío se usa el nombre de la empresa. |

**Guardar Configuración** aplica los cambios.

Pruébalo con un documento de habilitación

Estos datos los da tu proveedor de correo, y muchos exigen una contraseña de aplicación en vez de
la del buzón. Después de guardar, reenvía un documento de pruebas y comprueba en el listado que
la columna **Correo** se pone en **Enviado**. Si sale **Error**, el botón de esa columna te dice
el motivo. El listado está explicado en
[Documentos electrónicos](https://manual.facturalatam.com/interfaz/documentos-electronicos/).

### Almacenamiento de archivos

Cada documento emitido deja archivos: el XML, el PDF y el ZIP que los agrupa. Esta ventana decide
dónde se guardan. Se abre con **Empresas → ⋮ → Almacenamiento**.

![Ventana Almacenamiento de archivos con la pregunta de dónde se guardan los archivos y las tres opciones](https://manual.facturalatam.com/assets/images/07-almacenamiento-a0560ac69a9cff7eb48e4b325d1a4526.png)

| Opción | Qué implica |
| --- | --- |
| **Local** | Los archivos se quedan en el disco del servidor donde corre la plataforma. Es lo más simple, pero el espacio del servidor es limitado. |
| **Nube (S3)** | Los archivos se suben a Amazon S3. No ocupan espacio en el servidor y se consultan desde cualquier sitio. Requiere que la plataforma tenga el almacenamiento en nube configurado. |
| **Local + Nube** | Se guardan en los dos sitios a la vez. Si uno falla, el otro sirve de respaldo. Es la opción más segura y la que más espacio consume. |

Elige en el desplegable y pulsa **Guardar**.

El cambio afecta a lo que venga después

Cambiar esta opción no mueve los archivos que ya existen: decide dónde se guardarán los
siguientes. Si pasas de local a nube, los documentos antiguos siguen donde estaban.

Si la opción de nube no funciona

El almacenamiento en nube lo configura quien administra la plataforma, una vez para todo el
sistema. Si la seleccionas y los archivos no aparecen, no es un ajuste de tu empresa: avisa al
administrador.
