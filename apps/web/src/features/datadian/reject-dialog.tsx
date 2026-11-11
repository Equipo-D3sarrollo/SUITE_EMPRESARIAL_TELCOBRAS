import { REJECTION_CODES, type RejectionCode } from '@telcobras/contracts';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
} from '@telcobras/ui';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';

const text = t.datadian.reject;

type RejectDialogProps = {
  /** Número de la factura que se rechaza; sin él el diálogo está cerrado. */
  invoice: string | null;
  pending: boolean;
  onClose: () => void;
  onConfirm: (rejectionCode: RejectionCode, note: string | undefined) => void;
};

/** Rechazo con el motivo de reclamo de la DIAN (01 a 04), que es obligatorio, y una nota opcional. */
export function RejectDialog({ invoice, pending, onClose, onConfirm }: RejectDialogProps) {
  const [code, setCode] = useState<RejectionCode | ''>('');
  const [note, setNote] = useState('');

  const close = () => {
    setCode('');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={invoice !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent closeLabel={t.common.close}>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (code) onConfirm(code, note.trim() || undefined);
          }}
        >
          <DialogHeader>
            <DialogTitle>{text.title}</DialogTitle>
            <DialogDescription>{text.description(invoice ?? '')}</DialogDescription>
          </DialogHeader>
          <Field label={text.reasonLabel}>
            <Select
              required
              value={code}
              onChange={(event) => setCode(event.target.value as RejectionCode | '')}
            >
              <option value="" disabled>
                {text.reasonPlaceholder}
              </option>
              {REJECTION_CODES.map((option) => (
                <option key={option} value={option}>
                  {`${option} · ${t.datadian.rejectionCodes[option]}`}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={text.noteLabel}>
            <Input
              value={note}
              maxLength={1000}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {text.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={!code || pending}>
              {text.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
