import { useNavigate } from '@tanstack/react-router';
import type { ModuleNode } from '@telcobras/contracts';
import { Dialog, DialogContent, DialogTitle } from '@telcobras/ui';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { matchNavigation, moduleLabel, submoduleLabel } from '../navigation';

type CommandDialogProps = {
  modules: readonly ModuleNode[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Paleta Ctrl+K (cmdk) sobre los módulos permitidos. Filtra con debounce de 300 ms (documento madre §19.2). */
export function CommandDialog({ modules, open, onOpenChange }: CommandDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const navigate = useNavigate();
  const results = matchNavigation(modules, debouncedQuery);

  function changeOpen(next: boolean) {
    onOpenChange(next);
    if (!next) setQuery('');
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent closeLabel={t.common.close} className="gap-0 p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{t.shell.search.dialogTitle}</DialogTitle>
        {/* Filtra matchNavigation con el texto ya estabilizado; cmdk solo maneja el teclado y la lista. */}
        <Command shouldFilter={false} label={t.shell.search.dialogTitle}>
          <div className="flex items-center gap-2 border-tb-gris/40 border-b px-4 pr-12">
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={t.shell.search.placeholder}
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-tb-negro/60"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-2 py-6 text-center text-sm">
              {t.shell.search.empty}
            </Command.Empty>
            {results.map((module) => (
              <Command.Group
                key={module.id}
                heading={moduleLabel(module.id)}
                className="**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:text-xs"
              >
                {module.submodules.map((sub) => (
                  <Command.Item
                    key={sub.id}
                    value={`${module.id}/${sub.id}`}
                    onSelect={() => {
                      changeOpen(false);
                      void navigate({
                        to: '/app/$module/$submodule',
                        params: { module: module.id, submodule: sub.id },
                      });
                    }}
                    className="cursor-pointer rounded-sm px-2 py-2 text-sm data-[selected=true]:bg-tb-gris/15"
                  >
                    {submoduleLabel(module.id, sub.id)}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
