# Domain Catalogue

Every domain lives at `services/<domain>/`. The columns below
show which canonical subfolders are present. See
`docs/domain-layout.md` for subfolder definitions.

Legend: B=backend, C=controllers, M=migrations, T=tests,
A=admin UI, S=site UI, P=public UI.

---

## Feature Domains

| Domain             | B | C | M | T | A | S | P | Summary                          |
|--------------------|---|---|---|---|---|---|---|----------------------------------|
| `ai-chat`          | x | x |   |   |   |   |   | AI chat proxy (Claude, OpenAI)   |
| `alerts`           |   |   |   |   | x |   |   | Operator alert centre            |
| `analytics`        | x | x |   |   | x |   |   | Usage and event analytics        |
| `api-documentation`| x |   |   |   |   |   |   | OpenAPI spec serving             |
| `api-keys`         | x | x | x |   |   |   |   | API key management               |
| `audit`            | x | x | x | x | x |   |   | Audit log (via Kafka)            |
| `auth`             | x | x | x | x |   |   |   | Sessions, tokens, OAuth, TOTP    |
| `backup`           | x | x | x |   | x |   |   | Database backup management       |
| `badges`           | x |   |   |   |   |   |   | Badge definitions and criteria   |
| `blog`             | x | x | x | x | x |   |   | Articles, markdown, publishing   |
| `comments`         | x | x | x | x | x |   |   | Threaded comment system          |
| `cron`             | x | x |   |   | x |   |   | Cron expression scheduler        |
| `database`         |   |   |   |   | x |   |   | PostgreSQL admin panel           |
| `design-system`    |   |   |   |   |   |   |   | Shared design tokens (SCSS)      |
| `ecommerce`        | x | x | x | x | x |   |   | Orders, products, payments       |
| `elasticsearch`    | x |   |   |   |   |   |   | Elasticsearch client shim        |
| `email`            | x | x | x |   |   |   |   | SMTP sender and templates        |
| `feature-flags`    | x | x | x | x | x |   |   | Feature toggle management        |
| `gallery`          | x | x | x | x | x |   |   | Photo gallery and album storage  |
| `gamification`     | x | x |   |   |   |   |   | Points, badges, streaks, levels  |
| `i18n`             | x | x | x |   |   |   |   | Translations stored in Postgres  |
| `image`            | x | x | x | x | x |   |   | Image processing (libvips)       |
| `imap-sync`        | x |   |   |   |   |   |   | IMAP sync daemon                 |
| `job-queue`        | x | x | x |   | x |   |   | Durable job queue + scheduler    |
| `leaderboards`     | x |   |   |   |   |   |   | Leaderboard computation          |
| `levels`           | x |   |   |   |   |   |   | XP level thresholds              |
| `notifications`    | x | x | x | x | x |   |   | Notification router + senders    |
| `object-store`     |   |   |   |   |   |   |   | S3-compatible object store       |
| `package-repository`|  |   |   |   |   |   |   | Package repo (Conan/npm)         |
| `pdf`              | x | x | x |   |   |   |   | PDF generation (Gotenberg)       |
| `polls`            | x | x | x | x | x |   |   | Poll store, voting, results      |
| `progress`         | x |   |   |   |   |   |   | User progress tracking           |
| `rate-limit`       | x | x |   | x |   |   |   | Rate-limit storage and rules     |
| `search`           | x | x | x | x | x |   |   | Full-text search (Elasticsearch) |
| `social`           | x | x | x | x | x |   |   | Follows, likes, activity feed    |
| `sso`              |   |   |   |   |   |   |   | SSO login portal                 |
| `status-page`      | x | x | x |   |   |   | x | Public status page               |
| `streaks`          | x |   |   |   |   |   |   | Daily streak tracking            |
| `streaming`        | x | x | x |   | x |   |   | Live video streaming (mediamtx)  |
| `user-lookup`      |   |   |   |   |   |   |   | Username / email lookup          |
| `user-preferences` | x | x | x | x |   |   |   | Per-user settings                |
| `user-profiles`    |   |   |   |   |   |   |   | Public profile pages             |
| `user-search`      |   |   |   |   |   |   |   | User search index                |
| `user-stats`       |   |   |   |   |   |   |   | Aggregated user statistics       |
| `users`            | x | x | x |   |   |   |   | User CRUD, roles, admin          |
| `video`            | x | x | x |   |   |   |   | Video storage and transcoding    |
| `webhooks`         | x | x | x | x | x |   |   | Outbound webhook delivery        |
| `wiki`             | x | x | x | x | x |   |   | Wiki pages, revisions, tree      |
| `xp`               | x |   |   |   |   |   |   | XP award and computation         |

---

## Infrastructure Domains

| Domain              | Purpose                                      |
|---------------------|----------------------------------------------|
| `drogon-host`       | Drogon app shell, `main.cpp`, `serve`, config|
| `http-filters`      | JWT / CORS / rate-limit Drogon filters       |
| `orm-models`        | Drogon ORM generated model files             |
| `infra`             | Kafka and Redis client shims                 |
| `manager-cli`       | C++ project automation CLI                   |
| `migration-runner`  | Topo-sorted per-domain SQL migrator          |

---

## Nginx URL Mapping

| Domain / tool       | Nginx path      | SSO gated |
|---------------------|-----------------|-----------|
| `frontend` (main)   | `/app`          | no (app manages auth) |
| `sso`               | `/sso`          | no        |
| `alerts`            | `/alerts`       | yes       |
| `job-queue` admin   | `/jobs`         | yes       |
| `cron` admin        | `/cron`         | yes       |
| `package-repository`| `/repo`         | yes       |
| `object-store`      | `/s3`           | yes       |
| `database`          | `/db`           | yes       |
| `email` (IMAP UI)   | `/emailclient`  | yes       |
| `status-page`       | `/status`       | no        |

See `docs/adding-a-tool.md` to add a new nginx location.
