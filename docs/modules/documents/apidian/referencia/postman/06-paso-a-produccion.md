# 06 - Paso a Produccion

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Estos request son necesarios cuando se termina la habilitacion y se quiere llevar la empresa a produccion.

## Cambiar entre habilitacion y produccion

`PUT http://apidian2024.oo/api/ubl2.1/config/environment`

CAMBIAR AMBIENTE DE OPERACION

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/environment>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite cambiar el ambiente de operacion de la API para la empresa que se especifica mediante el token utilizado, el ambiente se especifica en el campo type\_environment\_id del json enviado.

**Headers**

| Header | Valor |
|---|---|
| `Authorization` | `Bearer [TOKEN CENSURADO]` |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
// Produccion = 1               // Habilitacion = 2
//Formato amigable              Formato Técnico
  "factura_ventas": 2,          //"type_environment_id": 2,
  "nomina": 2,                  //"payroll_type_environment_id": 2,
  "pos": 2,                     //"eqdocs_type_environment_id": 2,
  "documentos_soporte": 2,      //"support_document_type_environment_id": 2,
  "eventos_radian": 2           //"event_type_environment_id": 2
}
```

---

## Consultar los rangos de numeracion de la DIAN

`POST http://apidian2023.oo/api/ubl2.1/numbering-range`

CONSULTAR RANGOS DE NUMERACION

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/numbering-range>

* Requiere un token de autorizacion el cual fue devuelto al realizar el Paso 1 - Config Company, si este token se extravio, se puede consultar en la tabla de la base de datos de la API en la tabla users, en el campo API\_TOKEN.
* Este endpoint tiene no tiene parametros en la URL
* Este endpoint permite consultar los rangos de numeracion asociados a este software desde el portal de la DIAN, en su response muestra la informacion necesaria para registrar una resolucion, incluida la clave tecnica.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"IDSoftware": "82bf0c5e-0117-434d-9471-8a5ee58ae682"
}
```

---
