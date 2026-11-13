# DataDian (módulo 04)

Pantallas del módulo `documents`, que el usuario ve como **DataDian**. Implementan la **Etapa 3 (frontend)** según [`docs/modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md`](../../../../../docs/modules/documents/ARQUITECTURA_FRONTEND_DATADIAN.md), subetapas 3.1 a 3.7, contra mocks MSW (la API real llega en la Etapa 4).

**Contrato primero.** Esquemas, catálogo de rutas (E1 a E32 y las heredadas L1 a L5), errores por `code` y la máquina de estados de los botones (`deriveRadianActions`) viven en `packages/contracts/src/datadian/`. Los enumerados vienen de `packages/contracts/src/schemas/datadian-records.ts` (Etapa 2). El OpenAPI se genera con `pnpm --filter @telcobras/contracts openapi:datadian`.

## Ver la interfaz con mocks

```bash
# apps/web/.env.local (o en la línea de comandos)
VITE_DATADIAN_MOCKS=1
VITE_DATADIAN_MOCK_PROFILE=owner   # owner | accountant | viewer
pnpm --filter @telcobras/web dev
```

Con la bandera, `main.tsx` arranca MSW antes de montar la app: simula la sesión, la organización, los permisos y todas las rutas de DataDian. El worker lo sirve Vite en desarrollo desde `node_modules/msw` (no está en `public/`), y el import dinámico solo existe con `import.meta.env.DEV`: nada de MSW llega a `dist/`. En la consola, `__datadianMocks.advance(ms)` mueve el reloj del mock (por ejemplo, para que un plazo pase de `open` a `due_soon` y a `expired`).

Escenarios incluidos en los fixtures: factura con 032 que la DIAN rechaza (04, traza ficticia rotulada), factura cuyo envío falla en Telco, aceptación tácita (034) que llega al vencer el plazo, plazos abiertos, por vencer y vencidos, XML inválido, otro ambiente, factura de contado, factura heredada sin XML y proveedor con `<script>` en el nombre. Certificados de prueba por nombre de archivo: `vencido.pfx`, `otro-nit.pfx`, `sin-no-repudio.pfx` (fallan su validación) y `por-vencer.pfx` (válido a 89 días).

## Carpetas

| Carpeta | Propósito |
|---|---|
| `api/` | Cliente HTTP guiado por el catálogo (`client.ts`, valida cada respuesta con zod), llaves de consulta (`keys.ts`), `queryOptions` (`queries.ts`), mutaciones con `Idempotency-Key` por intención (`mutations.ts`) y reglas de sondeo (`polling.ts`: 3 s con evento pendiente, 30 s bandeja, 3 s certificado en validación, 5 s sincronización, 60 s Zona 4). |
| `inbox/` | Bandeja de recepción (`inbox-page.tsx`): cifras que filtran, filtros en la URL (`search-params.ts`, `filters.tsx`), búsqueda NIT/CUFE, grilla con semáforo de plazo, estados vacíos y de error. Con `?invoice=` pasa a la vista dividida. |
| `invoice/` | Vista dividida: visor de la Zona 2 (`invoice-viewer.tsx`, pestañas Representación, XML y PDF, sin XSLT) y Zona 3 (`invoice-context.tsx`: semáforo, botones, `timeline.tsx` con traza 02/04 e intentos, datos clave y la decisión interna heredada en `legacy-decision.tsx`). |
| `actions/` | Botones RADIAN según `deriveRadianActions` (`radian-actions.tsx`), confirmación previa del 030, 032 y 033 (`confirm-event-dialog.tsx`) y modal del reclamo 031 con conceptos y contador (`claim-dialog.tsx`). |
| `settings/` | Configuración por organización: datos DIAN, software (PIN de solo escritura), ambiente con lista de chequeo para producción, interruptores de sincronización (`dian-form.tsx`); certificado `.pfx` con validaciones previas, validaciones de Telco, activar, retirar e historial (`certificate-section.tsx`); buzones IMAP (`mailboxes-section.tsx`); Odoo conservado (`odoo-card.tsx`). |
| `sync/` | Submódulo Sincronizaciones: tarjeta por canal con "Sincronizar ahora", carga manual de XML, historial con errores por CUFE y advertencias (listado vacío, verificación humana), cola de trabajos con reintentar y cancelar. |
| `shared/` | Insignias, semáforo del plazo, banner del certificado (90 días), mensajes de error por `code`, formatos en hora de Bogotá, permisos (`useDatadianPermissions`). |
| `mocks/` | MSW: fixtures y fábricas validadas con zod (`fixtures.ts`), motor con reloj y semilla (`db.ts`), handlers tipados con el catálogo (`handlers.ts`), sesión simulada por perfil (`session.ts`) y arranque en el navegador (`browser.ts`). |

Los textos están en `apps/web/src/i18n/es-CO/datadian.ts` y se leen como `t.datadian.*`. La Zona 4 (`shell/zone4-status/connectors.ts`) toma el estado del conector RADIAN de `GET /documents/status`.

## Pendiente

- Cliente SSE (`live/`, Etapa 4.6): por ahora solo sondeo.
- Virtualización de la grilla con más de 200 filas; filtro de estado RADIAN de selección múltiple (la URL ya acepta valores separados por coma, la interfaz elige uno).
- E2E con Playwright, axe y Lighthouse (subetapa 3.8); pruebas de componentes de bandeja, visor, configuración y sincronizaciones.
- Tipos generados con `generate:api` para DataDian: el cliente usa el catálogo de contracts directamente.
