# syntax=docker/dockerfile:1.7
# webmail — standalone production build.
# Contexts: default=services/email/webmail, shared=shared

# -- Stage 1: deps --------------------------
FROM node:20-alpine AS deps
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY
COPY --from=shared . /build/shared/
WORKDIR /build/services/email/webmail
COPY package.json ./
RUN npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000
RUN npm install --prefer-offline --no-audit --no-fund
RUN ln -s \
    /build/services/email/webmail/node_modules \
    /build/node_modules

# -- Stage 2: build -------------------------
FROM deps AS build
ARG NEXT_BASE_PATH=/emailclient
WORKDIR /build/services/email/webmail
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
RUN mkdir -p public
RUN npx next build --turbopack

# -- Stage 3: runner -------------------------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs \
    /build/services/email/webmail/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs \
    /build/services/email/webmail/public \
    ./services/email/webmail/public
COPY --from=build --chown=nextjs:nodejs \
    /build/services/email/webmail/.next/static \
    ./services/email/webmail/.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s \
    --start-period=60s --retries=3 \
    CMD node -e "require('http').get(\
    'http://127.0.0.1:3000/emailclient',\
    r=>process.exit(r.statusCode<400?0:1)\
    ).on('error',()=>process.exit(1))"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/services/email/webmail
CMD ["node", "server.js"]
