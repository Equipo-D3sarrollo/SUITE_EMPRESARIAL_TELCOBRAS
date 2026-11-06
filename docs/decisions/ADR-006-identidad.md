# ADR-006: Better Auth sin contraseñas

- **Estado:** Reemplazado parcialmente por [ADR-012](ADR-012-acceso-con-codigo-por-correo.md)
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-09 (documento madre §14)

> **Nota (6 de noviembre de 2026):** el acceso por correo + passkey y el enlace de verificación se reemplazaron por un código de un solo uso enviado por correo ([ADR-012](ADR-012-acceso-con-codigo-por-correo.md)). Siguen vigentes Better Auth, Google OIDC, TOTP, la ausencia de contraseñas, la sesión en cookie httpOnly y la suplantación auditada. El texto de abajo se conserva como registro histórico.

## Contexto
Las fuentes proponen tres modelos de acceso distintos; el PDF prohíbe dos sistemas de autenticación; el OTP por correo no cumple NIST SP 800-63B.

## Decisión
Better Auth embebido en NestJS. Acceso sin contraseña: Google Workspace (OIDC) o correo + passkey, con segundo factor TOTP. Sesión en cookie httpOnly y límites de intentos por cuenta. La suplantación del superadministrador queda auditada. El SSO corporativo (Okta/Entra) se agrega después, por organización.

## Consecuencias
Se retiran de los diseños la contraseña, el "Magic Code" y el código por correo.

La columna nullable `accounts.password` se conserva porque Better Auth la requiere en su modelo de cuenta.
El acceso por correo y contraseña permanece deshabilitado y esta columna no se escribe.
