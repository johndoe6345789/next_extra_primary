# Forum moderation frontend.
# Contexts: default=tools/forum, shared=shared

FROM node:22-bookworm-slim AS deps
COPY --from=shared . /build/shared/
WORKDIR /build/tools/forum
COPY package.json package-lock.json* ./
RUN npm ci || npm install
RUN ln -s \
    /build/tools/forum/node_modules \
    /build/node_modules

FROM deps AS build
ARG NEXT_BASE_PATH=/forum
WORKDIR /build/tools/forum
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
RUN mkdir -p public
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/forum/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/forum/public \
    ./tools/forum/public
COPY --from=build --chown=nextjs:nodejs \
    /build/tools/forum/.next/static \
    ./tools/forum/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/tools/forum
CMD ["node", "server.js"]
