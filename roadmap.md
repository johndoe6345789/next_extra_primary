# ROADMAP — `next_extra_primary`

> **This repo is a GitHub template.** A consumer clicks "Use this
> template", clones, runs `docker compose up`, and gets a working
> **batteries-included Next.js stack** — backend, database, SSO,
> email, S3, package repo, alerts, chat, and everything listed below
> already wired together. Their job is to build their Next.js site in
> `frontend/`. Everything else is inherited infrastructure.
>
> **Every character is a feature.** Nothing gets deleted to fix bugs.
> Features get finished, not stripped.

---

## 0. How to use this playbook

**This file is operational, not aspirational.** Any session — human
or AI — opens this file first and uses it to decide what to do next.

**Start of every session:**
1. Read section 8 (Current progress) to see what's already on disk.
2. Read section 7 (Execution approach) to find the next committed
   step in the session order.
3. Skim section 6 (Design decisions log) for any decision that
   constrains the work.
4. Check section 9 (Open questions) — if the next step hits an
   unanswered question, surface it to the user before coding.
5. Begin the next step.

**End of every session:**
1. Update section 8 (Current progress) with the files that landed.
2. If a design decision was made, append it to section 6.
3. If an open question was resolved, move its answer into the
   relevant section and delete the row from section 9.
4. If the user added a new feature, add a row to the appropriate
   phase in section 5 and map it in section 10 if it touches
   existing v1.x scope.

**When in doubt, prefer making this file more specific.** Vague
entries ("designed", "pending") are acceptable only for work more
than two sessions away. Anything coming up next session should be
concrete enough to execute without re-planning.

**What lives here vs in memory vs in CLAUDE.md:**
- **ROADMAP.md (this file)** — the plan: what, why, in what order.
- **CLAUDE.md** — coding conventions that apply to every change.
- **`.claude/.../memory/`** — persistent facts about the user, the
  project state, and feedback on how to collaborate. Memory is
  loaded into every session automatically; ROADMAP must be opened
  explicitly.

---

## 1. Template value proposition

A single `git clone` + `docker compose up` gives the consumer:

- **Drogon C++ backend** with auth, gamification, AI chat, comments,
  email (real IMAP/SMTP), admin tools, JWT with refresh/blocklist.
- **Postgres 16** via Drogon ORM, migrations, seed data.
- **Next.js 16 frontend** (App Router, TS strict, MUI v6, next-intl
  across 8 locales, RTK Query, shared M3 component library).
- **Nginx portal on :8889** that stitches ~10 separate Next.js apps
  into one unified product via shared chrome
  (`shared/components/m3/feedback/AppHeaderActions`).
- **Pre-wired tooling**: `tools/manager` (C++ CLI), `tools/packagerepo`
  (npm/pypi-style), `tools/s3server` (S3-compatible), `tools/sso`,
  `tools/alerts`, `tools/apidocs`, `tools/componentviewer`,
  `tools/emailclient`, `tools/pgadmin`.
- **Playwright JSON DSL** for E2E tests auto-discovered from
  `shared/packages/<name>/playwright/tests.json`.

Every new daemon added below **composes** with the existing batteries
— reuses users, SSO, audit, jobs, notifications, s3, search, chat —
so adding feature N+1 gets cheaper, not more expensive.

---

## 2. Already shipped (v1.0 foundation)

These ship today in the template. Every later feature builds on them.

### Authentication
- Email/password registration with email confirmation.
- Login with JWT access + refresh tokens.
- Password reset via email link.
- Token blocklist for secure logout.
- Role-based access (user, admin, guest).
- Impersonation (admin acting-as user) — will be hardened in 2.2.

### Gamification
- Points: login (+10), chat (+5), badge (+50).
- Level progression with configurable thresholds.
- Badges: Early Adopter, Streak Master, Chatterbox, Night Owl, more.
- Daily login streaks with streak-break recovery window.
- Leaderboard (weekly, monthly, all-time).

### AI Chat
- Chat with Claude (Anthropic) and OpenAI models.
- Provider toggle in the UI.
- Chat history stored with pagination.
- Token usage tracking per message.

### Notifications (v1 — polling based)
- In-app inbox with unread count badge.
- Types: badge earned, level up, streak, system.
- Mark as read (individual + bulk).
- 30-second polling. Replaced by real-time bus in X4.

### Internationalization
- 8 locales shipped (en, es, fr, de, ja, zh, nl, cy).
- next-intl integrated with Next.js 16 proxy pattern.
- Locale switcher in navigation.
- All user-facing strings externalized. Being migrated from JSON
  files to Postgres tables via API.

### Theming
- MUI colorSchemes API (no flash of wrong theme).
- System preference detection.
- Manual toggle with localStorage persistence.
- All components respect the active color scheme.

### Email
- Real IMAP/SMTP webmail in `tools/emailclient/`.
- Admin test-email tool in main dashboard.
- Postfix + Dovecot containers with TLS (regenerated at first boot).

### Tooling
- Multi-stage Docker builds for every service.
- Docker Compose for local dev and production.
- CapRover deployment configuration.
- C++ project manager CLI tool (no shell scripts).

---

## 3. Confirmed infrastructure stack

The template ships with a fixed, opinionated infra stack. Every new
daemon composes with these — adding a new sidecar requires an
explicit decision log entry.

| Role        | Technology       | Role in the template                          |
|-------------|------------------|------------------------------------------------|
| Database    | **Postgres 16**  | Relational persistence; Drogon ORM; migrations |
| Caching     | **Redis**        | Sessions, rate-limit token buckets, leaderboard cache, ephemeral pub/sub |
| Message bus | **Kafka**        | Cross-daemon events, audit ingestion, notification fan-out, search index updates, webhook dispatch, X1 WebSocket bus upstream |
| Search      | **Elasticsearch**| Full-text index (config in `elasticsearch.json`); Phase 4.5 search daemon wraps it; kept warm via a Kafka consumer |
| RTMP ingest | **mediamtx**     | Live stream ingest sidecar for Phase 4.1      |
| PDF render  | **Gotenberg**    | HTML → PDF sidecar for Phase 6.2              |
| Object store| `tools/s3server` | S3-compatible object store (already shipped) |
| Mail        | Postfix + Dovecot| Real SMTP/IMAP (already shipped)              |

**Which transport for what?**

- **Durable work queue (job scheduler)** → Postgres `SELECT FOR UPDATE SKIP LOCKED`. Not Kafka. The job scheduler is a classic work-queue pattern and Postgres is the right tool.
- **Cross-daemon events (audit, notifications, search reindex, webhooks, WS bus)** → **Kafka topics**. Events are append-only, fan-out, durable. This supersedes the earlier decision to use Postgres LISTEN/NOTIFY for audit ingestion.
- **Ephemeral state (sessions, rate-limit counters, leaderboard, presence)** → Redis.
- **Source-of-truth relational state** → Postgres.

Jobs and events are complementary: a job completes → publishes an
event → other daemons consume and possibly enqueue their own jobs.

---

## 4. Architecture patterns (guiding rules)

### The composition rule

Every daemon must compose with **at least two existing batteries**,
or it doesn't belong in the template. Isolated islands bloat
maintenance without strengthening the product. This is the primary
filter for whether a proposal ships.

### The job scheduler is the backbone

`backend/migrations/012_job_scheduler.sql` defines `scheduled_jobs` +
`job_queue` + `job_runs` + `job_dead_letter`. **Every later daemon
dispatches its background work through this scheduler** instead of
rolling its own cron:

| Daemon           | Uses jobs for                         |
|------------------|---------------------------------------|
| Audit            | partition prune, s3 archive           |
| Search           | reindex (hourly)                      |
| Backup           | daily Postgres + s3 snapshot          |
| Notifications    | daily digest, retry failed deliveries |
| Livestream       | orphan recording cleanup              |
| Video reencoder  | per-upload transcode                  |
| Image processor  | per-upload resize/optimize            |
| Webhooks         | retry with exponential backoff        |
| Blog             | scheduled publish, unpublish          |
| Ecommerce        | abandoned-cart email, stock alerts    |

Workers use Postgres `SELECT ... FOR UPDATE SKIP LOCKED` for
multi-worker safety. Handlers register at startup via `JobRegistry`.

### Build vs integrate

Not everything is written from scratch. The template teaches *both*
patterns:

| Capability          | Decision                    | Rationale                       |
|---------------------|-----------------------------|---------------------------------|
| Database            | **Integrate** Postgres 16   | already core                    |
| Cache / sessions    | **Integrate** Redis         | ephemeral hot data              |
| Message bus         | **Integrate** Kafka (KRaft) | durable fan-out event transport |
| Search engine       | **Integrate** Elasticsearch | already in `elasticsearch.json` |
| Job scheduler       | Build (Drogon+PG)           | durable work queue belongs in PG|
| Audit log           | Build (Drogon+PG+Kafka+s3)  | composes everything             |
| Notification router | Build (Drogon+Kafka)        | Kafka consumer per channel      |
| Live RTMP ingest    | **Integrate** mediamtx      | don't reinvent RTMP parser      |
| Video reencoding    | **Integrate** ffmpeg child  | orchestrate child processes     |
| Image processing    | **Integrate** libvips       | fastest, small C++ binding      |
| Comments / forum    | Build                       | needs polymorphic composition   |
| Blog                | Build                       | composes comments+votes+search  |
| Ecommerce           | Build minimal + Stripe      | reference pattern               |
| PDF generator       | **Integrate** Gotenberg     | sidecar, don't embed            |
| Backup              | **Integrate** WAL-G         | battle-tested                   |
| Rate limiter        | Build over **Redis**        | token buckets                   |

### Hash-chained audit with retention

`audit_log` is PARTITIONed by month. Janitor job drops partitions
older than `retentionDays` (configurable, default 365). Before drop,
partition is serialized to `s3://audit-archive/YYYY/MM.jsonl.gz` and
a checkpoint row is written to `audit_checkpoints` (never pruned).
Integrity verifier walks the hash chain between checkpoints.

### Every sensitive action is auditable

A Drogon filter emits a generic access event for every authenticated
request. Explicit `audit::log(...)` calls inside controllers add
semantically rich events (impersonation start/stop, password reset,
admin email read, stream start, product purchase, blog publish, etc.).

---

## 5. Phased roadmap

### Phase 0 — Infrastructure bootstrap (prerequisite for everything)

| ID   | Feature                                                     | Status  |
|------|-------------------------------------------------------------|---------|
| 0.1  | Add Kafka (KRaft mode, no Zookeeper) to `docker-compose.yml`| pending |
| 0.2  | Add Redis to `docker-compose.yml`                           | pending |
| 0.3  | Add Elasticsearch service (config already exists)           | pending |
| 0.4  | Drogon client wiring: `KafkaProducer`, `KafkaConsumer`, `RedisClient`, `EsClient` in `backend/src/services/infra/` | pending |
| 0.5  | Constants JSON: `kafka-topics.json`, `redis.json`, extend `elasticsearch.json` | pending |
| 0.6  | Health checks for all three in `/healthz`                   | pending |
| 0.7  | Playwright infra smoke test: all three sidecars reachable from the backend container | pending |

### Phase 1 — Foundations (every later feature depends on these)

| ID   | Feature                            | Tool                    | Status       |
|------|------------------------------------|-------------------------|--------------|
| 1.1  | Job scheduler daemon               | `tools/jobs/`           | IN PROGRESS — 9 files landed, ~15 + tool still needed |
| 1.2  | Audit log daemon (Kafka `audit.events` consumer + partitioned PG log + chain + s3 archive) | `tools/audit/` | designed |
| 1.3  | Notification router daemon (Kafka consumer per channel: email/in-app/push/SMS) | `tools/notifications/` | designed |

### Phase 2 — Security hardening (uses 1.2 audit + 1.3 notifications)

| ID   | Feature                                                       |
|------|---------------------------------------------------------------|
| 2.1  | Fix `CookieAuthFilter` — reject refresh tokens for API auth   |
| 2.2  | Fix `ImpersonateController` — DB-backed session, drop dup cookie|
| 2.3  | Fix detached threads in `AdminEmailController`, `ImapSyncService`|
| 2.4  | Fix `messages.py` tenant spoofing — wire to SSO               |
| 2.5  | Passkeys (WebAuthn) in `AuthController` + `/settings/security`|
| 2.6  | TOTP 2FA in `AuthController` + `/settings/security`           |
| 2.7  | OAuth social providers (merges v1.3 Google + GitHub + Apple)  |

### Phase 3 — Content primitives

| ID   | Feature                                                     | Tool              |
|------|-------------------------------------------------------------|-------------------|
| 3.1  | Comments / forum daemon (polymorphic, threaded, boards → threads → posts, moderation) | `tools/comments/` |
| 3.2  | Polling / voting daemon (up/down votes + polls + surveys)   | `tools/polls/`    |

The comments daemon handles both: blog comments (shallow) AND forum
threads/posts via the same polymorphic table. A board is a
`resource_type = 'forum_board'`; a thread is a comment on a board;
a post is a comment on a thread. Same table, same API, same moderation.

### Phase 4 — Media, content, and search

| ID   | Feature                                                      | Tool              |
|------|--------------------------------------------------------------|-------------------|
| 4.1  | Media streaming daemon (Drogon control + mediamtx ingest + HLS + recording to s3) | `tools/livestream/` |
| 4.2  | Video reencoding daemon (ffmpeg, HLS/DASH, adaptive bitrate, thumbnails) | `tools/media/` |
| 4.3  | Image processor daemon (libvips, avatars, thumbnails, EXIF strip) | shared          |
| 4.4  | Gallery / photo album daemon                                 | `tools/gallery/`  |
| 4.5  | Search daemon (wraps Elasticsearch, reindex job)             | `tools/search/`   |
| 4.6  | Article / blog daemon (drafts, revisions, scheduled publish) | `tools/blog/`     |

### Phase 5 — Commerce and operations

| ID   | Feature                                                     | Tool              |
|------|-------------------------------------------------------------|-------------------|
| 5.1  | Ecommerce daemon (products, cart, checkout, orders, stock) + Stripe webhook reference | `tools/shop/` |
| 5.2  | Webhook dispatcher daemon (outbound, retry, replay, signed) | `tools/webhooks/` |
| 5.3  | Feature flags daemon (runtime toggles, targeting, A/B)      | `tools/flags/`    |
| 5.4  | Rate limiter middleware (Redis token bucket) — replaces backlog "API rate limiting dashboard" | filter only |
| 5.5  | Backup daemon (WAL-G or pg_dump + s3 snapshots, restore UI) | `tools/backups/`  |
| 5.6  | Status page tool (health-check contract every daemon implements) | `tools/status/` |

### Phase 6 — Late content

| ID   | Feature                                                     | Tool              |
|------|-------------------------------------------------------------|-------------------|
| 6.1  | Wiki daemon (markdown, history, comments, search)           | `tools/wiki/`     |
| 6.2  | PDF generator daemon (Gotenberg sidecar; invoices, reports, chat export from backlog) | integrates Gotenberg |
| 6.3  | Admin analytics dashboard (merges v1.2 analytics + system health) | `tools/admin-analytics/` |

### Phase 7 — Social and multiplayer (replaces v2.0 block)

| ID   | Feature                                                      |
|------|--------------------------------------------------------------|
| 7.1  | Teams: create/join teams with shared leaderboards            |
| 7.2  | Challenges: timed team challenges with bonus points          |
| 7.3  | Direct messaging: user-to-user chat alongside AI chat        |
| 7.4  | Activity feed: social feed of badge/level events from followed users |
| 7.5  | Team achievements requiring group coordination               |
| 7.6  | Tournament mode: periodic competitive events with badges     |

### Phase 8 — Polish and primetime

| ID   | Feature                                                      |
|------|--------------------------------------------------------------|
| 8.1  | Fix existing frontend issues (AlertsBell nav, useEmailClient no-ops, AlertList raw elements, alert fetch error swallowing) |
| 8.2  | Split oversized files under the 100-LOC limit                |
| 8.3  | Primetime test suite (every Next.js app × 3 phases: boot smoke, shared chrome contract, signature feature flow) |
| 8.4  | Docs pass (README, CLAUDE.md, per-daemon design docs, "Use this template" onboarding) |
| 8.5  | Mobile PWA support (merges v1.4: service worker, install prompt, offline chat cache, responsive redesign) |
| 8.6  | Kubernetes Helm chart (from backlog)                         |

### Cross-cutting features (applied across phases)

| ID  | Feature                                                       |
|-----|---------------------------------------------------------------|
| X1  | Unified WebSocket event bus (replaces v1.1 WS notifications, chat streaming, online presence, typing indicators) |
| X2  | GraphQL gateway as alternative to REST (from backlog)         |
| X3  | Redis caching layer (leaderboard, sessions, rate-limit buckets, from backlog) |
| X4  | CSP + security headers middleware                             |
| X5  | Health check protocol every daemon implements                 |
| X6  | Plugin system for third-party gamification rules (from backlog)|
| X7  | Custom badge creation admin feature (from backlog)            |

---

## 6. Design decisions log

Decisions that have been made and should **not** be re-litigated
without cause:

| #   | Decision                                                           |
|-----|--------------------------------------------------------------------|
| D0  | Infra stack = Postgres + Redis + Kafka + Elasticsearch + mediamtx + Gotenberg (user-confirmed 2026-04-15) |
| D1  | Job scheduler uses Postgres SKIP LOCKED — durable work queue is PG's job, not Kafka's |
| D2  | Audit transport = **Kafka topic `audit.events`** (supersedes original PG LISTEN/NOTIFY plan after stack confirmation) |
| D3  | Audit daemon runs as separate container with INSERT-only DB user   |
| D4  | Audit tamper-evidence = hash chain + daily Merkle root             |
| D5  | Audit retention = configurable, partition-by-month drop            |
| D6  | Audit old partitions archived to s3server before drop              |
| D7  | Impersonation = DB-backed session table with full audit trail, NOT stateless `act` claim, NOT duplicate refresh cookie |
| D8  | Live streaming = Drogon control plane + mediamtx sidecar (not native RTMP in C++) |
| D9  | Video reencoding = Drogon supervises ffmpeg child processes        |
| D10 | Search = Drogon wraps Elasticsearch (already in `elasticsearch.json`)|
| D11 | PDF generator = Gotenberg sidecar, not embedded renderer           |
| D12 | Comments daemon is polymorphic (`resource_type` + `resource_id`) and handles forum (boards/threads/posts) via the same table |
| D13 | Polling daemon handles votes (up/down) AND polls (single/multi/ranked) in one schema |
| D14 | Every daemon's background work goes through the job scheduler (no per-daemon cron) |
| D15 | Notification router has a single API; channels (email, in-app, push, SMS) are pluggable backends |
| D16 | Feature flags = simple key/value with JSON targeting rules (no Unleash/GrowthBook) |
| D17 | Rate limiter backed by Redis (first external sidecar needed beyond mediamtx + Gotenberg) |

---

## 7. Execution approach

Given the scope (~400 files of new code across 20+ features), the
template is built **depth-first per daemon, in dependency order**.
No breadth-first skeleton passes — every session ships a working,
committable slice.

### Committed session order

1. **Finish Phase 1.1 (Job Scheduler) depth-first.** Pure Postgres,
   no Kafka/Redis/ES dependency — it can be completed and committed
   before the infra bootstrap. Remaining: `JobQueue.cpp`, `JobWorker.h/.cpp`,
   `JobCron.h/.cpp`, `JobScheduler.cpp`, `JobController.h/.cpp`, main.cpp
   subcommand wiring, docker-compose service, `tools/jobs/` frontend.
2. **Phase 0 infra bootstrap.** Add Kafka (KRaft mode), Redis, and
   Elasticsearch to `docker-compose.yml`; write Drogon client wrappers
   in `backend/src/services/infra/`; add constants JSON; wire `/healthz`.
   This unblocks everything from 1.2 onward.
3. **Phase 1.2 Audit daemon.** First real Kafka consumer in the
   template. Every later security fix emits audit events as it lands.
4. **Phase 1.3 Notification router.** Second Kafka consumer; replaces
   the polling notification model shipped in v1.0.
5. **Phase 2 security fixes**, each one emitting audit events via 1.2.
6. **Phase 3 content primitives** (comments/forum, polls/votes).
7. **Phase 4 media and content** (livestream, video reenc, image,
   gallery, search, blog).
8. **Phase 5 commerce and ops** (ecommerce, webhooks, flags, rate
   limit, backup, status).
9. **Phase 6 late content** (wiki, PDF, admin analytics).
10. **Phase 7 social/multiplayer** (teams, DMs, activity feed, etc).
11. **Phase 8 polish** (frontend fixes, 100-LOC splits, test suite,
    docs, PWA, Helm chart).

### Locked stack-version choices

- **Kafka**: 3.7+ in **KRaft mode** (no Zookeeper). Single broker in
  dev, 3-broker cluster template in the Helm chart at Phase 8.6.
- **Redis**: 7.x single instance in dev compose; cluster-ready
  connection config so consumers can swap in a managed Redis (ElastiCache,
  Upstash, etc.) with one env var change.
- **Elasticsearch**: 8.x single node, security disabled in dev (per
  the existing `elasticsearch.json` defaults), HTTPS + API keys enabled
  in the Helm chart.
- **mediamtx**: latest stable; exposes RTMP :1935, HLS :8888, WHIP :8889
  (non-colliding with nginx portal by being on the internal network only).
- **Gotenberg**: 8.x; reachable only on the internal docker network.

### Session pacing

**This is multi-session work.** Expect ~15–25 conversation sessions
to reach primetime. Each session leaves behind a completed,
committable slice — never a half-done middle ground.

---

## 8. Current progress

### Files on disk (Phase 1.1 — Job Scheduler)

- `backend/migrations/012_job_scheduler.sql`
- `backend/src/constants/job-scheduler.json`
- `backend/src/services/JobTypes.h`
- `backend/src/services/JobRegistry.h`
- `backend/src/services/JobRegistry.cpp`
- `backend/src/services/JobQueue.h`
- `backend/src/services/JobBackoff.h`
- `backend/src/services/JobBackoff.cpp`
- `backend/src/services/JobScheduler.h`

### Still needed for Phase 1.1 to be buildable

- `JobQueue.cpp` — SQL impl of enqueue/claim/complete/fail
- `JobWorker.h/.cpp` — worker loop
- `JobCron.h/.cpp` — cron expression parser + next-run calculator
- `JobScheduler.cpp` — lifecycle (start workers, cron, recovery)
- `JobController.h/.cpp` — REST API (list/trigger/cancel/retry/history)
- `main.cpp` — new `job-scheduler` subcommand
- `CMakeLists.txt` — regenerated via `./manager generate cmake`
- `docker-compose.yml` — new `job-scheduler` service block
- `tools/jobs/` — Next.js tool (~20 files)

### Pre-existing issues (addressed in Phase 2 or 8)

- Impersonation duplicate refresh cookie (Phase 2.2)
- `CookieAuthFilter` missing token-type check (Phase 2.1)
- `messages.py` tenant spoofing (Phase 2.4)
- Detached threads in email controllers (Phase 2.3)
- `useEmailClient` star/read/send handlers are no-ops (Phase 8.1)
- `AlertsBell` uses `window.location.href` for cross-app nav (Phase 8.1)
- `useAlerts` / `useAlertsBell` swallow fetch errors silently (Phase 8.1)
- `AlertList.tsx` uses raw `<a>` / `<div>` instead of M3 (Phase 8.1)
- 7 source files exceed the 100-LOC limit (Phase 8.2)
- Untracked `docker/mail/config/ssl/` and `shared/e2e/playwright-report/` → FIXED (gitignored)

---

## 9. Open questions (answer before implementation reaches them)

| #   | Question                                                              | Default if unanswered    |
|-----|-----------------------------------------------------------------------|--------------------------|
| Q1  | Audit retention default: 30 / 90 / 365 days?                          | 365                      |
| Q2  | Passkeys + 2FA: both required, or user-choice?                        | User-choice, ≥1 required |
| Q3  | Ecommerce: multi-vendor marketplace or single-seller?                 | Single-seller (simpler)  |
| Q4  | Payment integration: reference Stripe only, or abstract over providers?| Stripe reference only   |
| Q5  | Search: reindex on every write (live) or batched by job?              | Batched (6-hourly)       |
| Q6  | Blog comments moderation: auto-approve / manual / reputation-based?   | Auto-approve, reportable |
| Q7  | Livestream recording retention: forever / N days / user-managed?      | 90 days then opt-in      |
| Q8  | Feature flag evaluation: server-side only or client SDK too?          | Both                     |
| Q9  | Execution approach: breadth-first skeleton vs depth-first per daemon? | Breadth-first            |

---

## 10. Historical v1.x → new-plan mapping

Where items from the original v1.0–v2.0 roadmap have moved:

| Original                                    | Now lives in                   |
|---------------------------------------------|--------------------------------|
| v1.1 WebSocket notifications                | X1 unified event bus           |
| v1.1 Chat streaming SSE                     | X1 unified event bus           |
| v1.1 Online presence indicators             | X1 unified event bus           |
| v1.1 Typing indicators                      | X1 unified event bus           |
| v1.2 Admin panel                            | Already exists (AdminUserList) |
| v1.2 User management                        | Already exists                 |
| v1.2 Analytics dashboard                    | Phase 6.3                      |
| v1.2 System health dashboard                | Phase 5.6 + X5                 |
| v1.2 Audit log                              | Phase 1.2 (full daemon)        |
| v1.3 Google / GitHub OAuth                  | Phase 2.7                      |
| v1.3 Account linking                        | Phase 2.7                      |
| v1.3 Profile picture sync                   | Phase 2.7                      |
| v1.4 PWA + service worker                   | Phase 8.5                      |
| v1.4 Push notifications                     | Phase 1.3 (notification router)|
| v1.4 Install prompt                         | Phase 8.5                      |
| v1.4 Offline chat cache                     | Phase 8.5                      |
| v2.0 Teams                                  | Phase 7.1                      |
| v2.0 Challenges                             | Phase 7.2                      |
| v2.0 Direct messaging                       | Phase 7.3                      |
| v2.0 Activity feed                          | Phase 7.4                      |
| v2.0 Achievements                           | Phase 7.5                      |
| v2.0 Tournament mode                        | Phase 7.6                      |
| Backlog: Email digest                       | Phase 1.3                      |
| Backlog: Rate limiting dashboard            | Phase 5.4                      |
| Backlog: Custom badge creation              | X7                             |
| Backlog: PDF chat export                    | Phase 6.2                      |
| Backlog: Plugin system                      | X6                             |
| Backlog: GraphQL layer                      | X2                             |
| Backlog: Redis caching                      | X3                             |
| Backlog: Kubernetes Helm chart              | Phase 8.6                      |
