# APIDIAN (FacturaLatam)

Material de referencia sobre APIDIAN, un API de facturación electrónica de terceros. DataDian
(módulo 04) no lo usa ni lo despliega: su edición Community sirve como **referencia de
comportamiento** para los eventos RADIAN y la consulta del XML por CUFE. La arquitectura de
DataDian y Telco está en [`../ARQUITECTURA_DATADIAN_TELCO.md`](../ARQUITECTURA_DATADIAN_TELCO.md).

**Empiece por `ANALISIS_APIDIAN.md`.** Resume qué es APIDIAN, qué exige cada operación ante la
DIAN, cómo habla con sus servicios web, su licencia y los errores de su código que no se deben
heredar.

| Elemento | Contenido |
|---|---|
| `ANALISIS_APIDIAN.md` | Análisis técnico de referencia |
| `repositorio-original/` | Destino del clon del código de APIDIAN, con el script para clonarlo. El código clonado no se versiona |
| `referencia/` | Copia íntegra de la documentación pública, descargada el 10-nov-2026: manual oficial (290 páginas), colección Postman (185 requests), índice de endpoints y transcripción del video de su extractor |

`referencia/` es material de terceros y de solo lectura. No se edita a mano: si FacturaLatam
publica cambios, se vuelve a descargar completa. Sus ejemplos traen razones sociales y nombres
reales: no se usan como datos de prueba.

**Licencia.** Los controladores, las plantillas y los catálogos de la edición Community son MIT.
La firma XAdES y el cliente SOAP están en la librería `ubl21dian/torresoftware`, con licencia
LGPL-3.0, que no viene en el clon. No se copia ni se traduce su código (ADR-013, enmienda).
