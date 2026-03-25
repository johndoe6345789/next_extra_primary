##
## Dockerfile -- multi-stage build for nextra-api
##
## Uses debian:sid for multi-arch support
## (amd64, arm64, riscv64, ppc64le).
##
## Stage 1: debian:sid builder with gcc-13 + Conan
## Stage 2: debian:sid-slim runtime with binary only
##

# ==========================================================
# Stage 1 -- build
# ==========================================================
ARG DEPS_IMAGE=debian:sid
FROM ${DEPS_IMAGE} AS builder

# Ensure full Perl is present for source builds (e.g. OpenSSL Configure).
# Kept separate from the Conan guard so pre-baked DEPS_IMAGE variants
# that already ship Conan still get this prerequisite.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        perl perl-modules && \
    rm -rf /var/lib/apt/lists/*

# Install build tools if not already in DEPS_IMAGE.
RUN command -v conan >/dev/null 2>&1 || { \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc-13 g++-13 make cmake \
        python3 python3-pip python3-venv \
        pkg-config libpq-dev libssl-dev zlib1g-dev \
        ca-certificates && \
    update-alternatives --install \
        /usr/bin/gcc gcc /usr/bin/gcc-13 100 && \
    update-alternatives --install \
        /usr/bin/g++ g++ /usr/bin/g++-13 100 && \
    update-alternatives --install \
        /usr/bin/cc cc /usr/bin/gcc-13 100 && \
    rm -rf /var/lib/apt/lists/* && \
    python3 -m pip install --break-system-packages \
        conan==2.* && \
    conan profile detect --force; }

# On exotic arches, Conan has no cmake binary; use system cmake.
RUN arch="$(uname -m)" && \
    case "$arch" in \
        x86_64|aarch64) ;; \
        *) mkdir -p ~/.conan2/profiles && \
           conan profile detect --force 2>/dev/null || true && \
           printf '\n[platform_tool_requires]\ncmake/[>=3.15 <4]\n' \
               >> ~/.conan2/profiles/default ;; \
    esac

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
RUN cmake -S . -B build/Release \
        -DCMAKE_TOOLCHAIN_FILE=build/Release/generators/conan_toolchain.cmake \
        -DCMAKE_BUILD_TYPE=Release && \
    cmake --build build/Release --parallel

# ==========================================================
# Stage 2 -- runtime
# ==========================================================
FROM debian:sid-slim AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 \
        libssl3 \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --system nextra && \
    useradd  --system --gid nextra --create-home nextra

WORKDIR /app

COPY --from=builder \
    /build/build/Release/nextra-api ./nextra-api
COPY config/     ./config/
COPY migrations/ ./migrations/
COPY seed/       ./seed/

RUN mkdir -p logs uploads public && \
    chown -R nextra:nextra /app

USER nextra
EXPOSE 8080

ENTRYPOINT ["./nextra-api"]
CMD ["serve", "--config", "config/config.prod.json"]
