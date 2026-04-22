# Dev-mode Next.js — source baked in, next dev runs on start.
# Named volumes preserve node_modules + .next across restarts.


FROM node:22-slim

WORKDIR /build/sso
COPY package.json package-lock.json* ./
RUN npm install

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY . .

EXPOSE 3000
CMD ["npx", "next", "dev", "--turbopack"]
