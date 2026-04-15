# Adding a New Frontend Tool

Nextra's operator tools are small, independent Next.js apps
under `tools/`. This guide walks through adding a new one,
using the existing `tools/cron/` as the worked example. Every
step is already visible in the repo for cron — treat this file
as an annotation of that tool.

Assume you want to add a tool called `foo`, mounted at `/foo`.

---

## 1. Scaffold the Next.js app

```
tools/foo/
├── package.json
├── next.config.ts
├── tsconfig.json
├── Dockerfile
└── src/
    └── app/
        ├── layout.tsx
        ├── page.tsx
        └── globals.scss
```

`package.json` should pin the same Next / React / MUI versions
as the other tools (copy `tools/cron/package.json`). Tools may
import from `shared/` — the Docker build uses a `shared:`
additional context to bring that tree in.

---

## 2. next.config.ts with basePath

The tool must live under a sub-path so that nginx can proxy it
alongside every other tool on port 8889. Copy from
`tools/cron/next.config.ts`:

```ts
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

`output: 'standalone'` is required — the Dockerfile copies the
`.next/standalone/` output into a minimal Node image. The
`basePath` must match the nginx location and the `NEXT_BASE_PATH`
build arg exactly, or client-side routing will 404.

Inside components, use relative asset imports and the Next.js
`<Link>` component. Do not hardcode `/foo/...` in URLs — Next
will prepend the basePath automatically.

---

## 3. Dockerfile

Copy `tools/emailclient/Dockerfile` or any other tool's
Dockerfile. It should:

1. Accept a `NEXT_BASE_PATH` build arg and plumb it into the
   build-time env so `next.config.ts` can pick it up.
2. Run `npm ci` and `npm run build`.
3. Copy `.next/standalone/`, `.next/static/`, and `public/` to
   a `node:20-slim` runtime image.
4. Expose port 3000 and run `node server.js`.

---

## 4. docker-compose service

Add a service block to `docker-compose.yml` alongside the other
tools. Copy from the `cron` service:

```yaml
foo:
  build:
    context: ./tools/foo
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

Add `foo` to the `depends_on` list on the `portal` service so
that nginx does not start before the upstream is reachable.

---

## 5. Nginx location with SSO auth_request

Edit `docker/nginx/nginx.conf` and add a `location /foo` block.
Copy from the `/cron` block — it already does everything you
need:

```nginx
location /foo {
    auth_request /_sso_validate;
    error_page 401 = @sso_login;
    auth_request_set $sso_user
        $upstream_http_x_user_id;
    set $foofe http://foo:3000;
    proxy_pass $foofe;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-User-Id $sso_user;
}
```

The `auth_request /_sso_validate` line is what enforces the SSO
gate — nginx makes a sub-request to the backend, and anything
non-200 redirects to `/sso/login?next=<original>`.
`X-User-Id` is forwarded from the validate response so the tool
can identify the caller without re-verifying the JWT.

---

## 6. Portal link

Add a tile for the new tool in
`docker/nginx/portal/index.html` so the portal homepage lists
it alongside every other tool.

---

## 7. Run it

```bash
docker compose up --build --no-deps foo portal
```

Open `http://localhost:8889/foo` — the portal should bounce you
through `/sso/login` if you aren't already authenticated, then
serve the Next.js app. Assets and client navigation should all
stay under `/foo/...`.

---

## 8. Optional: backend integration

If the tool needs its own backend data, prefer adding a
controller under `backend/src/controllers/` rather than a new
Flask or Node API. The existing `JobController` and
`CronController` are good templates. Your Next.js app can then
call `/api/<whatever>` via the nginx `/api/` location which is
already plumbed to the C++ backend.

---

## 9. Documentation

Add a section to `docs/tools.md` with the path, basePath, SSO
state, purpose, and the compose service name. This page is how
future contributors discover that your tool exists.
