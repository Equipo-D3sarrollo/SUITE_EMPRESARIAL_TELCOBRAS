import { describe, expect, it } from 'vitest';
import {
  filterNavigation,
  MODULE_IDS,
  NAVIGATION,
  OWNER_ROLE_KEY,
  PERMISSIONS,
  type Permission,
  SEED_ROLE_PERMISSIONS,
} from '../src/index.js';

describe('navegación', () => {
  it('tiene los 10 módulos en el orden del documento madre', () => {
    expect(NAVIGATION.map((m) => m.id)).toEqual([...MODULE_IDS]);
  });

  it('no repite ids de submódulo dentro de un módulo', () => {
    for (const module of NAVIGATION) {
      const ids = module.submodules.map((s) => s.id);
      expect(new Set(ids).size, module.id).toBe(ids.length);
    }
  });

  it('muestra solo lo permitido y oculta los módulos sin submódulos visibles', () => {
    const granted = new Set<Permission>(['dashboard:view', 'administration:view', 'members:read']);
    const visible = filterNavigation(granted);
    expect(visible.map((m) => m.id)).toEqual(['dashboard', 'administration']);
    expect(visible[1]?.submodules.map((s) => s.id)).toEqual(['subscription', 'users']);
    expect(filterNavigation(new Set<Permission>(['organization:read']))).toEqual([]);
  });
});

describe('roles semilla', () => {
  it('el dueño tiene todos los permisos', () => {
    expect(new Set(SEED_ROLE_PERMISSIONS[OWNER_ROLE_KEY])).toEqual(new Set(PERMISSIONS));
  });

  it('cada rol usa permisos del catálogo, sin repetir, y ve al menos el inicio y la ayuda', () => {
    for (const [role, permissions] of Object.entries(SEED_ROLE_PERMISSIONS)) {
      expect(new Set(permissions).size, role).toBe(permissions.length);
      expect(permissions, role).toEqual(expect.arrayContaining(['dashboard:view', 'help:view']));
    }
  });
});
