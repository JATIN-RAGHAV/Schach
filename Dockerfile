# Setting up the base environment
FROM oven/bun:alpine AS base

WORKDIR /app

COPY package.json package.json
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/common/package.json packages/common/package.json
COPY bun.lock bun.lock
RUN bun install --filter '*'

COPY . .


# Building the backend
FROM base AS backend

EXPOSE 2222

CMD ["bun","/apps/backend/index.ts"]

# Building the development frontend
FROM base AS frontenddev

RUN bun run build:dev

# Building the production frontend
FROM base AS frontendprod

RUN bun run build:prod

# Starting nginx for production
FROM nginx:1.29.8-alpine AS nginxprod

COPY --from=frontendprod /app/apps/frontend/dist /var/www/html
COPY --from=frontendprod /app/infra/nginx/index.html /var/www/default/index.html
COPY --from=frontendprod /app/infra/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Starting nginx for development
FROM nginx:1.29.8-alpine AS nginxdev

COPY --from=frontenddev /app/apps/frontend/dist /var/www/html
COPY --from=frontenddev /app/infra/nginx/index.html /var/www/default/index.html
COPY --from=frontenddev /app/infra/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Building the tui
FROM golang:1.26.2-alpine3.23 AS tui

WORKDIR /app

COPY apps/tui/go.mod go.mod
COPY apps/tui/go.sum go.sum
RUN go mod tidy

EXPOSE 22

COPY apps/tui/ .

ARG BACKEND_URL

RUN BACKEND_URL=$BACKEND_URL go build

CMD ["./tui_ssh"]

# Building the database with tables
FROM postgres:18.3-alpine3.23 AS postgres

WORKDIR /app

COPY apps/backend/database/SETUP.sql /docker-entrypoint-initdb.d/init.sql
