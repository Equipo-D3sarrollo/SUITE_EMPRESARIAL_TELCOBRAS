import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api-client';

/** Un error 4xx no cambia al repetir la petición: solo se reintentan los fallos de red y los 5xx. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < 2;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      // Cada consulta fija su propio staleTime según el recurso; este es el mínimo para deduplicar.
      queries: { staleTime: 30_000, retry: shouldRetry },
      mutations: { retry: false },
    },
  });
}
