import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@telcobras/ui';
import { Check, ChevronDown } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { api, unwrap } from '@/lib/api-client';
import { formatNit } from '@/lib/format-co';
import { organizationsQuery } from '@/lib/queries';

/** Selector de organización (Zona 0): lista solo las organizaciones del usuario, según el servidor. */
export function OrganizationSwitcher() {
  const { data } = useSuspenseQuery(organizationsQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const active = data.items.find((org) => org.isActive) ?? data.items[0];

  const switchOrganization = useMutation({
    mutationFn: (organizationId: string) =>
      unwrap(api.POST('/api/v1/me/active-organization', { body: { organizationId } })),
    onSuccess: async () => {
      // Todo lo cacheado pertenece a la organización anterior: se descarta antes de volver a pedirlo.
      await queryClient.resetQueries();
      await navigate({ to: '/app' });
    },
  });

  if (!active) return null;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`${t.shell.organization.switcherLabel}: ${active.name}`}
          className="flex min-w-0 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-left outline-tb-azul hover:bg-tb-gris/15 focus-visible:outline-2"
        >
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-tb-verde" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-semibold text-sm">{active.name}</span>
            <span className="text-xs tabular-nums">
              {t.shell.organization.nit(formatNit(active.nit))}
            </span>
          </span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>{t.shell.organization.listTitle}</DropdownMenuLabel>
          {data.items.map((org) => (
            <DropdownMenuItem
              key={org.id}
              disabled={switchOrganization.isPending}
              onSelect={() => {
                if (org.id !== active.id) switchOrganization.mutate(org.id);
              }}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{org.name}</span>
                <span className="text-xs tabular-nums">{formatNit(org.nit)}</span>
              </span>
              {org.id === active.id && (
                <>
                  <Check aria-hidden="true" />
                  <span className="sr-only">{t.shell.organization.active}</span>
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {switchOrganization.isError && (
        <span role="alert" className="text-tb-error text-xs">
          {t.shell.organization.switchError}
        </span>
      )}
    </div>
  );
}
