import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type EmptyStateProps = Omit<ComponentProps<'div'>, 'title'> & {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  /** Normalmente un <Button> con la acción que llena el vacío. */
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center gap-2 px-6 py-10 text-center', className)}
      {...props}
    >
      <Icon aria-hidden="true" strokeWidth={1.5} className="mb-1 size-10 text-tb-gris" />
      <p className="font-semibold text-base">{title}</p>
      {description && <p className="max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
