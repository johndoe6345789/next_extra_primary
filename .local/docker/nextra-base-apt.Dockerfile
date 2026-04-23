# =============================================================
# Base image: nextra backend apt + pip toolchain.
# Debian sid (rolling) — gcc-13, cmake 3.31 via pip (conan 2
# compatibility), ninja, perl, pkg-config, OpenSSL/libpq dev
# headers. No project code — just the toolchain.
# =============================================================
FROM debian:sid

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc-13 g++-13 make ninja-build \
        git ca-certificates pkg-config \
        perl perl-modules \
        python3 python3-pip python3-venv \
        libpq-dev libssl-dev zlib1g-dev \
        libc-ares-dev libsqlite3-dev \
        libbrotli-dev libjsoncpp-dev \
        uuid-dev curl && \
    update-alternatives --install \
        /usr/bin/gcc gcc /usr/bin/gcc-13 100 && \
    update-alternatives --install \
        /usr/bin/g++ g++ /usr/bin/g++-13 100 && \
    update-alternatives --install \
        /usr/bin/cc cc /usr/bin/gcc-13 100 && \
    rm -rf /var/lib/apt/lists/* && \
    pip3 install --break-system-packages \
        'cmake==3.31.10' 'conan==2.*' && \
    conan profile detect --force
