import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@telcobras/ui';
import { t } from '@/i18n/es-CO';

const text = t.datadian.confirm;

type ConfirmCode = '030' | '032' | '033';

type ConfirmEventDialogProps = {
  code: ConfirmCode | null;
  /** Proveedor, número y total de la factura. */
  summary: string;
  pending: boolean;
  error: string | null;
  variant: 'info' | 'accent' | 'primary';
  onClose: () => void;
  onConfirm: () => void;
};

/** Confirmación previa del 030, 032 y 033 (§5.3): resume la factura y su efecto legal. */
export function ConfirmEventDialog({
  code,
  summary,
  pending,
  error,
  variant,
  onClose,
  onConfirm,
}: ConfirmEventDialogProps) {
  return (
    <Dialog open={code !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeLabel={t.common.close}>
        {code && (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>{text.title(t.datadian.eventButtons[code])}</DialogTitle>
              <DialogDescription>{summary}</DialogDescription>
            </DialogHeader>
            <p className="text-sm">{text.effects[code]}</p>
            <p className="font-medium text-sm">{text.irreversible}</p>
            {error && (
              <p role="alert" className="text-sm text-tb-error">
                {error}
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  {text.cancel}
                </Button>
              </DialogClose>
              <Button variant={variant} disabled={pending} onClick={onConfirm}>
                {text.submit}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
