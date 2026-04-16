# Adding a New Frontend Tool

Operator tools in Nextra are Next.js apps that live as an `admin/`,
`site/`, or `public/` subfolder inside their owning domain under
`services/<domain>/`. Nginx reverse-proxies them into the unified
portal on port 8889.

This guide walks through adding a tool called `foo` mounted at
`/foo`. Use `services/cron/admin/` as the concrete reference.

---

## 1. Scaffold the Next.js app

```
services/foo/
  admin/            # or site/ or public/ — see below
    package.json
    next.config.ts
    tsconfig.json
    Dockerfile
    src/
      app/
        layout.tsx
        page.tsx
        globals.scss
  constants.json
  README.md
```

**Audience labels:**

- `admin/` — SSO-gated operator UI (default for dashboards).
- `site/` — SSO-gated end-user UI (authenticated users).
- `public/` — unauthenticated, no SSO gate.

Pin the same Next / React / MUI versions as the other tools
(copy `services/cron/admin/package.json`). Apps may import from
`shared/` — the Docker build brings that tree in via
`additional_contexts`.

---

## 2. next.config.ts with basePath

```ts
// services/foo/admin/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/foo',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}
export default nextConfig
```

`output: 'standalone'` is required. The `basePath` must match the
nginx location and the `NEXT_BASE_PATH` build arg exactly.

---

## 3. Dockerfile

Copy `services/cron/admin/Dockerfile`. It must:

1. Accept `NEXT_BASE_PATH` as a build arg.
2. Run `npm ci && npm run build`.
3. Copy `.next/standalone/`, `.next/static/`, and `public/` to
   a `node:20-slim` runtime image.
4. Expose port 3000 and run `node server.js`.

The `additional_contexts` in the compose service wires `shared/`
into the build at depth `../../../shared` relative to the tool.

---

## 4. docker-compose service

```yaml
foo:
  build:
    context: ./services/foo/admin
    dockerfile: Dockerfile
    additional_contexts:
      shared: ./shared
    args:
      NEXT_BASE_PATH: /foo
  depends_on:
    - backend
  environment:
    NEXT_PUBLIC_BASE_PATH: /foo
    BACKEND_URL: http://backend:8080
  restart: unless-stopped
```

Add `foo` to the `depends_on` list of the `portal` service so
nginx does not start before the upstream is reachable.

---

## 5. Nginx location with SSO auth_request

Edit `docker/nginx/nginx.conf`. For an SSO-gated tool:

```nginx
location /foo {
    auth_request /_sso_validate;
    error_page 401 = @sso_login;
    auth_request_set $sso_user $upstream_http_x_user_id;
    set $foofe http://foo:3000;
    proxy_pass $foofe;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-User-Id $sso_user;
}
```

For a `public/` tool, omit the `auth_request` lines.

---

## 6. Portal link

Add a tile in `docker/nginx/portal/index.html` so the portal
homepage lists the new tool.

---

## 7. Run it

```bash
docker compose up --build --no-deps foo portal
```

Open `http://localhost:8889/foo`. The portal should redirect to
`/sso/login` if not authenticated, then serve the app.

---

## 8. Backend integration

If the tool needs its own backend data, add a controller under
`services/foo/controllers/` rather than a new standalone API.
The Next.js app calls `/api/<route>` via the nginx `/api/`
location already wired to the C++ backend.

---

## 9. Documentation

Add a section to `docs/domains.md` and update `docs/architecture.md`
if a new nginx location block was added.
