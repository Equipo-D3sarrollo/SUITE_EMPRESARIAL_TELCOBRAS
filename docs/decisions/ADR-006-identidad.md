# ADR-006: Better Auth sin contraseñas

- **Estado:** Aceptado
- **Fecha:** 4 de noviembre de 2026
- **Decide:** arquitecto del producto
- **Decisiones:** D-09 (documento madre §14)

## Contexto
Las fuentes proponen tres modelos de acceso distintos; el PDF prohíbe dos sistemas de autenticación; el OTP por correo no cumple NIST SP 800-63B.

## Decisión
Better Auth embebido en NestJS. Acceso sin contraseña: Google Workspace (OIDC) o correo + passkey, con segundo factor TOTP. Sesión en cookie httpOnly y límites de intentos por cuenta. La suplantación del superadministrador queda auditada. El SSO corporativo (Okta/Entra) se agrega después, por organización.

## Consecuencias
Se retiran de los diseños la contraseña, el "Magic Code" y el código por correo.
