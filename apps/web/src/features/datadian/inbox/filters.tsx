import {
  DEADLINE_STATES,
  DIAN_SYNC_CHANNELS,
  INVOICE_VALIDATION_STATUSES,
  PAYMENT_FORMS,
  RADIAN_STATUSES,
  type RadianStatus,
} from '@telcobras/contracts';
import { Button, Field, Input, Select } from '@telcobras/ui';
import { FilterX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { t } from '@/i18n/es-CO';
import {
  classifySearch,
  currentMonthRange,
  type InboxSearch,
  last30DaysRange,
  previousMonthRange,
  type useInboxSearch,
} from './search-params';

const text = t.datadian.filters;
type SetSearch = ReturnType<typeof useInboxSearch>['setSearch'];

const MAX_RANGE_DAYS = 366;

function rangePreset(search: InboxSearch): string {
  for (const [preset, range] of [
    ['currentMonth', currentMonthRange()],
    ['previousMonth', previousMonthRange()],
    ['last30', last30DaysRange()],
  ] as const) {
    if (
      (search.from ?? currentMonthRange().from) === range.from &&
      (search.to ?? range.to) === range.to
    ) {
      return preset;
    }
  }
  return 'custom';
}

/** Filtros globales de la bandeja (§5.1). Todo vive en la URL. */
export function InboxFilters({ search, setSearch }: { search: InboxSearch; setSearch: SetSearch }) {
  const [query, setQuery] = useState(search.q ?? '');
  const [preset, setPreset] = useState(() => rangePreset(search));
  useEffect(() => setQuery(search.q ?? ''), [search.q]);

  const kind = classifySearch(query);
  const range = {
    from: search.from ?? currentMonthRange().from,
    to: search.to ?? currentMonthRange().to,
  };
  const days = (new Date(range.to).getTime() - new Date(range.from).getTime()) / 86_400_000;

  const select = <T extends string>(
    label: string,
    value: T | undefined,
    options: readonly T[],
    labels: Record<string, string>,
    onChange: (value: T | undefined) => void,
  ) => (
    <Field label={label} className="min-w-40">
      <Select
        value={value ?? ''}
        onChange={(event) => onChange((event.target.value || undefined) as T | undefined)}
      >
        <option value="">{text.any}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </Select>
    </Field>
  );

  return (
    <section aria-label={text.label} className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field label={text.range} className="min-w-44">
          <Select
            value={preset}
            onChange={(event) => {
              const next = event.target.value;
              setPreset(next);
              const ranges: Record<string, { from: string; to: string }> = {
                currentMonth: currentMonthRange(),
                previousMonth: previousMonthRange(),
                last30: last30DaysRange(),
              };
              const chosen = ranges[next];
              if (chosen) setSearch(chosen);
            }}
          >
            {(['currentMonth', 'previousMonth', 'last30', 'custom'] as const).map((option) => (
              <option key={option} value={option}>
                {text.presets[option]}
              </option>
            ))}
          </Select>
        </Field>
        {preset === 'custom' && (
          <>
            <Field label={text.from}>
              <Input
                type="date"
                value={range.from}
                onChange={(event) => setSearch({ from: event.target.value })}
              />
            </Field>
            <Field
              label={text.to}
              error={days > MAX_RANGE_DAYS || days < 0 ? text.rangeTooLong : undefined}
            >
              <Input
                type="date"
                value={range.to}
                onChange={(event) => setSearch({ to: event.target.value })}
              />
            </Field>
          </>
        )}
        <form
          className="min-w-64 flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            if (kind === 'invalid') return;
            setSearch({ q: query.trim() || undefined });
          }}
        >
          <Field
            label={text.search}
            error={kind === 'invalid' && query.length > 0 ? text.searchInvalid : undefined}
          >
            <Input
              type="search"
              value={query}
              placeholder={text.searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => kind !== 'invalid' && setSearch({ q: query.trim() || undefined })}
            />
          </Field>
        </form>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        {select<RadianStatus>(
          text.radianStatus,
          search.radian?.[0],
          RADIAN_STATUSES,
          t.datadian.radianStatuses,
          (value) => setSearch({ radian: value ? [value] : undefined }),
        )}
        {select(
          text.deadline,
          search.deadline,
          DEADLINE_STATES,
          t.datadian.deadlineStates,
          (value) => setSearch({ deadline: value }),
        )}
        {select(
          text.validation,
          search.validation,
          INVOICE_VALIDATION_STATUSES,
          t.datadian.validationStatuses,
          (value) => setSearch({ validation: value }),
        )}
        {select(text.payment, search.payment, PAYMENT_FORMS, t.datadian.paymentForms, (value) =>
          setSearch({ payment: value }),
        )}
        {select(text.source, search.source, DIAN_SYNC_CHANNELS, t.datadian.channels, (value) =>
          setSearch({ source: value }),
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setPreset('currentMonth');
            setQuery('');
            setSearch({
              from: undefined,
              to: undefined,
              q: undefined,
              radian: undefined,
              deadline: undefined,
              validation: undefined,
              payment: undefined,
              source: undefined,
            });
          }}
        >
          <FilterX aria-hidden="true" />
          {text.clear}
        </Button>
      </div>
    </section>
  );
}
