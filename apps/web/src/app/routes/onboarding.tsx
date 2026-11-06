import { createFileRoute, redirect } from '@tanstack/react-router';
import { OnboardingPage } from '@/features/onboarding/onboarding-page';
import { organizationsQuery } from '@/lib/queries';
import { requireSession } from '../guards';

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async ({ context, location }) => {
    await requireSession(context.queryClient, location.href);
    const organizations = await context.queryClient.ensureQueryData(organizationsQuery);
    if (organizations.items.length > 0) throw redirect({ to: '/app' });
  },
  component: OnboardingPage,
});
