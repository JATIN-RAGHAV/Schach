# Setting up the base environment
FROM oven/bun:alpine AS base

WORKDIR /app

COPY package.json package.json
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/common/package.json packages/common/package.json
RUN bun install

COPY . .

# Building the backend
FROM base AS backend

EXPOSE 2222

CMD ["bun","/apps/backend/index.ts"]

# Building the frontend
FROM base AS frontend

RUN bun i -g typescript
RUN bun run frontendBuild

# Starting nginx
FROM nginx:1.29.8-alpine AS nginx

COPY --from=frontend /app/apps/frontend/dist /var/www/html
COPY --from=frontend /app/infra/nginx/index.html /var/www/default/index.html
COPY --from=frontend /app/infra/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
