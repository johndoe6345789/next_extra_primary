# Builds @next/swc native NAPI binding from source.
# Output: /swc/next-swc.<triple>.node
#
# Usage (build + push cache image):
#   docker buildx build --platform linux/riscv64 \
#     -f swc.Dockerfile \
#     --build-arg NEXT_VERSION=16.2.1 \
#     -t ghcr.io/<repo>/swc-cache:next-16.2.1-riscv64 \
#     --push .
#
# The main Dockerfile pulls this via SWC_NATIVE_IMAGE arg.

FROM debian:sid-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl git nodejs npm gcc g++ make \
        pkg-config libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install Rust via rustup; rust-toolchain.toml in the
# Next.js repo auto-selects the correct nightly version.
RUN curl --proto '=https' --tlsv1.2 -sSf \
        https://sh.rustup.rs | \
    sh -s -- -y --default-toolchain none
ENV PATH="/root/.cargo/bin:${PATH}"

RUN npm install -g @napi-rs/cli@2.18.4

ARG NEXT_VERSION=16.2.1
WORKDIR /src
RUN git clone --depth 1 --branch "v${NEXT_VERSION}" \
        https://github.com/vercel/next.js .

WORKDIR /src/packages/next-swc
RUN napi build --platform \
        -p next-napi-bindings \
        --cargo-cwd ../../ \
        --cargo-name next_napi_bindings \
        --release \
        --features image-webp,tracing/release_max_level_trace \
        --js false native

# Minimal output image: just the .node file.
FROM scratch
COPY --from=builder /src/packages/next-swc/native/ /swc/
