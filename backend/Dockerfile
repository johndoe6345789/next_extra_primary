##
## Dockerfile -- multi-stage build for nextra-api
##
## Stage 1 (builder):
##   gcc:13 base, installs Conan 2 + CMake, compiles a
##   fully-static release binary.
##
## Stage 2 (runtime):
##   Minimal Debian Bookworm image with only the binary,
##   config, migrations, and seed data.  Runs as a
##   non-root user.
##

# =============================================================
# Stage 1 -- build
# =============================================================
FROM gcc:13 AS builder

# Install build tooling
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        cmake \
        python3 \
        python3-pip \
        python3-venv \
        pkg-config \
        libpq-dev \
        libssl-dev \
        zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Conan 2
RUN python3 -m pip install --break-system-packages \
    conan==2.* && \
    conan profile detect --force

WORKDIR /build

# -- Dependency layer (cached unless conanfile changes) -------
COPY conanfile.py .
RUN conan install . \
    --build=missing \
    -s build_type=Release \
    -s compiler.cppstd=20

# -- Source layer ----------------------------------------------
COPY CMakeLists.txt .
COPY src/ src/

# -- Build -----------------------------------------------------
RUN cmake --preset conan-release \
        -DCMAKE_BUILD_TYPE=Release && \
    cmake --build --preset conan-release --parallel

# =============================================================
# Stage 2 -- runtime
# =============================================================
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
