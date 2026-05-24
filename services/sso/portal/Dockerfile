# syntax=docker/dockerfile:1.7
# Production Next.js — built at image creation; use Dockerfile.dev for local dev.
# Contexts: default=<service>, shared=shared

FROM node:20-alpine
ARG NPM_REGISTRY=https://registry.npmjs.org
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY

COPY --from=shared . /build/shared/
WORKDIR /build/services/sso/portal
COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --prefer-offline --no-audit --no-fund
RUN ln -s \
    /build/services/sso/portal/node_modules \
    /build/node_modules

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY . .

RUN npx next build --turbopack

EXPOSE 3000
CMD ["npx", "next", "start"]
