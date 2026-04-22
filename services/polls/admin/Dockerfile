# Polls frontend — monorepo-aware build.
# Contexts: default=tools/polls, shared=shared

# -- Stage 1: deps --------------------------
FROM node:22-bookworm-slim AS deps
COPY --from=shared . /build/shared/
WORKDIR /build/tools/polls
COPY package.json package-lock.json* ./
RUN npm ci || npm install
RUN ln -s \
    /build/tools/polls/node_modules \
    /build/node_modules

# -- Stage 2: build -------------------------
FROM deps AS build
ARG NEXT_BASE_PATH=/polls
WORKDIR /build/tools/polls
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
RUN mkdir -p public
RUN npm run build

# -- Stage 3: runner -------------------------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/polls/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/polls/public \
    ./tools/polls/public
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/polls/.next/static \
    ./tools/polls/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/tools/polls
CMD ["node", "server.js"]
