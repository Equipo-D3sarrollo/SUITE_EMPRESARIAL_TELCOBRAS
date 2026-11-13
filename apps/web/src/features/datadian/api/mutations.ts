import { type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DatadianBody,
  DianSettingsInput,
  ImapMailboxInput,
  OdooConnectionInput,
  RadianEventRequest,
  ReceivedDocumentDecision,
  SyncRunRequest,
} from '@telcobras/contracts';
import { datadianRequest } from './client';
import { DATADIAN_KEY, datadianKeys } from './keys';

/** Una llave por intención (§3.6): se crea al abrir la confirmación y se reutiliza en sus reintentos. */
export const newIntentKey = () => crypto.randomUUID();

const refreshInvoice = (queryClient: QueryClient, id: string) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: datadianKeys.invoice(id) }),
    queryClient.invalidateQueries({ queryKey: datadianKeys.invoices() }),
    queryClient.invalidateQueries({ queryKey: datadianKeys.summary() }),
  ]);

/**
 * Pide un evento RADIAN. Sin actualización optimista del estado: la respuesta 202 trae el evento
 * `pending` y la factura cambia cuando la DIAN lo registra. Con un error también se refresca la
 * factura (un 409 suele significar que otra pestaña o la DIAN ya cambiaron algo).
 */
export function useRequestEvent(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      request,
      idempotencyKey,
    }: {
      request: RadianEventRequest;
      idempotencyKey: string;
    }) => datadianRequest('E10', { params: { id: invoiceId }, body: request, idempotencyKey }),
    onSettled: () => refreshInvoice(queryClient, invoiceId),
  });
}

export function useLegacyDecision(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReceivedDocumentDecision) =>
      datadianRequest('L1', { params: { id: invoiceId }, body }),
    onSettled: () => refreshInvoice(queryClient, invoiceId),
  });
}

export function useLegacyOdooRetry(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => datadianRequest('L2', { params: { id: invoiceId } }),
    onSettled: () => refreshInvoice(queryClient, invoiceId),
  });
}

const invalidateAll = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: DATADIAN_KEY });

export function useSaveDianSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: DianSettingsInput) => datadianRequest('E13', { body }),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useUploadCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, password }: { file: File; password: string }) => {
      const form = new FormData();
      form.set('file', file);
      form.set('password', password);
      return datadianRequest('E16', { body: form });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: datadianKeys.certificates() }),
  });
}

export function useActivateCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => datadianRequest('E18', { params: { id } }),
    onSettled: () => invalidateAll(queryClient),
  });
}

export function useRetireCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => datadianRequest('E19', { params: { id } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: datadianKeys.certificates() }),
  });
}

export function useSaveMailbox() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string | null; body: ImapMailboxInput }) =>
      id
        ? datadianRequest('E22', { params: { id }, body: body as DatadianBody<'E22'> })
        : datadianRequest('E21', { body: body as DatadianBody<'E21'> }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: datadianKeys.mailboxes() }),
  });
}

const refreshSync = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: [...DATADIAN_KEY, 'sync'] }),
    queryClient.invalidateQueries({ queryKey: [...DATADIAN_KEY, 'jobs'] }),
    queryClient.invalidateQueries({ queryKey: datadianKeys.health() }),
  ]);

export function useRequestSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SyncRunRequest) => datadianRequest('E26', { body }),
    onSettled: () => refreshSync(queryClient),
  });
}

export function useUploadXml() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.set('file', file);
      return datadianRequest('E27', { body: form });
    },
    onSettled: () => refreshSync(queryClient),
  });
}

export function useJobAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'retry' | 'cancel' }) =>
      datadianRequest(action === 'retry' ? 'E29' : 'E30', { params: { id } }),
    onSettled: () => refreshSync(queryClient),
  });
}

export function useSaveOdoo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OdooConnectionInput) => datadianRequest('L4', { body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: datadianKeys.settings() }),
  });
}

export function useTestOdoo() {
  return useMutation({ mutationFn: () => datadianRequest('L5') });
}
