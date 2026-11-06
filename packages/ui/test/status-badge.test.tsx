import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type Status, StatusBadge } from '../src';

const statuses: Status[] = ['ok', 'warning', 'error', 'info', 'neutral'];

describe('StatusBadge', () => {
  it.each(statuses)('el estado %s muestra icono decorativo y texto', (status) => {
    render(<StatusBadge status={status}>Validada</StatusBadge>);

    const badge = screen.getByText('Validada');
    const icon = badge.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(badge).toHaveTextContent(/^Validada$/);
  });

  it('el error usa el rojo reservado y nunca solo color', () => {
    render(<StatusBadge status="error">Rechazada</StatusBadge>);

    const badge = screen.getByText('Rechazada');
    expect(badge).toHaveClass('text-tb-error', 'border-tb-error');
    expect(badge.querySelector('svg')).not.toBeNull();
  });
});
