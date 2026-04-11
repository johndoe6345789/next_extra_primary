# SSO portal — standalone Next.js app.
# No shared context needed (zero shared deps).
FROM node:22-slim AS deps
WORKDIR /build/sso
COPY package.json ./
RUN npm install

FROM deps AS build
WORKDIR /build/sso
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
COPY --from=build /build/sso/.next/standalone ./
COPY --from=build /build/sso/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
