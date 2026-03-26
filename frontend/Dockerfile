# Multi-arch Dockerfile for the Next.js frontend.
# Platforms: amd64, arm64, riscv64, ppc64le
#
# Build always runs on amd64 (native SWC + Turbopack).
# Only the runner stage uses the target platform's Node.js,
# since `next build` output is plain JavaScript.

# -- Stage 1: deps (amd64) ----------------------------------
FROM --platform=linux/amd64 node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# -- Stage 2: build (amd64) ---------------------------------
FROM deps AS build
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -- Stage 3: runner (target arch) --------------------------
FROM debian:sid-slim AS runner
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        nodejs ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=build /app/public ./public
COPY --from=build \
    --chown=nextjs:nodejs \
    /app/.next/standalone ./
COPY --from=build \
    --chown=nextjs:nodejs \
    /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
