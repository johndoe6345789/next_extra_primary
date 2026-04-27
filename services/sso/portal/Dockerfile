# syntax=docker/dockerfile:1.7
# Dev-mode Next.js — source baked in, next dev runs on start.
# Named volumes preserve node_modules + .next across restarts.


FROM node:20-alpine
ARG NPM_REGISTRY=http://host.docker.internal:4873
ENV NPM_CONFIG_REGISTRY=$NPM_REGISTRY

WORKDIR /build/sso
COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --prefer-offline --no-audit --no-fund

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY . .

EXPOSE 3000
CMD ["npx", "next", "dev", "--turbopack"]
