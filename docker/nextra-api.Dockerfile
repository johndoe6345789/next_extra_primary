# docker/nextra-api.Dockerfile
# Monolith nextra-api binary — all domains compiled into one.
# Shares the same apt+conan caching strategy as service-base.Dockerfile.
#
# In docker-compose only ONE service (backend) builds this image.
# All worker services (job-scheduler, cron-manager, etc.) reuse
# the built image with a different CMD — no redundant builds.

ARG BASE_IMAGE=debian:sid
ARG RUNTIME_IMAGE=debian:sid-slim
ARG APT_PROXY=http://host.docker.internal:3128

# ── Stage 1: system toolchain ───────────────────────────────────
FROM ${BASE_IMAGE} AS toolchain
ARG APT_PROXY

RUN printf 'Acquire::http::Proxy "%s";\n' "${APT_PROXY}" \
        > /etc/apt/apt.conf.d/00proxy && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        bison ca-certificates cmake flex \
        g++-13 gcc-13 git libpq-dev make \
        ninja-build pkg-config \
        python3 python3-pip && \
    rm -rf /var/lib/apt/lists/* && \
    ln -sf /usr/bin/gcc-13 /usr/local/bin/cc && \
    ln -sf /usr/bin/g++-13 /usr/local/bin/g++ && \
    python3 -m pip install --break-system-packages \
        --no-cache-dir "conan>=2.0,<3.0" && \
    conan profile detect --force

ENV CC=gcc-13 CXX=g++-13 CONAN_SKIP_TEST=1

# ── Stage 2: Conan C++ dependencies ─────────────────────────────
FROM toolchain AS conan-deps

WORKDIR /conan
COPY services/drogon-host/conanfile.py .

RUN conan install /conan --build=missing \
        --output-folder=/conan/out \
        -s build_type=Release \
        -s compiler.cppstd=20

# ── Stage 3: full monolith compile ──────────────────────────────
FROM conan-deps AS build

# Pass --build-arg SRC_BUST=$(date +%s) to bypass the COPY cache
# when source files change but Docker Desktop serves stale layers.
ARG SRC_BUST=1
# This RUN consumes SRC_BUST, so --build-arg SRC_BUST=$(date +%s)
# invalidates the COPY cache when Mac Docker Desktop serves stale layers.
RUN echo "src bust: ${SRC_BUST}"

WORKDIR /src
COPY . .

RUN cmake -B /build \
        -G Ninja \
        -DCMAKE_BUILD_TYPE=Release \
        "-DCMAKE_TOOLCHAIN_FILE=/conan/out/build/Release/generators/conan_toolchain.cmake" && \
    cmake --build /build --clean-first \
        -j"$(( $(nproc) > 4 ? 4 : $(nproc) ))"

# ── Stage 4: slim runtime base ───────────────────────────────────
FROM ${RUNTIME_IMAGE} AS runtime-base
ARG APT_PROXY

RUN printf 'Acquire::http::Proxy "%s";\n' "${APT_PROXY}" \
        > /etc/apt/apt.conf.d/00proxy && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates libpq5 libssl3 && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd --system nextra && \
    useradd --system --gid nextra \
        --create-home nextra

# ── Stage 5: runtime image ──────────────────────────────────────
FROM runtime-base AS runtime

WORKDIR /app

COPY --from=build /build/nextra-api ./nextra-api
COPY services/drogon-host/config ./config

COPY --from=build \
    /src/services/audit/constants.json \
    ./constants/audit-manager.json
COPY --from=build \
    /src/services/backup/constants.json \
    ./constants/backup-manager.json
COPY --from=build \
    /src/services/cron/constants.json \
    ./constants/cron-manager.json
COPY --from=build \
    /src/services/ecommerce/constants.json \
    ./constants/ecommerce.json
COPY --from=build \
    /src/services/image/constants.json \
    ./constants/image-processor.json
COPY --from=build \
    /src/services/job-queue/constants.json \
    ./constants/job-scheduler.json
COPY --from=build \
    /src/services/notifications/constants/notifications.json \
    ./constants/notification-router.json
COPY --from=build \
    /src/services/pdf/constants.json \
    ./constants/pdf-generator.json
COPY --from=build \
    /src/services/search/constants.json \
    ./constants/search-indexer.json
COPY --from=build \
    /src/services/streaming/constants.json \
    ./constants/media-streaming.json
COPY --from=build \
    /src/services/video/constants.json \
    ./constants/video-transcoder.json
COPY --from=build \
    /src/services/webhooks/constants.json \
    ./constants/webhook-dispatcher.json

RUN mkdir -p logs public uploads && \
    chown -R nextra:nextra /app

USER nextra
EXPOSE 8080

ENTRYPOINT ["./nextra-api"]
CMD ["serve", "--config", "config/config.prod.json"]
