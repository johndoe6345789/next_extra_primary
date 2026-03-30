# Multi-arch Dockerfile for nextra-api (C++ backend).
# Build contexts: manager=./tools/manager, commands=./.local/commands
ARG DEPS_IMAGE=debian:sid
ARG RUNTIME_IMAGE=debian:sid-slim

# -- Stage 0: manager tool ----------------------------------
FROM ${DEPS_IMAGE} AS manager-build
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        g++ make && \
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
COPY --from=commands . /usr/local/share/manager/commands/
ENV MANAGER_COMMANDS_DIR=/usr/local/share/manager/commands/
WORKDIR /build

# -- Dependency layer ----------------------------------------
COPY conanfile.py .
ENV CONAN_SKIP_TEST=1
ENV CONAN_CPU_COUNT=14
RUN ARGS="--build=missing -s build_type=Release" && \
    ARGS="$ARGS -s compiler.cppstd=20" && \
    ARGS="$ARGS -of build/Release" && \
    manager conan-install --args "$ARGS"

# -- Source + build ------------------------------------------
COPY CMakeLists.txt .
COPY src/ src/
RUN cmake -S . -B build/Release \
        -DCMAKE_TOOLCHAIN_FILE=build/Release/generators/conan_toolchain.cmake \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_C_COMPILER=gcc \
        -DCMAKE_CXX_COMPILER=g++ && \
    cmake --build build/Release --parallel 14

# -- Stage 2: runtime ----------------------------------------
FROM ${RUNTIME_IMAGE} AS runtime
ARG REPO_URL=
ARG APT_VER=sid-2026q1
ARG TARGETARCH

RUN if [ -n "$REPO_URL" ]; then \
        curl -fsSL \
            "$REPO_URL/v1/apt/backend-runtime-deps/$APT_VER/$TARGETARCH/blob" \
            -o /tmp/apt.tar.gz && \
        mkdir -p /tmp/debs && \
        tar -xzf /tmp/apt.tar.gz -C /tmp/debs && \
        dpkg -i --force-depends /tmp/debs/*.deb && \
        ldconfig && \
        rm -rf /tmp/apt.tar.gz /tmp/debs; \
    else \
        apt-get update && \
        apt-get install -y --no-install-recommends \
            libpq5 libssl3 ca-certificates && \
        rm -rf /var/lib/apt/lists/*; \
    fi

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
