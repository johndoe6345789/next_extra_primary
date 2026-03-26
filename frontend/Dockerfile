# Multi-arch Dockerfile for the Next.js frontend.
# Platforms: amd64, arm64, riscv64, ppc64le
#
# On exotic arches Turbopack is unavailable (Next.js has no
# native binding loader for riscv64/ppc64le), so we fall back
# to Webpack with WASM SWC bindings.
# Requires: --build-context manager=./tools/manager

ARG DEPS_IMAGE=debian:sid

# -- Manager tool (patches node_modules on exotic arches) ----
FROM ${DEPS_IMAGE} AS manager-build
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        g++ make curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
COPY --from=manager . /build/
WORKDIR /build
RUN make

# -- Stage 1: deps ------------------------------------------
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

# Exotic-arch fixups: stub @parcel/watcher, patch @swc/core.
COPY --from=manager-build /build/manager /usr/local/bin/
RUN case "$(uname -m)" in \
        riscv64|ppc64le) \
            manager setup-exotic-arch ;; \
    esac

# -- Stage 2: build -----------------------------------------
FROM deps AS build
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN case "$(uname -m)" in \
        riscv64|ppc64le) npx next build --no-turbopack ;; \
        *) npm run build ;; \
    esac

# -- Stage 3: runner ----------------------------------------
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
