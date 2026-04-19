# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Copy full source and build
COPY . .
RUN pnpm build

# ── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
# Bind to all interfaces — Nitro defaults to 127.0.0.1 which is unreachable outside the container
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

WORKDIR /app

COPY --from=builder /app/.output /app/.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
