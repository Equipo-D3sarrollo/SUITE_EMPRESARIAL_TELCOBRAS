# Registro de decisiones de arquitectura (ADR)

Las decisiones vienen del documento madre §14. ADR-005 se decidió con la prueba de concepto de RLS (`poc/rls/`). ADR-012 cambió el acceso por correo tras probar el flujo de passkey en uso real.

- [ADR-001](ADR-001-fuentes.md) — Resolución de conflictos entre fuentes
- [ADR-002](ADR-002-estilo-arquitectonico.md) — Monolito modular NestJS
- [ADR-003](ADR-003-frontend.md) — SPA React + Vite, Tailwind v4 y shadcn/Radix
- [ADR-004](ADR-004-multi-tenancy.md) — Tablas compartidas con RLS
- [ADR-006](ADR-006-identidad.md) — Better Auth sin contraseñas (reemplazado parcialmente por ADR-012)
- [ADR-007](ADR-007-marca-y-ui.md) — Paleta oficial, Poppins, lucide y Zona 4
- [ADR-008](ADR-008-convenciones.md) — Idioma, repositorio y herramientas
- [ADR-009](ADR-009-datos-e-infraestructura.md) — Cola, archivos y secretos
- [ADR-010](ADR-010-hosting-y-disponibilidad.md) — VPS con Docker Compose y meta de 99,5 %
- [ADR-011](ADR-011-alcance-funcional.md) — RADIAN, Odoo, automatización, analítica y LeadGen
- [ADR-005](ADR-005-orm.md) — Drizzle ORM para acceso a datos y migraciones
- [ADR-012](ADR-012-acceso-con-codigo-por-correo.md) — Acceso con código por correo en lugar de passkey
