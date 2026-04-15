# Multi-stage build for API Docs viewer
# Context: monorepo root
ARG BASE_REGISTRY=metabuilder
FROM ${BASE_REGISTRY}/base-node-deps:latest AS builder

# Shared packages
COPY icons/ ./icons/
COPY scss/ ./scss/
COPY components/ ./components/
COPY types/ ./types/
COPY hooks/ ./hooks/

# The app itself
COPY tools/apidocs/frontend/ ./tools/apidocs/frontend/

# Build workspace packages
RUN for ws in components; do \
    npm run build -w "$ws" --if-present 2>&1 \
    || echo "WARN: $ws build skipped"; \
done

# Build the app
RUN cd tools/apidocs/frontend \
    && npx next build --webpack

# Runtime stage
FROM node:24-alpine
WORKDIR /app

COPY --from=builder \
  /app/tools/apidocs/frontend/.next/standalone ./
COPY --from=builder \
  /app/tools/apidocs/frontend/.next/static \
  ./tools/apidocs/frontend/.next/static
COPY --from=builder \
  /app/tools/apidocs/frontend/public \
  ./tools/apidocs/frontend/public

ENV NODE_ENV=production
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

EXPOSE 3003

HEALTHCHECK --interval=15s --timeout=5s \
  --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider \
  http://127.0.0.1:3003/ || exit 1

WORKDIR /app/tools/apidocs/frontend
CMD ["node", "server.js"]
