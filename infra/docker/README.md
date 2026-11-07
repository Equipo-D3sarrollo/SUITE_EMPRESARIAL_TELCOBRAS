# Imágenes y proxy

| Archivo | Propósito |
|---|---|
| `api.Dockerfile` | Construye la imagen de la API. |
| `api.Dockerfile.dockerignore` | Excluye del contexto de construcción de API archivos que no deben copiarse a la imagen. |
| `web.Dockerfile` | Construye la imagen de la aplicación web. |
| `web.Dockerfile.dockerignore` | Excluye archivos innecesarios del contexto de construcción web. |
| `Caddyfile` | Configura Caddy como proxy/servidor frontal del despliegue. |

