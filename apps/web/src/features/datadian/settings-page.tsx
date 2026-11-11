import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type OdooConnectionInput, odooConnectionInputSchema } from '@telcobras/contracts';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
  StatusBadge,
} from '@telcobras/ui';
import { PlugZap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { t } from '@/i18n/es-CO';
import { api, unwrap } from '@/lib/api-client';
import { moduleLabel, submoduleLabel } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import { DATADIAN_KEY, errorMessage, settingsQuery } from './api';

const text = t.datadian.settings;

/** Configuración de DataDian: la conexión con Odoo 19. La API key se escribe, nunca se lee. */
export function SettingsPage() {
  const queryClient = useQueryClient();
  const settings = useQuery(settingsQuery);
  const odoo = settings.data?.odoo;

  const form = useForm({
    resolver: zodResolver(odooConnectionInputSchema),
    values: { baseUrl: odoo?.baseUrl ?? '', database: odoo?.database ?? '', apiKey: '' },
  });
  const { errors } = form.formState;

  const save = useMutation({
    mutationFn: (body: OdooConnectionInput) =>
      unwrap(api.PUT('/api/v1/documents/settings/odoo', { body })),
    onSuccess: () => {
      form.resetField('apiKey');
      return queryClient.invalidateQueries({ queryKey: DATADIAN_KEY });
    },
  });
  const test = useMutation({
    mutationFn: () => unwrap(api.POST('/api/v1/documents/settings/odoo/test')),
  });

  return (
    <>
      <Workspace
        routeKey="documents/settings"
        eyebrow={moduleLabel('documents')}
        title={submoduleLabel('documents', 'settings')}
      >
        <Card className="max-w-3xl">
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
              onSubmit={form.handleSubmit((values) => save.mutate(values))}
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
                {save.isError && (
                  <p className="text-tb-error">{errorMessage(save.error, text.error)}</p>
                )}
                {test.isSuccess && <p>{text.testOk}</p>}
                {test.isError && (
                  <p className="text-tb-error">{errorMessage(test.error, text.error)}</p>
                )}
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
      </Workspace>
      <ContextPanel routeKey="documents/settings">
        <Card className="space-y-2 p-4 text-sm">
          <p className="font-medium">{text.odooTitle}</p>
          {odoo ? (
            <StatusBadge status="ok">{text.configured(odoo.baseUrl, odoo.database)}</StatusBadge>
          ) : (
            <StatusBadge status="warning">{text.notConfigured}</StatusBadge>
          )}
        </Card>
        <Card className="space-y-2 p-4 text-sm">
          <p className="font-medium">{text.pdfTitle}</p>
          <p>{text.pdfDescription}</p>
        </Card>
      </ContextPanel>
    </>
  );
}
