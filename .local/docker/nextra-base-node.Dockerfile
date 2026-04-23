# =============================================================
# Base image: nextra Next.js deps (npm cache primed).
# Debian trixie (13) + Node 22. Warms /root/.npm/_cacache
# with every heavy dep used across the monorepo's Next.js
# services so per-service `npm install --prefer-offline`
# becomes a cache-only lookup.
# =============================================================
FROM node:22-trixie-slim

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Synthetic union package.json: every 3rd-party dep that
# any Next.js service in the monorepo imports, pinned
# loosely. Installing these fills the npm download cache
# without us having to keep node_modules around.
WORKDIR /warm
RUN cat > package.json <<'JSON'
{
  "name": "nextra-npm-warmer",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@monaco-editor/react": "^4.7.0",
    "@reduxjs/toolkit": "^2.11.2",
    "react-redux": "^9.2.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "next": "^16.2.4",
    "next-intl": "^4.9.1",
    "sass": "^1.97.1",
    "@types/node": "^25.5.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "typescript": "^5.4.0"
  }
}
JSON
RUN npm install --ignore-scripts --no-audit --no-fund && \
    rm -rf /warm
