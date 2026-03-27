# docker/frontend-deps.Dockerfile
#
# Multi-arch base for the Node.js frontend.
# Uses debian:sid for riscv64 + ppc64le support.
#
# Strategy: install Node from apt (any version sid has),
# then use `n` to upgrade to Node 22 LTS. On exotic
# arches, `n` compiles Node from source automatically.
#
# Platforms: amd64, arm64, riscv64, ppc64le

FROM debian:sid

# Install system Node (bootstrap), build tools for
# compiling Node from source on exotic arches, and
# ca-certificates for npm registry access.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        nodejs npm ca-certificates \
        curl python3 make gcc g++ && \
    rm -rf /var/lib/apt/lists/*

# Use `n` to install Node 22 LTS. On amd64/arm64 this
# downloads a prebuilt binary (~5s). On exotic arches
# no prebuilt binary exists, so keep the system Node.
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
RUN npm ci
