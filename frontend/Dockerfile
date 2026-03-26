# Multi-arch Dockerfile for the Next.js frontend.
# Platforms: amd64, arm64, riscv64, ppc64le
#
# On exotic arches, pass SWC_NATIVE_IMAGE pointing to a
# GHCR cache image built by swc.Dockerfile so Turbopack
# can run with native bindings.

ARG DEPS_IMAGE=debian:sid
ARG SWC_NATIVE_IMAGE=busybox
FROM ${SWC_NATIVE_IMAGE} AS swc-native
RUN mkdir -p /swc && touch /swc/.keep

# Build the manager tool (exotic arches only; Docker
# skips this stage on amd64/arm64 when it is unused).
# Requires: --build-context manager=./tools/manager
FROM ${DEPS_IMAGE} AS manager-build
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        g++ make curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
COPY --from=manager . /build/
WORKDIR /build
RUN make

# Stage 1: Install dependencies
FROM ${DEPS_IMAGE} AS deps

RUN command -v node >/dev/null 2>&1 || { \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        nodejs npm ca-certificates \
        curl python3 make gcc g++ && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g n && \
    case "$(uname -m)" in \
        x86_64|aarch64) n 22 ;; \
        *) cp /usr/bin/node /usr/local/bin/node ;; \
    esac && \
    npm install -g npm@latest && hash -r; }

WORKDIR /app
COPY package.json package-lock.json* ./
RUN case "$(uname -m)" in \
        riscv64|ppc64le) \
            npm ci --ignore-scripts || npm ci ;; \
        *) npm ci ;; \
    esac

# On exotic arches: install SWC native cache, stub
# @parcel/watcher, patch @swc/core for WASM fallback.
COPY --from=swc-native /swc/ /tmp/swc/
COPY --from=manager-build /build/manager /usr/local/bin/
RUN case "$(uname -m)" in \
        riscv64|ppc64le) \
            manager setup-exotic-arch \
                --swc-dir /tmp/swc ;; \
    esac

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
