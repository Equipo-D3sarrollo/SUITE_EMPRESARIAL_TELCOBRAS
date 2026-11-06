import { filterNavigation } from '@telcobras/contracts';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CommandSearch } from '@/shell/zone0-topbar/command-search';
import { renderAtSubmodule } from './render-with-router';

const modules = filterNavigation(new Set(['dashboard:view', 'integrations:view'] as const));

describe('Buscador Ctrl+K (Zona 0)', () => {
  it('Ctrl+K abre la paleta solo con los módulos permitidos y filtra con debounce', async () => {
    renderAtSubmodule(() => <CommandSearch modules={modules} />);
    await screen.findByRole('button', { name: /Buscar módulos/ });

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog = await screen.findByRole(
      'dialog',
      { name: 'Buscar en la suite' },
      { timeout: 5_000 },
    );
    expect(within(dialog).getByRole('option', { name: 'Dashboard General' })).toBeInTheDocument();
    expect(within(dialog).getByRole('option', { name: 'Hub de Conectores' })).toBeInTheDocument();
    expect(within(dialog).queryByRole('option', { name: 'Leads' })).not.toBeInTheDocument();

    fireEvent.change(within(dialog).getByRole('combobox'), { target: { value: 'whatsapp' } });
    // Antes de 300 ms la lista no cambia.
    expect(within(dialog).getByRole('option', { name: 'Hub de Conectores' })).toBeInTheDocument();
    await waitFor(() =>
      expect(within(dialog).queryByRole('option', { name: 'Hub de Conectores' })).toBeNull(),
    );
    expect(within(dialog).getByRole('option', { name: 'WhatsApp Cloud API' })).toBeInTheDocument();
  });

  it('elegir un resultado navega al submódulo y cierra la paleta', async () => {
    const router = renderAtSubmodule(() => <CommandSearch modules={modules} />);
    fireEvent.click(await screen.findByRole('button', { name: /Buscar módulos/ }));
    const dialog = await screen.findByRole('dialog');

    fireEvent.click(within(dialog).getByRole('option', { name: 'Odoo ERP' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/integrations/odoo'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
