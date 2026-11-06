# syntax=docker/dockerfile:1
# Imagen web: la SPA compilada servida por Caddy, que además hace de proxy de /api (ver Caddyfile).
#   docker build -f infra/docker/web.Dockerfile -t telcobras-web .
FROM node:24.22-alpine AS build
WORKDIR /repo
COPY package.json ./
# La misma versión de pnpm que fija packageManager en package.json.
RUN npm install --global "$(node -p "require('./package.json').packageManager")"
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --filter "@telcobras/web..."
RUN pnpm --filter @telcobras/web build
# Precomprime en br y gzip (doc madre §19.2): Caddy los entrega con file_server precompressed.
RUN apk add --no-cache brotli \
 && find apps/web/dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' \
      -o -name '*.json' -o -name '*.webmanifest' -o -name '*.txt' \) \
      -exec brotli --best --keep {} + -exec gzip -9 -k {} +

FROM caddy:2.11-alpine
RUN addgroup -S app && adduser -S -G app app && chown -R app:app /data /config
COPY infra/docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/web/dist /srv
# Sin root: Docker permite a cualquier usuario abrir los puertos 80 y 443 dentro del contenedor.
USER app
EXPOSE 80 443 443/udp
# La API de administración de Caddy solo escucha en localhost:2019 dentro del contenedor.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD ["wget", "-qO", "/dev/null", "http://127.0.0.1:2019/config/"]
