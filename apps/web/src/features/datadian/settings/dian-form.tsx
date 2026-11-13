import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  computeNitCheckDigit,
  DIAN_ENVIRONMENTS,
  DIAN_OPERATION_MODES,
  type DianSettings,
} from '@telcobras/contracts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  StatusBadge,
  Switch,
} from '@telcobras/ui';
import { KeyRound, Scale } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { t } from '@/i18n/es-CO';
import { useSaveDianSettings } from '../api/mutations';
import { readinessQuery } from '../api/queries';
import { datadianErrorMessage } from '../shared/errors';

const text = t.datadian.settings;

const formSchema = z
  .object({
    nit: z
      .string()
      .trim()
      .regex(/^\d{5,15}$/, text.dian.nitInvalid),
    nitDv: z.string().trim().regex(/^\d?$/, text.dian.dvInvalid),
    operationMode: z.enum(DIAN_OPERATION_MODES),
    syncLookbackDays: z.number().int().min(1).max(92),
    softwareId: z.union([z.literal(''), z.uuid(text.software.softwareIdInvalid)]),
    softwarePin: z.string().trim().max(20),
    testSetId: z.string().trim().max(100),
    environment: z.enum(DIAN_ENVIRONMENTS),
    rpaEnabled: z.boolean(),
    imapEnabled: z.boolean(),
  })
  .refine(
    ({ nit, nitDv }) =>
      !nitDv || !/^\d{5,15}$/.test(nit) || computeNitCheckDigit(nit) === Number(nitDv),
    {
      path: ['nitDv'],
      message: text.dian.dvMismatch,
    },
  );

type FormValues = z.infer<typeof formSchema>;

const toValues = (dian: DianSettings | null): FormValues => ({
  nit: dian?.nit ?? '',
  nitDv: dian?.nitDv ?? '',
  operationMode: dian?.operationMode ?? 'own_software',
  syncLookbackDays: dian?.syncLookbackDays ?? 30,
  softwareId: dian?.softwareId ?? '',
  softwarePin: '',
  testSetId: dian?.testSetId ?? '',
  environment: dian?.environment ?? '2',
  rpaEnabled: dian?.rpaEnabled ?? false,
  imapEnabled: dian?.imapEnabled ?? false,
});

/**
 * Secciones 1, 3 y 4 de la configuración (§5.6): datos DIAN, software y ambiente, y sincronización.
 * El PIN es de solo escritura. Pasar a producción exige la lista de chequeo completa (la API lo
 * vuelve a comprobar con 422 `production-not-ready`).
 */
export function DianSettingsForm({ dian }: { dian: DianSettings | null }) {
  const save = useSaveDianSettings();
  const [replacingPin, setReplacingPin] = useState(false);
  const [askProduction, setAskProduction] = useState(false);
  const readiness = useQuery({ ...readinessQuery, enabled: askProduction });

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), values: toValues(dian) });
  const { errors } = form.formState;

  const submit = form.handleSubmit((values) =>
    save.mutate(
      {
        nit: values.nit,
        nitDv: values.nitDv || null,
        environment: values.environment,
        operationMode: values.operationMode,
        softwareId: values.softwareId || null,
        ...(values.softwarePin ? { softwarePin: values.softwarePin } : {}),
        testSetId: values.testSetId || null,
        rpaEnabled: values.rpaEnabled,
        imapEnabled: values.imapEnabled,
        syncLookbackDays: values.syncLookbackDays,
      },
      {
        onSuccess: () => {
          setReplacingPin(false);
          form.resetField('softwarePin');
        },
      },
    ),
  );

  return (
    <form noValidate onSubmit={submit} className="space-y-6">
      <Card id="dian">
        <CardHeader>
          <CardTitle asChild>
            <h2>{text.sections.dian}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-[1fr_6rem]">
          <Field label={text.dian.nit} error={errors.nit?.message}>
            <Input inputMode="numeric" autoComplete="off" {...form.register('nit')} />
          </Field>
          <Field label={text.dian.nitDv} error={errors.nitDv?.message}>
            <Input inputMode="numeric" maxLength={1} {...form.register('nitDv')} />
          </Field>
          <Field
            label={text.dian.operationMode}
            description={text.dian.operationModeNote}
            className="sm:col-span-2"
          >
            <Select {...form.register('operationMode')}>
              {DIAN_OPERATION_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {text.dian.operationModes[mode]}
                </option>
              ))}
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card id="software">
        <CardHeader>
          <CardTitle asChild>
            <h2>{text.sections.software}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label={text.software.softwareId} error={errors.softwareId?.message}>
            <Input autoComplete="off" className="font-mono" {...form.register('softwareId')} />
          </Field>
          <div className="space-y-2">
            <p className="flex items-center gap-2 font-medium text-sm">
              <KeyRound aria-hidden="true" className="size-4" />
              {text.software.pin}
              <StatusBadge status={dian?.softwarePinSet ? 'ok' : 'warning'}>
                {dian?.softwarePinSet ? text.software.pinSet : text.software.pinMissing}
              </StatusBadge>
            </p>
            {replacingPin || !dian?.softwarePinSet ? (
              <Field label={text.software.pin} description={text.software.pinNote}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  {...form.register('softwarePin')}
                />
              </Field>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => setReplacingPin(true)}>
                {text.software.replacePin}
              </Button>
            )}
          </div>
          <Field label={text.software.testSetId}>
            <Input autoComplete="off" {...form.register('testSetId')} />
          </Field>
          <Field label={text.software.environment} description={text.software.environmentNote}>
            <Controller
              control={form.control}
              name="environment"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(event) => {
                    if (event.target.value === '1' && field.value !== '1') setAskProduction(true);
                    else field.onChange(event.target.value);
                  }}
                >
                  {DIAN_ENVIRONMENTS.map((environment) => (
                    <option key={environment} value={environment}>
                      {t.datadian.environments[environment]}
                    </option>
                  ))}
                </Select>
              )}
            />
          </Field>
        </CardContent>
      </Card>

      <Card id="sync">
        <CardHeader>
          <CardTitle asChild>
            <h2>{text.sections.sync}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['rpaEnabled', 'imapEnabled'] as const).map((name) => (
            <Controller
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-sm">
                    <Switch
                      id={`dian-${name}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor={`dian-${name}`}>
                      {name === 'rpaEnabled' ? text.sync.rpa : text.sync.imap}
                    </label>
                  </div>
                  {name === 'rpaEnabled' && <p className="text-xs">{text.sync.rpaLegal}</p>}
                </div>
              )}
            />
          ))}
          <Field
            label={text.dian.lookback}
            error={errors.syncLookbackDays && text.dian.lookbackInvalid}
          >
            <Input
              type="number"
              min={1}
              max={92}
              className="w-28"
              {...form.register('syncLookbackDays', { valueAsNumber: true })}
            />
          </Field>
        </CardContent>
      </Card>

      <div role="status" aria-live="polite" className="text-sm">
        {save.isSuccess && <p>{text.dian.saved}</p>}
        {save.isError && <p className="text-tb-error">{datadianErrorMessage(save.error)}</p>}
      </div>
      <Button type="submit" disabled={save.isPending}>
        {text.dian.save}
      </Button>

      <Dialog open={askProduction} onOpenChange={setAskProduction}>
        <DialogContent closeLabel={t.common.close}>
          <DialogHeader>
            <DialogTitle>{text.software.readinessTitle}</DialogTitle>
            <DialogDescription>{text.software.readinessDescription}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-1.5 text-sm">
            {readiness.data?.items.map((item) => (
              <li key={item.item} className="flex items-start gap-2">
                <StatusBadge status={item.ok ? 'ok' : 'error'}>
                  {item.ok
                    ? text.certificate.precheckState.ok
                    : text.certificate.precheckState.failed}
                </StatusBadge>
                <span>
                  {text.software.readinessItems[item.item]}
                  {item.detail && <span className="block text-xs">{item.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
          {readiness.data && !readiness.data.ready && (
            <p className="text-sm text-tb-error">{text.software.readinessIncomplete}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{text.software.cancel}</Button>
            </DialogClose>
            <Button
              disabled={!readiness.data?.ready}
              onClick={() => {
                form.setValue('environment', '1', { shouldDirty: true });
                setAskProduction(false);
              }}
            >
              <Scale aria-hidden="true" />
              {text.software.confirmProduction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
