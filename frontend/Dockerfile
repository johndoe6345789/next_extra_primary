# Multi-arch Dockerfile for the Next.js frontend.
# Platforms: amd64, arm64, riscv64, ppc64le
#
# Build runs on amd64 (native SWC + Turbopack).
# Only the runner stage uses the target platform.

# -- Global build args --------------------------------------
ARG BUILD_PLATFORM=linux/amd64
ARG NODE_IMAGE=node:22-slim
ARG RUNTIME_IMAGE=debian:sid-slim

# -- Stage 1: deps (amd64) ----------------------------------
FROM --platform=${BUILD_PLATFORM} ${NODE_IMAGE} AS deps
ARG NPM_REGISTRY=http://host.docker.internal:4873
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY
# Mirror the local monorepo layout so file: deps resolve
COPY --from=shared . /build/shared/
WORKDIR /build/app
COPY package.json package-lock.json* ./
COPY patches/ ./patches/
RUN npm ci || npm install
# Hoist node_modules so shared packages can resolve them
RUN ln -s /build/app/node_modules /build/node_modules

# -- Stage 2: build (amd64) ---------------------------------
FROM deps AS build
ARG NEXT_BASE_PATH=
ARG BACKEND_URL=http://localhost:8080
WORKDIR /build/app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_BASE_PATH}
ENV BACKEND_URL=${BACKEND_URL}
RUN npm run build

# -- Stage 3: runner (target arch) --------------------------
ARG RUNTIME_IMAGE
FROM ${RUNTIME_IMAGE} AS runner
ARG REPO_URL=
ARG APT_VER=sid-2026q1
ARG TARGETARCH

RUN if [ -n "$REPO_URL" ]; then \
        curl -fsSL \
            "$REPO_URL/v1/apt/frontend-runtime-deps/$APT_VER/$TARGETARCH/blob" \
            -o /tmp/apt.tar.gz && \
        mkdir -p /tmp/debs && \
        tar -xzf /tmp/apt.tar.gz -C /tmp/debs && \
        dpkg -i --force-depends /tmp/debs/*.deb && \
        ldconfig && \
        rm -rf /tmp/apt.tar.gz /tmp/debs; \
    else \
        apt-get update && \
        apt-get install -y --no-install-recommends \
            nodejs ca-certificates curl && \
        rm -rf /var/lib/apt/lists/*; \
    fi

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs
# standalone output mirrors outputFileTracingRoot (/build/)
# so server.js is at /build/app/.next/standalone/app/
COPY --from=build /build/app/public ./public
COPY --from=build \
    --chown=nextjs:nodejs \
    /build/app/.next/standalone/app/ ./
COPY --from=build \
    --chown=nextjs:nodejs \
    /build/app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
