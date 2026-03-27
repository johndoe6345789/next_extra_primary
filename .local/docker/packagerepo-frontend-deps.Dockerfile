# =============================================================
# Base image: Package Repository frontend dependencies
# Pre-bakes Node.js 22 + npm install so per-arch builds
# only need to copy source and run next build.
# =============================================================
FROM node:22-alpine

WORKDIR /deps
COPY tools/packagerepo/frontend/package.json \
     tools/packagerepo/frontend/package-lock.json ./
RUN npm install --production=false
