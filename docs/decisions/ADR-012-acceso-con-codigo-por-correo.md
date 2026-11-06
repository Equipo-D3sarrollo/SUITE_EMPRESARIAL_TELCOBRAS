# ADR-012: Acceso con código por correo en lugar de passkey

- **Estado:** Aceptado
- **Fecha:** 6 de noviembre de 2026
- **Decide:** usuario y arquitecto del producto
- **Decisiones:** D-09 (documento madre §14). Reemplaza parcialmente a [ADR-006](ADR-006-identidad.md)

## Contexto
ADR-006 definió el acceso por correo como enlace de verificación seguido del registro de una passkey. En el uso real en local ese flujo falló: el enlace dura poco, cuando vence o ya se usó la persona vuelve al inicio de sesión sin ningún mensaje y, como todavía no tiene passkey, se queda sin forma de entrar. Además, la operación prefiere un código por correo, que se entiende sin explicación y funciona en cualquier equipo y navegador.

## Decisión
Se mantiene Better Auth embebido en NestJS y el acceso sin contraseña. Cambia solo el acceso por correo:

- Se entra con Google Workspace (OIDC, opcional por entorno) o con un **código de un solo uso enviado por correo**: 6 dígitos, vigencia de 10 minutos, 5 intentos por código y guardado cifrado con la clave del servidor (`BETTER_AUTH_SECRET`). Se usa el plugin `emailOTP` de Better Auth con el tipo `sign-in`.
- El mismo flujo sirve para el registro: si el correo no tiene cuenta, el primer código válido pedido desde `/registro` la crea con el nombre que se pidió allí y el correo queda verificado. Si el código se pidió desde `/iniciar-sesion` con un correo sin cuenta, la API no crea una cuenta sin nombre: responde `ACCOUNT_NOT_FOUND` después de verificar el código (así no revela qué correos tienen cuenta) y la web ofrece ir a `/registro` conservando el destino.
- TOTP (app autenticadora) se mantiene como segundo factor. Hoy se exige al entrar con código por correo, pero **no al entrar con Google**: el plugin de Better Auth no cubre el callback de OAuth y hace falta otro manejo. Queda en [PENDIENTES](../PENDIENTES.md).
- Se eliminan las passkeys y el enlace mágico: los plugins `passkey` y `magicLink`, sus clientes en la web, la dependencia `@better-auth/passkey` y la tabla `app.passkeys` (con una migración nueva).
- Siguen sin existir las contraseñas.

El resto de ADR-006 sigue vigente: sesión en cookie httpOnly, suplantación del superadministrador auditada y SSO corporativo (Okta/Entra) más adelante, por organización.

## Consecuencias
**El código por correo no cumple NIST SP 800-63B como autenticador.** ADR-006 citaba esta norma para descartarlo: el correo es un canal de recuperación, no un autenticador fuera de banda. Con esta decisión, quien controle el buzón de una persona sin TOTP puede entrar a su cuenta. El riesgo se acepta a cambio de un acceso que la operación sí puede usar, y se reduce con estas medidas:

- **TOTP como segundo factor.** Se recomienda a todos los usuarios. Para administradores de organización y superadministradores debe ser obligatorio; hoy no se exige y queda en [PENDIENTES](../PENDIENTES.md).
- **Límites de intentos y de envío.** Cada código admite 5 intentos. Además, Better Auth limita el envío y el ingreso del código a 3 solicitudes por minuto por IP, pero ese límite solo se activa por defecto en producción. Falta un límite de envíos por cuenta y por hora; queda en PENDIENTES.
- **Códigos de un solo uso guardados cifrados.** Un código se invalida al usarse y vence a los 10 minutos. Se guarda cifrado con la clave derivada de `BETTER_AUTH_SECRET` y no con un hash: un SHA-256 sin clave de 6 dígitos se invierte probando el millón de combinaciones, así que no protegería a quien lea Valkey. El correo lleva el código solo en el cuerpo, nunca en el asunto, para que no aparezca en las notificaciones.
- **Sesión en cookie httpOnly.** La sesión no queda al alcance de JavaScript. Hoy usa la duración por defecto de Better Auth (7 días, que se extienden con el uso como máximo una vez al día). Acortarla, al menos para administradores, queda en PENDIENTES.

Otros efectos:

- El flujo depende de que el correo llegue a tiempo. En producción hacen falta un proveedor de correo confiable y dominios con SPF, DKIM y DMARC (ya listado en PENDIENTES para la etapa 3).
- La recuperación de acceso deja de ser un flujo aparte: perder el dispositivo ya no bloquea la cuenta, porque basta con el correo. Si la persona pierde la app de TOTP, entra con sus códigos de respaldo; falta definir cómo lo restablece un administrador cuando también los perdió.
- Las passkeys pueden volver más adelante como factor opcional, con un ADR nuevo.
