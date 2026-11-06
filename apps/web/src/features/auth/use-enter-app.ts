import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

/**
 * Tras abrir sesión o cambiar de organización: se descarta la caché (era de otra sesión u organización)
 * y se navega; las guardas de ruta vuelven a pedir sesión, organizaciones y permisos.
 */
export function useEnterApp() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async (href: string) => {
    queryClient.clear();
    await navigate({ href });
  };
}
