# 11 - Servicios APP

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

grupo de servicios que consume la app movil

## Iniciar sesion y obtener el token

`POST http://facturalatam-apidian.oo/api/login`

El login requiere de un usuario que se haya registrado junto a una empresa, se utiliza el correo y el numero de documento como contraseña en los primeros accesos hasta que sea modificada.

**Headers**

| Header | Valor |
|---|---|
| `Accept` | `application/json` |
| `Content-Type` | `application/json` |

**Autenticación:** `noauth`

**Body**

```json
{
    "email": "demo@gmail.com",
    "password": "[CENSURADO]"
}
```

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "data": {
        "id": 3,
        "name": "ALEXANDER OBANDO LONDONO",
        "email": "alexander_obando@hotmail.com",
        "api_token": "[CENSURADO]",
        "company": {
            "id": 1,
            "identification_number": "89008003",
            "dv": "2",
            "type_environment_id": 2,
            "type_operation_id": 10,
            "type_document_identification_id": 3,
            "type_currency_id": 35,
            "type_organization_id": 2,
            "type_regime_id": 2,
            "type_liability_id": 14,
            "municipality_id": 820,
            "merchant_registration": "0000000-00",
            "address": "CRA 21A NRO 11-25",
            "phone": "3103891693",
            "state": 1
        }
    },
    "code": 200
}
```

**Respuesta de ejemplo — Unauthorized (401 Unauthorized)**

```json
{
    "error": "Credenciales invalidas",
    "code": 401
}
```

**Respuesta de ejemplo — Unauthorized without company (401 Unauthorized)**

```json
{
    "error": "Usuario no tiene una empresa asignada",
    "code": 401
}
```

---

## Listar los documentos de la empresa

`GET http://facturalatam-apidian.oo/api/documents`

Permite listar los documentos y filtrar por fecha utilizando la clave date y los valores all, current\_month, last\_month, last\_ninety, mientras que search es capaz de buscar por numero, prefijo, total, fecha especifica y algunos datos principales del cliente como nombre, correo, telefono o numero de documento, tambien cuenta con el sistema paginacion utilizando la clave page.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "current_page": 1,
    "data": [
        {
            "id": 228,
            "prefix": "SETP",
            "number": "990060188",
            "client": {
                "dv": 1,
                "name": "INVERSIONES DAVAL SAS",
                "email": "demo@gmail.com",
                "phone": "3103891693",
                "address": "CLL 4 NRO 33-90",
                "type_regime_id": 1,
                "municipality_id": 822,
                "type_liability_id": 7,
                "type_organization_id": 1,
                "identification_number": 900166483,
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 6
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "13:01:05",
            "sale": 950000,
            "total_discount": 0,
            "total_tax": 0,
            "subtotal": 769500,
            "total": 950000,
            "xml": "FES-SETP990060188.xml",
            "pdf": "FES-SETP990060188.pdf"
        },
        {
            "id": 227,
            "prefix": "SETP",
            "number": "990060187",
            "client": {
                "dv": 1,
                "name": "INVERSIONES DAVAL SAS",
                "email": "demo@gmail.com",
                "phone": "3103891693",
                "address": "CLL 4 NRO 33-90",
                "type_regime_id": 1,
                "municipality_id": 822,
                "type_liability_id": 7,
                "type_organization_id": 1,
                "identification_number": 900166483,
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 6
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "12:57:32",
            "sale": 950000,
            "total_discount": 0,
            "total_tax": 0,
            "subtotal": 769500,
            "total": 950000,
            "xml": "FES-SETP990060187.xml",
            "pdf": "FES-SETP990060187.pdf"
        },
        {
            "id": 226,
            "prefix": "SETP",
            "number": "990060186",
            "client": {
                "dv": 2,
                "name": "OBANDO LONDONO ALEXANDER",
                "email": "demo@gmail.com",
                "phone": "3103891693",
                "address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 13337,
                "type_organization_id": 2,
                "identification_number": "89008003",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "11:06:55",
            "sale": 100.00361344537815,
            "total_discount": 0,
            "total_tax": 15.969999999999999,
            "subtotal": 84.03361344537815,
            "total": 100.00361344537815,
            "xml": "FES-SETP990060186.xml",
            "pdf": "FES-SETP990060186.pdf"
        },
        {
            "id": 225,
            "prefix": "SETP",
            "number": "990060185",
            "client": {
                "dv": 0,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-20",
            "time": "11:19:18",
            "sale": 10.003361344537815,
            "total_discount": 0,
            "total_tax": 1.5999999999999996,
            "subtotal": 8.403361344537815,
            "total": 10.003361344537815,
            "xml": "FES-SETP990060185.xml",
            "pdf": "FES-SETP990060185.pdf"
        },
        {
            "id": 224,
            "prefix": "SETP",
            "number": "990060184",
            "client": {
                "dv": 0,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-20",
            "time": "11:08:51",
            "sale": 10.003361344537815,
            "total_discount": 0,
            "total_tax": 1.5999999999999996,
            "subtotal": 8.403361344537815,
            "total": 10.003361344537815,
            "xml": "FES-SETP990060184.xml",
            "pdf": "FES-SETP990060184.pdf"
        },
        {
            "id": 223,
            "prefix": "SETP",
            "number": "990060183",
            "client": {
                "dv": 5,
                "name": "ACERO VARGAS JOSE ALEXANDERSituación de la empresa: CANCELACIÓN",
                "email": "alexacero26@gmail.com",
                "phone": "52543456",
                "address": "calle 42 a 83 b 09",
                "identification_number": "1030663",
                "merchant_registration": "000000"
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-19",
            "time": "17:12:52",
            "sale": 2190,
            "total_discount": 0,
            "total_tax": 349.65999999999985,
            "subtotal": 1840.3400000000001,
            "total": 2190,
            "xml": "FES-SETP990060183.xml",
            "pdf": "FES-SETP990060183.pdf"
        },
        {
            "id": 222,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": null,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "17:06:29",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf"
        },
        {
            "id": 221,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": null,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "17:03:43",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf"
        },
        {
            "id": 220,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:59:37",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf"
        },
        {
            "id": 219,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:55:30",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf"
        },
        {
            "id": 218,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:53:29",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf"
        },
        {
            "id": 217,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:49:34",
            "sale": 23.8,
            "total_discount": 0,
            "total_tax": 3.8000000000000007,
            "subtotal": 20,
            "total": 23.8,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf"
        },
        {
            "id": 216,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": null,
                "name": "juliannys morales",
                "email":
…[recortado: 24978 caracteres en total]
```

**Respuesta de ejemplo — Filter Success (200 OK)**

```json
{
    "current_page": 1,
    "data": [
        {
            "id": 226,
            "prefix": "SETP",
            "number": "990060186",
            "client": {
                "dv": 2,
                "name": "OBANDO LONDONO ALEXANDER",
                "email": "demo@gmail.com",
                "phone": "3103891693",
                "address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 13337,
                "type_organization_id": 2,
                "identification_number": "89008003",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "11:06:55",
            "sale": 100.00361344537815,
            "total_discount": 0,
            "total_tax": 15.969999999999999,
            "subtotal": 84.03361344537815,
            "total": 100.00361344537815,
            "xml": "FES-SETP990060186.xml",
            "pdf": "FES-SETP990060186.pdf"
        }
    ],
    "first_page_url": "http://co_apidian2025.oo/api/documents?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://co_apidian2025.oo/api/documents?page=1",
    "next_page_url": null,
    "path": "http://co_apidian2025.oo/api/documents",
    "per_page": 20,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

**Respuesta de ejemplo — Unauthorized (401 Unauthorized)**

```json
{
    "message": "Unauthenticated."
}
```

**Respuesta de ejemplo — Filter Last 90 days (200 OK)**

```json
{
    "current_page": 1,
    "data": [
        {
            "id": 228,
            "prefix": "SETP",
            "number": "990060188",
            "client": {
                "dv": 1,
                "name": "INVERSIONES DAVAL SAS",
                "email": "sh.raul.jgb@gmail.com",
                "phone": "3103891693",
                "address": "CLL 4 NRO 33-90",
                "type_regime_id": 1,
                "municipality_id": 822,
                "type_liability_id": 7,
                "type_organization_id": 1,
                "identification_number": 900166483,
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 6
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "13:01:05",
            "sale": 950000,
            "total_discount": 0,
            "total_tax": 0,
            "subtotal": 769500,
            "total": 950000,
            "xml": "FES-SETP990060188.xml",
            "pdf": "FES-SETP990060188.pdf",
            "state_document_id": 1
        },
        {
            "id": 227,
            "prefix": "SETP",
            "number": "990060187",
            "client": {
                "dv": 1,
                "name": "INVERSIONES DAVAL SAS",
                "email": "sh.raul.jgb@gmail.com",
                "phone": "3103891693",
                "address": "CLL 4 NRO 33-90",
                "type_regime_id": 1,
                "municipality_id": 822,
                "type_liability_id": 7,
                "type_organization_id": 1,
                "identification_number": 900166483,
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 6
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "12:57:32",
            "sale": 950000,
            "total_discount": 0,
            "total_tax": 0,
            "subtotal": 769500,
            "total": 950000,
            "xml": "FES-SETP990060187.xml",
            "pdf": "FES-SETP990060187.pdf",
            "state_document_id": 1
        },
        {
            "id": 226,
            "prefix": "SETP",
            "number": "990060186",
            "client": {
                "dv": 2,
                "name": "OBANDO LONDONO ALEXANDER",
                "email": "demo@gmail.com",
                "phone": "3103891693",
                "address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 13337,
                "type_organization_id": 2,
                "identification_number": "89008003",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2025-01-02",
            "time": "11:06:55",
            "sale": 100.00361344537815,
            "total_discount": 0,
            "total_tax": 15.969999999999999,
            "subtotal": 84.03361344537815,
            "total": 100.00361344537815,
            "xml": "FES-SETP990060186.xml",
            "pdf": "FES-SETP990060186.pdf",
            "state_document_id": 1
        },
        {
            "id": 225,
            "prefix": "SETP",
            "number": "990060185",
            "client": {
                "dv": 0,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-20",
            "time": "11:19:18",
            "sale": 10.003361344537815,
            "total_discount": 0,
            "total_tax": 1.5999999999999996,
            "subtotal": 8.403361344537815,
            "total": 10.003361344537815,
            "xml": "FES-SETP990060185.xml",
            "pdf": "FES-SETP990060185.pdf",
            "state_document_id": 1
        },
        {
            "id": 224,
            "prefix": "SETP",
            "number": "990060184",
            "client": {
                "dv": 0,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "000000",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-20",
            "time": "11:08:51",
            "sale": 10.003361344537815,
            "total_discount": 0,
            "total_tax": 1.5999999999999996,
            "subtotal": 8.403361344537815,
            "total": 10.003361344537815,
            "xml": "FES-SETP990060184.xml",
            "pdf": "FES-SETP990060184.pdf",
            "state_document_id": 1
        },
        {
            "id": 223,
            "prefix": "SETP",
            "number": "990060183",
            "client": {
                "dv": 5,
                "name": "ACERO VARGAS JOSE ALEXANDERSituación de la empresa: CANCELACIÓN",
                "email": "alexacero26@gmail.com",
                "phone": "52543456",
                "address": "calle 42 a 83 b 09",
                "identification_number": "1030663",
                "merchant_registration": "000000"
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-19",
            "time": "17:12:52",
            "sale": 2190,
            "total_discount": 0,
            "total_tax": 349.65999999999985,
            "subtotal": 1840.3400000000001,
            "total": 2190,
            "xml": "FES-SETP990060183.xml",
            "pdf": "FES-SETP990060183.pdf",
            "state_document_id": 1
        },
        {
            "id": 222,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": null,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "17:06:29",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf",
            "state_document_id": 0
        },
        {
            "id": 221,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": null,
                "name": "juliannys morales",
                "email": "julycaro2915@gmail.com",
                "phone": "3152918183",
                "address": "cra 8 # 13 a 22",
                "type_regime_id": 2,
                "type_liability_id": 117,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "1065633585",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "17:03:43",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf",
            "state_document_id": 0
        },
        {
            "id": 220,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:59:37",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf",
            "state_document_id": 0
        },
        {
            "id": 219,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:55:30",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf",
            "state_document_id": 0
        },
        {
            "id": 218,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:53:29",
            "sale": 11.9,
            "total_discount": 0,
            "total_tax": 1.9000000000000004,
            "subtotal": 10,
            "total": 11.9,
            "xml": "POSS-EPOS912.xml",
            "pdf": "POSS-EPOS912.pdf",
            "state_document_id": 0
        },
        {
            "id": 217,
            "prefix": "EPOS",
            "number": "912",
            "client": {
                "dv": "7",
                "name": "Cliente POS",
                "email": "clientepos@gmail.com",
                "phone": "999993333",
                "address": "direccion POS",
                "type_regime_id": 2,
                "type_liability_id": null,
                "municipality_id_fact": 12688,
                "type_organization_id": 2,
                "identification_number": "222222222222",
                "merchant_registration": "0000000-00",
                "type_document_identification_id": 3
            },
            "currency": {
                "id": 35,
                "name": "Peso colombiano",
                "code": "COP\r",
                "created_at": "2023-02-26 14:28:28",
                "updated_at": "2023-02-26 14:28:28"
            },
            "date": "2024-12-10",
            "time": "16:49:34",
            "sale": 23.8,
            "total_disco
…[recortado: 25710 caracteres en total]
```

---

## Listar los clientes

`GET http://facturalatam-apidian.oo/api/customers`

Permite listar los clientes registrados por la empresa. La clave search busca por numero de documento o nombre, y cuenta con el sistema de paginacion utilizando la clave page.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — Lista Clientes (200 OK)**

```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "identification_number": 1030663,
                "dv": "5",
                "name": "ACERO VARGAS JOSE ALEXANDERSituación de la empresa: CANCELACIÓN",
                "phone": "52543456",
                "address": "calle 42 a 83 b 09",
                "email": "alexacero26@gmail.com",
                "companies_id": 1
            },
            {
                "identification_number": 900166483,
                "dv": "1",
                "name": "INVERSIONES DAVAL SAS",
                "phone": "3103891693",
                "address": "CLL 4 NRO 33-90",
                "email": "gerencia@torresoftware.com",
                "companies_id": 1
            }
        ],
        "first_page_url": "http://co_apidian2025.oo/api/customers?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://co_apidian2025.oo/api/customers?page=1",
        "next_page_url": null,
        "path": "http://co_apidian2025.oo/api/customers",
        "per_page": 20,
        "prev_page_url": null,
        "to": 2,
        "total": 2
    }
}
```

---

## Actualizar un cliente

`PUT http://facturalatam-apidian.oo/api/customers/2222222222`

Permite actualizar un cliente, el numero de identificacion no es modificable ya que es unico por cliente

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "dv": "5",
    "name": "cliente por defecto",
    "phone": "52543456",
    "address": "calle 42 a 83 b 09",
    "email": "clientepordefecto@gmail.com"
}
```

**Respuesta de ejemplo — 200 (200 OK)**

```json
{
    "success": true,
    "message": "Cliente actualizado exitosamente",
    "data": {
        "customer": {
            "id": 18,
            "identification_number": 2222222222,
            "dv": "5",
            "name": "cliente por defecto",
            "phone": "52543456",
            "address": "calle 42 a 83 b 09",
            "email": "clientepordefecto@gmail.com"
        }
    }
}
```

---

## Listar las resoluciones de la empresa

`GET http://facturalatam-apidian.oo/api/table/resolutions/89008003`

Permite listar las resoluciones  
\* obtiene las resoluciones dependiendo del entorno en el que esta la compañia  
\* permite filtrar por tipo de documento, ver ejemplo de respuesta 2

Tipos de documento

| **id** | **nombre** |
| --- | --- |
| 1 | Factura electronica |
| 4 | Nota de credito |
| 5 | Nota de debito |
| 9 | Nomina |

> si no lista las resoluciones del entorno actual, debe consumir el servicio de configuracion de resolucion para que se establezca la relacion del entorno de la empresa con la resolucion

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — 200 (200 OK)**

```json
{
    "resolutions": [
        {
            "id": 1,
            "type_document_id": 1,
            "type_environment_id": 2,
            "prefix": "SETP",
            "resolution": "18760000001",
            "resolution_date": "2019-01-19",
            "technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
            "from": 990000000,
            "to": 995000000,
            "date_from": "2019-01-19",
            "date_to": "2030-01-19",
            "created_at": "2025-05-14 12:48:59",
            "updated_at": "2025-09-08 15:00:17",
            "number": 990000000,
            "next_consecutive": "SETP990000000",
            "type_document": {
                "id": 1,
                "name": "Factura de Venta Nacional",
                "code": "01",
                "cufe_algorithm": "CUFE-SHA384",
                "prefix": "fv\r",
                "created_at": "2025-05-13 17:40:55",
                "updated_at": "2025-05-13 17:40:55"
            }
        }
    ]
}
```

**Respuesta de ejemplo — 200 - filtro de tipo (200 OK)**

```json
{
    "resolutions": [
        {
            "id": 1,
            "type_document_id": 1,
            "type_environment_id": 2,
            "prefix": "SETP",
            "resolution": "18760000001",
            "resolution_date": "2019-01-19",
            "technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
            "from": 990000000,
            "to": 995000000,
            "date_from": "2019-01-19",
            "date_to": "2030-01-19",
            "created_at": "2025-05-14 12:48:59",
            "updated_at": "2025-09-08 15:00:17",
            "number": 990000000,
            "next_consecutive": "SETP990000000",
            "type_document": {
                "id": 1,
                "name": "Factura de Venta Nacional",
                "code": "01",
                "cufe_algorithm": "CUFE-SHA384",
                "prefix": "fv\r",
                "created_at": "2025-05-13 17:40:55",
                "updated_at": "2025-05-13 17:40:55"
            }
        }
    ]
}
```

**Respuesta de ejemplo — 200 - filtro con parametros (200 OK)**

```json
{
    "resolutions": [
        {
            "id": 1,
            "type_document_id": 1,
            "type_environment_id": 2,
            "prefix": "SETP",
            "resolution": "18760000001",
            "resolution_date": "2019-01-19",
            "technical_key": "[CLAVE TÉCNICA DE EJEMPLO CENSURADA]",
            "from": 990000000,
            "to": 995000000,
            "date_from": "2019-01-19",
            "date_to": "2030-01-19",
            "created_at": "2025-05-14 12:48:59",
            "updated_at": "2025-09-08 15:00:17",
            "number": 990000000,
            "next_consecutive": "SETP990000000",
            "type_document": {
                "id": 1,
                "name": "Factura de Venta Nacional",
                "code": "01",
                "cufe_algorithm": "CUFE-SHA384",
                "prefix": "fv\r",
                "created_at": "2025-05-13 17:40:55",
                "updated_at": "2025-05-13 17:40:55"
            }
        }
    ]
}
```

---

## Listar los metodos de pago

`GET http://facturalatam-apidian.oo/api/table/payment-methods`

Permite listar los metodos de pago disponibles (payment\_method\_id), que son los que indican el medio con el que se paga el documento: efectivo, consignacion, tarjeta de credito, etc. Devuelve el id y el nombre de cada uno.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "payment_methods": [
        {
            "id": 1,
            "name": "Instrumento no definido",
            "code": "1\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 2,
            "name": "Crédito ACH",
            "code": "2\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 3,
            "name": "Débito ACH",
            "code": "3\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 4,
            "name": "Reversión débito de demanda ACH",
            "code": "4\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 5,
            "name": "Reversión crédito de demanda ACH ",
            "code": "5\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 6,
            "name": "Crédito de demanda ACH",
            "code": "6\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 7,
            "name": "Débito de demanda ACH",
            "code": "7\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 8,
            "name": "Mantener",
            "code": "8\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 9,
            "name": "Clearing Nacional o Regional",
            "code": "9\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 10,
            "name": "Efectivo",
            "code": "10\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 11,
            "name": "Reversión Crédito Ahorro",
            "code": "11\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 12,
            "name": "Reversión Débito Ahorro",
            "code": "12\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 13,
            "name": "Crédito Ahorro",
            "code": "13\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 14,
            "name": "Débito Ahorro",
            "code": "14\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 15,
            "name": "Bookentry Crédito",
            "code": "15\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 16,
            "name": "Bookentry Débito",
            "code": "16\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 17,
            "name": "Concentración de la demanda en efectivo /Desembolso Crédito (CCD)",
            "code": "17\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 18,
            "name": "Concentración de la demanda en efectivo / Desembolso (CCD) débito",
            "code": "18\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 19,
            "name": "Crédito Pago negocio corporativo (CTP)",
            "code": "19\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 20,
            "name": "Cheque",
            "code": "20\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 21,
            "name": "Poyecto bancario",
            "code": "21\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 22,
            "name": "Proyecto bancario certificado",
            "code": "22\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 23,
            "name": "Cheque bancario",
            "code": "23\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 24,
            "name": "Nota cambiaria esperando aceptación",
            "code": "24\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 25,
            "name": "Cheque certificado",
            "code": "25\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 26,
            "name": "Cheque Local",
            "code": "26\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 27,
            "name": "Débito Pago Neogcio Corporativo (CTP)",
            "code": "27\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 28,
            "name": "Crédito Negocio Intercambio Corporativo (CTX)",
            "code": "28\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 29,
            "name": "Débito Negocio Intercambio Corporativo (CTX)",
            "code": "29\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 30,
            "name": "Transferecia Crédito",
            "code": "30\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 31,
            "name": "Transferencia Débito",
            "code": "31\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 32,
            "name": "Concentración Efectivo / Desembolso Crédito plus (CCD+)",
            "code": "32\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 33,
            "name": "Concentración Efectivo / Desembolso Débito plus (CCD+)",
            "code": "33\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 34,
            "name": "Pago y depósito pre acordado (PPD)",
            "code": "34\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 35,
            "name": "Concentración efectivo ahorros / Desembolso Crédito (CCD)",
            "code": "35\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 36,
            "name": "Concentración efectivo ahorros / Desembolso Drédito (CCD)",
            "code": "36\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 37,
            "name": "Pago Negocio Corporativo Ahorros Crédito (CTP)",
            "code": "37\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 38,
            "name": "Pago Neogcio Corporativo Ahorros Débito (CTP)",
            "code": "38\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 39,
            "name": "Crédito Negocio Intercambio Corporativo (CTX)",
            "code": "39\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 40,
            "name": "Débito Negocio Intercambio Corporativo (CTX)",
            "code": "40\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 41,
            "name": "Concentración efectivo/Desembolso Crédito plus (CCD+) ",
            "code": "41\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 42,
            "name": "Consiganción bancaria",
            "code": "42\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 43,
            "name": "Concentración efectivo / Desembolso Débito plus (CCD+)",
            "code": "43\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 44,
            "name": "Nota cambiaria",
            "code": "44\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 45,
            "name": "Transferencia Crédito Bancario",
            "code": "45\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 46,
            "name": "Transferencia Débito Interbancario",
            "code": "46\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 47,
            "name": "Transferencia Débito Bancaria",
            "code": "47\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 48,
            "name": "Tarjeta Crédito",
            "code": "48\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 49,
            "name": "Tarjeta Débito",
            "code": "49\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 50,
            "name": "Postgiro",
            "code": "50\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 51,
            "name": "Telex estándar bancario francés",
            "code": "51\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 52,
            "name": "Pago comercial urgente",
            "code": "52\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 53,
            "name": "Pago Tesorería Urgente",
            "code": "53\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 54,
            "name": "Nota promisoria",
            "code": "60\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 55,
            "name": "Nota promisoria firmada por el acreedor",
            "code": "61\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 56,
            "name": "Nota promisoria firmada por el acreedor, avalada por el banco",
            "code": "62\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 57,
            "name": "Nota promisoria firmada por el acreedor, avalada por un tercero",
            "code": "63\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 58,
            "name": "Nota promisoria firmada pro el banco",
            "code": "64\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 59,
            "name": "Nota promisoria firmada por un banco avalada por otro banco",
            "code": "65\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 60,
            "name": "Nota promisoria firmada ",
            "code": "66\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 61,
            "name": "Nota promisoria firmada por un tercero avalada por un banco",
            "code": "67\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 62,
            "name": "Retiro de nota por el por el acreedor",
            "code": "70\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 63,
            "name": "Retiro de nota por el por el acreedor sobre un banco",
            "code": "74\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 64,
            "name": "Retiro de nota por el acreedor, avalada por otro banco",
            "code": "75\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 65,
            "name": "Retiro de nota por el acreedor, sobre un banco avalada por un tercero",
            "code": "76\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 66,
            "name": "Retiro de una nota por el acreedor sobre un tercero",
            "code": "77\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28"
        },
        {
            "id": 67,
            "name": "Retiro de una nota por el acreedor sobre un tercero avalada por un banco",
            "code": 
…[recortado: 16827 caracteres en total]
```

---

## Listar las formas de pago

`GET http://facturalatam-apidian.oo/api/table/payment-forms`

Permite listar las formas de pago disponibles (payment\_form\_id), que son las que indican si el documento es de contado o a credito. Devuelve el id y el nombre de cada una.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "payment_forms": [
        {
            "id": 1,
            "name": "Contado",
            "code": "1\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28",
            "payment_method_code": null,
            "payment_due_date": null,
            "duration_measure": null,
            "duration_measure_unit_code": "DAY",
            "payment_id": 1
        },
        {
            "id": 2,
            "name": "Crédito",
            "code": "2\r",
            "created_at": "2023-02-26 14:28:28",
            "updated_at": "2023-02-26 14:28:28",
            "payment_method_code": null,
            "payment_due_date": null,
            "duration_measure": null,
            "duration_measure_unit_code": "DAY",
            "payment_id": 1
        }
    ]
}
```

---

## Listar los productos

`GET http://facturalatam-apidian.oo/api/items`

Permite listar los productos y filtrar con 'search', es capaz de buscar por codigo interno o nombre.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — 200 (200 OK)**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Producto Prueba App",
            "second_name": null,
            "description": "es para probar",
            "internal_id": "prdctprbpp",
            "sale_unit_price": "1500.000000",
            "percentage_of_profit": "0.00",
            "is_set": 0,
            "has_perception": 0,
            "percentage_perception": null,
            "companies_id": 1,
            "status": 1
        }
    ]
}
```

**Respuesta de ejemplo — 200 search (200 OK)**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Producto Prueba App",
            "second_name": null,
            "description": "es para probar",
            "internal_id": "prdctprbpp",
            "sale_unit_price": "1500.000000",
            "percentage_of_profit": "0.00",
            "is_set": 0,
            "has_perception": 0,
            "percentage_perception": null,
            "companies_id": 1,
            "status": 1
        }
    ]
}
```

---

## Actualizar un producto

`PUT http://facturalatam-apidian.oo/api/items/1`

Permite actualizar un producto, el parametro para la url es el id del mismo

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "name": "Producto Prueba App",
    "second_name": "Producto prueba",
    "description": "es para probar",
    "internal_id": "prdctprbpp",
    "sale_unit_price": "1500.000000",
    "percentage_of_profit": "0.00",
    "is_set": 0,
    "has_perception": 0,
    "percentage_perception": null,
    "companies_id": 1,
    "status": 1
}
```

**Respuesta de ejemplo — 200 (200 OK)**

```json
{
    "success": true,
    "message": "Item actualizado exitosamente",
    "data": {
        "item": {
            "id": 1,
            "name": "Producto Prueba App",
            "second_name": null,
            "description": "es para probar",
            "internal_id": "prdctprbpp",
            "sale_unit_price": "1500.000000",
            "percentage_of_profit": "0.00",
            "is_set": 0,
            "has_perception": 0,
            "percentage_perception": null,
            "status": 1,
            "companies_id": 1
        }
    }
}
```

---

## Registrar un producto

`POST http://facturalatam-apidian.oo/api/items/add`

Permite registrar un producto en el catalogo de la empresa. El codigo interno no se puede repetir; para modificar uno ya existente se usa el request Actualizar producto.

**Autenticación:** `bearer`

**Body**

```json
{
    "name": "Producto 1",
    "second_name": "Subtítulo Producto",
    "description": "Descripción del producto",
    "item_type_id": "01",
    "internal_id": "PROD001",
    "sale_unit_price": 100.50,
    "purchase_unit_price": 80.00,
    "active": true,
    "companies_id":1
}
```

**Respuesta de ejemplo — Success (201 Created)**

```json
{
    "name": "Producto 1",
    "second_name": "Subtítulo Producto",
    "description": "Descripción del producto",
    "item_type_id": "01",
    "internal_id": "PROD001",
    "sale_unit_price": 100.5,
    "purchase_unit_price": 80,
    "stock": 10,
    "active": true,
    "updated_at": "2025-01-15 09:44:13",
    "created_at": "2025-01-15 09:44:13",
    "id": 1
}
```

---

## Descargar el PDF de un documento desde la app

`GET http://facturalatam-apidian.oo/api/download/89008003/FES-SETP990060188.pdf`

Permite descargar el PDF de un documento ya emitido para mostrarlo en la app. En URL el primer parametro es el NIT de la empresa y el segundo el nombre del archivo, que se obtiene del listado de documentos.

**Autenticación:** `bearer`

---
