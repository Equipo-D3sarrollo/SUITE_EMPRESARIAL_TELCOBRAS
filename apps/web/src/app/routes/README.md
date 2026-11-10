# Páginas y rutas

Cada archivo declara una página o ruta del router file-based.

| Archivo | Propósito |
|---|---|
| `__root.tsx` | Layout raíz que envuelve las rutas. |
| `index.tsx` | Ruta inicial del sitio. |
| `app.tsx` | Entrada a la zona autenticada de la aplicación. |
| `app.index.tsx` | Página índice del espacio de trabajo. |
| `app.$module.$submodule.tsx` | Ruta dinámica para módulos y submódulos del shell. |
| `iniciar-sesion.tsx` | Página de inicio de sesión. |
| `registro.tsx` | Página de registro. |
| `invitacion.$token.tsx` | Página que resuelve una invitación a partir de su token. |
| `onboarding.tsx` | Ruta de configuración inicial de la cuenta u organización. |
| `organizaciones.nueva.tsx` | Registrar otra organización con la cuenta actual; exige sesión y al menos una organización (sin ninguna lleva a `/onboarding`) y queda fuera de `/app`. |

