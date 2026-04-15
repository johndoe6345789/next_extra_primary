# Frontend Tools

Nextra ships several small Next.js apps under `tools/`. Each one
is an independent Next.js project with its own `package.json`,
`next.config.ts`, and Dockerfile. They are reverse-proxied into
the unified portal by nginx (`docker/nginx/nginx.conf`) so that
from the browser's perspective there is a single origin
(`http://localhost:8889`).

Every tool (except the SSO portal itself) sits behind the
nginx `auth_request /_sso_validate` gate, which calls
`/api/auth/validate` on the backend; an unauthenticated request
is redirected to `/sso/login?next=<original-url>`.

---

## sso — `/sso`

- **Path**: `tools/sso/`
- **Next `basePath`**: `/sso`
- **Nginx**: public (no gate — this IS the gate)
- **Purpose**: Login / logout / token exchange. The form submits
  to `/api/auth/login`, receives a JWT pair, writes them to the
  `nextra_sso` cookie, and redirects back to the `next` param.
- **Compose service**: `sso` (port 3099 for direct access)

---

## emailclient — `/emailclient`

- **Path**: `tools/emailclient/`
- **Next `basePath`**: `/emailclient`
- **Nginx**: SSO gated
- **Purpose**: Real webmail for the in-stack mail server
  (Postfix + Dovecot via `mailserver` compose service). Talks
  to a Flask API (`emailclient-api` service) which uses IMAP
  and SMTP against the real Dovecot/Postfix containers. Mail
  metadata is persisted in its own `emailclient-db` Postgres.
- **Compose services**: `emailclient`, `emailclient-api`,
  `emailclient-db`, `mailserver`.

---

## alerts — `/alerts`

- **Path**: `tools/alerts/`
- **Next `basePath`**: `/alerts`
- **Nginx**: SSO gated
- **Purpose**: System alerts centre — aggregates notification
  events, job dead-letter entries, failed webhook deliveries,
  and inbound email alerts into a single operator dashboard.
- **Compose service**: `alerts` (port 8999 for direct access)

---

## jobs — `/jobs`

- **Path**: `tools/jobs/`
- **Next `basePath`**: `/jobs`
- **Nginx**: SSO gated
- **Purpose**: Operator dashboard for the job-scheduler daemon.
  Lists pending + running queue rows, run history, dead-letter
  entries, and exposes the ad-hoc enqueue form. All data comes
  from the `/api/jobs/*` REST endpoints — see `docs/jobs.md`.
- **Compose service**: `jobs`

---

## cron — `/cron`

- **Path**: `tools/cron/`
- **Next `basePath`**: `/cron`
- **Nginx**: SSO gated
- **Purpose**: CRUD over `scheduled_jobs` and a cron-expression
  preview ("next N fire times"). The form-tick button calls the
  cron-manager via `CronController` and is useful when
  developing handlers locally.
- **Compose service**: `cron`

---

## packagerepo — `/repo`

- **Path**: `tools/packagerepo/` (Flask backend)
  and `tools/packagerepo/frontend/` (Next.js frontend)
- **Next `basePath`**: `/repo`
- **Nginx**: SSO gated for the UI. The raw package API is
  unguarded at `/v1/`, `/auth/`, `/admin/` so that build tools
  (Conan, npm) can authenticate with their own tokens.
- **Purpose**: Self-hosted package repository for Conan / npm
  artifacts. Backed by S3 object storage (`s3` service) and its
  own Postgres (`packagerepo-db`).
- **Compose services**: `packagerepo-backend`, `packagerepo-frontend`.

---

## s3server — `/s3`

- **Path**: `tools/s3server/` (C++ backend)
  and `tools/s3server/frontend/` (Next.js frontend)
- **Next `basePath`**: `/s3`
- **Nginx**: SSO gated for the UI. Raw S3 API routes live under
  `/api/s3/*` and `/s3-api/*`.
- **Purpose**: S3-compatible object store for local development
  and fully air-gapped builds. Used by packagerepo and by the
  offline-preload flow.
- **Compose services**: `s3`, `s3-frontend`, `s3-db`.

---

## pgadmin — `/db`

- **Path**: `tools/pgadmin/` (C++ backend)
  and `tools/pgadmin/frontend/` (Next.js frontend)
- **Next `basePath`**: `/db`
- **Nginx**: SSO gated for the UI. Backend API routes at
  `/api/db/*` and `/api/pgadmin/*`.
- **Purpose**: Lightweight PostgreSQL admin panel for the main
  `nextra_db`. Supports query execution, schema browsing, and
  row inspection.
- **Compose services**: `pgadmin-backend`, `pgadmin-frontend`.

---

## Not in the portal

`tools/manager/` is the C++ developer CLI — it is not an app,
it is the project's automation binary. `tools/componentviewer/`
and `tools/apidocs/` are static-asset tools served directly by
nginx where applicable.

---

## Adding a new tool

See `docs/adding-a-tool.md` for a walkthrough based on the
existing `tools/cron/`.
