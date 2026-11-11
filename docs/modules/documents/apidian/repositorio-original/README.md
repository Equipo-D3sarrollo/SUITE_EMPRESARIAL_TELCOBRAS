# Repositorio original de APIDIAN

Copia local del código original de APIDIAN (FacturaLatam), para estudiarlo y replicar en OrveX.IA
lo que necesita DataDian (módulo 04). El análisis está en `../ANALISIS_APIDIAN.md`.

## Estado

| Repositorio | Carpeta local | Estado |
|---|---|---|
| `https://github.com/facturalatam/apidian` (público, edición **Community**) | `apidian/` | **Clonado** el 10-nov-2026. Rama `main`, commit `da4ed764` del 14-ago-2026. Datos en `ORIGEN-apidian.txt` |
| `https://git.buho.la/facturalatam/apidian/co-apidian2026.git` (edición completa, privado) | `co-apidian2026/` | Sin acceso: requiere cuenta |

## Lo que trae la edición Community

**Licencia: dos partes distintas** (auditoría del 11-nov-2026).

- El código de este repositorio (controladores, plantillas XML, catálogos) trae un archivo
  `LICENSE` **MIT**, Copyright (c) 2026 Factura Latam. Su `composer.json` declara `LGPL-3.0`; es
  una incoherencia del original.
- **La firma XAdES y el cliente SOAP de la DIAN no están aquí.** Son la librería
  `ubl21dian/torresoftware` (fuente: `gitlab.com/torresoftware/ubl21dian`), con licencia
  **LGPL-3.0**. El clon no trae `vendor/`, así que ese código no está en esta carpeta.

Por eso APIDIAN se usa como **referencia de comportamiento**. No se copia ni se traduce su código.

| Incluido | No incluido (edición Enterprise, de pago) |
|---|---|
| Factura de venta, notas crédito y débito, documento soporte y notas de ajuste | **Módulo Extractor de facturas de compras** |
| **Eventos RADIAN**: envío, consulta y carga de documentos recibidos por CUFE | Nómina electrónica y documentos equivalentes |
| Llamadas a la firma XAdES y a la transmisión (la firma en sí está en la librería LGPL), PDF y correo | RIPS y sector salud |
| Catálogos DIAN, resoluciones y paso a producción | App móvil, roles avanzados y almacenamiento en la nube |

**El clon es del 14-ago-2026, anterior a las correcciones de seguridad de octubre de 2026** que
describe el manual. En este código hay descargas por NIT sin autenticación, el `api_token` y la
contraseña del certificado se guardan sin protección y la verificación TLS contra la DIAN está
desactivada. **No se despliega.** Detalle en `../ANALISIS_APIDIAN.md` §12.

**Consecuencia:** el extractor que lista los documentos del portal de la DIAN **no está en este
código**. Lo que sí está y nos sirve:

- `app/Http/Controllers/Api/RadianEventController.php`: `load-document-by-cufe` y la recepción de
  documentos del vendedor.
- `app/Http/Controllers/Api/SendEventController.php`: `send-event`, `send-event-data` y consultas
  de eventos.
- `app/Http/Controllers/Api/XmlDocumentController.php`: el XML de un documento por CUFE con el web
  service `GetXmlByDocumentKey` de la DIAN.
- `app/Http/Controllers/Api/StateController.php`: estado de documentos y eventos.
- Migraciones de `events`, `received_documents` y `type_rejections`, y el catálogo
  `public/csv/events.csv`.

## Cómo actualizarlo

```powershell
git -C .\docs\modules\documents\apidian\repositorio-original\apidian pull --ff-only
```

El script `clonar-apidian.ps1` sirve para clonar el repositorio privado `co-apidian2026` u otro,
con credenciales:

```powershell
.\docs\modules\documents\apidian\repositorio-original\clonar-apidian.ps1 -Url <url> -Carpeta <carpeta>
```

## Reglas

- **La copia no se versiona en la suite.** Las carpetas clonadas y los `ORIGEN-*.txt` están en
  `.gitignore`. Así el repositorio no carga 32 MB de PHP, y las herramientas del proyecto no lo
  escanean. Solo se versionan este README y el script.
- **No se copia código de aquí a la suite.** Si en algún caso se adapta un catálogo o una
  plantilla MIT, se conserva el aviso de copyright y la licencia de Factura Latam. El código de la
  librería LGPL no se traduce: la firma se escribe a partir del anexo técnico de la DIAN.
- No ejecutar el `.env` ni los scripts de instalación del original contra la base de datos de la
  suite.
