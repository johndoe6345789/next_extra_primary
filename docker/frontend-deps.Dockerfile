# docker/frontend-deps.Dockerfile
#
# Pre-bakes Node.js 22 and all npm dependencies.
# node_modules lives at /deps/node_modules.
#
# Built and pushed to GHCR by base-images.yml when
# frontend/package.json or package-lock.json changes.

FROM node:22-alpine

WORKDIR /deps

COPY frontend/package.json frontend/package-lock.json* ./

RUN npm ci
