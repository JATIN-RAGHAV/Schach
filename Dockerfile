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
CMD ["bun","/apps/backend/index.ts"]

# Building the frontend
FROM base AS frontend

RUN bun i -g typescript

RUN bun run frontendBuild

CMD ["bun","/apps/backend/index.ts"]
