// Límites de paginación sin zod: la web los importa en su bundle inicial (lib/queries.ts) y este módulo
// no debe arrastrar los esquemas. pagination.ts los reexporta, así que la API pública no cambia.
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;
