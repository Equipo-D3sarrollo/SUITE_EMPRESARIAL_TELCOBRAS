-- El acceso con passkey se reemplazó por un código de un solo uso enviado al correo: la tabla deja de usarse.
-- Su índice, su llave foránea y los permisos de app_user (GRANT de 0002_auth.sql) se van con ella.
DROP TABLE "app"."passkeys";
