// Aplica el modo claro u oscuro antes del primer pintado, para que la página no destelle en blanco.
// Script clásico y externo (no en línea): la CSP de producción solo permite script-src 'self'.
// La misma clave y la misma lógica están en src/lib/theme.ts, que mantiene el tema después de cargar.
{
  let preference = null;
  try {
    preference = localStorage.getItem('orvex-theme');
  } catch {
    // Almacenamiento bloqueado (modo privado o política del navegador): se sigue el sistema.
  }
  const dark =
    preference === 'dark' ||
    (preference !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}
