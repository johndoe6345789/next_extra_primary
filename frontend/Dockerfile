# Multi-arch Dockerfile for the Next.js frontend.
# Uses debian:sid for riscv64 + ppc64le support.
# Node 22 installed via `n` (prebuilt binary on amd64/arm64;
# system apt nodejs used on exotic arches).
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

# @parcel/watcher has no prebuilt binary for riscv64/ppc64le
# and native compilation under QEMU is unreliable. Provide a
# no-op stub so `next build` can load config without crashing.
# File watching is not needed during production builds.
RUN if [ ! -f node_modules/@parcel/watcher/index.js ] || \
       ! node -e "require('@parcel/watcher')" 2>/dev/null; then \
        mkdir -p node_modules/@parcel/watcher && \
        printf '{"name":"@parcel/watcher","version":"0.0.0","main":"index.js"}\n' \
            > node_modules/@parcel/watcher/package.json && \
        printf 'exports.subscribe=async()=>({unsubscribe:async()=>{}});\nexports.getEventsSince=async()=>[];\n' \
            > node_modules/@parcel/watcher/index.js; \
    fi

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
