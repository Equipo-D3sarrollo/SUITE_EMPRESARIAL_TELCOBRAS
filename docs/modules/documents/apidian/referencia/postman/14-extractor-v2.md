# 14 - Extractor V2

> Fuente: colección Postman pública «FacturaLatam ApiDianV2.1» (<https://documenter.getpostman.com/view/50442293/2sBYHUSfRJ>), descargada el 10-nov-2026. Tokens y secretos censurados; base64 largos recortados.

Extractor de documentos de la DIAN, su despliegue es separado de proyecto APIDIAN

## Modo 1 - Extraccion completa (respuesta inmediata)

`POST http://coapi.test/api/extractor/company/stream`

### 1. Extracción completa (todo en uno)

```
POST {{base_url}}/api/extractor/company/stream
```

Hace todo el proceso en una sola llamada: obtiene los CUFEs del catálogo y  
consulta el XML de cada uno. Devuelve el resultado **completo al terminar**.

##### Headers

```
Authorization: Bearer [TOKEN CENSURADO]
Content-Type: application/json
```

##### Body

```
{
  "url": "{{dian_url}}",
  "tipo": "Received",
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-01-31"
}
```

##### Respuesta `200`

```
{
  "log": [
    "✅ Extracción iniciada",
    "🟡 Obteniendo CUFEs del catálogo DIAN…",
    "📄 Página 1",
    "🟢 CUFEs obtenidos: 9. Consultando la DIAN por cada uno…",
    "⬇️ Procesado 1/9 [ok]",
    "⬇️ Procesado 9/9 [ok]",
    "✅ Proceso terminado"
  ],
  "data": [
    {
      "TipoDocumento": "Invoice",
      "CUFE": "41a77209dcc997ca657d4f858f09c93c...",
      "Sub Total": 99495.8,
      "Total a Pagar": 118400,
      "TaxBreakdown": [],
      "LineItems": []
    }
  ]
}
```

> Estructura completa de `data` en la sección **Estructura de los documentos**.

##### Notas

* ⏱️ **El proceso puede tardar varios minutos.** Subir el timeout en Postman  
   (*Settings → Request timeout*). Si hay un proxy con límite de tiempo, usar los  
   endpoints 2 y 3.
* La respuesta llega **completa al final**; no es un stream en vivo.
* Si se agota la espera interna (~10 min) o no hay CUFEs en el rango, responde  
   `200` con `data: []` y el motivo en `log`.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "url": "{{dian_url}}",
  "tipo": "Received", //Sent - Received
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-01-31"
}
```

**Respuesta de ejemplo — success (200 OK)**

```json
{
  "log": [
    "✅ Iniciando proceso",
    "🟡 Ingresando a DIAN",
    "🟢 Redirigiendo a documentos",
    "📅 Filtro de fechas ingresado: 2025/08/01 - 2025/08/09",
    "🔍 Buscando documentos \"Enviados\" entre 2025/08/01 - 2025/08/09",
    "📄 Página 1",
    "🔍 Filas encontradas: 9",
    "➡️ Encontrados 9 botones de descarga",
    "⬇️ Descargando archivo 1...",
    "⬇️ Descargando archivo 2...",
    "⬇️ Descargando archivo 3...",
    "⬇️ Descargando archivo 4...",
    "⬇️ Descargando archivo 5...",
    "⬇️ Descargando archivo 6...",
    "⬇️ Descargando archivo 7...",
    "⬇️ Descargando archivo 8...",
    "⬇️ Descargando archivo 9...",
    "✅ Fin del paginado",
    "✅ Descargas completadas: 9 archivos descargados",
    "✅ JSON generado: E:\\www\\facturalatam-scraperv2\\downloads\\resultado_2025-09-02T15-35-44.json",
    "✅ Excel generado: E:\\www\\facturalatam-scraperv2\\downloads\\resultado_2025-09-02T15-35-44.xlsx",
    "JSON_PATH:resultado_2025-09-02T15-35-44.json",
    "EXCEL_PATH:resultado_2025-09-02T15-35-44.xlsx",
    "EXCEL_PATH:resultado_2025-09-02T15-35-44.xlsx",
    "✅ Proceso terminado"
  ],
  "data": [
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEBC24",
      "CUFE": "41a77209dcc997ca657d4f858f09c93c41dcc7149ff25c525190f3a5d0d4af7b72d7e3179780096c7b9249a52d5c5136",
      "Fecha de Creación": "2025-08-05",
      "Fecha de Vencimiento": "2025-08-05",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "901827899",
      "Razon Social del Receptor": "CASA ESPIRITU S A S",
      "Metodo de Pago": "10",
      "Sub Total": 99495.8,
      "Impuestos Cabecera": 18904.2,
      "Retenciones": 0,
      "Total a Pagar": 118400,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 19,
          "taxable_amount": 99495.8,
          "amount": 18904.2
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Certificados Firma Digital - DIAN Colombia - Anual",
          "Referencia": "CFC-A",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 143273.95,
          "Total": 99495.8,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 19,
              "taxable_amount": 99495.8,
              "amount": 18904.2
            }
          ],
          "total_tax_line": 18904.2
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEBC25",
      "CUFE": "4d714bc10d24226319b9cde972d0a947e2682d42f4eaf7ab1f25de1683783c70c7878686e4c9c53aeb708f3c97103252",
      "Fecha de Creación": "2025-08-05",
      "Fecha de Vencimiento": "2025-08-05",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "1007259520",
      "Razon Social del Receptor": "DIEGO ALEJANDRO VALLEJO PASTRANA",
      "Metodo de Pago": "10",
      "Sub Total": 99495.8,
      "Impuestos Cabecera": 18904.2,
      "Retenciones": 0,
      "Total a Pagar": 118400,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 19,
          "taxable_amount": 99495.8,
          "amount": 18904.2
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Certificados Firma Digital - DIAN Colombia - Anual",
          "Referencia": "CFC-A",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 143273.95,
          "Total": 99495.8,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 19,
              "taxable_amount": 99495.8,
              "amount": 18904.2
            }
          ],
          "total_tax_line": 18904.2
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEFL3",
      "CUFE": "5ae5024c703f7ecbdd26fe9bf058781ce7fddfcb46c1120a2762cfdb596a809d0924948b9600212faf19823188dbf4bb",
      "Fecha de Creación": "2025-08-01",
      "Fecha de Vencimiento": "2025-08-01",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "79881562",
      "Razon Social del Receptor": "MORALES CUBILLOS JHONNY ALEXANDER",
      "Metodo de Pago": "10",
      "Sub Total": 2092596,
      "Impuestos Cabecera": 0,
      "Retenciones": 0,
      "Total a Pagar": 2092596,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 0,
          "taxable_amount": 2092596,
          "amount": 0
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Cloud Computing Software de Facturación Electrónica",
          "Referencia": "CCSFE",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 2092596,
          "Total": 2092596,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 0,
              "taxable_amount": 2092596,
              "amount": 0
            }
          ],
          "total_tax_line": 0
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEBC28",
      "CUFE": "a56969a2522fdeb0a750bffa22975388c3ce1162b44f62bddfb580289c251222478cbc9e26c36bf0965ffa00fbbe6a64",
      "Fecha de Creación": "2025-08-08",
      "Fecha de Vencimiento": "2025-08-08",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "901745036",
      "Razon Social del Receptor": "SISTECONFIT S A S",
      "Metodo de Pago": "31",
      "Sub Total": 124369.75,
      "Impuestos Cabecera": 23630.25,
      "Retenciones": 0,
      "Total a Pagar": 148000,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 19,
          "taxable_amount": 124369.75,
          "amount": 23630.25
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Certificados Firma Digital - DIAN Colombia - Anual",
          "Referencia": "CFC-A",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 148000,
          "Total": 124369.75,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 19,
              "taxable_amount": 124369.75,
              "amount": 23630.25
            }
          ],
          "total_tax_line": 23630.25
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEFL4",
      "CUFE": "aefb7cbd5e72761513f323910abe034574fd944a6571caa55a08661f2396edec38969321d58f3aa353ce760a126caffd",
      "Fecha de Creación": "2025-08-01",
      "Fecha de Vencimiento": "2025-08-01",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "901804761",
      "Razon Social del Receptor": "FEASY SOFTWARE SOLUTIONS S A S",
      "Metodo de Pago": "10",
      "Sub Total": 1030750,
      "Impuestos Cabecera": 0,
      "Retenciones": 0,
      "Total a Pagar": 1030750,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 0,
          "taxable_amount": 1030750,
          "amount": 0
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Cloud Computing Software de Facturación Electrónica",
          "Referencia": "CCSFE",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 1030750,
          "Total": 1030750,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 0,
              "taxable_amount": 1030750,
              "amount": 0
            }
          ],
          "total_tax_line": 0
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEFL5",
      "CUFE": "b004f86eee8d84abe4f5d93dea1a48e65fa745e7c972249736e02431d31cbc7605de6b49dbaf1e15d512713b1a74b5a9",
      "Fecha de Creación": "2025-08-05",
      "Fecha de Vencimiento": "2025-08-05",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "77516865",
      "Razon Social del Receptor": "Pragmatech Venture SpA",
      "Metodo de Pago": "10",
      "Sub Total": 2065113,
      "Impuestos Cabecera": 0,
      "Retenciones": 0,
      "Total a Pagar": 2065113,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 0,
          "taxable_amount": 2065113,
          "amount": 0
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Cloud Computing Software de Facturación Electrónica",
          "Referencia": "-",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 2065113,
          "Total": 2065113,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 0,
              "taxable_amount": 2065113,
              "amount": 0
            }
          ],
          "total_tax_line": 0
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEBC27",
      "CUFE": "d578166f3ed69d8ba7143bb581472acf5afa48490b02b0d8ba30eb7b4d43699f30a4355cde84221b2aa502ed02d83bb3",
      "Fecha de Creación": "2025-08-08",
      "Fecha de Vencimiento": "2025-08-08",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "900712713",
      "Razon Social del Receptor": "EXCELENCIA SOLUCIONES INTEGRALES SAS",
      "Metodo de Pago": "31",
      "Sub Total": 248739.5,
      "Impuestos Cabecera": 47260.5,
      "Retenciones": 0,
      "Total a Pagar": 296000,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 19,
          "taxable_amount": 248739.5,
          "amount": 47260.5
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Certificados Firma Digital - DIAN Colombia - Anual",
          "Referencia": "CFC-A",
          "Unidad de Medida": "94",
          "Cantidad": 2,
          "Precio Unitario": 148000,
          "Total": 248739.5,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 19,
              "taxable_amount": 248739.5,
              "amount": 47260.5
            }
          ],
          "total_tax_line": 47260.5
        }
      ]
    },
    {
      "TipoDocumento": "Invoice",
      "TipoBusqueda": "Sent",
      "Numero de Factura": "FEBC26",
      "CUFE": "f8c813a006042ff90348fa19726b430a8cfaf036f7e97960807e8d48f3043c621f3abfc89c83df2b7f83272a3578344e",
      "Fecha de Creación": "2025-08-08",
      "Fecha de Vencimiento": "2025-08-08",
      "Moneda": "COP",
      "NIT del Emisor": "901846280",
      "Razon Social del Emisor": "DIGITAL BÚHO SAS",
      "NIT del Receptor": "816006619",
      "Razon Social del Receptor": "SALUDNET LTDA",
      "Metodo de Pago": "10",
      "Sub Total": 99495.8,
      "Impuestos Cabecera": 18904.2,
      "Retenciones": 0,
      "Total a Pagar": 118400,
      "TaxBreakdown": [
        {
          "code": "01",
          "name": "IVA",
          "percent": 19,
          "taxable_amount": 99495.8,
          "amount": 18904.2
        }
      ],
      "LineItems": [
        {
          "Nombre del Producto": "Certificados Firma Digital - DIAN Colombia - Anual",
          "Referencia": "CFC-A",
          "Unidad de Medida": "94",
          "Cantidad": 1,
          "Precio Unitario": 143273.95,
          "Total": 99495.8,
          "taxes": [
            {
              "code": "01",
              "name": "IVA",
              "percent": 19,
              "taxable_amount": 99495.8,
              "amount": 18904.2
            }
          ],
          "total_tax_line": 18904.2
        }
      ]
    }
  ]
}
```

---

## Modo 2 - Iniciar la extraccion en segundo plano

`POST http://coapi.test/api/certificate`

### 2. Iniciar extracción (asíncrono)

```
POST {{base_url}}/api/extractor/company
```

Arranca el proceso y devuelve un `jobId` al instante. El resultado se consulta con  
el endpoint 3.

##### Headers

```
Authorization: Bearer [TOKEN CENSURADO]
Content-Type: application/json
```

##### Body

Idéntico al endpoint 1.

```
{
  "url": "{{dian_url}}",
  "tipo": "Received",
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-01-31"
}
```

##### Respuesta `202`

```
{
  "success": true,
  "jobId": "3f2a1b8c-...",
  "statusUrl": "https://api.tu-dominio.com/api/extractor/company/jobs/3f2a1b8c-...",
  "message": "Extracción iniciada. Consulte statusUrl para el avance y el resultado."
}
```

##### Script de test (guardar el `jobId`)

```
const r = pm.response.json();
if (r.jobId) pm.collectionVariables.set("job_id", r.jobId);
```

##### Notas

* ⚠️ **Un body inválido devuelve** **`502`\*\*\*\*, no** **`422`\*\*\*\*.** Si aparece  
   `"No se pudo iniciar la extracción: ..."`, revisar primero el formato de las  
   fechas (`YYYY-MM-DD`) y el valor de `tipo`.
* El job vive **2 horas** en caché.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
  "url": "{{dian_url}}",
  "tipo": "Received", //Sent - Received
  "fechaDesde": "2026-01-01",
  "fechaHasta": "2026-01-31"
}
```

**Respuesta de ejemplo — success (200 OK)**

```json
{
  "success": true,
  "jobId": "3f2a1b8c-...",
  "statusUrl": "https://api.tu-dominio.com/api/extractor/company/jobs/3f2a1b8c-...",
  "message": "Extracción iniciada. Consulte statusUrl para el avance y el resultado."
}
```

---

## Modo 3 - Consultar el avance y el resultado

`GET http://coapi.test/api/extractor/company/jobs/{{job_id}}`

### 3. Consultar avance y resultado

```
GET {{base_url}}/api/extractor/company/jobs/{{job_id}}
```

Se consulta por **polling** hasta que `status` sea `done` o `error`.

##### Headers

```
Authorization: Bearer [TOKEN CENSURADO]
```

##### Respuesta — en proceso

```
{
  "success": true,
  "status": "running",
  "stage": "enriching",
  "total": 9,
  "processed": 5,
  "log": [
    "🟢 CUFEs obtenidos: 9. Consultando la DIAN por cada uno…",
    "⬇️ Procesados 5/9 documento(s)…"
  ]
}
```

##### Respuesta — terminado

```
{
  "success": true,
  "status": "done",
  "stage": "done",
  "total": 9,
  "processed": 9,
  "log": ["...", "✅ Proceso terminado"],
  "data": [ ... ]
}
```

##### Campos de estado

| Campo | Valores |
| --- | --- |
| `status` | `running` · `done` · `error` |
| `stage` | `getting_cufes` → `enriching` → `done` (o `error`) |
| `total` | CUFEs encontrados en el rango |
| `processed` | CUFEs ya consultados en la DIAN |

##### Notas

* 🔁 **Cada consulta hace avanzar el proceso** (procesa 5 documentos por llamada).  
   Sin polling, el job no progresa. **Consultar cada 3–5 segundos.**
* `404` si el job no existe, expiró (2 h) o pertenece a otra empresa.
* Con `status: "error"` viene además el campo `message`.

**Autenticación:** `bearer`

**Respuesta de ejemplo — Respuesta — en proceso ( )**

```json
{
  "success": true,
  "status": "running",
  "stage": "enriching",
  "total": 9,
  "processed": 5,
  "log": [
    "🟢 CUFEs obtenidos: 9. Consultando la DIAN por cada uno…",
    "⬇️ Procesados 5/9 documento(s)…"
  ]
}
```

**Respuesta de ejemplo — Respuesta — terminado ( )**

```json
{
  "success": true,
  "status": "done",
  "stage": "done",
  "total": 9,
  "processed": 9,
  "log": ["...", "✅ Proceso terminado"],
  "data": [ ... ]
}
```

---

## Modo 4 - Descargar el XML de un documento por CUFE

`POST http://coapi.test/api/ubl2.1/xml/document/{{cufe}}`

### 4. XML de un documento por CUFE

```
POST {{base_url}}/api/ubl2.1/xml/document/{{cufe}}
```

Consulta en la DIAN el XML de **un** documento por su CUFE, usando el certificado  
de la empresa. Devuelve el XML en **base64**.

##### Headers

```
Authorization: Bearer [TOKEN CENSURADO]
Content-Type: application/json
```

##### Body

```
{ "is_event": true }
```

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `is_event` | boolean | ❌ | `true` para consultar por el endpoint de eventos (documentos recibidos) |

##### Respuesta `200`

```
{
  "success": true,
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetXmlByDocumentKeyResponse": {
          "GetXmlByDocumentKeyResult": {
            "Code": "100",
            "XmlBytesBase64": "PD94bWwgdmVyc2lvbj0iMS4w..."
          }
        }
      }
    }
  },
  "certificate_days_left": 123
}
```

##### Notas

* El XML está en  
   `ResponseDian → Envelope → Body → GetXmlByDocumentKeyResponse → GetXmlByDocumentKeyResult → XmlBytesBase64`.  
   Decodificar el base64 para obtener el UBL.
* Si el documento viene envuelto en un `AttachedDocument`, la factura real está  
   embebida dentro de un `cbc:Description`.
* Si la DIAN rechaza la consulta responde con `success: false` y el detalle en  
   `ResponseDian`.

**Headers**

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |

**Autenticación:** `bearer`

**Body**

```json
{
    "is_event": true
}
```

**Respuesta de ejemplo — Respuesta 200 ( )**

```json
{
  "success": true,
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetXmlByDocumentKeyResponse": {
          "GetXmlByDocumentKeyResult": {
            "Code": "100",
            "XmlBytesBase64": "PD94bWwgdmVyc2lvbj0iMS4w..."
          }
        }
      }
    }
  },
  "certificate_days_left": 123
}
```

---
