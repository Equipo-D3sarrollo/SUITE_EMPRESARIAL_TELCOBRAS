import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '@/features/auth/login-page';
import { RegisterPage } from '@/features/auth/register-page';

const auth = vi.hoisted(() => ({
  sendVerificationOtp: vi.fn(),
  signInEmailOtp: vi.fn(),
}));

vi.mock('@/lib/auth-client', () => ({
  googleEnabled: false,
  authClient: {
    emailOtp: { sendVerificationOtp: auth.sendVerificationOtp },
    signIn: { emailOtp: auth.signInEmailOtp },
  },
}));

const searchOf = (search: Record<string, unknown>) => ({
  redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  paso: search.paso === 'totp' ? ('totp' as const) : undefined,
});

/** Monta /iniciar-sesion y /registro con las páginas reales, más destinos vacíos para comprobar la navegación. */
function renderAt(path: string) {
  const rootRoute = createRootRoute({ component: Outlet });
  const routes = [
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/iniciar-sesion',
      validateSearch: searchOf,
      component: LoginPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/registro',
      validateSearch: searchOf,
      component: RegisterPage,
    }),
    createRoute({ getParentRoute: () => rootRoute, path: '/app', component: () => null }),
    createRoute({ getParentRoute: () => rootRoute, path: '/onboarding', component: () => null }),
  ];
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

async function requestCode(email: string) {
  fireEvent.change(await screen.findByLabelText('Correo electrónico'), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Enviarme un código' }));
  return screen.findByLabelText('Código de acceso');
}

beforeEach(() => {
  auth.sendVerificationOtp.mockReset().mockResolvedValue({ data: { success: true }, error: null });
  auth.signInEmailOtp.mockReset();
});

describe('Acceso con código por correo', () => {
  it('pide el código, enfoca el campo y entra al destino al verificarlo', async () => {
    auth.signInEmailOtp.mockResolvedValue({ data: { token: 't', user: {} }, error: null });
    const router = renderAt('/iniciar-sesion?redirect=%2Fapp');

    const codeInput = await requestCode(' Ana@Empresa.com ');

    expect(auth.sendVerificationOtp).toHaveBeenCalledWith({
      email: 'ana@empresa.com',
      type: 'sign-in',
    });
    expect(screen.getByRole('status')).toHaveTextContent('ana@empresa.com');
    await waitFor(() => expect(codeInput).toHaveFocus());
    expect(codeInput).toHaveAttribute('autocomplete', 'one-time-code');

    fireEvent.change(codeInput, { target: { value: '123 456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app'));
    expect(auth.signInEmailOtp).toHaveBeenCalledWith({ email: 'ana@empresa.com', otp: '123456' });
  });

  it('muestra el error del código asociado al campo y no navega', async () => {
    auth.signInEmailOtp.mockResolvedValue({
      data: null,
      error: { code: 'OTP_EXPIRED', status: 400 },
    });
    const router = renderAt('/iniciar-sesion');
    const codeInput = await requestCode('ana@empresa.com');

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('6 dígitos');
    expect(auth.signInEmailOtp).not.toHaveBeenCalled();

    fireEvent.change(codeInput, { target: { value: '654321' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(codeInput).toHaveAccessibleDescription(/El código venció/));
    expect(codeInput).toHaveAttribute('aria-invalid', 'true');
    expect(router.state.location.pathname).toBe('/iniciar-sesion');
  });

  it('tras agotar los intentos bloquea el envío hasta pedir un código nuevo', async () => {
    auth.signInEmailOtp
      .mockResolvedValueOnce({ data: null, error: { code: 'TOO_MANY_ATTEMPTS', status: 403 } })
      .mockResolvedValueOnce({ data: { token: 't', user: {} }, error: null });
    const router = renderAt('/iniciar-sesion');
    const codeInput = await requestCode('ana@empresa.com');
    const submit = screen.getByRole('button', { name: 'Iniciar sesión' });

    fireEvent.change(codeInput, { target: { value: '111111' } });
    fireEvent.click(submit);
    await waitFor(() => expect(codeInput).toHaveAccessibleDescription(/demasiados intentos/));
    expect(submit).toBeDisabled();

    // Aunque escriba otro código, el mensaje sigue pidiendo reenviarlo.
    fireEvent.change(codeInput, { target: { value: '222222' } });
    expect(codeInput).toHaveAccessibleDescription(/demasiados intentos/);
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Reenviar código' }));
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.change(codeInput, { target: { value: '333333' } });
    fireEvent.click(submit);
    await waitFor(() => expect(router.state.location.pathname).toBe('/app'));
  });

  it('con un correo sin cuenta ofrece crearla conservando el destino', async () => {
    auth.signInEmailOtp.mockResolvedValue({
      data: null,
      error: { code: 'ACCOUNT_NOT_FOUND', status: 400 },
    });
    const router = renderAt('/iniciar-sesion?redirect=%2Finvitacion%2Fabc');
    const codeInput = await requestCode('nueva@empresa.com');

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(codeInput).toHaveAccessibleDescription(/No hay una cuenta/));
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeDisabled();
    fireEvent.click(screen.getByRole('link', { name: 'Crea una cuenta' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/registro'));
    expect(router.state.location.search).toEqual({ redirect: '/invitacion/abc' });
  });

  it('con TOTP activo deja que el cliente lleve al paso TOTP', async () => {
    auth.signInEmailOtp.mockResolvedValue({
      data: { twoFactorRedirect: true, twoFactorMethods: ['totp'] },
      error: null,
    });
    const router = renderAt('/iniciar-sesion');
    const codeInput = await requestCode('ana@empresa.com');

    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(auth.signInEmailOtp).toHaveBeenCalled());
    expect(router.state.location.pathname).toBe('/iniciar-sesion');
  });

  it('reenvía el código y permite cambiar de correo conservando el escrito', async () => {
    renderAt('/iniciar-sesion');
    await requestCode('ana@empresa.com');

    fireEvent.click(screen.getByRole('button', { name: 'Reenviar código' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('código nuevo'));
    expect(auth.sendVerificationOtp).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole('button', { name: 'Usar otro correo' }));
    expect(await screen.findByLabelText('Correo electrónico')).toHaveValue('ana@empresa.com');
  });

  it('muestra un error claro si no se pudo enviar el código', async () => {
    auth.sendVerificationOtp.mockResolvedValue({ data: null, error: { status: 500 } });
    renderAt('/iniciar-sesion');
    fireEvent.change(await screen.findByLabelText('Correo electrónico'), {
      target: { value: 'ana@empresa.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviarme un código' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos enviar el código');
    expect(screen.queryByLabelText('Código de acceso')).not.toBeInTheDocument();
  });

  it('en el registro envía el nombre al verificar y entra al onboarding', async () => {
    auth.signInEmailOtp.mockResolvedValue({ data: { token: 't', user: {} }, error: null });
    const router = renderAt('/registro');

    fireEvent.change(await screen.findByLabelText('Nombre completo'), {
      target: { value: 'Ana Gómez' },
    });
    const codeInput = await requestCode('ana@empresa.com');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding'));
    expect(auth.signInEmailOtp).toHaveBeenCalledWith({
      email: 'ana@empresa.com',
      otp: '123456',
      name: 'Ana Gómez',
    });
  });
});
