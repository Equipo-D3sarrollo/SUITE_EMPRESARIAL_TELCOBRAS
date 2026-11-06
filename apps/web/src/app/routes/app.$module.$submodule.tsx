import { createFileRoute } from '@tanstack/react-router';
import { ModulePlaceholder } from '@/features/module-placeholder/module-placeholder';

export const Route = createFileRoute('/app/$module/$submodule')({
  component: ModulePlaceholder,
});
