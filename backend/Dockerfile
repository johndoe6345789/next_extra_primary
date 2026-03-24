##
## Dockerfile -- multi-stage build for nextra-api
##
## Uses GHCR-hosted backend-deps image (built by
## base-images.yml) for pre-cached Conan packages.
## Falls back to gcc:13 if DEPS_IMAGE not provided.
##
## Stage 1 (builder): Conan install + CMake build
## Stage 2 (runtime): Minimal Debian with binary only
##

# ==========================================================
# Stage 1 -- build
# ==========================================================
ARG DEPS_IMAGE=gcc:13
FROM ${DEPS_IMAGE} AS builder

# If using raw gcc:13 (no base image), install build tools.
# These are no-ops if the base image already has them.
RUN command -v conan >/dev/null 2>&1 || { \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        cmake python3 python3-pip python3-venv \
        pkg-config libpq-dev libssl-dev zlib1g-dev && \
    rm -rf /var/lib/apt/lists/* && \
    python3 -m pip install --break-system-packages \
        conan==2.* && \
    conan profile detect --force; }

WORKDIR /build

# -- Dependency layer (instant if Conan cache warm) --------
COPY conanfile.py .
RUN conan install . \
    --build=missing \
    -s build_type=Release \
    -s compiler.cppstd=20

# -- Source layer -------------------------------------------
COPY CMakeLists.txt .
COPY src/ src/

# -- Build --------------------------------------------------
RUN cmake --preset conan-release \
        -DCMAKE_BUILD_TYPE=Release && \
    cmake --build --preset conan-release --parallel

# ==========================================================
# Stage 2 -- runtime
# ==========================================================
FROM debian:bookworm-slim AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 \
        libssl3 \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Non-root user
RUN groupadd --system nextra && \
    useradd  --system --gid nextra --create-home nextra

WORKDIR /app

# Copy artefacts from builder
COPY --from=builder \
    /build/build/Release/nextra-api ./nextra-api

# Copy runtime assets
COPY config/     ./config/
COPY migrations/ ./migrations/
COPY seed/       ./seed/

# Create writable directories
RUN mkdir -p logs uploads public && \
    chown -R nextra:nextra /app

USER nextra

EXPOSE 8080

ENTRYPOINT ["./nextra-api"]
CMD ["serve", "--config", "config/config.prod.json"]
