import { Slot } from '@radix-ui/react-slot';
import { CircleAlert } from 'lucide-react';
import { type ReactElement, type ReactNode, useId } from 'react';
import { cn } from '../lib/cn';
import { Label } from './label';

export type FieldProps = {
  label: ReactNode;
  description?: ReactNode;
  /** Mensaje de error ya traducido (por ejemplo, el de react-hook-form + zod). */
  error?: ReactNode;
  className?: string;
  /** Un solo control (Input, Select, Switch…). Field le pone id, aria-invalid y aria-describedby; no le pases id. */
  children: ReactElement;
};

export function Field({ label, description, error, className, children }: FieldProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Slot id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy}>
        {children}
      </Slot>
      {description && (
        <p id={descriptionId} className="text-xs">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1 text-tb-error text-xs">
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
