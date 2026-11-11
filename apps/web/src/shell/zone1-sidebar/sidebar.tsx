import { Link, useParams } from '@tanstack/react-router';
import type { ModuleNode } from '@telcobras/contracts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input } from '@telcobras/ui';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { moduleIcon } from '../module-icons';
import { matchNavigation, moduleLabel, submoduleLabel } from '../navigation';

/** Zona 1: menú de 256 px con acordeón de un solo módulo abierto y filtro rápido. */
export function Sidebar({ modules }: { modules: readonly ModuleNode[] }) {
  const { module: activeModule = '' } = useParams({ strict: false });
  const [filter, setFilter] = useState('');
  const [openModule, setOpenModule] = useState(activeModule);
  const [syncedModule, setSyncedModule] = useState(activeModule);
  // Si la URL cambia de módulo (Ctrl+K, atrás), se abre el módulo nuevo.
  if (activeModule !== syncedModule) {
    setSyncedModule(activeModule);
    setOpenModule(activeModule);
  }
  const visible = matchNavigation(modules, filter);

  function changeFilter(value: string) {
    setFilter(value);
    const [firstMatch] = matchNavigation(modules, value);
    if (value.trim() && firstMatch) setOpenModule(firstMatch.id);
  }

  return (
    <nav
      id="module-navigation"
      aria-label={t.shell.regions.navigation}
      className="flex w-64 shrink-0 flex-col border-tb-gris/40 border-r bg-tb-superficie"
    >
      <div className="relative p-3">
        <Search
          aria-hidden="true"
          className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-6 size-4"
        />
        <Input
          type="search"
          value={filter}
          onChange={(event) => changeFilter(event.target.value)}
          aria-label={t.shell.sidebar.filterLabel}
          placeholder={t.shell.sidebar.filterPlaceholder}
          className="pl-9"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {visible.length === 0 ? (
          <p className="px-2 py-4 text-sm">
            {modules.length === 0 ? t.shell.sidebar.noModules : t.shell.sidebar.noMatches}
          </p>
        ) : (
          <Accordion type="single" collapsible value={openModule} onValueChange={setOpenModule}>
            {visible.map((module) => {
              const Icon = moduleIcon(module);
              return (
                <AccordionItem key={module.id} value={module.id} className="border-b-0">
                  <AccordionTrigger className="rounded-sm px-2 py-2.5 hover:bg-tb-gris/15">
                    <span className="flex items-center gap-2.5">
                      <Icon aria-hidden="true" className="size-4 shrink-0 text-tb-azul" />
                      {moduleLabel(module.id, true)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <ul className="ml-4 flex flex-col gap-0.5 border-tb-gris/40 border-l pl-2">
                      {module.submodules.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to="/app/$module/$submodule"
                            params={{ module: module.id, submodule: sub.id }}
                            className="block rounded-sm px-2 py-1.5 outline-tb-azul hover:bg-tb-gris/15 focus-visible:outline-2"
                            activeProps={{
                              className:
                                'bg-tb-verde font-semibold text-tb-negro hover:bg-tb-verde',
                            }}
                          >
                            {submoduleLabel(module.id, sub.id)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </nav>
  );
}
