# =============================================================
# Base image: Package Repository backend dependencies
# Pre-bakes Drogon v1.9.3 + system libs so per-arch builds
# only need to compile the ~2s application code.
# =============================================================
FROM ubuntu:24.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    cmake g++ make git ca-certificates \
    libssl-dev libjsoncpp-dev uuid-dev zlib1g-dev \
    libc-ares-dev libsqlite3-dev libbrotli-dev \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /deps
RUN git clone --depth 1 --branch v1.9.3 \
    https://github.com/drogonframework/drogon.git && \
    cd drogon && git submodule update --init && \
    cmake -B build -DBUILD_EXAMPLES=OFF \
    -DCMAKE_BUILD_TYPE=Release && \
    cmake --build build -j$(nproc) && \
    cmake --install build && \
    rm -rf /deps/drogon
