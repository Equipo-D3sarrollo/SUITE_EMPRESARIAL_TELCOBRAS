# 09 - Planes

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

## Crear un plan

`PUT http://apidian2023.oo/api/ubl2.1/plan`

CREAR PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* Este endpoint no tiene parametros en la URL. Si el id enviado no existe se crea el plan, si ya existe se actualiza.
* Los campos qty\_docs\_invoice, qty\_docs\_payroll, qty\_docs\_radian y qty\_docs\_ds son la cantidad de documentos que el plan permite por cada tipo (facturas, nominas, eventos RADIAN y documentos soporte). Los cuatro son obligatorios.
* El campo period es la vigencia del plan: 1 = MENSUAL, 2 = ANUAL, 3 = PAQUETE.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |
| `X-Admin-Token` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"id": "2",
	"name": "PLAN DE PRUEBA 2",
    "qty_docs_invoice": 15,
    "qty_docs_payroll": 5,
    "qty_docs_radian": 10,
    "qty_docs_ds": 5,
    "period": 1,
    "observation": "NINGUNA"
}
```

---

## Modificar un plan

`PUT http://apidian2023.oo/api/ubl2.1/plan`

MODIFICAR PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* Es el mismo endpoint de crear plan: se identifica el plan por el campo id, pero hay que reenviar siempre qty\_docs\_invoice, qty\_docs\_payroll, qty\_docs\_radian, qty\_docs\_ds y period, no solo los que se quieren cambiar, porque los que falten quedan en nulo.
* El campo state permite activar (1) o desactivar (0) el plan.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |
| `X-Admin-Token` | `` |

**Autenticación:** `bearer`

**Body**

```json
{
	"id": "1",
    "qty_docs_invoice": 3,
    "qty_docs_payroll": 0,
    "period": 1,
    "state": 1,
    "observation": "NINGUNA"
}
```

---

## Listar todos los planes

`GET http://apidian2023.oo/api/ubl2.1/plan/query`

CONSULTAR PLANES

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/query>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* Sin parametros en la URL devuelve el listado de todos los planes registrados con sus cupos por tipo de documento, el periodo y el estado.
* Para consultar uno solo se agrega su id al final de la ruta, como en el request Consultar Plan.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |
| `X-Admin-Token` | `` |

**Autenticación:** `bearer`

---

## Consultar el plan y el consumo de una empresa

`GET http://apidian2023.oo/api/ubl2.1/plan/infoplanuser`

INFORMACION DEL PLAN DE LA EMPRESA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/infoplanuser>

* Requiere el token de la empresa, el mismo que fue devuelto al realizar el Paso 1 - Config Company.
* Este endpoint no tiene parametros en la URL: devuelve el plan asignado a la empresa dueña del token, su fecha de vencimiento y los documentos consumidos frente a los disponibles.
* Es el request que debe usar el cliente para saber cuantos documentos le quedan.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `bearer`

---

## Consultar un plan por su id

`GET http://apidian2023.oo/api/ubl2.1/plan/query/1`

CONSULTAR UN PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/query/1>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* En URL el ultimo parametro corresponde al id del plan que se quiere consultar.
* Devuelve los datos de ese plan: nombre, cupos por tipo de documento, periodo y estado.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |
| `X-Admin-Token` | `` |

**Autenticación:** `bearer`

---

## Listar las empresas que tienen un plan

`GET http://apidian2023.oo/api/ubl2.1/plan/queryusersbyplan/1`

CONSULTAR USUARIOS POR PLAN

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/plan/queryusersbyplan/1>

* Este endpoint no esta autenticado, por lo que solo lo debe usar el administrador de la API: no se debe exponer a los clientes.
* En URL el ultimo parametro corresponde al id del plan.
* Devuelve las empresas que tienen asignado ese plan, con su NIT, razon social y el estado de su suscripcion.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |
| `X-Admin-Token` | `` |

**Autenticación:** `bearer`

---

## Asignar, renovar o cambiar el plan de una empresa

`POST http://apidian2023.oo/api/ubl2.1/config/89008003/2`

CONFIGURAR COMPAÑIA

* Si se instalo un dominio se debe utilizar de la siguiente manera:

<http://midominio.com/api/ubl2.1/config/89008003/2>

* No requiere autorizacion
* En URL los ultimos dos parametros son NIT y digito de verificacion de la empresa.

.../ubl2.1/config/NitEmpresa/DigitoVerificacion

* Los datos necesarios para llenar los campos JSON cuyo nombre finalice con "\_id" se encuentran en las tablas parametricas de la base de datos de la API, ejemplo:

type\_liability\_id, se debe especificar el id del registro correspondiente de la tabla type\_liabilities de la base de datos de la API.

* Devuelve un token en el response, si fue posible la creacion de la empresa, este token es una cadena alfanumerica en el campo API\_TOKEN, este dato es necesario para utilizarlo como autorizacion en los siguientes endpoints de la API. Si este token se pierde, se puede recuperar consultando la tabla users de la base de datos de la API, en el campo API\_TOKEN.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `X-Admin-Token` | `` |

**Body**

```json
{
	"type_document_identification_id": 3,
	"type_organization_id": 2,
	"type_regime_id": 2,
	"type_liability_id": 14,
    "type_plan_id": 1,
    "renew_plan": true,
	"business_name": "ALEXANDER OBANDO LONDONO",
	"merchant_registration": "0000000-00",
	"municipality_id": 820,
	"address": "CRA 21A NRO 11-25",
	"phone": 3103891693,
	"email": "alexander_obando@hotmail.com",
    "state": true
}
```

---
