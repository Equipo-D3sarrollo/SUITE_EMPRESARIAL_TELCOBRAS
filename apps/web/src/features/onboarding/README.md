# Onboarding

| Archivo | Propósito |
|---|---|
| `onboarding-page.tsx` | Pantalla de configuración inicial (`/onboarding`): crea la primera organización del usuario. |
| `new-organization-page.tsx` | Pantalla `/organizaciones/nueva`: registra otra organización con la cuenta actual, sin volver a iniciar sesión. Sin organizaciones, la ruta lleva a `/onboarding`. |
| `organization-form.tsx` | Formulario compartido (nombre, razón social, NIT, tamaño): crea la organización, la activa y entra al panel. |

Una persona usa una sola cuenta para varias organizaciones (como Slack o Notion). Quien crea una organización queda con el rol de Administrador de empresa; el selector de la Zona 0 lista todas las organizaciones donde la cuenta es miembro, sea cual sea su rol.
