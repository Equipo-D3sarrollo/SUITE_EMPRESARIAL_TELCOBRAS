import { render, screen, within } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { createDataTableColumns, DataTable, EmptyState } from '../src';

type Member = { id: string; name: string; role: string };

const column = createDataTableColumns<Member>();
const columns = column.columns([
  column.accessor('name', { header: 'Nombre' }),
  column.accessor('role', { header: 'Rol' }),
]);

const emptyState = <EmptyState icon={Inbox} title="No hay miembros" />;

describe('DataTable', () => {
  it('vacía: tabla con nombre, encabezados de columna y estado vacío en una sola celda', () => {
    render(<DataTable caption="Miembros" columns={columns} data={[]} emptyState={emptyState} />);

    const table = screen.getByRole('table', { name: 'Miembros' });
    const headers = within(table).getAllByRole('columnheader');
    expect(headers.map((header) => header.textContent)).toEqual(['Nombre', 'Rol']);
    expect(headers[0]).toHaveAttribute('scope', 'col');

    const cell = within(table).getByRole('cell');
    expect(cell).toHaveAttribute('colspan', '2');
    expect(within(cell).getByText('No hay miembros')).toBeInTheDocument();
    expect(table).not.toHaveAttribute('aria-busy');
  });

  it('cargando: marca aria-busy y pinta filas esqueleto sin estado vacío', () => {
    render(
      <DataTable
        caption="Miembros"
        columns={columns}
        data={undefined}
        loading
        loadingRows={3}
        emptyState={emptyState}
      />,
    );

    const table = screen.getByRole('table', { name: 'Miembros' });
    expect(table).toHaveAttribute('aria-busy', 'true');
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getAllByRole('cell')).toHaveLength(6);
    expect(screen.queryByText('No hay miembros')).toBeNull();
  });

  it('con datos: una fila por registro', () => {
    render(
      <DataTable
        caption="Miembros"
        columns={columns}
        data={[
          { id: 'm1', name: 'Ana Gómez', role: 'Administradora' },
          { id: 'm2', name: 'Luis Pérez', role: 'Comercial' },
        ]}
        getRowId={(member) => member.id}
        emptyState={emptyState}
      />,
    );

    const table = screen.getByRole('table', { name: 'Miembros' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByRole('cell', { name: 'Ana Gómez' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: 'Comercial' })).toBeInTheDocument();
  });
});
