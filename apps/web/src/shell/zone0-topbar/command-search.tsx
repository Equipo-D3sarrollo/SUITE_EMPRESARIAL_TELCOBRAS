import type { ModuleNode } from '@telcobras/contracts';
import { Search } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { t } from '@/i18n/es-CO';

// cmdk y el diálogo se descargan al abrir el buscador por primera vez: no pesan en la carga del shell.
const CommandDialog = lazy(() =>
  import('./command-dialog').then((module) => ({ default: module.CommandDialog })),
);

/** Buscador Ctrl+K de la Zona 0: botón visible más el atajo global de teclado. */
export function CommandSearch({ modules }: { modules: readonly ModuleNode[] }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  function changeOpen(next: boolean) {
    setOpen(next);
    if (next) setRequested(true);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setRequested(true);
        setOpen((current) => !current);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => changeOpen(true)}
        aria-keyshortcuts="Control+K"
        className="flex h-8.5 w-full max-w-md cursor-pointer items-center gap-2 rounded-sm border border-tb-gris px-3 text-sm outline-tb-azul hover:bg-tb-gris/15 focus-visible:outline-2"
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">{t.shell.search.trigger}</span>
        <kbd className="rounded-sm border border-tb-gris px-1.5 font-sans text-xs">
          {t.shell.search.shortcut}
        </kbd>
      </button>
      {requested && (
        <Suspense fallback={null}>
          <CommandDialog modules={modules} open={open} onOpenChange={changeOpen} />
        </Suspense>
      )}
    </>
  );
}
