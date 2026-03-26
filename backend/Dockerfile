# Multi-arch Dockerfile for nextra-api (C++ backend).
# Requires: --build-context manager=./tools/manager
ARG DEPS_IMAGE=debian:sid

# -- Stage 0: manager tool ----------------------------------
FROM ${DEPS_IMAGE} AS manager-build
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        g++ make curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
COPY --from=manager . /build/
WORKDIR /build
RUN make

# -- Stage 1: build -----------------------------------------
FROM ${DEPS_IMAGE} AS builder
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        perl perl-modules && \
    rm -rf /var/lib/apt/lists/*
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

COPY --from=manager-build /build/manager /usr/local/bin/

WORKDIR /build

# -- Dependency layer ----------------------------------------
COPY conanfile.py .
RUN manager conan-install \
        --build=missing \
        -s build_type=Release \
        -s compiler.cppstd=20

# -- Source layer --------------------------------------------
COPY CMakeLists.txt .
COPY src/ src/

# -- Build ---------------------------------------------------
RUN cmake -S . -B build/Release \
        -DCMAKE_TOOLCHAIN_FILE=build/Release/generators/conan_toolchain.cmake \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_C_COMPILER=gcc \
        -DCMAKE_CXX_COMPILER=g++ && \
    cmake --build build/Release --parallel

# -- Stage 2: runtime ----------------------------------------
FROM debian:sid-slim AS runtime
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 libssl3 ca-certificates && \
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
