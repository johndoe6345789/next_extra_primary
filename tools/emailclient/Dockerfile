# Email client frontend — self-contained build.
# Context: tools/emailclient/

# -- Stage 1: deps ------------------------------------------
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps

# -- Stage 2: build -----------------------------------------
FROM deps AS build
ARG NEXT_BASE_PATH=/emailclient
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
RUN npm run build

# -- Stage 3: runner ----------------------------------------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=build --chown=nextjs:nodejs \
    /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs \
    /app/.next/static ./app/.next/static
COPY --from=build --chown=nextjs:nodejs \
    /app/public ./app/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/app
HEALTHCHECK --interval=15s --timeout=5s \
    --start-period=60s --retries=3 \
    CMD node -e "require('http').get(\
    'http://127.0.0.1:3000/emailclient',\
    r=>process.exit(r.statusCode<400?0:1)\
    ).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
