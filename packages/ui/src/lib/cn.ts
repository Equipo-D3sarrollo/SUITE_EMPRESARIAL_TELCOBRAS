import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Une clases condicionales y resuelve conflictos de Tailwind (la última gana). */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
