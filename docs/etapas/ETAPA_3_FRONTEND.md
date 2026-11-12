# Etapa 3 — Frontend de DataDian

> Segunda etapa de DataDian (2 a 5), según el orden fijado por el usuario el 12-nov-2026. Se construye **antes que el backend, contra contratos y mocks**. Esta ficha es un resumen: **la especificación completa es [ARQUITECTURA_FRONTEND_DATADIAN.md](../modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md)**. Dependencias, bloqueos y estado: [RUTA_DE_TRABAJO_DATADIAN.md](../modules/documents/RUTA_DE_TRABAJO_DATADIAN.md).

| Campo | Valor |
|---|---|
| Estado | Pendiente. Diseño propuesto; las decisiones de la §13 del documento siguen abiertas. Empieza cuando cierre la Etapa 2 |
| Componente | `apps/web` (`features/datadian`) y `packages/contracts` (esquemas zod, catálogo de rutas E1 a E32, OpenAPI de DataDian, máquina de estados de los botones) |
| Especificación | [ARQUITECTURA_FRONTEND_DATADIAN.md](../modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md) (§11: subetapas; §12: puntos por verificar; §13: decisiones) |
| Criterio de salida | Todas las pantallas funcionan contra los mocks; los contratos están publicados en `packages/contracts` (zod y OpenAPI); las pruebas unitarias, de componentes y E2E pasan en la CI, sin violaciones graves de accesibilidad |

## Subetapas

| Sub | Contenido |
|---|---|
| 3.1 | Contratos y máquina de estados (`deriveRadianActions`) |
| 3.2 | Mocks (MSW) y arnés de pruebas |
| 3.3 | Bandeja de recepción |
| 3.4 | Vista dividida: visor y línea de tiempo RADIAN |
| 3.5 | Acciones RADIAN, modal de reclamo (031) y semáforo del plazo |
| 3.6 | Configuración por organización (DIAN, certificado, software, buzones; Odoo conservado) |
| 3.7 | Sincronizaciones, cola, Zona 4 y cliente SSE detrás de bandera |
| 3.8 | Accesibilidad, rendimiento y cierre |

## Aportes de la especificación anterior

La antigua `ETAPA_7_FRONTEND_DATADIAN.md` se retiró: su parte de interfaz la reemplaza el documento de arquitectura y su parte de API y E2E pasó a la Etapa 4 (subetapa 4.6). Se conservan estos puntos que no estaban en el documento:

- **Aceptación irreversible:** la confirmación previa del 033 muestra el resumen de la factura y avisa que la aceptación es irreversible y que la factura ya no admitirá notas (decisión 7 del documento).
- **Representación gráfica oficial:** verificar si la DIAN publica una hoja XSLT oficial para el `AttachedDocument`. Mientras tanto, nada de XSLT en esta etapa (decisión 9).
- **Rendimiento móvil:** el presupuesto de Lighthouse de la subetapa 3.8 se mide también en móvil con Slow 4G, como exige el documento madre §19.4.
- **Paleta:** el blueprint pide naranja para el 032, pero **la paleta oficial no tiene naranja** (D-04, ADR-007); el rojo #C62828 es solo para errores. Ver la decisión 4 del documento y [`PENDIENTES.md`](../PENDIENTES.md).
