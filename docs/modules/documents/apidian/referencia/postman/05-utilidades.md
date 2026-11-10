# 05 - Utilidades

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Los request de esta carpeta permiten realizar operaciones varias.

## 📁 Consultar documentos enviados

### Listar documentos por rango de fechas

`GET http://apidian2024.oo/api/information/89008003/1900-01-01/2023-09-15`

##### CONSULTA DE DOCUMENTOS POR NIT

Este endpoint permite consultar los documentos asociados a un NIT (identificación de empresa) en diferentes rangos de fechas y paginación.

###### Endpoints disponibles

* Consultar todos los documentos por NIT:  
   /api/information/{nit}

  Retorna todos los documentos del NIT especificado.
* Consultar documentos por NIT y fecha específica:  
   /api/information/{nit}/{desde}

  Retorna los documentos del NIT en la fecha `{desde}`.
* Consultar documentos por NIT y rango de fechas:  
   /api/information/{nit}/{desde}/{hasta}

  Retorna los documentos del NIT entre las fechas `{desde}` y `{hasta}`.
* Consultar documentos por NIT y paginación:  
   /api/information/{nit}/page/{page}/page

  Retorna los documentos del NIT en la página `{page}` (100 documentos por página).

###### Parámetros

* `nit`: Número de identificación tributaria de la empresa.
* `desde`: Fecha inicial en formato `YYYY-MM-DD` (opcional).
* `hasta`: Fecha final en formato `YYYY-MM-DD` (opcional).
* `page`: Número de página para paginación (opcional).

###### Respuesta

La respuesta incluye:

* `success`: Indica si la consulta fue exitosa.
* `message`: Mensaje descriptivo.
* `data`: Listado de documentos agrupados por tipo (Factura, Nota Crédito, Nota Débito, POS).
* `company`: Nombre de la empresa.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

### Total de documentos por rango de fechas

`GET http://apidian2024.oo/api/total_documents/89008003/1900-01-01/2023-09-15`

##### TOTAL DE DOCUMENTOS POR NIT

Este endpoint permite consultar el total de documentos emitidos por una empresa (NIT), agrupados por tipo de documento y en rangos de fechas.

###### Endpoints disponibles

* GET /api/total\_documents/{nit}
* GET /api/total\_documents/{nit}/{desde}
* GET /api/total\_documents/{nit}/{desde}/{hasta}

**Descripción:**  
Retorna el total de cada tipo de documento (Factura, Nota Crédito, Nota Débito, Nómina, Documento Soporte, POS, etc.) emitido por el NIT especificado, en el rango de fechas solicitado.

**Parámetros:**

* `nit`: Número de identificación tributaria de la empresa.
* `desde`: Fecha inicial en formato `YYYY-MM-DD` (opcional).
* `hasta`: Fecha final en formato `YYYY-MM-DD` (opcional).

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

### Listar documentos pagina por pagina

`GET http://facturalatam-apidian.oo/api/information/89008003/page/0/page`

##### CONSULTA DE DOCUMENTOS POR NIT

Este endpoint permite consultar los documentos asociados a un NIT (identificación de empresa) en diferentes rangos de fechas y paginación.

###### Endpoints disponibles

* Consultar todos los documentos por NIT:  
   /api/information/{nit}

  Retorna todos los documentos del NIT especificado.
* Consultar documentos por NIT y fecha específica:  
   /api/information/{nit}/{desde}

  Retorna los documentos del NIT en la fecha `{desde}`.
* Consultar documentos por NIT y rango de fechas:  
   /api/information/{nit}/{desde}/{hasta}

  Retorna los documentos del NIT entre las fechas `{desde}` y `{hasta}`.
* Consultar documentos por NIT y paginación:  
   /api/information/{nit}/page/{page}/page

  Retorna los documentos del NIT en la página `{page}` (100 documentos por página).

###### Parámetros

* `nit`: Número de identificación tributaria de la empresa.
* `desde`: Fecha inicial en formato `YYYY-MM-DD` (opcional).
* `hasta`: Fecha final en formato `YYYY-MM-DD` (opcional).
* `page`: Número de página para paginación (opcional).

###### Respuesta

La respuesta incluye:

* `success`: Indica si la consulta fue exitosa.
* `message`: Mensaje descriptivo.
* `data`: Listado de documentos agrupados por tipo (Factura, Nota Crédito, Nota Débito, POS).
* `company`: Nombre de la empresa.

**Autenticación:** `bearer`

---

### Buscar documentos con filtros

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

## Registrar o actualizar un cliente

`PUT http://apidian2023.oo/api/ubl2.1/register-update-customer`

**REGISTRAR/MODIFICAR DATOS DE UN CLIENTE**

Este endpoint permite registrar un nuevo cliente o actualizar la información de un cliente existente, como el correo electrónico o el teléfono, en la base de datos de la API.

**URL de uso:**  
Si tienes un dominio instalado, utiliza la siguiente ruta:  
`http://midominio.com/api/ubl2.1/register-update-customer`

**Autenticación:**  
Requiere un token de autorización, el cual se obtiene al realizar el Paso 1 - Config Company.  
Si extraviaste el token, puedes consultarlo en la base de datos, tabla `users`, campo `API_TOKEN`.

**Parámetros:**  
Este endpoint no requiere parámetros en la URL.  
Toda la información del cliente se envía en el cuerpo (body) de la solicitud.

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

**Body**

```json
{
    "identification_number": 89008003,
	"dv": null,
	"name": "ALEXANDER OBANDO LONDOÑO.",
	"phone": 3103891693,
	"address": "LIMONAR MZ 6 CS 3 ET 1 PISO 2",
	"email": "alexander_obando@hotmail.com",
    "sendnotification": true
}
```

---

## Buscar un cliente por tipo y numero de documento

`GET http://facturalatam-apidian.oo/api/customer/31/31999910`

**Consulta de datos de un cliente por tipo y número de documento**

Este endpoint permite consultar la información de un cliente utilizando el tipo de documento y el número de documento.

**URL de uso:**  
`http://[DOMINIO]/api/customer/[ID_TIPO_DOCUMENTO]/[NUMERO_DOCUMENTO]`

* **ID\_TIPO\_DOCUMENTO:** Código del tipo de documento (ver tabla abajo).
* **NUMERO\_DOCUMENTO:** Número del documento del cliente.

**Ejemplo:**  
`http://midominio.com/api/customer/13/123456789`

**Nota:**

* si su sistema esta en entorno de pruebas puede utilizar los numeros facilitados por el servicio que se encuentran en <https://www.dian.gov.co/impuestos/factura-electronica/Documents/Guia-Herramienta-para-el-Consumo-de-Web-Services.pdf>

**Códigos de tipo de documento:**

* ID de tipo de documento

| ID | Nombre |
| --- | --- |
| 11 | Registro civil |
| 12 | Tarjeta de identidad |
| 13 | Cédula de ciudadanía |
| 21 | Tarjeta de extranjería |
| 22 | Cédula de extranjería |
| 31 | NIT |
| 41 | Pasaporte |
| 42 | Documento de identificación extranjero |
| 47 | PEP (Permiso Especial de Permanencia) |
| 48 | PPT (Permiso Protección Temporal) |
| 50 | NIT de otro país |
| 91 | NUIP |

**Headers**

| Header | Valor |
|---|---|
| `Authorization` | `Bearer [TOKEN CENSURADO]` |
| `Cache-Control` | `no-cache` |
| `Postman-Token` | `<calculated when request is sent>` |
| `Host` | `<calculated when request is sent>` |
| `User-Agent` | `PostmanRuntime/7.39.1` |
| `Accept` | `*/*` |
| `Accept-Encoding` | `gzip, deflate, br` |
| `Connection` | `keep-alive` |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Respuesta de ejemplo — 404 (200 OK)**

```json
{
    "success": false,
    "message": "El adquirente No existe en la base de datos",
    "status": "404"
}
```

**Respuesta de ejemplo — 200 (200 OK)**

```json
{
    "success": true,
    "message": {
        "_attributes": {
            "nil": "true"
        }
    },
    "ResponseDian": {
        "GetAcquirerResponse": {
            "GetAcquirerResult": {
                "Message": {
                    "_attributes": {
                        "nil": "true"
                    }
                },
                "ReceiverEmail": "Mail_NIT_10@mail.com",
                "ReceiverName": "Nombre NIT 10",
                "StatusCode": "200"
            }
        }
    },
    "status": "200"
}
```

---

## Consultar la fecha de vencimiento del certificado

`PUT http://apidian2024.oo/api/ubl2.1/certificate-end-date`

**FECHA DE VENCIMIENTO DEL CERTIFICADO DIGITAL**

Este endpoint permite consultar la fecha de vencimiento del certificado digital asociado a la empresa autenticada.

**URL de uso:**  
`http://midominio.com/api/ubl2.1/certificate-end-date`

**Autenticación:**  
Requiere un token de autorización, obtenido en el Paso 1 - Config Company.  
Si extraviaste el token, puedes consultarlo en la base de datos, tabla `users`, campo `API_TOKEN`.

**Parámetros:**

* No requiere parámetros en la URL.
* No requiere campos JSON en el body.

**Respuesta:**  
Retorna la fecha de vencimiento del certificado digital de la empresa correspondiente al token utilizado en la autorización.

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

## Consultar el proximo consecutivo a usar

`POST http://facturalatam-apidian.oo/api/ubl2.1/next-consecutive`

**OBTENER EL PRÓXIMO CONSECUTIVO DE DOCUMENTO**

Este endpoint permite consultar cuál será el próximo número consecutivo disponible para un tipo de documento y prefijo específico, según la resolución activa de la empresa.

**URL de uso:**  
`http://midominio.com/api/ubl2.1/next-consecutive`

**Autenticación:**  
Requiere un token de autorización (API\_TOKEN).

**Parámetros:**

* No requiere parámetros en la URL.
* Debes enviar los siguientes campos en el body (JSON):

  + `type_document_id`: ID del tipo de documento (por ejemplo, factura, nota crédito, etc.).
  + `prefix`: Prefijo de la resolución.

**Respuesta:**  
Retorna el próximo número consecutivo disponible para el tipo de documento y prefijo indicados.

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

**Body**

```json
{
    "type_document_id": 1,
    "prefix": "SETP"
}
```

**Respuesta de ejemplo — Success (200 OK)**

```json
{
    "success": true,
    "type_document_id": 1,
    "prefix": "SETP",
    "number": 990060187
}
```

---

## Descargar el XML de un documento por CUFE

`POST http://apidian2024.oo/api/ubl2.1/xml/document/7735317bef9d6b648eeb0d0ad56ec5feb63911072947a3d06a894bf6dd66a3c912325660eeb27d7424d23af740432f66`

**CONSULTA DEL XML DE UN DOCUMENTO POR CUFE**

Este endpoint permite consultar y obtener el archivo XML de un documento electrónico registrado en la DIAN, utilizando el CUFE del documento.

**URL de uso:**  
`http://apidian2024.oo/api/ubl2.1/xml/document/{cufe}`

* **CUFE:** Identificador único del documento .

**Autenticación:**  
Requiere un token de autorización (API\_TOKEN).

**Parámetros en la URL:**

* CUFE.

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

## Consultar los parametros de correo de la empresa

`GET http://api2023.oo/api/ubl2.1/emailconfig`

**Consulta de configuración de correo electrónico**

Este endpoint permite obtener la configuración de envío de correo electrónico asociada a la empresa autenticada mediante el token de acceso.  
Primero busca la configuración personalizada en la base de datos del usuario (empresa).  
Si no existe configuración personalizada, retorna la configuración general definida en el archivo [.env](https://null) y muestra un mensaje indicando que se está usando la configuración por defecto.

**URL:**  
`GET /api/ubl2.1/emailconfig`

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**  
No requiere parámetros en la URL ni en el body.

**Respuesta:**

* Si la empresa tiene configuración personalizada, retorna esos datos (host, puerto, usuario, encriptación, etc.).
* Si no tiene configuración personalizada, retorna la configuración general y un mensaje informativo.
* La contraseña siempre se oculta por seguridad.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `cache-control` | `no-cache` |
| `Connection` | `keep-alive` |
| `Accept-Encoding` | `gzip, deflate` |
| `accept` | `application/json` |
| `X-CSRF-TOKEN` | `` |

**Autenticación:** `noauth`

---

## Consultar la razon social por NIT

`GET http://apidian2024.oo/api/ubl2.1/name-by-nit/89008003`

**Consulta de nombre por NIT**

Este endpoint permite obtener el nombre y la estructura básica del nombre de una empresa/persona a partir de su NIT (Número de Identificación Tributaria).

**URL:**  
`GET /api/ubl2.1/name-by-nit/{nit}`

* **nit:** Número de identificación tributaria de la empresa o persona.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `nit`: NIT de la empresa/persona a consultar.

**Respuesta:**

* Si encuentra el NIT, retorna la estructura del nombre (primer nombre, otros nombres, primer apellido, segundo apellido).
* Si no lo encuentra, retorna un mensaje de error.

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

## Consultar los datos de una empresa por NIT

`GET http://apidian2024.oo/api/ubl2.1/SearchCompany/1124024319`

**Consulta de información de empresa por NIT**

Este endpoint permite obtener información básica de una empresa consultando por su NIT (Número de Identificación Tributaria).  
La consulta se realiza en fuentes externas y retorna datos como nombre, tipo, dirección, estado y actividad de la empresa.

**URL:**  
`GET /api/ubl2.1/SearchCompany/{nit}`

* **nit:** Número de identificación tributaria de la empresa.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `nit`: NIT de la empresa a consultar.

**Respuesta:**

* Si encuentra el NIT, retorna información relevante de la empresa.
* Si no lo encuentra, retorna un mensaje de error.

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

## Unir varios PDF en un solo archivo

`POST http://apidian2023/api/ubl2.1/join-pdfs`

**Unir varios archivos PDF en uno solo**

Este endpoint permite unir varios archivos PDF de documentos electrónicos de la empresa autenticada en un solo archivo PDF.  
El usuario debe indicar los documentos a unir y el nombre del archivo resultante.

**URL:**  
`POST /api/ubl2.1/join-pdfs`

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros (body JSON):**

* `pdfs`: Array de objetos con los datos de cada PDF a unir. Cada objeto debe incluir:

  + `type_document_id`: ID del tipo de documento.
  + `prefix`: Prefijo del documento.
  + `number`: Número del documento.
* `name_joined_pdfs`: Nombre del archivo PDF resultante.

**Respuesta:**

* Si la operación es exitosa, retorna el PDF unido en base64 y un mensaje de éxito.
* Si ocurre un error, retorna el mensaje de error.

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

**Body**

```json
{
    "name_joined_pdfs": "PDFs-Unidos.pdf",
    "pdfs": [
        {
            "type_document_id": 1,
            "prefix": "T",
            "number": "68"
        },{
            "type_document_id": 1,
            "prefix": "T",
            "number": "67"
        },{
            "type_document_id": 1,
            "prefix": "T",
            "number": "65"
        },{
            "type_document_id": 4,
            "prefix": "9",
            "number": "70000012"
        }
    ]
}
```

---

## Descargar un archivo del documento (XML, PDF o ZIP)

`GET http://apidian2023.oo/api/ubl2.1/download/89008003/Attachment-SETP990000399.xml/BASE64`

**Descarga de archivos de documentos electrónicos**

Este endpoint permite descargar archivos asociados a documentos electrónicos de una empresa, como PDFs, XMLs o ZIPs.  
Se puede obtener el archivo directamente o en formato base64.

**URL:**  
`GET /api/ubl2.1/download/{identification}/{file}/{type_response?}`

* **identification:** Número de identificación de la empresa.
* **file:** Nombre del archivo a descargar (ejemplo: `Attachment-SETP990000399.xml`).
* **type\_response (opcional):** Si se envía el valor `BASE64`, el archivo se retorna en base64; si se omite, se descarga el archivo directamente.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `identification`: Identificación de la empresa.
  + `file` (string): Nombre del archivo.
  + `type_response` (opcional): Si es `BASE64`, retorna el archivo en base64.

**Respuesta:**

* Si el archivo existe, retorna el archivo solicitado (descarga directa o base64).
* Si no existe, retorna un mensaje de error.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Descargar el AttachedDocument en BASE64

`GET http://apidian2023.oo/api/ubl2.1/download/89008003/Attachment-SETP990000506.xml/BASE64`

**Descarga de archivos de documentos electrónicos**

Este endpoint permite descargar archivos asociados a documentos electrónicos de una empresa, como PDFs, XMLs o ZIPs.  
Se puede obtener el archivo directamente o en formato base64.

**URL:**  
`GET /api/ubl2.1/download/{identification}/{file}/{type_response?}`

* **identification:** Número de identificación de la empresa.
* **file:** Nombre del archivo a descargar (ejemplo: `Attachment-SETP990000399.xml`).
* **type\_response (opcional):** Si se envía el valor `BASE64`, el archivo se retorna en base64; si se omite, se descarga el archivo directamente.

**Autenticación:**  
Requiere token de autorización en el header:  
`Authorization: Bearer {API_TOKEN}`

**Parámetros:**

* En la URL:

  + `identification`: Identificación de la empresa.
  + `file` (string): Nombre del archivo.
  + `type_response` (opcional): Si es `BASE64`, retorna el archivo en base64.

**Respuesta:**

* Si el archivo existe, retorna el archivo solicitado (descarga directa o base64).
* Si no existe, retorna un mensaje de error.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Descargar el PDF de un documento

`GET http://apidian2023.oo/api/invoice/89008003/FES-SETP990000650.pdf`

**Descargar PDF de un documento electrónico**

Este endpoint permite descargar el archivo PDF de un documento electrónico de una empresa, utilizando el NIT y el nombre del archivo.

**URL:**  
`GET /api/invoice/{identification}/{filename}`

* **identification:** NIT de la empresa.
* **filename:** Nombre del archivo PDF a descargar (ejemplo: `FES-SETP990000650.pdf`).

**Parámetros en la URL:**

* `identification`: NIT de la empresa.
* `filename`: Nombre del archivo PDF.

**Respuesta:**

* Si el archivo existe, retorna el PDF como descarga directa (stream).

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Descargar un documento recibido

`GET http://apidian2023.oo/api/receivedfile/89008003/ad090011631902722219520220419145805646.xml`

**Descargar archivo recibido de la empresa**

Este endpoint permite descargar archivos recibidos (por ejemplo, XML, PDF, ZIP) asociados a una empresa, utilizando el NIT y el nombre del archivo.

**URL:**  
`GET /api/receivedfile/{identification}/{filename}`

* **identification:** NIT de la empresa.
* **filename:** Nombre del archivo recibido a descargar (ejemplo: `ad090011631902722219520220419145805646.xml`).

**Autenticación:**  
No requiere autenticación.

**Parámetros en la URL:**

* `identification` (string): NIT de la empresa.
* `filename` (string): Nombre del archivo recibido.

**Respuesta:**

* Si el archivo existe, retorna el archivo como descarga directa (stream).
* Si el archivo no existe, retorna un mensaje de error en formato JSON.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Consultar el ultimo consecutivo por tipo de documento

`GET http://apidian2023.oo/api/ubl2.1/invoice/current_number/1`

#### CONSULTAR EL ÚLTIMO NÚMERO DE DOCUMENTO

Este endpoint permite consultar el siguiente número consecutivo disponible para un tipo de documento específico de la empresa.

##### Endpoint

```
GET /api/ubl2.1/invoice/current_number/{type}/{prefix?}/{ignore_state_document_id?}
```

**Parámetros:**

* `type`: ID del tipo de documento (ver tabla `type_documents` en la base de datos).
* `prefix` (opcional): Prefijo de la resolución (ejemplo: 'FES', 'NC', etc.).
* `ignore_state_document_id` (opcional): Si es `true`, ignora el estado del documento para calcular el consecutivo.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Eliminar una empresa

`POST http://apidian2023.oo/api/ubl2.1/delete/company/89008003/2`

#### ELIMINAR COMPAÑÍA

Este endpoint permite eliminar una empresa de la base de datos de la API. **Debe utilizarse con precaución**, ya que borra toda la información asociada a la empresa.

**Parámetros:**

* `nit`: Número de identificación tributaria de la empresa.
* `dv`: Dígito de verificación de la empresa.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Ejemplo de uso:**

```
POST http://midominio.com/api/ubl2.1/delete/company/900123456/5
```

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

---

## Reenviar un documento al correo del cliente

`POST http://apidian2023.oo/api/send-email-customer/NO`

#### ENVIAR CORREO AL ADQUIRIENTE

Este endpoint permite enviar el documento adjunto de una factura al correo electrónico del adquiriente registrado en la base de datos.

**Parámetros en URL:**

* `ShowView` (opcional): Si se envía, retorna una vista con el resultado; si no, retorna un JSON.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).

**Body del request (JSON):**

* `company_idnumber`: NIT de la empresa emisora.
* `prefix`: Prefijo de la factura.
* `number`: Número de la factura.
* `smtp_parameters` (opcional): Parámetros SMTP personalizados.
* `customerEmail` (opcional): Correo alternativo del adquiriente.

**Notas:**

* El documento adjunto enviado corresponde a la factura especificada.
* Si el parámetro `ShowView` es `YES`, la respuesta será una vista HTML; si es `NO` o se omite, la respuesta será JSON.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `noauth`

**Body**

```json
{
	"company_idnumber": "89008003",
	"prefix": "SETP",
	"number": "990111030"
}
```

---

## Reenviar un documento por correo a otra direccion

`POST http://apidian2024.oo/api/ubl2.1/send-email`

#### ENVIAR CORREO AL ADQUIRIENTE

Este endpoint permite enviar el documento adjunto de una factura al correo electrónico del adquiriente registrado en la base de datos o al correo alternativo especificado.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Body del request (JSON):**

* `prefix`: Prefijo de la factura.
* `number`: Número de la factura.
* `alternate_email` (opcional): Correo alternativo del adquiriente.
* `base64graphicrepresentation` (opcional): PDF codificado en base64 para enviar una representación gráfica personalizada.
* `email_cc_list` (opcional): Lista de correos en copia.
* `smtp_parameters` (opcional): Parámetros SMTP personalizados.

**Notas:**

* Si no se especifica `base64graphicrepresentation`, se envía la representación gráfica por defecto.
* El correo se envía al email registrado en la base de datos o al alternativo si se indica.
* Puedes enviar copia a otros correos usando `email_cc_list`

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
	"prefix": "SETP",
	"number": "990000532",
    "showacceptrejectbuttons": false,
    "email_cc_list": [
        {
            "email": "alexanderobandolondono@gmail.com"
        },
        {
            "email": "alexander_obando@hotmail.com"
        }
    ],
"base64graphicrepresentation": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9MZW5ndGggNiAwIFIvRmlsdGVy…[base64 recortado, 22948 caracteres]"
}
```

---

## Reenviar la nomina al correo del empleado

`POST http://apidian2023.oo/api/send-email-employee/NO`

#### ENVIAR CORREO AL EMPLEADO (NÓMINA)

Este endpoint permite enviar el documento adjunto de la nómina al correo electrónico del empleado registrado en la base de datos.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Body del request (JSON):**

* `company_idnumber`: NIT de la empresa emisora.
* `prefix`: Prefijo de la nómina.
* `number`: Número/consecutivo de la nómina.
* `smtp_parameters` (opcional): Parámetros SMTP personalizados.
* `email_cc_list` (opcional): Lista de correos en copia.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `accept` | `application/json` |

**Autenticación:** `noauth`

**Body**

```json
{
	"company_idnumber": "89008003",
	"prefix": "NI",
	"number": "100025"
}
```

---

## Cargar el logo de la empresa

`PUT http://apidian2023.oo/api/ubl2.1/config/logo`

#### CONFIGURAR LOGO DE LA EMPRESA

Este endpoint permite registrar o actualizar el logo de la empresa en la API. El logo debe ser una imagen JPG codificada en base64.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Body del request (JSON):**

* `logo`: Imagen JPG codificada en base64.

**Notas:**

* El logo se asocia a la empresa identificada por el token utilizado.
* Solo se acepta formato JPG codificado en base64.

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

**Body**

```json
{
	"logo": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMD…[base64 recortado, 11488 caracteres]"
}
```

---

## Listar los certificados cargados de una empresa

`GET http://apidian2023.oo/api/ubl2.1/certificates-listing/89008003`

#### LISTADO DE CERTIFICADOS DIGITALES

Estos endpoints permiten consultar los certificados digitales registrados en la API, ya sea de todas las empresas o de una empresa específica.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Parámetros en la URL:**

* `company_identification_number` (opcional): NIT de la empresa para filtrar los certificados.

**Notas:**

* Si no se envía el parámetro, retorna todos los certificados disponibles.
* Si se envía el NIT, retorna solo los certificados de esa empresa.
* No requiere campos JSON en el body.

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

## Ajustar el consecutivo de un tipo de documento

`PUT http://apidian2023.oo/api/ubl2.1/config/generateddocuments`

#### REGISTRAR NÚMERO INICIAL DE DOCUMENTO

Este endpoint permite registrar el número inicial de un documento para una empresa, útil para configurar el primer consecutivo de facturas, nómina, soporte, etc.

**Autenticación:**  
Requiere un token de autorización (`API_TOKEN`).  
Este token se obtiene en el Paso 1 - Config Company. Si se extravió, se puede consultar en la tabla `users`, campo `API_TOKEN`.

**Body del request (JSON):**

* `identification_number`: NIT de la empresa.
* `type_document_id`: ID del tipo de documento (ver tabla `type_documents`).
* `prefix`: Prefijo de la resolución.
* `number`: Número inicial del documento.

**Notas:**

* Aplica para cualquier tipo de documento: factura, nómina, soporte, etc.
* Es útil para configurar el primer envío y el consecutivo inicial de la empresa.
* Para facturas AIU, se debe enviar la información correspondiente en el body, siguiendo el mismo formato.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "identification_number": "901464013",
    "type_document_id": 1,
    "prefix": "CI",
    "number": "4716"
}
```

---

## Regenerar el AttachedDocument de un documento

`POST http://apidian2023.oo/api/ubl2.1/regenerate-attached-document`

#### Endpoint: Regenerar AttachedDocument

Regenera el XML adjunto (AttachedDocument, code 89) de una factura ya validada por la DIAN, a partir de los archivos guardados (`FES-{n}.xml` + `RptaFE-{n}.xml`). No reconsulta a la DIAN ni envía correo: solo regenera y devuelve el archivo.

##### Petición

```
POST /api/ubl2.1/regenerate-attached-document
```

**Headers**

```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Body** — identificá el documento por CUFE **o** por prefijo + número:

```
{ "cufe": "a1b2c3d4e5f6..." }
```

```
{ "prefix": "SETP", "number": "990000001" }
```

Debe enviarse `cufe`, **o** la pareja `prefix` + `number`. El documento debe pertenecer a la empresa autenticada y estar validado

Respuesta de attachment en base64

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "cufe": "332ad89fa4a448e46d03d3f5713a044d1e686d74df31b8b6fabbda1d58e32978fb21ce9a1c4cd72dd72102ca7f5a3876" //Utilizar cufe
  // o utlizar
  //"PREFIX": "SETP",
  //"NUMBER": "990000001"
}
```

---
