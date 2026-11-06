import { Skeleton } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';

/** Esqueleto con la forma de las 5 zonas mientras cargan la sesión, las organizaciones y los permisos. */
export function ShellSkeleton() {
  return (
    <div aria-busy="true" className="flex h-screen w-screen flex-col overflow-hidden">
      <span className="sr-only">{t.common.loading}</span>
      <div className="flex h-14 shrink-0 items-center gap-4 border-tb-gris/40 border-b px-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mx-auto h-8.5 w-full max-w-md" />
        <Skeleton className="size-8 rounded-full" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-64 shrink-0 flex-col gap-3 border-tb-gris/40 border-r p-3">
          <Skeleton className="h-8.5" />
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} className="h-8" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="basis-[72%] space-y-6 p-6">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-64" />
            </div>
            <div className="basis-[28%] space-y-4 border-tb-gris/40 border-l p-5">
              <Skeleton className="h-32" />
              <Skeleton className="h-48" />
            </div>
          </div>
          <Skeleton className="h-12 shrink-0 rounded-none" />
        </div>
      </div>
    </div>
  );
}
