import { useSuspenseQuery } from '@tanstack/react-query';
import { permissionsQuery } from '@/lib/queries';

/** Permisos de DataDian del usuario en la organización activa (§2.4). */
export function useDatadianPermissions() {
  const { data } = useSuspenseQuery(permissionsQuery);
  const granted = new Set(data.permissions);
  return {
    canView: granted.has('documents:view'),
    canRequestEvents: granted.has('documents:events'),
    canSync: granted.has('documents:sync'),
    canConfigure: granted.has('documents:configure'),
    canDecide: granted.has('documents:decide'),
  };
}
