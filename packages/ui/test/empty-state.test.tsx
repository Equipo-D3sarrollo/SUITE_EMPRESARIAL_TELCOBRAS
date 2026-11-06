import { render, screen } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Button, EmptyState } from '../src';

describe('EmptyState', () => {
  it('muestra título, descripción y una acción accesible; el icono es decorativo', () => {
    const { container } = render(
      <EmptyState
        icon={Inbox}
        title="Aún no hay invitaciones"
        description="Invita a tu equipo para que trabaje en esta organización."
        action={<Button>Invitar miembro</Button>}
      />,
    );

    expect(screen.getByText('Aún no hay invitaciones')).toBeInTheDocument();
    expect(
      screen.getByText('Invita a tu equipo para que trabaje en esta organización.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invitar miembro' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('acepta solo el título', () => {
    render(<EmptyState icon={Inbox} title="Sin resultados" />);

    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
