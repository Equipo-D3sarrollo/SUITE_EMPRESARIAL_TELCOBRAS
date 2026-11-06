# Bitácora de continuidad entre agentes de IA

Este documento conserva el estado operativo del proyecto para que otro agente pueda continuar
desde el mismo punto sin depender del historial de una conversación. Es una bitácora: no reemplaza
el alcance ni las decisiones del proyecto.

## Cómo usarla

### Al comenzar una intervención

1. Leer primero **Estado actual** y la entrada más reciente de **Registro de intervenciones**.
2. Contrastar el estado descrito con el repositorio: revisar `git status --short`, los archivos
   relevantes y las pruebas relacionadas. La bitácora orienta; el código y los documentos vigentes
   son la fuente final.
3. Leer `docs/PLAN_IMPLEMENTACION_INICIAL.md`, `docs/PENDIENTES.md` y los ADR relacionados con la
   tarea. No iniciar una etapa posterior si la anterior no cumple sus criterios de salida.
4. No borrar, revertir ni atribuirse cambios preexistentes sin confirmar su origen. No incluir
   secretos ni valores de `.env` en esta bitácora.

### Al cerrar una intervención

1. Actualizar **Estado actual** para que describa el punto de continuación más reciente.
2. Añadir una entrada al inicio de **Registro de intervenciones**, con fecha, responsable/agente,
   objetivo, cambios, validaciones y resultado, pendientes y el siguiente paso ejecutable.
3. Separar hechos comprobados de supuestos. Indicar comandos exactos y fallos relevantes; no
   declarar una etapa terminada hasta verificar todos sus criterios de salida.
4. Registrar cambios persistentes aunque la tarea sea documental. Mantener el historial conciso y
   no reescribir ni eliminar entradas anteriores.

## Fuentes de verdad y prioridades

- Alcance y arquitectura: `docs/DOCUMENTO_MADRE_SUITE_TELCOBRAS.md`.
- Orden de trabajo y criterios de salida: `docs/PLAN_IMPLEMENTACION_INICIAL.md`.
- Decisiones técnicas: `docs/decisions/`.
- Pendientes y decisiones diferidas: `docs/PENDIENTES.md`.
- Estado de trabajo, evidencias y traspaso entre sesiones: este archivo.

Si dos fuentes discrepan, no ocultar la diferencia: verificar la decisión aprobada, actualizar el
documento que corresponda y dejar constancia aquí.

## Estado actual

| Campo | Estado |
|---|---|
| Corte de este estado | 2026-11-06 16:40, hora de Colombia (UTC-05:00) |
| Etapa | **Etapa 1 — Fundaciones, en curso** |
| Punto alcanzado | Autenticación (Google o código OTP por correo + TOTP, ADR-012; sin passkeys ni enlace mágico), organizaciones, permisos iniciales y endpoints de invitación están implementados. |
| Próximo foco | Administración de miembros y roles en la interfaz, seguida de E2E autenticado y verificaciones de salida. |
| Etapa 2 | Especificada, pero **no iniciar** hasta cumplir los criterios de salida de Etapa 1. |
| Commit | No se creó ningún commit en las intervenciones registradas aquí. |

### Último punto técnico verificado

La API implementa:

- `POST /api/v1/invitations`: crea la invitación para la organización activa, valida
  `members:invite`, restringe el rol a permisos que el invitador posee, registra auditoría y envía
  correo. El token aleatorio se entrega en el enlace y solo se guarda su hash.
- `POST /api/v1/invitations/{token}/accept`: requiere una sesión y una cuenta con correo verificado
  que coincida con el correo invitado. El token vence a los siete días y solo se acepta una vez;
  la aceptación crea la membresía y asigna el rol dentro del tenant.
- La pantalla existente `/invitacion/$token` acepta la invitación y luego activa la organización.

Archivos de referencia: `apps/api/src/modules/invitations/`,
`apps/api/src/auth/auth.module.ts`, `apps/api/test/invitations.test.ts`,
`apps/api/test/app.test.ts` y `packages/contracts/openapi/openapi.json`.

### Validaciones recientes

Pasaron en la última intervención:

- `pnpm.cmd --filter @telcobras/api typecheck`
- `pnpm.cmd exec biome check apps/api/src/auth/auth.module.ts apps/api/src/app.module.ts apps/api/src/modules/invitations apps/api/test/invitations.test.ts apps/api/test/app.test.ts`
- `pnpm.cmd --filter @telcobras/api openapi:export`
- Pruebas seleccionadas de invitaciones y API: 9 pasaron y 1 se omitió por filtro; después,
  la prueba de salud omitida pasó al ejecutarse aisladamente.
- `graphify update .`

Los servicios de PostgreSQL, Valkey, S3 y Mailpit aparecían saludables en Compose. No se volvió a
ejecutar la suite completa, build ni E2E en esta intervención. Validaciones previas de la etapa
están resumidas en el historial y no sustituyen volver a ejecutar los checks después de cambios
posteriores.

### Trabajo pendiente para cerrar Etapa 1

Contrastar cada punto con el código y actualizar esta lista al completarlo:

1. Administración de miembros y roles/permisos conectada a la API; el plan exige poder crear y
   asignar roles y observar el efecto en la navegación.
2. E2E autenticado del recorrido de alta/registro, invitación con rol limitado, aceptación,
   cambio de organización y menú según permisos.
3. Confirmar que la CI prueba el aislamiento RLS entre organizaciones y corregir cualquier brecha.
4. Ejecutar/verificar Lighthouse CI móvil con Slow 4G y los presupuestos del documento madre.
5. Confirmar todos los demás criterios de salida en `docs/PLAN_IMPLEMENTACION_INICIAL.md` antes de
   abrir Etapa 2.

### Precaución con Git

En el corte registrado, `git status --short` mostraba cambios locales en `.gitignore`, `README.md`,
`docs/PENDIENTES.md` y `docs/decisions/ADR-006-identidad.md`, además de numerosas rutas de la base
del proyecto como no seguidas (`?? apps/`, `?? packages/`, `?? infra/`, entre otras). La
implementación de fundaciones se encontraba así en el árbol de trabajo; esto **no** significa que
sean archivos prescindibles. No limpiar, resetear, revertir ni asumir que esos cambios pertenecen
a la tarea actual. Volver a consultar Git antes de editar o preparar commits.

## Plantilla de nueva intervención

Copiar al principio de **Registro de intervenciones** y completar. Si un campo no aplica, escribir
`No aplica`; no dejar ambiguo si una validación no se ejecutó.

```markdown
### AAAA-MM-DD HH:MM (UTC±HH:MM) — agente/modelo o sesión

- **Etapa y objetivo:**
- **Resultado:**
- **Cambios:** archivos y comportamiento; indicar decisiones relevantes.
- **Validaciones:** comandos ejecutados y resultado exacto; incluir las no ejecutadas/fallidas.
- **Pendientes/bloqueos:**
- **Siguiente paso exacto:** tarea prioritaria y archivos, criterio o comando para empezar.
- **Git:** estado relevante; commit creado: sí/no (no crear uno salvo que se solicite).
```

## Registro de intervenciones

### 2026-11-06 16:40 (UTC-05:00) — Claude Code (Opus 5.5)

- **Etapa y objetivo:** Etapa 1; por decisión del usuario, reemplazar passkey y enlace mágico por
  código OTP por correo. Antes: diagnóstico del enlace mágico (no se reprodujo el fallo; el clic del
  usuario no llegó a la API) y borrado de todas las organizaciones de la base local.
- **Resultado:** plugin `emailOTP` (6 dígitos, 10 min, 5 intentos, guardado cifrado); TOTP exigido
  también en `/sign-in/email-otp` mediante `requireTwoFactorOnEmailOtp` (revisar al actualizar
  Better Auth); el login con un correo sin cuenta responde `ACCOUNT_NOT_FOUND` y no crea cuentas sin
  nombre. Web con paso de código compartido (`otp-step.tsx`). ADR-012 reemplaza parcialmente ADR-006.
- **Cambios:** `apps/api/src/auth/auth.module.ts`, schema y migración `0004_drop_passkeys.sql`,
  `apps/api/test/auth-email-otp.test.ts`, `apps/web/src/lib/auth-client.ts`,
  `apps/web/src/features/auth/{otp-step,login-page,register-page}.tsx`, `registro.tsx`, i18n,
  `package.json` de api/web, `pnpm-workspace.yaml`, lockfile, docs (ADR-006, ADR-012, README,
  plan, documento madre, pendientes).
- **Validaciones:** `pnpm typecheck`, `pnpm test` (api 44, web 21, ui 19, contracts 17),
  `pnpm build`, `check:bundle`, `check:palette`, `openapi:export` pasaron. `pnpm lint` falla solo
  por 4 archivos preexistentes ajenos; `pnpm knip` falla por dependencias sin uso preexistentes.
  Prueba en navegador (Edge, Playwright, Mailpit): registro → código → `/onboarding`; login →
  código incorrecto rechazado → código correcto → `/app`.
- **Pendientes/bloqueos:** Google no exige TOTP (registrado en `docs/PENDIENTES.md`, antes de
  habilitar Google en producción). Siguen los pendientes de cierre de Etapa 1.
- **Siguiente paso exacto:** administración de miembros y roles en `apps/web/src/features/`.
- **Git:** sin commit. La base local no tiene organizaciones (el seed las recrea si se ejecuta).

### 2026-11-06 15:15 (UTC-05:00) — Copilot en VS Code

- **Etapa y objetivo:** Etapa 1; crear esta bitácora raíz y dejar un traspaso verificable.
- **Resultado:** creada `BITACORA_AGENTES_IA.md`, con protocolo de lectura/escritura, estado,
  evidencias, pendientes y advertencias para preservar el árbol de trabajo.
- **Cambios:** solo este documento; no se modificó código.
- **Validaciones:** contrastados el plan de implementación, los pendientes, el estado de Git y el
  resumen de la implementación previa. No se ejecutaron pruebas porque el cambio es documental.
- **Pendientes/bloqueos:** siguen pendientes la interfaz de administración, E2E autenticado y las
  verificaciones de salida de Etapa 1.
- **Siguiente paso exacto:** revisar `apps/web/src/features/` y los contratos/endpoints existentes
  para implementar administración de miembros y roles sin empezar Etapa 2.
- **Git:** no se creó commit ni se prepararon cambios; hay cambios previos y archivos no seguidos.

### 2026-11-06 — Copilot en VS Code

- **Etapa y objetivo:** Etapa 1; conectar el esquema y la pantalla de invitación ya existentes con
  la API.
- **Resultado:** endpoints de creación y aceptación, correo, auditoría, token de un solo uso,
  verificación de correo y restricciones de asignación de roles implementados.
- **Cambios:** módulo, controlador, servicio y pruebas en `apps/api`; DI de correo en
  `apps/api/src/auth/auth.module.ts`; registro del módulo en `apps/api/src/app.module.ts`;
  rutas OpenAPI regeneradas; estado actualizado en `README.md`.
- **Validaciones:** typecheck, Biome, exportación OpenAPI y pruebas seleccionadas pasaron. La
  prueba de salud dio 503 una vez dentro de la suite y pasó al repetirla aislada. `graphify update .`
  terminó correctamente. No se ejecutaron suite completa, build ni E2E.
- **Pendientes/bloqueos:** UI de administración de miembros/roles, E2E autenticado y verificaciones
  finales de Etapa 1.
- **Siguiente paso exacto:** implementar administración de miembros y roles en el shell web; leer
  el plan y los contratos/API existentes antes de tocar la interfaz.
- **Git:** no se creó commit. Ya había rutas base del proyecto no seguidas; preservar esos cambios.

### 2026-11-05 — Continuidad inicial de Etapa 1

- **Etapa y objetivo:** ubicar la fase y construir la base segura del proyecto.
- **Resultado:** se conectaron Better Auth, sesión/tenant, alta/listado/cambio de organización,
  permisos iniciales y roles semilla; también se integraron ajustes de infraestructura, shell,
  OpenAPI, CI, pruebas y documentación.
- **Validaciones reportadas en la sesión:** `pnpm test` (81 pruebas), `pnpm typecheck`,
  `pnpm build`, `pnpm check:bundle`, `pnpm check:palette`, exportación OpenAPI y Biome dirigido
  pasaron. `pnpm lint` mantuvo fallos de formato preexistentes en cuatro archivos no modificados.
- **Pendientes al cierre:** invitaciones, administración de miembros/roles, E2E autenticado y
  Lighthouse/CI para los criterios de salida.
- **Git:** los archivos de la base aparecían como cambios locales/no seguidos; no asumir que estaban
  guardados en commits.
