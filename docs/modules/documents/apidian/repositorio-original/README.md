# Repositorio original de APIDIAN

Copia local del código original de APIDIAN (FacturaLatam), para estudiarlo y replicar en OrveX.IA
lo que necesita DataDian (módulo 04). El análisis está en `../ANALISIS_APIDIAN.md`.

## Estado

| Repositorio | Carpeta local | Estado |
|---|---|---|
| `https://github.com/facturalatam/apidian` (público, edición **Community**) | `apidian/` | **Clonado** el 10-nov-2026. Rama `main`, commit `da4ed764` del 14-ago-2026. Datos en `ORIGEN-apidian.txt` |
| `https://git.buho.la/facturalatam/apidian/co-apidian2026.git` (edición completa, privado) | `co-apidian2026/` | Sin acceso: requiere cuenta |

## Lo que trae la edición Community

**Licencia MIT**, Copyright (c) 2026 Factura Latam. Permite usar, copiar y modificar el código,
también en un producto comercial, siempre que se conserve el aviso de copyright y la licencia.

| Incluido | No incluido (edición Enterprise, de pago) |
|---|---|
| Factura de venta, notas crédito y débito, documento soporte y notas de ajuste | **Módulo Extractor de facturas de compras** |
| **Eventos RADIAN**: envío, consulta y carga de documentos recibidos por CUFE | Nómina electrónica y documentos equivalentes |
| Firma XAdES, transmisión a la DIAN, PDF y correo | RIPS y sector salud |
| Catálogos DIAN, resoluciones y paso a producción | App móvil, roles avanzados y almacenamiento en la nube |

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
- **Si se copia o adapta código de aquí a la suite**, se conserva el aviso de copyright y la
  licencia MIT de Factura Latam en el archivo o en un aviso de terceros.
- No ejecutar el `.env` ni los scripts de instalación del original contra la base de datos de la
  suite.
