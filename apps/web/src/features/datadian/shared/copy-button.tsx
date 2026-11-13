import { Button } from '@telcobras/ui';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';

/** Copia un texto (CUFE, CUDE, XML) al portapapeles y lo confirma en el propio botón. */
export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={async () => {
        await navigator.clipboard?.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? t.datadian.viewer.copied : (label ?? t.datadian.viewer.copy)}
    </Button>
  );
}
