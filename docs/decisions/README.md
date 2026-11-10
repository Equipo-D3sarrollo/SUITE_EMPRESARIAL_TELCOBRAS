# Registro de decisiones de arquitectura (ADR)

Las decisiones vienen del documento madre §14. ADR-005 se decidió con la prueba de concepto de RLS (`poc/rls/`). ADR-012 cambió el acceso por correo tras probar el flujo de passkey en uso real.

- [ADR-001](ADR-001-fuentes.md) — Resolución de conflictos entre fuentes
- [ADR-002](ADR-002-estilo-arquitectonico.md) — Monolito modular NestJS (RADIAN como servicio aparte, reemplazado por ADR-013)
- [ADR-003](ADR-003-frontend.md) — SPA React + Vite, Tailwind v4 y shadcn/Radix
- [ADR-004](ADR-004-multi-tenancy.md) — Tablas compartidas con RLS
- [ADR-006](ADR-006-identidad.md) — Better Auth sin contraseñas (reemplazado parcialmente por ADR-012)
- [ADR-007](ADR-007-marca-y-ui.md) — Paleta oficial, Poppins, lucide y Zona 4
- [ADR-008](ADR-008-convenciones.md) — Idioma, repositorio y herramientas
- [ADR-009](ADR-009-datos-e-infraestructura.md) — Cola, archivos y secretos
- [ADR-010](ADR-010-hosting-y-disponibilidad.md) — VPS con Docker Compose y meta de 99,5 %
- [ADR-011](ADR-011-alcance-funcional.md) — RADIAN, Odoo, automatización, analítica y LeadGen (reemplazado parcialmente por ADR-013)
- [ADR-005](ADR-005-orm.md) — Drizzle ORM para acceso a datos y migraciones
- [ADR-012](ADR-012-acceso-con-codigo-por-correo.md) — Acceso con código por correo en lugar de passkey
- [ADR-013](ADR-013-datadian-y-nueva-ruta.md) — DataDian como etapa 2 y nueva ruta de etapas

## Contenido de esta carpeta

Además de este índice, cada archivo registra una decisión y sus consecuencias:

- `ADR-001-fuentes.md`: precedencia y resolución de conflictos entre fuentes del proyecto.
- `ADR-002-estilo-arquitectonico.md`: elección del monolito modular NestJS.
- `ADR-003-frontend.md`: SPA basada en React, Vite, Tailwind y componentes Radix/shadcn.
- `ADR-004-multi-tenancy.md`: aislamiento multiempresa mediante tablas compartidas y RLS.
- `ADR-005-orm.md`: Drizzle ORM para persistencia y migraciones.
- `ADR-006-identidad.md`: decisión inicial sobre Better Auth e identidad sin contraseña, parcialmente reemplazada por ADR-012.
- `ADR-007-marca-y-ui.md`: marca, paleta, tipografía, iconos y organización visual.
- `ADR-008-convenciones.md`: idioma, repositorio y herramientas de desarrollo.
- `ADR-009-datos-e-infraestructura.md`: decisiones sobre cola, archivos y secretos.
- `ADR-010-hosting-y-disponibilidad.md`: hosting en VPS con Docker Compose y objetivo de disponibilidad.
- `ADR-011-alcance-funcional.md`: alcance relativo a RADIAN, Odoo, automatización, analítica y LeadGen.
- `ADR-012-acceso-con-codigo-por-correo.md`: acceso con código de un solo uso enviado por correo.
- `ADR-013-datadian-y-nueva-ruta.md`: DataDian reemplaza al Centro Documental, pasa a ser la etapa 2 y renumera la ruta.
