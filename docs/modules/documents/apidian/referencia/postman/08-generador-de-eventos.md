# 08 - Generador de Eventos

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Con este request se implementa el acuse de recibo, la aceptacion y rechazo de documento y la recepcion de
bienes.

## Enviar un evento desde el AttachedDocument

`POST https://apidian2024.oo/api/ubl2.1/send-event`

ENVIAR EVENTO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/send-event>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite registrar un evento al documento especificado en el json del request, este evento puede ser ACEPTACION, RECHAZO, RECEPCION DE BIENES ó ACUSE DE RECIBO.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "event_id": 1,
    "allow_cash_documents": false,
    "sendmail": false,
    "base64_attacheddocument_name": "ad09001495660102400018741.xml",
    "base64_attacheddocument": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxBdHRh…[base64 recortado, 54004 caracteres]",
    "type_rejection_id": null,
    "resend_consecutive": false
}
```

---

## Enviar un evento indicando el CUFE

`POST http://apidian2024.oo/api/ubl2.1/send-event-data`

ENVIAR EVENTO

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/send-event>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite registrar un evento al documento especificado en el json del request, este evento puede ser ACEPTACION, RECHAZO, RECEPCION DE BIENES ó ACUSE DE RECIBO.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "event_id": "1",
    "document_reference": {
        "cufe": "a7369298cca540ae26efb140a8b23cf7776857294f8718392d3437695749246dbd062246964468b5b319b8d66ced4b8a"
    },
    "issuer_party": {
        "identification_number": "89000001",
        "first_name": "PEPITO",
        "last_name": "PEREZ",
        "organization_department": "CONTABILIDAD",
        "job_title": "AUXILIAR CONTABLE"
    }
}
```

---

## Cargar un documento recibido por CUFE

`POST http://apidian2024.oo/api/load-document-by-cufe`

CARGAR UN DOCUMENTO POR CUFE

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/load-document-by-cufe>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint no tiene parametros en la URL. En el cuerpo se envia el cufe de la factura y, opcionalmente, save en true para guardar el documento en el listado de documentos RADIAN (received\_documents); sin ese campo solo devuelve los datos consultados, con saved en false.
* El cuerpo de ejemplo de este request manda la clave como "saved", que la API no interpreta: el campo correcto es "save".
* No envia ningun evento a la DIAN: solo consulta el documento para poder aplicarle despues los eventos de acuse, aceptacion o rechazo.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "cufe": "a7369298cca540ae26efb140a8b23cf7776857294f8718392d3437695749246dbd062246964468b5b319b8d66ced4b8a",
    "saved": true
}
```

---
