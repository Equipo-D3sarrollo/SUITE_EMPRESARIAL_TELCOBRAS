import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@telcobras/ui';
import { ChevronDown, LogOut } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { sessionQuery } from '@/lib/queries';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export function UserMenu() {
  const { data: session } = useSuspenseQuery(sessionQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  if (!session) return null;
  const { user } = session;

  async function signOut() {
    // El cliente de Better Auth se descarga solo al cerrar sesión: no pesa en la carga del shell.
    const { authClient } = await import('@/lib/auth-client');
    await authClient.signOut();
    // Nada de la sesión anterior queda en memoria para el siguiente usuario del navegador.
    queryClient.clear();
    await navigate({ to: '/iniciar-sesion' });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.shell.userMenu.label}
        className="flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-1 outline-tb-azul hover:bg-tb-gris/15 focus-visible:outline-2"
      >
        <Avatar>
          {user.image && <AvatarImage src={user.image} alt="" />}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-40 truncate font-medium text-sm xl:inline">{user.name}</span>
        <ChevronDown aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-semibold">{user.name}</span>
          <span className="truncate font-normal text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut aria-hidden="true" />
          {t.shell.userMenu.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
