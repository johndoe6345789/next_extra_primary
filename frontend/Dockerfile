# Multi-arch Dockerfile for the Next.js frontend.
# Uses debian:sid for riscv64 + ppc64le support.
# Node 22 installed via `n` (compiles from source
# on exotic arches, prebuilt binary on amd64/arm64).
#
# Platforms: amd64, arm64, riscv64, ppc64le

# Stage 1: Install dependencies
ARG DEPS_IMAGE=debian:sid
FROM ${DEPS_IMAGE} AS deps

# Install Node if not already in DEPS_IMAGE.
RUN command -v node >/dev/null 2>&1 || { \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        nodejs npm ca-certificates \
        curl python3 make gcc g++ && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g n && \
    case "$(uname -m)" in \
        x86_64|aarch64) n 22 ;; \
        *) n --build 22 ;; \
    esac && \
    npm install -g npm@latest && hash -r; }

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the application
FROM deps AS build

WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runner
FROM debian:sid-slim AS runner

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy Node binary from build stage.
COPY --from=build /usr/local/bin/node /usr/local/bin/

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
