# syntax=docker/dockerfile:1.7
# Stub Dockerfile for Drogon services (requires build infrastructure)
ARG RUNTIME_IMAGE=debian:sid-slim

FROM ${RUNTIME_IMAGE} AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5 libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --system nextra && \
    useradd --system --gid nextra --create-home nextra

WORKDIR /app

RUN echo '#!/bin/sh' > /app/nextra-api && \
    echo 'echo "nextra-api stub binary"' >> /app/nextra-api && \
    chmod +x /app/nextra-api

RUN mkdir -p logs uploads public && \
    chown -R nextra:nextra /app

USER nextra

EXPOSE 8080

ENTRYPOINT ["./nextra-api"]
CMD ["serve", "--config", "config/config.prod.json"]
