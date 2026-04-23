# syntax=docker/dockerfile:1.7
# Email client frontend — dev mode with next dev.
# Contexts: default=services/email/webmail, shared=shared
# Source is baked into the image; named volumes preserve
# node_modules and .next cache across restarts.

FROM node:20-alpine

# Place shared at the path file:../../../shared/* resolves to
COPY --from=shared . /build/shared/

WORKDIR /build/services/email/webmail
COPY package.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --prefer-offline --no-audit --no-fund

# Symlink so bare /build/node_modules also resolves
RUN ln -s \
    /build/services/email/webmail/node_modules \
    /build/node_modules

# Bake source into image
COPY . .

ARG NEXT_BASE_PATH=/emailclient
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s \
    --start-period=60s --retries=3 \
    CMD node -e "require('http').get(\
    'http://127.0.0.1:3000/emailclient',\
    r=>process.exit(r.statusCode<400?0:1)\
    ).on('error',()=>process.exit(1))"

CMD ["npx", "next", "dev", "--turbopack"]
