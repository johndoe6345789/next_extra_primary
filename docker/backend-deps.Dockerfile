# docker/backend-deps.Dockerfile
#
# Pre-bakes gcc 13, cmake, conan 2, clang-tidy, and all
# Conan dependencies. Conan cache lives at /root/.conan2.
#
# Built and pushed to GHCR by base-images.yml when
# backend/conanfile.py changes.

FROM gcc:13

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        cmake \
        python3 \
        python3-pip \
        python3-venv \
        pkg-config \
        libpq-dev \
        libssl-dev \
        zlib1g-dev \
        clang-tidy && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --break-system-packages \
        conan==2.* && \
    conan profile detect --force

WORKDIR /deps
COPY backend/conanfile.py .

# Install all Conan packages into the cache.
# This is the slow step (~3 min) that gets cached.
RUN conan install . \
        --build=missing \
        -s build_type=Release \
        -s compiler.cppstd=20
