# docker/backend-deps.Dockerfile
#
# Multi-arch base for the C++ backend build toolchain.
# Uses debian:sid for riscv64 + ppc64le support.
# Pre-installs gcc-13, cmake, conan 2, clang-tidy,
# and all Conan dependencies.
#
# Platforms: amd64, arm64, riscv64, ppc64le

FROM debian:sid

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc-13 g++-13 make cmake \
        python3 python3-pip python3-venv \
        pkg-config clang-tidy ca-certificates \
        libpq-dev libssl-dev zlib1g-dev && \
    update-alternatives --install \
        /usr/bin/gcc gcc /usr/bin/gcc-13 100 && \
    update-alternatives --install \
        /usr/bin/g++ g++ /usr/bin/g++-13 100 && \
    update-alternatives --install \
        /usr/bin/cc cc /usr/bin/gcc-13 100 && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --break-system-packages \
        conan==2.* && \
    conan profile detect --force

WORKDIR /deps
COPY backend/conanfile.py .

# Pre-build all Conan packages (~3 min, cached).
RUN conan install . \
        --build=missing \
        -s build_type=Release \
        -s compiler.cppstd=20
