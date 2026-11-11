import { useSyncExternalStore } from 'react';

/**
 * Modo claro u oscuro. La preferencia se guarda en este navegador; «system» sigue al sistema operativo.
 * public/theme-init.js aplica la clase .dark antes de pintar con la misma clave; este módulo la
 * mantiene al día cuando el usuario cambia la preferencia o el sistema cambia de modo.
 */
export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'orvex-theme';
const PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (PREFERENCES.includes(stored as ThemePreference)) return stored as ThemePreference;
  } catch {
    // Almacenamiento bloqueado: se sigue el sistema.
  }
  return 'system';
}

function apply(preference: ThemePreference) {
  const dark = preference === 'dark' || (preference === 'system' && darkQuery().matches);
  document.documentElement.classList.toggle('dark', dark);
}

let current: ThemePreference = typeof window === 'undefined' ? 'system' : readPreference();

export function setThemePreference(preference: ThemePreference) {
  current = preference;
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Sin almacenamiento el cambio dura hasta recargar la página.
  }
  apply(preference);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const query = darkQuery();
  const onSystemChange = () => {
    if (current === 'system') apply('system');
  };
  query.addEventListener('change', onSystemChange);
  return () => {
    listeners.delete(listener);
    query.removeEventListener('change', onSystemChange);
  };
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => 'system',
  );
}
