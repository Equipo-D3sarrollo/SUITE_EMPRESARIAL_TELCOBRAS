import { zodResolver } from '@hookform/resolvers/zod';
import { type OdooConnection, odooConnectionInputSchema } from '@telcobras/contracts';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
} from '@telcobras/ui';
import { PlugZap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { t } from '@/i18n/es-CO';
import { useSaveOdoo, useTestOdoo } from '../api/mutations';
import { datadianErrorMessage } from '../shared/errors';

const text = t.datadian.odooSettings;

/** Sección 6 (§5.6): la conexión con Odoo 19, sin cambios. La API key se escribe, nunca se lee. */
export function OdooCard({ odoo }: { odoo: OdooConnection | null }) {
  const save = useSaveOdoo();
  const test = useTestOdoo();
  const form = useForm({
    resolver: zodResolver(odooConnectionInputSchema),
    values: { baseUrl: odoo?.baseUrl ?? '', database: odoo?.database ?? '', apiKey: '' },
  });
  const { errors } = form.formState;

  return (
    <Card id="odoo">
      <CardHeader>
        <CardTitle asChild>
          <h2>{text.odooTitle}</h2>
        </CardTitle>
        <CardDescription>{text.odooDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((values) =>
            save.mutate(values, { onSuccess: () => form.resetField('apiKey') }),
          )}
        >
          <Field label={text.baseUrl} error={errors.baseUrl && text.invalid}>
            <Input
              type="url"
              autoComplete="url"
              placeholder={text.baseUrlPlaceholder}
              {...form.register('baseUrl')}
            />
          </Field>
          <Field label={text.database} error={errors.database && text.invalid}>
            <Input autoComplete="off" {...form.register('database')} />
          </Field>
          <Field
            label={text.apiKey}
            description={text.apiKeyDescription}
            error={errors.apiKey && text.invalid}
          >
            <Input type="password" autoComplete="new-password" {...form.register('apiKey')} />
          </Field>
          <div role="status" aria-live="polite" className="text-sm">
            {save.isSuccess && <p>{text.saved}</p>}
            {save.isError && <p className="text-tb-error">{datadianErrorMessage(save.error)}</p>}
            {test.isSuccess && <p>{text.testOk}</p>}
            {test.isError && <p className="text-tb-error">{datadianErrorMessage(test.error)}</p>}
          </div>
          <div className="flex gap-2 self-end">
            {odoo && (
              <Button
                type="button"
                variant="secondary"
                disabled={test.isPending}
                onClick={() => test.mutate()}
              >
                <PlugZap aria-hidden="true" />
                {text.test}
              </Button>
            )}
            <Button type="submit" disabled={save.isPending}>
              {text.save}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
