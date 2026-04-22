# Dev-mode Next.js — source baked in, next dev runs on start.
# Named volumes preserve node_modules + .next across restarts.
# Contexts: default=<service>, shared=shared

FROM node:22-slim

COPY --from=shared . /build/shared/
WORKDIR /build/tools/flags
COPY package.json package-lock.json* ./
RUN npm install
RUN ln -s \
    /build/tools/flags/node_modules \
    /build/node_modules

ARG NEXT_BASE_PATH=/flags
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY . .

EXPOSE 3000
CMD ["npx", "next", "dev", "--turbopack"]
