import { useQuery } from '@tanstack/react-query';
import { IMAP_AUTH_METHODS, type ImapMailbox, imapMailboxInputSchema } from '@telcobras/contracts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Select,
  StatusBadge,
  Switch,
} from '@telcobras/ui';
import { Mail, Plus } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { useSaveMailbox } from '../api/mutations';
import { mailboxesQuery } from '../api/queries';
import { datadianErrorMessage } from '../shared/errors';

const text = t.datadian.settings.mailboxes;

type Draft = {
  id: string | null;
  host: string;
  port: string;
  useTls: boolean;
  username: string;
  authMethod: (typeof IMAP_AUTH_METHODS)[number];
  secret: string;
  folder: string;
  enabled: boolean;
  secretSet: boolean;
};

const empty: Draft = {
  id: null,
  host: '',
  port: '993',
  useTls: true,
  username: '',
  authMethod: 'password',
  secret: '',
  folder: 'INBOX',
  enabled: true,
  secretSet: false,
};

const fromMailbox = (mailbox: ImapMailbox): Draft => ({
  id: mailbox.id,
  host: mailbox.host,
  port: String(mailbox.port),
  useTls: mailbox.useTls,
  username: mailbox.username,
  authMethod: mailbox.authMethod,
  secret: '',
  folder: mailbox.folder,
  enabled: mailbox.enabled,
  secretSet: mailbox.secretSet,
});

/** Sección 5 (§5.6): buzones IMAP. El secreto se escribe y no se lee; un buzón no se borra, se desactiva. */
export function MailboxesSection() {
  const mailboxes = useQuery(mailboxesQuery);
  const save = useSaveMailbox();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [invalid, setInvalid] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const submit = () => {
    if (!draft) return;
    const parsed = imapMailboxInputSchema.safeParse({
      host: draft.host,
      port: Number(draft.port),
      useTls: draft.useTls,
      username: draft.username,
      authMethod: draft.authMethod,
      ...(draft.secret ? { secret: draft.secret } : {}),
      folder: draft.folder,
      enabled: draft.enabled,
    });
    const needsSecret = draft.id === null && !draft.secret;
    if (!parsed.success || needsSecret) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    save.mutate({ id: draft.id, body: parsed.data }, { onSuccess: () => setDraft(null) });
  };

  return (
    <Card id="mailboxes">
      <CardHeader>
        <CardTitle asChild>
          <h2>{t.datadian.settings.sections.mailboxes}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mailboxes.data?.length === 0 && <p className="text-sm">{text.empty}</p>}
        <ul className="space-y-2">
          {mailboxes.data?.map((mailbox) => (
            <li
              key={mailbox.id}
              className="flex flex-wrap items-center gap-2 rounded-sm border border-tb-gris/40 p-3 text-sm"
            >
              <Mail aria-hidden="true" className="size-4" />
              <span className="font-medium">{mailbox.username}</span>
              <span>
                {mailbox.host}:{mailbox.port} · {mailbox.folder}
              </span>
              <StatusBadge status={mailbox.enabled ? 'ok' : 'neutral'}>
                {mailbox.enabled ? text.enabled : text.disabled}
              </StatusBadge>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto"
                onClick={() => setDraft(fromMailbox(mailbox))}
              >
                {text.edit}
              </Button>
            </li>
          ))}
        </ul>
        <p className="text-xs">{text.noDelete}</p>

        {draft ? (
          <form
            noValidate
            className="grid gap-3 rounded-sm border border-tb-gris/40 p-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <Field label={text.host}>
              <Input value={draft.host} onChange={(event) => set('host', event.target.value)} />
            </Field>
            <Field label={text.port}>
              <Input
                type="number"
                value={draft.port}
                onChange={(event) => set('port', event.target.value)}
              />
            </Field>
            <Field label={text.username}>
              <Input
                autoComplete="off"
                value={draft.username}
                onChange={(event) => set('username', event.target.value)}
              />
            </Field>
            <Field label={text.authMethod}>
              <Select
                value={draft.authMethod}
                onChange={(event) => set('authMethod', event.target.value as Draft['authMethod'])}
              >
                {IMAP_AUTH_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {text.authMethods[method]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={text.secret} description={draft.secretSet ? text.secretSet : undefined}>
              <Input
                type="password"
                autoComplete="new-password"
                value={draft.secret}
                onChange={(event) => set('secret', event.target.value)}
              />
            </Field>
            <Field label={text.folder}>
              <Input value={draft.folder} onChange={(event) => set('folder', event.target.value)} />
            </Field>
            <div className="flex items-center gap-2 text-sm">
              <Switch
                id="mailbox-tls"
                checked={draft.useTls}
                onCheckedChange={(value) => set('useTls', value)}
              />
              <label htmlFor="mailbox-tls">{text.tls}</label>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Switch
                id="mailbox-enabled"
                checked={draft.enabled}
                onCheckedChange={(value) => set('enabled', value)}
              />
              <label htmlFor="mailbox-enabled">{text.enabled}</label>
            </div>
            <div role="status" aria-live="polite" className="text-sm sm:col-span-2">
              {invalid && <p className="text-tb-error">{text.invalid}</p>}
              {save.isError && <p className="text-tb-error">{datadianErrorMessage(save.error)}</p>}
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={save.isPending}>
                {text.save}
              </Button>
              <Button variant="ghost" onClick={() => setDraft(null)}>
                {text.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="secondary" onClick={() => setDraft(empty)}>
            <Plus aria-hidden="true" />
            {text.add}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
