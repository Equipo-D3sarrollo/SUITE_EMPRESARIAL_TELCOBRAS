# ADR-003: SPA React + Vite, Tailwind v4 y shadcn/Radix

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-02, D-03 (documento madre §14)

## Contexto
El PDF propone React + Vite + Bootstrap; la guía exige Next.js 14 (sin soporte y con CVE-2025-29927). Stitch y la guía usan Tailwind.

## Decisión
SPA con React, Vite y TypeScript. Tailwind CSS v4 + shadcn/ui con Radix fijado explícitamente. Se descartan Next.js, SSR/SSG y Bootstrap. La URL es la fuente de verdad del módulo activo; Zustand solo para el estado de UI; TanStack Query para los datos del servidor.

## Consecuencias
El shell es estático y se sirve desde la CDN. Toda la lógica de negocio vive en la API (PDF §17.1).
