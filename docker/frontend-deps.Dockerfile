# docker/frontend-deps.Dockerfile
# Multi-arch base for the Node.js frontend.
# Platforms: amd64, arm64, riscv64, ppc64le
FROM debian:sid

ARG REPO_URL=
ARG APT_VER=sid-2026q1
ARG NPM_LOCK_HASH=
ARG TARGETARCH

# Install system Node, build tools, ca-certificates.
RUN if [ -n "$REPO_URL" ]; then \
        curl -fsSL \
            "$REPO_URL/v1/apt/frontend-runtime-deps/$APT_VER/$TARGETARCH/blob" \
            -o /tmp/apt.tar.gz && \
        mkdir -p /tmp/debs && \
        tar -xzf /tmp/apt.tar.gz -C /tmp/debs && \
        dpkg -i --force-depends /tmp/debs/*.deb && \
        ldconfig && rm -rf /tmp/apt.tar.gz /tmp/debs; \
    else \
        apt-get update && \
        apt-get install -y --no-install-recommends \
            nodejs npm ca-certificates \
            curl python3 make gcc g++ && \
        rm -rf /var/lib/apt/lists/*; \
    fi

# Use `n` to install Node 22 LTS on amd64/arm64.
# Exotic arches keep the system Node.
ENV N_PREFIX=/usr/local
RUN npm install -g n && \
    case "$(uname -m)" in \
        x86_64|aarch64) n 22 ;; \
        *) echo "Using system Node $(node -v)" ;; \
    esac && \
    npm install -g npm@latest && \
    hash -r

WORKDIR /deps
COPY frontend/package.json frontend/package-lock.json* ./

RUN if [ -n "$REPO_URL" ]; then \
        curl -fsSL \
            "$REPO_URL/v1/npm/nextra-frontend/$NPM_LOCK_HASH/noarch/blob" \
            -o /tmp/npm.tar.gz && \
        mkdir -p node_modules && \
        tar -xzf /tmp/npm.tar.gz -C node_modules && \
        rm -f /tmp/npm.tar.gz; \
    else \
        npm ci; \
    fi
