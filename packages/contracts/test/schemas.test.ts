import { describe, expect, it } from 'vitest';
import {
  cursorPageQuerySchema,
  invitationCreateSchema,
  organizationCreateSchema,
  roleCreateSchema,
} from '../src/index.js';

describe('organizationCreateSchema', () => {
  it('acepta el onboarding simplificado y normaliza el NIT', () => {
    const org = organizationCreateSchema.parse({
      name: ' Acme ',
      legalName: 'Acme S.A.S.',
      nit: '890.903.938-8',
      size: '11-50',
    });
    expect(org).toEqual({
      name: 'Acme',
      legalName: 'Acme S.A.S.',
      nit: '890903938-8',
      size: '11-50',
    });
  });

  it('rechaza tamaños fuera del catálogo', () => {
    const input = { name: 'Acme', legalName: 'Acme', nit: '890903938-8', size: '1000+' };
    expect(organizationCreateSchema.safeParse(input).success).toBe(false);
  });
});

describe('invitationCreateSchema', () => {
  it('normaliza el correo antes de validarlo', () => {
    const roleId = '0190d6a4-7c1e-7b3a-9f2e-3c4d5e6f7a8b';
    expect(invitationCreateSchema.parse({ email: ' Ana@Empresa.CO ', roleId }).email).toBe(
      'ana@empresa.co',
    );
  });
});

describe('roleCreateSchema', () => {
  it('rechaza permisos fuera del catálogo o repetidos', () => {
    expect(roleCreateSchema.safeParse({ name: 'Ventas', permissions: ['crm:fly'] }).success).toBe(
      false,
    );
    const repeated = { name: 'Ventas', permissions: ['help:view', 'help:view'] };
    expect(roleCreateSchema.safeParse(repeated).success).toBe(false);
  });
});

describe('cursorPageQuerySchema', () => {
  it('aplica el límite por defecto y nunca más de 100', () => {
    expect(cursorPageQuerySchema.parse({})).toEqual({ limit: 20 });
    expect(cursorPageQuerySchema.parse({ limit: '100' }).limit).toBe(100);
    expect(cursorPageQuerySchema.safeParse({ limit: '101' }).success).toBe(false);
  });
});
