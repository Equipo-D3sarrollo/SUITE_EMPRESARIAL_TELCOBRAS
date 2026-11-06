import { createFileRoute } from '@tanstack/react-router';
import { permissionsQuery } from '@/lib/queries';
import { AppShell } from '@/shell/app-shell';
import { ShellSkeleton } from '@/shell/shell-skeleton';
import { requireOrganization, requireSession } from '../guards';

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ context, location }) => {
    await requireSession(context.queryClient, location.href);
    await requireOrganization(context.queryClient);
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(permissionsQuery),
  component: AppShell,
  pendingComponent: ShellSkeleton,
});
