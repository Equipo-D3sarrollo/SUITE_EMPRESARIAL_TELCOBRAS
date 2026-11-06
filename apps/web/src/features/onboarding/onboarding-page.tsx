import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  ORGANIZATION_SIZES,
  type OrganizationCreate,
  organizationCreateSchema,
} from '@telcobras/contracts';
import { Badge, Button, Card, Field, Input } from '@telcobras/ui';
import { ArrowRight, Timer } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormError } from '@/features/auth/form-error';
import { useEnterApp } from '@/features/auth/use-enter-app';
import { t } from '@/i18n/es-CO';
import { api, unwrap } from '@/lib/api-client';
import { Logo } from '@/shell/zone0-topbar/logo';

const sizeOption =
  'flex h-9.5 cursor-pointer items-center justify-center rounded-sm border border-tb-gris text-sm hover:bg-tb-gris/15 peer-checked:border-2 peer-checked:border-tb-azul peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tb-azul';

/** /onboarding simplificado (Stitch: configuración simplificada de empresa): crea la organización y entra al panel. */
export function OnboardingPage() {
  const enterApp = useEnterApp();
  const form = useForm({
    resolver: zodResolver(organizationCreateSchema),
    defaultValues: { name: '', legalName: '', nit: '' },
  });
  const { errors } = form.formState;

  const create = useMutation({
    mutationFn: async (values: OrganizationCreate) => {
      const organization = await unwrap(api.POST('/api/v1/organizations', { body: values }));
      await unwrap(
        api.POST('/api/v1/me/active-organization', { body: { organizationId: organization.id } }),
      );
    },
    onSuccess: () => enterApp('/app'),
  });

  const nitError =
    errors.nit &&
    (errors.nit.message === 'nit.checkDigit'
      ? t.onboarding.errors.nitCheckDigit
      : t.onboarding.errors.nitFormat);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 shrink-0 items-center border-tb-gris/40 border-b px-6">
        <Logo withSlogan className="h-14" />
      </header>
      <main id="main-content" className="flex flex-1 flex-col items-center gap-6 p-6">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <Badge className="border-tb-azul">
            <Timer aria-hidden="true" className="text-tb-azul" />
            {t.onboarding.badge}
          </Badge>
          <h1 className="font-semibold text-3xl">{t.onboarding.title}</h1>
          <p className="text-sm">{t.onboarding.description}</p>
        </div>
        <Card className="w-full max-w-3xl p-8">
          <form
            noValidate
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit((values) => create.mutate(values))}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.onboarding.nameLabel} error={errors.name && t.onboarding.errors.name}>
                <Input
                  autoComplete="organization"
                  placeholder={t.onboarding.namePlaceholder}
                  {...form.register('name')}
                />
              </Field>
              <Field
                label={t.onboarding.legalNameLabel}
                error={errors.legalName && t.onboarding.errors.legalName}
              >
                <Input
                  placeholder={t.onboarding.legalNamePlaceholder}
                  {...form.register('legalName')}
                />
              </Field>
              <Field
                label={t.onboarding.nitLabel}
                description={t.onboarding.nitDescription}
                error={nitError}
              >
                <Input
                  inputMode="numeric"
                  placeholder={t.onboarding.nitPlaceholder}
                  className="tabular-nums"
                  {...form.register('nit')}
                />
              </Field>
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 font-medium text-sm">{t.onboarding.sizeLabel}</legend>
              <div className="grid grid-cols-4 gap-3">
                {ORGANIZATION_SIZES.map((size) => (
                  <label key={size}>
                    <input
                      type="radio"
                      value={size}
                      className="peer sr-only"
                      {...form.register('size')}
                    />
                    <span className={sizeOption}>{t.onboarding.sizes[size]}</span>
                  </label>
                ))}
              </div>
              {errors.size && <FormError>{t.onboarding.errors.size}</FormError>}
            </fieldset>
            {create.isError && <FormError>{t.onboarding.error}</FormError>}
            <Button type="submit" disabled={create.isPending} className="self-end">
              {t.onboarding.submit}
              <ArrowRight aria-hidden="true" />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
