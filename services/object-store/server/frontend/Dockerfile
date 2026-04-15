# S3 server frontend — monorepo-aware build.
# Contexts: default=tools/s3server/frontend, shared=shared

# -- Stage 1: deps ------------------------------------------
FROM --platform=linux/amd64 node:22-bookworm-slim AS deps
COPY --from=shared . /build/shared/
WORKDIR /build/tools/s3server/frontend
COPY package.json package-lock.json* ./
RUN npm ci || npm install
RUN ln -s \
    /build/tools/s3server/frontend/node_modules \
    /build/node_modules

# -- Stage 2: build -----------------------------------------
FROM deps AS build
ARG NEXT_BASE_PATH=
WORKDIR /build/tools/s3server/frontend
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
RUN mkdir -p public
RUN npm run build

# -- Stage 3: runner ----------------------------------------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/s3server/frontend/.next/standalone \
    ./
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/s3server/frontend/public \
    ./tools/s3server/frontend/public
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/s3server/frontend/.next/static \
    ./tools/s3server/frontend/.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/tools/s3server/frontend
CMD ["node", "server.js"]
