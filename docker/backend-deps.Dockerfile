# docker/backend-deps.Dockerfile
# Multi-arch base for the C++ backend build toolchain.
# Platforms: amd64, arm64, riscv64, ppc64le
FROM debian:sid

ARG REPO_URL=
ARG APT_VER=sid-2026q1
ARG CONAN_VER=1.0.0
ARG TARGETARCH

# -- System packages ----------------------------------------
RUN if [ -n "$REPO_URL" ]; then \
        curl -fsSL \
            "$REPO_URL/v1/apt/backend-build-deps/$APT_VER/$TARGETARCH/blob" \
            -o /tmp/apt.tar.gz && \
        mkdir -p /tmp/debs && \
        tar -xzf /tmp/apt.tar.gz -C /tmp/debs && \
        dpkg -i --force-depends /tmp/debs/*.deb && \
        ldconfig && \
        rm -rf /tmp/apt.tar.gz /tmp/debs; \
    else \
        apt-get update && \
        apt-get install -y --no-install-recommends \
            gcc-13 g++-13 make cmake \
            python3 python3-pip python3-venv \
            pkg-config clang-tidy ca-certificates \
            libpq-dev libssl-dev zlib1g-dev && \
        rm -rf /var/lib/apt/lists/*; \
    fi && \
    update-alternatives --install \
        /usr/bin/gcc gcc /usr/bin/gcc-13 100 && \
    update-alternatives --install \
        /usr/bin/g++ g++ /usr/bin/g++-13 100 && \
    update-alternatives --install \
        /usr/bin/cc cc /usr/bin/gcc-13 100

# -- Conan install ------------------------------------------
RUN if [ -n "$REPO_URL" ]; then \
        curl -fsSL \
            "$REPO_URL/v1/pip/conan/$CONAN_VER/noarch/blob" \
            -o /tmp/pip.tar.gz && \
        mkdir -p /tmp/pip && \
        tar -xzf /tmp/pip.tar.gz -C /tmp/pip && \
        python3 -m pip install --break-system-packages \
            --no-index --find-links /tmp/pip conan && \
        rm -rf /tmp/pip.tar.gz /tmp/pip; \
    else \
        python3 -m pip install --break-system-packages \
            conan==2.*; \
    fi && \
    conan profile detect --force

# Exotic arches: tell Conan the host provides cmake.
RUN arch="$(uname -m)" && \
    case "$arch" in \
        x86_64|aarch64) ;; \
        *) printf '\n[platform_tool_requires]\n' \
               >> ~/.conan2/profiles/default && \
           printf 'cmake/[>=3.15 <4]\n' \
               >> ~/.conan2/profiles/default ;; \
    esac

WORKDIR /deps
COPY backend/conanfile.py .

# -- Conan dependencies -------------------------------------
RUN if [ -n "$REPO_URL" ]; then \
        URL="$REPO_URL/v1/conan/nextra-backend" && \
        URL="$URL/$CONAN_VER/$TARGETARCH-release/blob" && \
        curl -fsSL "$URL" -o /tmp/conan.tar.gz && \
        tar -xzf /tmp/conan.tar.gz -C ~ && \
        rm -f /tmp/conan.tar.gz; \
    else \
        conan install . \
            --build=missing \
            -s build_type=Release \
            -s compiler.cppstd=20; \
    fi
