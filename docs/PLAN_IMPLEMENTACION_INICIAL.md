# Plan de implementación inicial — OrveX.IA

| Campo | Valor |
|---|---|
| Versión | 1.0 — borrador para aprobación |
| Fecha | 4 de noviembre de 2026 |
| Base | `docs/DOCUMENTO_MADRE_SUITE_TELCOBRAS.md` (§14 decisiones, §15 ruta) |
| Alcance | Etapas 0 y 1 en detalle; etapas 2 a 6 solo como referencia |

Sin fechas ni semanas: el PDF §29.2 prohíbe inventar cronogramas. Cada etapa termina cuando se cumple su criterio de salida, no en una fecha.

---

## Etapa 0 — Decisiones y descubrimiento

**Objetivo:** que no se escriba código sobre supuestos.

### 0.1 Decisiones (estado al 4-nov-2026)

Aprobadas por el arquitecto el 4-nov-2026 y **redactadas** en `docs/decisions/` (detalle en el documento madre §14):

| ADR | Decisión tomada |
|---|---|
| ADR-001 | D-01: los conflictos entre fuentes se resuelven caso por caso |
| ADR-002 | D-06: monolito modular NestJS; LeadGen y RADIAN como servicios Python aparte; REST + OpenAPI |
| ADR-003 | D-02/D-03: SPA React + Vite + TS, Tailwind v4, shadcn con Radix |
| ADR-004 | D-08: tablas compartidas + RLS, `organization_id`, membresías |
| ADR-006 | D-09: Better Auth; Google o correo + passkey, con TOTP; sin contraseñas. **Reemplazado parcialmente por ADR-012** |
| ADR-007 | D-04/D-05: paleta oficial de 6 colores + rojo solo para errores; Poppins; lucide; Zona 4 de 48 px expandible |
| ADR-008 | D-22/D-23/D-24: código en inglés y UI en español; monorepo pnpm; Node LTS |
| ADR-009 | D-10/D-11/D-12: BullMQ + Valkey + outbox; S3 gestionado; cifrado envolvente |
| ADR-010 | D-13: VPS con Docker Compose; disponibilidad del piloto 99,5 % |
| ADR-011 | D-15/D-16/D-17/D-20/D-21: RADIAN solo recepción; Odoo 19/20 con JSON-2; módulo 06 como catálogo gobernado; analítica separada; LeadGen se revisa primero |
| ADR-012 | D-09 (6-nov-2026): Google o código de 6 dígitos por correo (10 min, 5 intentos), con TOTP; sin passkeys, sin enlace mágico y sin contraseñas |

**Diferidas por decisión del arquitecto (4-nov-2026):** se resuelven más adelante y no frenan el arranque.
- ✅ **ADR-005 (D-07 ORM):** resuelto el 5-nov-2026 con la prueba de 0.3: Drizzle.
- **D-13:** el proveedor y la región del VPS.
- **D-14:** la figura ante la DIAN. El arquitecto lo averigua; bloquea la etapa 4.
- **D-18 y D-19:** se deciden más adelante.

### 0.2 Inspección de activos existentes (PDF §29.1)

Se necesita **acceso** a cada uno. Este es el pedido al responsable:

| Activo | Qué se entrega | Qué se documenta en `docs/modules/` |
|---|---|---|
| LeadGen (+ Harvey) | Repositorio, `.env` de ejemplo sin secretos | Stack, endpoints, modelo de datos, fuentes que consulta (para D-21), cómo correrlo en local |
| RADIAN | Repositorio o ejecutable | Cómo obtiene documentos de la DIAN, con qué credenciales, qué produce (para D-14 y D-15) |
| Make | Acceso de lectura a la organización | Inventario de escenarios: disparador, entradas, salidas, credenciales usadas, dueño |
| Odoo | Versión, edición, hosting, módulos instalados (`l10n_co*`) | Si la API externa está disponible (plan) y si Odoo ya maneja RADIAN (para D-16) |

### 0.3 Prueba de concepto de RLS (decide D-07)

Un script mínimo, no un producto. Debe probar que:
1. Dos organizaciones comparten las tablas y ninguna lee las filas de la otra.
2. La aplicación se conecta con un rol **sin** BYPASSRLS y con FORCE ROW LEVEL SECURITY.
3. El tenant se fija por transacción (`set_config('app.org_id', ..., true)`) y no se filtra entre peticiones del mismo pool de conexiones.
4. El ORM candidato lo soporta sin trucos.

Se prueba con el primer ORM candidato. Si falla, se prueba el siguiente. Gana el primero que pase.

**Criterio de salida de la etapa 0:** ADR-001 a ADR-011 redactados, ADR-005 decidido con la prueba de RLS en verde, e inventario de 0.2 escrito.

---

## Etapa 1 — Fundaciones

**Objetivo:** un esqueleto seguro y multiempresa sobre el que se construyen todos los módulos.
**Fuera de alcance:** CRM, LeadGen, RADIAN, integraciones y agentes. La Zona 4 y los dashboards usan datos simulados.

### 1.1 Repositorio y entorno

Estructura de referencia. Depende de los ADR-002, ADR-003 y ADR-008:

```
apps/web        SPA React + Vite (shell de 5 zonas)
apps/api        NestJS (monolito modular)
packages/ui     design system (tokens + componentes)
packages/contracts  tipos y esquemas compartidos (zod / OpenAPI)
infra/compose   docker-compose: postgres, valkey, almacenamiento S3 local, api, web
docs/           documento madre, plan, ADR
```

**Entregables:**
- `docker compose up` levanta todo en local.
- `.env.example` sin secretos.
- README de arranque.

### 1.2 Núcleo (backend)

| Paquete | Contenido | Criterio de aceptación |
|---|---|---|
| Organizaciones | Crear, leer y actualizar; campos de PDF §4.1 (NIT, zona horaria, moneda, módulos habilitados, estado) | Solo el superadministrador crea organizaciones |
| Usuarios y membresías | Un usuario puede estar en varias organizaciones; organización activa por sesión | Cambiar de organización no mezcla datos |
| Autenticación | Proveedor elegido en ADR-006; login, logout, sesión, renovación | Sin tokens en `localStorage`; límites de intentos por cuenta |
| RBAC configurable | Roles como datos; permisos `recurso:acción`; roles semilla del PDF §4.4 | Un rol sin permiso recibe 403; los roles se editan sin migrar el esquema |
| Auditoría | Tabla append-only (quién, qué, cuándo, organización, resultado), separada de los logs | No hay endpoint para editar ni borrar auditoría |
| RLS | Políticas en todas las tablas de negocio | **Prueba de aislamiento en la CI:** el usuario de la organización A pide un id de B y recibe 404 |
| API | REST versionado (`/api/v1`), OpenAPI generado, errores estructurados, id de correlación | El contrato OpenAPI se publica en cada build |

### 1.3 Shell de la UI (frontend)

| Paquete | Contenido | Criterio de aceptación |
|---|---|---|
| Design system | **Paleta oficial de 6 colores** (documento madre §12.4.1) como variables en `@theme` de Tailwind v4, con la paleta por defecto desactivada; botones, inputs, badges, tablas y tabs con las medidas de DESIGN.md. Las tarjetas base usan fondo blanco al 20% (80% de transparencia) y desenfoque; los datos se ven al 100%. | Página de muestra con todos los componentes; la CI falla si aparece un color fuera de los 6; todo el texto cumple el contraste AA; las tarjetas mantienen legibilidad sobre fondos decorativos. |
| Layout de 5 zonas | Zona 0 (56 px), Zona 1 (256 px, acordeón single), Zona 2 (72 %), Zona 3 (28 %), Zona 4 (48 px); scroll independiente por zona | Sin scroll global a 1280 px o más; el comportamiento en tablet sigue ADR-003 |
| Navegación | Árbol de 10 módulos (documento madre §12.2); **la ruta en la URL** decide las Zonas 2, 3 y 4; fade de 0,15 s | Recargar la página o usar "atrás" mantiene el submódulo |
| Zona 0 | Logo oficial (eslogan en español), selector de organización (desde el servidor), Ctrl+K (cmdk) sobre los módulos, campana, menú de usuario | El selector solo muestra las organizaciones del usuario |
| Acceso | Login y registro con **un** flujo (ADR-006); onboarding simplificado (nombre, NIT, tamaño) | Un usuario nuevo crea su organización y entra al dashboard |
| Vistas | Cada submódulo muestra un estado vacío con su nombre; el Dashboard General usa datos simulados de ejemplo | Ninguna vista llama a servicios externos |
| Administración | Usuarios, roles y permisos (matriz), conectada al núcleo real | Crear un rol, asignarlo y ver el efecto en el menú |

### 1.4 Rendimiento (documento madre §19, obligatorio desde esta etapa)

- **Frontend:** skeletons, TanStack Query (sin duplicados, optimistas), React Compiler, code splitting por ruta, Poppins local (3 pesos), SVG para logo e iconos, lazy loading y debounce de 300 ms en Ctrl+K.
- **API:** paginación por cursor (máx. 100), `Idempotency-Key`, sin `SELECT *`, índices que empiezan por `organization_id`, contador de N+1 en las pruebas.
- **Entrega:** Caddy con compresión zstd/br/gzip, Cloudflare como CDN, assets `immutable`, API sin estado.
- **Monitoreo:** OpenTelemetry en la API y los workers desde el primer commit.

### 1.5 Calidad

- **CI:** lint, typecheck, pruebas unitarias, prueba de aislamiento entre organizaciones, **knip**, **Lighthouse CI móvil con Slow 4G y presupuestos de §19.4**, build de imágenes y escaneo de secretos.
- **Pruebas:** unitarias en reglas de permisos y RLS; una prueba E2E del flujo registro → login → cambiar de organización → ver el menú según el rol.
- **Accesibilidad:** navegación con teclado entre zonas y contraste AA de los tokens elegidos.

**Criterio de salida de la etapa 1:**
- El usuario registra una organización e invita a otro usuario con un rol limitado.
- Ambos navegan los 10 módulos (vacíos) según sus permisos.
- La CI demuestra que una organización no ve datos de otra.
- Lighthouse móvil con Slow 4G cumple los presupuestos de §19.4.

---

## Etapas siguientes (referencia, documento madre §15)

| Etapa | Contenido | Antes de empezar se necesita |
|---|---|---|
| 2 | CRM completo, Document Management, notificaciones internas | D-10, D-11 |
| 3 | Integration Hub, conector Odoo, LeadGen por contrato | D-12, D-16, D-21, inventario 0.2 |
| 4 | RADIAN (estados internos + eventos DIAN), aprobación humana → borrador Odoo, adaptador Make | D-14, D-15 |
| 5 | Analítica, suscripciones y consumo, Panel Global, pentest, piloto | D-13, D-20 |
| 6 | Agent Management, Runtime Layer, agentes con OpenAI Agents SDK en Docker | D-18, D-19 |

---

## Riesgos del plan

| Riesgo | Efecto | Mitigación |
|---|---|---|
| No se consigue acceso a LeadGen, RADIAN o Make | Las etapas 3 y 4 quedan bloqueadas | Pedir los accesos en la etapa 0; las etapas 1 y 2 no los necesitan |
| La figura ante la DIAN (D-14) exige habilitación | RADIAN no puede registrar eventos por terceros | Consultar con legal/contable antes de la etapa 4 |
| La marca no se decide (D-04) | Hay que rehacer los tokens | Tokens centralizados en `packages/ui`: cambiar la paleta es editar un solo archivo |
| Versiones de la auditoría sin verificación cruzada | Se elige una versión equivocada | Confirmar cada versión en la documentación oficial al escribir el ADR |
