import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../src';

describe('Button', () => {
  it('es un botón con nombre accesible y no envía formularios por defecto', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Crear oportunidad</Button>);

    const button = screen.getByRole('button', { name: 'Crear oportunidad' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respeta type="submit" y el estado deshabilitado', () => {
    render(
      <Button type="submit" disabled>
        Guardar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
  });

  it('aplica el estilo al hijo con asChild sin forzar un type', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/ayuda">Centro de ayuda</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Centro de ayuda' });
    expect(link).not.toHaveAttribute('type');
    expect(link).toHaveClass('border-tb-azul');
  });

  it('el botón de solo icono toma el nombre de aria-label', () => {
    render(
      <Button size="icon" variant="ghost" aria-label="Notificaciones">
        <svg aria-hidden="true" />
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
  });
});
