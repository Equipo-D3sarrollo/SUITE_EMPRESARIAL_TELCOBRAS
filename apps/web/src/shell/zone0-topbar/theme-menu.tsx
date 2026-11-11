import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@telcobras/ui';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { setThemePreference, type ThemePreference, useThemePreference } from '@/lib/theme';

const OPTIONS = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
] as const satisfies readonly { value: ThemePreference; icon: typeof Sun }[];

/** Zona 0: selector de modo claro, oscuro o según el sistema. */
export function ThemeMenu() {
  const preference = useThemePreference();
  const TriggerIcon = OPTIONS.find((option) => option.value === preference)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.shell.theme.label}>
          <TriggerIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t.shell.theme.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map(({ value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            aria-current={preference === value ? 'true' : undefined}
            onSelect={() => setThemePreference(value)}
          >
            <Icon aria-hidden="true" />
            <span className="flex-1">{t.shell.theme.options[value]}</span>
            {preference === value && <Check aria-hidden="true" className="text-tb-azul" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
