# syntax=docker/dockerfile:1
# Imagen de la API (NestJS). Se construye desde la raíz del repositorio:
#   docker build -f infra/docker/api.Dockerfile -t telcobras-api .
# Etapa "migrate" (con drizzle-kit) para correr las migraciones antes de arrancar la API:
#   docker build -f infra/docker/api.Dockerfile --target migrate -t telcobras-api-migrate .
ARG NODE_IMAGE=node:24.22-alpine

FROM ${NODE_IMAGE} AS build
WORKDIR /repo
COPY package.json ./
# La misma versión de pnpm que fija packageManager en package.json.
RUN npm install --global "$(node -p "require('./package.json').packageManager")"
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --filter "@telcobras/api..."
RUN pnpm --filter "@telcobras/api..." build
# Copia autónoma de la API: solo dependencias de producción y @telcobras/contracts compilado.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm --filter @telcobras/api deploy --prod --store-dir /pnpm/store /out

FROM build AS migrate
USER node
WORKDIR /repo/apps/api
CMD ["pnpm", "db:migrate"]

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
# qpdf abre los PDF de la DIAN protegidos con el NIT (DataDian).
RUN apk add --no-cache qpdf
WORKDIR /app
# Archivos de root y solo lectura para el usuario que ejecuta la API.
COPY --from=build /out ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/v1/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "dist/main.js"]
