import { Link } from '@tanstack/react-router';
import { Button, EmptyState, Skeleton } from '@telcobras/ui';
import { CircleAlert, Compass } from 'lucide-react';
import { t } from '@/i18n/es-CO';

/** Carga de una página completa (solo aparece si la ruta tarda más de un segundo). */
export function PageSkeleton() {
  return (
    <div aria-busy="true" className="flex h-screen flex-col gap-4 p-6">
      <span className="sr-only">{t.common.loading}</span>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
      <Skeleton className="flex-1" />
    </div>
  );
}

export function NotFoundView() {
  return (
    <EmptyState
      icon={Compass}
      title={t.common.notFoundTitle}
      description={t.common.notFoundDescription}
      action={
        <Button asChild>
          <Link to="/app">{t.common.goHome}</Link>
        </Button>
      }
    />
  );
}

export function ErrorView({ reset }: { reset: () => void }) {
  return (
    <div role="alert">
      <EmptyState
        icon={CircleAlert}
        title={t.common.genericError}
        action={
          <Button variant="secondary" onClick={reset}>
            {t.common.retry}
          </Button>
        }
      />
    </div>
  );
}
