# Etapa 5 — Integración con Odoo 19

> Cuarta y última etapa de DataDian (2 a 5), según el orden fijado por el usuario el 12-nov-2026 ([ruta de trabajo](../modules/documents/RUTA_DE_TRABAJO_DATADIAN.md)). Antes era la Etapa 8. No está en el roadmap del [blueprint oficial](<../modules/documents/DataDian/arquitectura Eventos RADIAN DIAN.md>): la agrega la suite para cerrar el ciclo contable (Documento madre §4.4, D-15 y D-16). Arquitectura: [ARQUITECTURA_DATADIAN_TELCO.md](../modules/documents/ARQUITECTURA_DATADIAN_TELCO.md) §8, [ARQUITECTURA_DB_DATADIAN.md](../modules/documents/ARQUITECTURA_DB_DATADIAN.md) §7.8 (`odoo_document_links`, subetapa 2.8) y [ADR-014](../decisions/ADR-014-arquitectura-datadian-telco.md).

| Campo | Valor |
|---|---|
| Estado | Especificación propuesta el 12-nov-2026. No se implementa hasta que el usuario lo ordene. **El disparador (aceptación expresa 033) está propuesto y pendiente de confirmar** |
| Componente | DataDian: módulo `documents` de la API y la cola de trabajos de Telco (`telco_jobs`, Etapa 2) |
| Base | Documento madre §4.4, §10 y D-16; [ADR-011](../decisions/ADR-011-alcance-funcional.md); código conservado en `apps/api/src/modules/documents/`: `odoo.client.ts`, `odoo-vendor-bill.ts`, `documents-settings.*` y, en la web, `settings-page.tsx` |
| Criterio de salida | Una factura con el evento 033 aceptado por la DIAN queda como **borrador de factura de proveedor** en el Odoo 19 Online de Telcobras, con el XML adjunto, sin duplicados ante reintentos y con los tres riesgos del código conservado corregidos |

## 1. Objetivo

Que la factura recibida, una vez aceptada, llegue a la contabilidad sin digitarla: DataDian crea en Odoo 19 el borrador de la factura de proveedor con los datos del XML oficial y se lo adjunta. La aprobación final sigue siendo humana, dentro de Odoo.

## 2. Alcance

**Entra:**
- El disparador: **propuesto**, el evento 033 (aceptación expresa) **aceptado por la DIAN**. Pendiente de confirmar con el usuario; las alternativas son el 032 aceptado o un botón manual.
- La creación del borrador reutilizando el cliente Odoo conservado, adaptado para tomar los datos del XML (líneas e impuestos incluidos) y adjuntar el XML.
- La configuración de la conexión por organización, que ya existe (`odoo_connections`, `documents-settings.*`, `settings-page.tsx`).
- La corrección de los tres riesgos del código conservado (§6).
- El aviso de vencimiento de la API key de Odoo.

**No entra:**
- Confirmar o publicar la factura en Odoo: queda en borrador para la aprobación humana.
- Pagos, conciliación y notas.
- Sincronizar maestros (proveedores, productos, cuentas) desde la suite: si el proveedor no existe en Odoo, el borrador queda sin proveedor y con un aviso.
- El resto de conectores y el Integration Hub completo: etapa 7.

## 3. Lo que ya se sabe de Odoo 19 Online

| Hecho | Consecuencia | Fuente |
|---|---|---|
| La API JSON-2 de Odoo 19 recibe `POST /json/2/<modelo>/<método>`, con la API key en `Authorization: bearer` y la base en `X-Odoo-Database` | Es lo que implementa `odoo.client.ts` (tiempo máximo de 30 s y sin seguir redirecciones) | Documentación oficial de Odoo 19, External JSON-2 API |
| El borrador se crea con `account.move` (`move_type` = `in_invoice`) y el adjunto con `ir.attachment` (`res_model` = `account.move`) | Es lo que implementa `odoo-vendor-bill.ts`; el proveedor se busca por `vat`, con o sin dígito de verificación | Documentación oficial de Odoo 19 |
| En Odoo Online, la API externa exige el plan Custom | **Resuelto:** el usuario confirmó (11-nov-2026) que el Odoo 19 Online de Telcobras permite el envío, porque una automatización en Make.com ya envía datos y archivos a Odoo con una petición HTTP. La suite replica esa lógica desde su propio conector; Make queda solo como ejemplo | Usuario; Documento madre §10 |
| Las API key de Odoo vencen | El conector avisa antes del vencimiento | Documentación oficial de Odoo 19 |
| Odoo 19 trae eventos RADIAN nativos | Riesgo de duplicar funciones y de que dos sistemas envíen eventos de la misma factura (D-16) | Documento madre H-11 |

## 4. Entregables

| # | Entregable | Detalle |
|---|---|---|
| E-1 | Trabajo «crear borrador en Odoo» | Lo encola la misma transacción que registra el 033 aceptado (subetapas 4.4 y 4.5). Corre en la cola, nunca dentro de la petición del usuario ni de una transacción de la base de datos |
| E-2 | Datos desde el XML | Proveedor por NIT, fecha de la factura, referencia (prefijo y número), líneas con cantidades y valores, impuestos (mapa configurable de los códigos de la DIAN, como 01 IVA y 04 INC, a los impuestos de la compañía en Odoo), moneda y vencimiento |
| E-3 | Adjuntos | El XML `AttachedDocument` y, si las etapas 3 y 4 generan la representación gráfica, también ese archivo |
| E-4 | Idempotencia | Llave por organización y CUFE. El CUFE se guarda en un campo dedicado de Odoo (por ejemplo, el de la localización colombiana `l10n_co`, si está instalada, o un campo propio), no en `narration` |
| E-5 | Registro | Id del borrador, id del adjunto, fecha y error, en `odoo_document_links` (Etapa 2, subetapa 2.8) y en la auditoría |
| E-6 | Correcciones del código conservado | Las tres de §6 |
| E-7 | Aviso de la API key | Fecha de vencimiento en la configuración y aviso en la interfaz antes de que venza |

## 5. Criterios de aceptación

1. Con el 033 aceptado (o el disparador que se confirme), aparece en la instancia de prueba de Odoo un `account.move` `in_invoice` en borrador con proveedor, fecha, referencia, líneas e impuestos del XML, y con el XML adjunto.
2. Repetir el trabajo no crea una segunda factura ni un segundo adjunto.
3. Con Odoo caído, el trabajo reintenta con espera exponencial y ninguna transacción de la base de datos queda abierta mientras espera.
4. Si el registro en la suite falla después de que Odoo creó el borrador, el reintento lo encuentra por el CUFE y lo enlaza, sin duplicarlo.
5. Guardar una URL de Odoo que apunta a `localhost`, a una IP privada o de enlace local, o a un servicio de metadatos de la nube se rechaza; una URL que redirige a otro host falla.
6. Con un rollback forzado después de subir un archivo, no queda ningún objeto huérfano en S3 (o el barrido lo elimina en su siguiente corrida).
7. La API key nunca sale hacia el navegador ni a los registros.
8. Si el proveedor no existe en Odoo, el borrador se crea sin proveedor y la suite muestra el aviso.

## 6. Riesgos

**Riesgos del código conservado** (se corrigen en esta etapa):

| Riesgo | Dónde | Efecto | Corrección |
|---|---|---|---|
| Llamada a Odoo dentro de una transacción de la base de datos | `sendToOdoo` en `received-documents.service.ts`, dentro de `withTenant` | Un Odoo lento retiene la transacción y la conexión; si la transacción se revierte después de crear el borrador, este queda en Odoo sin registro en la suite. El reintento busca el CUFE en `narration`, lo que es frágil | Trabajo en la cola en tres pasos: transacción que marca «enviando», llamada a Odoo fuera de toda transacción, transacción que guarda el resultado. Idempotencia por el campo dedicado (E-4) |
| SSRF por la URL de Odoo configurable | `saveOdoo` en `documents-settings.service.ts` | Acepta cualquier host (solo exige `https://` en producción): un usuario con permiso de configuración podría hacer que la API llame a servicios internos | Lista de dominios permitidos (`*.odoo.com` para Odoo Online; otros, solo con aprobación del superadministrador), resolución del DNS y bloqueo de IP privadas, de enlace local y de metadatos; se mantiene `redirect: 'error'` en el cliente |
| Objeto huérfano en S3 si se revierte la transacción | `received-documents.service.ts`: la subida a S3 ocurre dentro de la transacción | Archivos sin dueño que ocupan espacio y pueden contener datos fiscales | Subir fuera de la transacción con una llave determinista y limpiar si falla el registro, más un barrido periódico de objetos sin referencia. La regla aplica a todo archivo nuevo de DataDian (XML, respuestas de la DIAN y adjuntos) |

**Otros riesgos:**

| Riesgo | Efecto | Mitigación |
|---|---|---|
| El RADIAN nativo de Odoo 19 está activo (D-16) | Eventos duplicados o contradictorios ante la DIAN | Confirmar la configuración de Odoo antes de producción y dejar a DataDian como único emisor de eventos |
| El disparador en el 033 llega tarde para contabilidad | La factura no se registra hasta la aceptación | Confirmar el disparador con el usuario; la cola permite cambiarlo sin rehacer el conector |
| Impuestos mal mapeados | Borradores con valores errados | Mapa por organización, validado contra el total del XML; si no cuadra, el borrador lleva un aviso |

## 7. Dependencias

- Etapas 2 a 4: tablas (incluida `odoo_document_links`), estado RADIAN, eventos aceptados por la DIAN y pantalla de configuración.
- **D-16:** versión exacta, edición y hosting de Odoo, y comparación con su RADIAN nativo.
- Detalle de la petición HTTP que hace hoy el escenario de Make.com a Odoo: URL, modelo, campos y credencial ([PENDIENTES.md](../PENDIENTES.md) §2).
- Confirmación del disparador por parte del usuario.
- Una instancia de prueba de Odoo 19 (o una base de pruebas en la de Telcobras) para la aceptación.

## 8. Puntos por verificar

Lista completa en [PENDIENTES.md](../PENDIENTES.md) §7.

| Punto | Qué falta |
|---|---|
| Disparador | Confirmar con el usuario si el borrador se crea con el 033 aceptado, con el 032 aceptado o con un botón |
| RADIAN nativo de Odoo 19 (D-16) | Si la localización colombiana de Odoo envía eventos por su cuenta y cómo se desactiva para las organizaciones que usan DataDian |
| Campo del CUFE en Odoo | Qué campo de la localización `l10n_co` guarda el CUFE, o si hace falta un campo propio |
| PV-8 | Si las facturas de contado, que no requieren eventos, se envían a Odoo con otro disparador |
