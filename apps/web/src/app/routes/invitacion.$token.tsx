import { createFileRoute } from '@tanstack/react-router';
import { InvitationPage } from '@/features/auth/invitation-page';

export const Route = createFileRoute('/invitacion/$token')({
  component: InvitationPage,
});
