# docker/service-base.Dockerfile
# Parameterised build/runtime for every nextra
# Drogon microservice. Referenced by docker-compose
# build.args; no per-service Dockerfile needed.
#
# Build args:
#   SVC_NAME   binary name      (e.g. nextra-auth)
#   SVC_DIR    CMakeLists dir   (e.g. auth-service)
#   SVC_PORT   exposed port     (e.g. 9001)
#   DEPS_IMAGE toolchain image
#   RUNTIME_IMAGE slim runtime

ARG DEPS_IMAGE=debian:sid
ARG RUNTIME_IMAGE=debian:sid-slim

FROM ${DEPS_IMAGE} AS build
ARG SVC_NAME
ARG SVC_DIR

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        bison ca-certificates cmake flex \
        g++-13 gcc-13 git libpq-dev make \
        ninja-build pkg-config \
        python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/gcc-13 /usr/local/bin/cc && \
    ln -sf /usr/bin/g++-13 /usr/local/bin/g++

RUN python3 -m pip install \
    --break-system-packages \
    --no-cache-dir "conan>=2.0,<3.0"

WORKDIR /src
COPY . .

ENV CC=gcc-13 CXX=g++-13 CONAN_SKIP_TEST=1

RUN cd /src/services/drogon-host && \
    conan profile detect --force && \
    conan install . --build=missing \
        --output-folder=build \
        -s build_type=Release && \
    cmake -B /build \
        -S "/src/services/${SVC_DIR}" \
        -G Ninja \
        -DCMAKE_BUILD_TYPE=Release \
        "-DCMAKE_TOOLCHAIN_FILE=/src/services/drogon-host/build/build/Release/generators/conan_toolchain.cmake" && \
    cmake --build /build -j"$(nproc)"

FROM ${RUNTIME_IMAGE} AS runtime
ARG SVC_NAME
ARG SVC_DIR
ARG SVC_PORT
# Persist binary name as env so ENTRYPOINT can use it.
ENV NEXTRA_BIN=${SVC_NAME}

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates libpq5 libssl3 && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --system nextra && \
    useradd --system --gid nextra \
        --create-home nextra

WORKDIR /app

COPY --from=build "/build/${SVC_NAME}" ./bin/svc
COPY "services/${SVC_DIR}/config/config.json" \
    ./config/config.json

RUN mkdir -p logs && \
    chown -R nextra:nextra /app

USER nextra
EXPOSE ${SVC_PORT}

ENTRYPOINT ["./bin/svc", "config/config.json"]
