import { filterNavigation, type Permission } from '@telcobras/contracts';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from '@/shell/zone1-sidebar/sidebar';
import { renderAtSubmodule } from './render-with-router';

function renderSidebar(permissions: Permission[], path?: string) {
  const modules = filterNavigation(new Set(permissions));
  return renderAtSubmodule(() => <Sidebar modules={modules} />, path);
}

describe('Sidebar (Zona 1)', () => {
  it('muestra solo los módulos y submódulos que permiten los permisos', async () => {
    renderSidebar(['dashboard:view', 'administration:view', 'members:read']);
    const nav = await screen.findByRole('navigation', { name: 'Módulos' });

    const modules = within(nav)
      .getAllByRole('button')
      .map((button) => button.textContent);
    expect(modules).toEqual(['1. Inicio', '9. Administración']);

    fireEvent.click(within(nav).getByRole('button', { name: '9. Administración' }));
    // Sin organization:read ni roles:read, Administración solo deja ver Usuarios y Suscripción.
    expect(within(nav).getByRole('link', { name: 'Usuarios' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Suscripción y Licencias' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Roles y Permisos' })).not.toBeInTheDocument();
  });

  it('abre el módulo de la URL, marca el submódulo activo y mantiene un solo módulo abierto', async () => {
    renderSidebar(['dashboard:view', 'help:view'], '/app/dashboard/quick-metrics');
    const nav = await screen.findByRole('navigation', { name: 'Módulos' });
    const inicio = within(nav).getByRole('button', { name: '1. Inicio' });
    const ayuda = within(nav).getByRole('button', { name: '10. Ayuda' });

    expect(inicio).toHaveAttribute('aria-expanded', 'true');
    expect(within(nav).getByRole('link', { name: 'Métricas Rápidas' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    fireEvent.click(ayuda);
    expect(ayuda).toHaveAttribute('aria-expanded', 'true');
    expect(inicio).toHaveAttribute('aria-expanded', 'false');
    expect(within(nav).queryByRole('link', { name: 'Dashboard General' })).not.toBeInTheDocument();

    // collapsible: un segundo clic deja todo cerrado.
    fireEvent.click(ayuda);
    expect(ayuda).toHaveAttribute('aria-expanded', 'false');
  });

  it('filtra por submódulo sin importar tildes ni mayúsculas y abre el primer resultado', async () => {
    renderSidebar(['dashboard:view', 'documents:view', 'integrations:view']);
    const nav = await screen.findByRole('navigation', { name: 'Módulos' });

    fireEvent.change(within(nav).getByRole('searchbox', { name: 'Filtrar módulos' }), {
      target: { value: 'odoo' },
    });

    expect(
      within(nav)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['5. Integraciones']);
    expect(within(nav).getByRole('link', { name: 'Odoo ERP' })).toBeInTheDocument();
    expect(
      within(nav).queryByRole('link', { name: 'Bandeja de recepción' }),
    ).not.toBeInTheDocument();

    fireEvent.change(within(nav).getByRole('searchbox'), { target: { value: 'BANDEJA' } });
    expect(
      within(nav)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['4. DataDian']);
    expect(within(nav).getByRole('link', { name: 'Bandeja de recepción' })).toBeInTheDocument();

    fireEvent.change(within(nav).getByRole('searchbox'), { target: { value: 'ANALITICA' } });
    expect(within(nav).getByText('Ningún módulo coincide con el filtro.')).toBeInTheDocument();
  });
});
