# Domain Layout Reference

Nextra uses a domain-sliced monorepo. Every feature lives at
`services/<domain>/`. This document is the definitive reference
for what can go inside each domain directory.

---

## Canonical Subfolders

| Subfolder       | Language    | Purpose                               |
|-----------------|-------------|---------------------------------------|
| `backend/`      | C++         | Service classes, repositories, utils  |
| `controllers/`  | C++         | Drogon HTTP route handlers            |
| `migrations/`   | SQL         | Schema migrations (001+ per domain)   |
| `tests/`        | C++ GTest   | Unit and integration tests            |
| `admin/`        | Next.js     | SSO-gated operator UI                 |
| `site/`         | Next.js     | SSO-gated end-user UI                 |
| `public/`       | Next.js     | Unauthenticated public UI             |
| `e2e/`          | JSON/TS     | Playwright JSON test package          |
| `docs/`         | Markdown    | Domain-specific documentation         |

In addition, each domain may have:

- `constants.json` — all tunables and seed data (never hardcode).
- `README.md` — one-paragraph description of the domain.

Not every domain uses every subfolder — include only what the
domain needs.

---

## Audience Labels

| Subfolder | Who accesses it          | SSO gate |
|-----------|--------------------------|----------|
| `admin/`  | Operators / admins       | Yes      |
| `site/`   | Authenticated end-users  | Yes      |
| `public/` | Unauthenticated visitors | No       |

---

## Per-Domain Migration Numbering

Each domain numbers its migrations independently starting at
`001`. Do not use a global sequence.

```
services/auth/migrations/
  001_auth_schema.sql
  002_add_oauth_providers.sql

services/blog/migrations/
  001_blog_schema.sql
```

The runner applies domains in topological order (see
`docs/migration-dag.md`), so per-domain numbers are safe even
when FK dependencies exist across domains.

---

## Cross-Cutting Domains

These special domains contain no feature logic but provide
infrastructure consumed by all others:

| Domain              | Purpose                                       |
|---------------------|-----------------------------------------------|
| `drogon-host/`      | Drogon app shell, `main.cpp`, `serve`, config |
| `http-filters/`     | JWT / CORS / rate-limit Drogon filters        |
| `orm-models/`       | Drogon ORM generated models                   |
| `infra/`            | Kafka and Redis client shims                  |
| `manager-cli/`      | C++ project automation CLI (CLI11)            |
| `migration-runner/` | Topo-sorted per-domain SQL migrator           |

---

## C++ Include Paths

The CMake include root is `services/`, so headers are included
as:

```cpp
#include "auth/backend/AuthService.h"
#include "job-queue/backend/JobQueue.h"
```

Never use relative `../` paths across domain boundaries.

---

## Frontend Shared Context

Every `admin/`, `site/`, or `public/` Dockerfile pulls in
the `shared/` library via Docker `additional_contexts`:

```yaml
additional_contexts:
  shared: ./shared
```

Inside the Next.js app, import shared components as:

```ts
import { Button } from 'shared/components/m3'
```

---

## Further Reading

- `docs/domain-layout-backend.md` — C++ layout detail
- `docs/domain-layout-frontend.md` — Next.js layout detail
- `docs/migration-dag.md` — migration dependency graph
- `docs/domains.md` — table of all 55+ domains
