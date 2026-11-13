import { Button, Card } from '@telcobras/ui';
import { FileUp } from 'lucide-react';
import { useId, useState } from 'react';
import { t } from '@/i18n/es-CO';
import { useUploadXml } from '../api/mutations';
import { datadianErrorMessage } from '../shared/errors';

const text = t.datadian.sync.upload;
const MAX_BYTES = 5 * 1024 * 1024;

/** Validación previa de la carga manual: extensión y tamaño (§5.7). */
export function xmlUploadError(file: File): string | null {
  if (!/\.(xml|zip)$/i.test(file.name)) return text.invalidType;
  if (file.size > MAX_BYTES) return text.tooLarge;
  return null;
}

/** Subir XML a mano: arrastrar y soltar `.xml` o `.zip`. Solo sirve para descubrir el CUFE. */
export function UploadXml() {
  const inputId = useId();
  const upload = useUploadXml();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const error = file ? xmlUploadError(file) : null;

  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">{text.title}</h3>
      <p className="text-sm">{text.description}</p>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          setFile(event.dataTransfer.files[0] ?? null);
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-sm border-2 border-dashed p-6 text-sm ${dragging ? 'border-tb-azul bg-tb-azul/10' : 'border-tb-gris'}`}
      >
        <FileUp aria-hidden="true" className="size-6" />
        {file ? file.name : dragging ? text.drop : text.choose}
        <input
          id={inputId}
          type="file"
          accept=".xml,.zip"
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>
      <div role="status" aria-live="polite" className="text-sm">
        {error && <p className="text-tb-error">{error}</p>}
        {upload.isSuccess && <p>{text.done}</p>}
        {upload.isError && <p className="text-tb-error">{datadianErrorMessage(upload.error)}</p>}
      </div>
      <Button
        variant="secondary"
        disabled={!file || error !== null || upload.isPending}
        onClick={() => file && upload.mutate(file, { onSuccess: () => setFile(null) })}
      >
        {text.submit}
      </Button>
    </Card>
  );
}
