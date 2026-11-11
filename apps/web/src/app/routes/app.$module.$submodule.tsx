import { createFileRoute } from '@tanstack/react-router';
import { ModulePage } from '@/app/module-pages';

export const Route = createFileRoute('/app/$module/$submodule')({
  component: ModulePage,
});
