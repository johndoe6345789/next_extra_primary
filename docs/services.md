# Backend Services (Drogon Daemons)

The Nextra backend is not a single process. One binary
(`backend/nextra-api`) exposes several CLI subcommands in
`backend/src/commands/`, and docker-compose runs each subcommand
as its own long-lived container. They all share the same
PostgreSQL database and Drogon config file (`backend/config/config.json`).

This page documents every daemon currently defined under
`backend/src/commands/`. The entry point for all of them is
`backend/src/main.cpp`, which dispatches a CLI11 subcommand.

---

## backend (`serve`)

- **CLI**: `./nextra-api serve --port 8080`
- **Source**: `backend/src/commands/serve.cpp`
- **Compose service**: `backend`
- **Port**: `8080`
- **Purpose**: Main HTTP API. Mounts every Drogon
  controller under `backend/src/controllers/` (auth, users,
  gamification, notifications, chat, email, admin, jobs, cron).
- **Key env vars**: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
  `DB_PASSWORD`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `APP_BASE_URL`,
  `ES_HOST`, `ES_PORT`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.
- **Config**: `backend/config/config.json` (Drogon listener,
  DB client pool, log level).

---

## job-scheduler (`job-scheduler`)

- **CLI**: `./nextra-api job-scheduler --config config/config.json`
- **Source**: `backend/src/commands/job_scheduler.cpp`
- **Compose service**: `job-scheduler`
- **Purpose**: Durable background worker pool. Drains the
  `job_queue` table using `SELECT ... FOR UPDATE SKIP LOCKED`,
  runs each claimed job via a handler registered in
  `backend/src/services/JobRegistry.cpp`, writes a
  `job_runs` row, retries with exponential backoff, and
  moves exhausted rows to `job_dead_letter`.
- **Key files**:
  - `backend/src/services/JobScheduler.{h,cpp}` — worker pool.
  - `backend/src/services/JobQueue.{h,cpp}` — repository over
    `job_queue`, `job_runs`, `job_dead_letter`.
  - `backend/src/services/JobWorker.{h,cpp}` — single-worker loop.
  - `backend/src/services/JobBackoff.{h,cpp}` — retry timing.
  - `backend/src/services/JobRegistry.{h,cpp}` — handler lookup.
- **Config file**: `backend/src/constants/job-scheduler.json`.
  Tunables: `workers`, `pollIntervalMs`, `defaultMaxAttempts`,
  `defaultBackoff`, `backoffBaseMs`, `backoffMaxMs`,
  `lockTimeoutSeconds`, `recoveryTickSeconds`,
  `gracefulShutdownSeconds`, `deadLetterRetentionDays`,
  `runHistoryRetentionDays`, `workerIdPrefix`.
- **Migration**: `backend/migrations/012_job_scheduler.sql`.
- **HTTP surface**: `JobController` is still linked into the
  `backend` daemon so the operator UI can read/write the queue.
  See `docs/jobs.md` for the REST endpoints.

---

## cron-manager (`cron-manager`)

- **CLI**: `./nextra-api cron-manager --config config/config.json`
- **Source**: `backend/src/commands/cron_manager.cpp`
- **Compose service**: `cron-manager`
- **Purpose**: Evaluates rows in `scheduled_jobs`, and whenever
  a schedule is due, enqueues a fresh `job_queue` row pointing
  at the same handler. It does NOT execute the work itself —
  execution is the job-scheduler's responsibility.
- **Key files**:
  - `backend/src/services/cron/CronManager.{h,cpp}` — tick loop.
  - `backend/src/services/cron/CronExpression.h` — Vixie parser.
  - `backend/src/services/cron/cron_expression_parse.cpp`
  - `backend/src/services/cron/cron_expression_next.cpp`
  - `backend/src/services/cron/cron_manager_tick.cpp`
  - `backend/src/services/cron/cron_manager_seeds.cpp`
- **Config file**: `backend/src/constants/cron-manager.json`.
  Tunables: `tickIntervalSeconds`, `gracefulShutdownSeconds`,
  `dueSlackSeconds`, plus the `seedSchedules` array of
  `{name, cron, handler, description}` objects that are upserted
  into `scheduled_jobs` at daemon boot.
- **Migration**: `backend/migrations/012_job_scheduler.sql`.
- **HTTP surface**: `CronController` (see
  `backend/src/controllers/CronController.h`) is linked into
  `backend` for CRUD, preview, and force-tick actions. Force
  tick reaches into the live daemon via a module-local global
  (`nextra::cron::g_cronManager`).

---

## migrate (`migrate`)

- **CLI**: `./nextra-api migrate --up` or `--down`
- **Source**: `backend/src/commands/migrate.cpp`
- **Purpose**: One-shot (not a daemon). Applies SQL files from
  `backend/migrations/` in order, tracked via a schema version
  table. Invoked at first boot or on schema changes.
- **Services**: `MigrationRunner`, `MigrationApplier`,
  `MigrationStateStore`, `MigrationRollback`,
  `MigrationStatusQuery`, `MigrationFileUtils`.

---

## seed (`seed`) / serve-advice (`serve-advice`) / create-admin

- **seed** — one-shot. Loads `backend/seed/*.json` into the
  `badges`, `notifications`, `users`, etc. tables.
  Source: `backend/src/commands/seed.cpp`.
- **serve-advice** — diagnostic helper that prints the current
  effective config resolved from env + JSON.
  Source: `backend/src/commands/serve_advice.cpp`.
- **create-admin** — interactive bootstrap to create the first
  admin user when the database is empty.
  Source: `backend/src/commands/create_admin.cpp`.

---

## Adding a new daemon

See `docs/adding-a-daemon.md` for a step-by-step walkthrough
based on the existing `cron-manager`.
