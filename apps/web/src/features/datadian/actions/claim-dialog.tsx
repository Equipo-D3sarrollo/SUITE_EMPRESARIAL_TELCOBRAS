import { CLAIM_CODES, type ClaimCode, type RadianDeadline } from '@telcobras/contracts';
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
import { TriangleAlert } from 'lucide-react';
import { useId, useState } from 'react';
import { t } from '@/i18n/es-CO';
import { formatDeadline } from '../shared/format';

const text = t.datadian.claim;
const NOTE_MAX = 1000;

type ClaimDialogProps = {
  open: boolean;
  /** Número de la factura que se reclama. */
  invoice: string;
  deadline: RadianDeadline;
  pending: boolean;
  /** Mensaje del último intento fallido; el diálogo sigue abierto para reintentar con la misma llave. */
  error: string | null;
  onClose: () => void;
  onConfirm: (claimCode: ClaimCode, note: string | undefined) => void;
};

/**
 * Modal del reclamo 031 (§5.4): concepto obligatorio en un grupo de radio (las cuatro opciones se
 * leen sin abrir una lista), nota opcional con contador y el efecto legal escrito. El `Dialog` de
 * @telcobras/ui atrapa el foco, cierra con Escape y devuelve el foco al botón "Reclamo (031)".
 */
export function ClaimDialog({
  open,
  invoice,
  deadline,
  pending,
  error,
  onClose,
  onConfirm,
}: ClaimDialogProps) {
  const [code, setCode] = useState<ClaimCode | null>(null);
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);
  const counterId = useId();
  const conceptErrorId = useId();

  const close = () => {
    setCode(null);
    setNote('');
    setTouched(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent closeLabel={t.common.close}>
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setTouched(true);
            if (code) onConfirm(code, note.trim() || undefined);
          }}
        >
          <DialogHeader>
            <DialogTitle>{text.title}</DialogTitle>
            <DialogDescription>{text.description(invoice)}</DialogDescription>
          </DialogHeader>

          <p className="flex items-start gap-2 rounded-sm border border-tb-error p-3 text-sm">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-tb-error" />
            {text.effect}
          </p>
          {deadline.state === 'due_soon' && deadline.claimDeadlineAt && (
            <p className="text-sm">{text.dueSoon(formatDeadline(deadline.claimDeadlineAt))}</p>
          )}
          {deadline.state === 'expired' && <p className="text-sm">{text.expired}</p>}

          <fieldset
            className="flex flex-col gap-2"
            aria-describedby={touched && !code ? conceptErrorId : undefined}
          >
            <legend className="mb-1 font-medium text-sm">{text.conceptLabel}</legend>
            {CLAIM_CODES.map((option) => {
              const concept = t.datadian.claimConcepts[option];
              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-2 rounded-sm border border-tb-gris/50 p-2 text-sm has-[:checked]:border-tb-azul"
                >
                  <input
                    type="radio"
                    name="claim-concept"
                    value={option}
                    checked={code === option}
                    onChange={() => setCode(option)}
                    className="mt-1"
                    required
                  />
                  <span>
                    <span className="font-medium">{`${option} · ${concept.label}`}</span>
                    <span className="block text-xs">{concept.description}</span>
                  </span>
                </label>
              );
            })}
            {touched && !code && (
              <p id={conceptErrorId} className="text-tb-error text-xs">
                {text.conceptRequired}
              </p>
            )}
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${counterId}-note`} className="font-medium text-sm">
              {text.noteLabel}
            </label>
            <textarea
              id={`${counterId}-note`}
              value={note}
              maxLength={NOTE_MAX}
              rows={3}
              aria-describedby={counterId}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-sm border border-tb-gris bg-tb-superficie px-3 py-2 text-sm outline-tb-azul focus-visible:outline-2 focus-visible:outline-offset-2"
            />
            <p id={counterId} className="self-end text-xs tabular-nums">
              {text.counter(note.length, NOTE_MAX)}
            </p>
          </div>

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
            <Button type="submit" variant="destructive" disabled={!code || pending}>
              {text.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
