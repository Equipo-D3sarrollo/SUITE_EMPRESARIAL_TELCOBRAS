import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field, Input } from '../src';

describe('Field', () => {
  it('asocia la etiqueta al control y lo describe con la ayuda', () => {
    render(
      <Field label="NIT" description="Sin dígito de verificación">
        <Input />
      </Field>,
    );

    const input = screen.getByLabelText('NIT');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription('Sin dígito de verificación');
  });

  it('marca el control como inválido y anuncia el error', () => {
    render(
      <Field label="NIT" description="Sin dígito de verificación" error="El NIT no es válido">
        <Input />
      </Field>,
    );

    const input = screen.getByLabelText('NIT');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Sin dígito de verificación El NIT no es válido');
  });
});
