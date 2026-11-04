# ADR-008: Idioma, repositorio y herramientas

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-22, D-23, D-24 (documento madre §14)

## Contexto
El blueprint usa nombres en español; el PDF, en inglés. No hay estructura de repositorio definida.

## Decisión
Código, tablas y APIs en inglés; interfaz solo en español de Colombia, con textos externalizados. Monorepo pnpm en este repositorio: apps/web, apps/api, packages/ui, packages/contracts. Node LTS.

## Consecuencias
Las traducciones futuras no requieren tocar código.
