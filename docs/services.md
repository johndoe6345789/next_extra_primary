# Backend Services (Drogon Daemons)

The Nextra backend is not a single process. One binary
(`nextra-api`) is built from `services/drogon-host/` and exposes
CLI subcommands defined in
`services/drogon-host/backend/cli_setup_daemons.h`. Docker-compose
runs each subcommand as its own long-lived container. All daemons
share the same PostgreSQL database and Drogon config file
(`services/drogon-host/config/config.json`).

---

## backend (`serve`)

- **CLI**: `./nextra-api serve --port 8080`
- **Source**: `services/drogon-host/backend/commands/serve.cpp`
- **Compose service**: `backend`
- **Port**: `8080`
- **Purpose**: Main HTTP API. Mounts every Drogon controller from
  every domain (`services/<domain>/controllers/`).
- **Key env vars**: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
  `DB_PASSWORD`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `APP_BASE_URL`,
  `ES_HOST`, `ES_PORT`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.
- **Config**: `services/drogon-host/config/config.json`.

---

## job-scheduler (`job-scheduler`)

- **CLI**: `./nextra-api job-scheduler --config config/config.json`
- **Source**: `services/drogon-host/backend/commands/`
- **Compose service**: `job-scheduler`
- **Domain**: `services/job-queue/`
- **Purpose**: Durable background worker pool. Drains the
  `job_queue` table using `SELECT ... FOR UPDATE SKIP LOCKED`,
  runs each claimed job via a handler registered in
  `services/job-queue/backend/JobRegistry.cpp`, writes a
  `job_runs` row, retries with exponential backoff, and
  moves exhausted rows to `job_dead_letter`.
- **Key files**:
  - `services/job-queue/backend/JobScheduler.{h,cpp}`
  - `services/job-queue/backend/JobQueue.{h,cpp}`
  - `services/job-queue/backend/JobWorker.{h,cpp}`
  - `services/job-queue/backend/JobBackoff.{h,cpp}`
  - `services/job-queue/backend/JobRegistry.{h,cpp}`
- **Config**: `services/job-queue/constants.json`.
- **Migration**: `services/job-queue/migrations/`.
- **HTTP surface**: `JobController` in `services/job-queue/controllers/`
  is linked into the `backend` daemon. See `docs/jobs.md`.

---

## cron-manager (`cron-manager`)

- **CLI**: `./nextra-api cron-manager --config config/config.json`
- **Source**: `services/drogon-host/backend/commands/`
- **Compose service**: `cron-manager`
- **Domain**: `services/cron/`
- **Purpose**: Evaluates rows in `scheduled_jobs`; whenever a
  schedule is due, enqueues a `job_queue` row. Does NOT execute
  work itself — that is the job-scheduler's responsibility.
- **Key files**:
  - `services/cron/backend/CronManager.{h,cpp}`
  - `services/cron/backend/CronExpression.h`
  - `services/cron/backend/cron_expression_parse.cpp`
  - `services/cron/backend/cron_expression_next.cpp`
  - `services/cron/backend/cron_manager_tick.cpp`
  - `services/cron/backend/cron_manager_seeds.cpp`
- **Config**: `services/cron/constants.json`.
- **Migration**: `services/job-queue/migrations/` (shared table).
- **HTTP surface**: `CronController` in `services/cron/controllers/`.

---

## migrate (`migrate`)

- **CLI**: `./nextra-api migrate --up` or `--down`
- **Source**: `services/migration-runner/backend/`
- **Purpose**: One-shot (not a daemon). Reads the dependency graph
  at `services/migration-graph.json`, applies per-domain SQL files
  from `services/<domain>/migrations/` in topological order.
- **Details**: See `docs/migration-dag.md`.

---

## seed / serve-advice / create-admin

- **seed** — one-shot. Loads seed JSON from
  `services/users/seeds/users.json` and similar domain seed
  files into the database.
- **serve-advice** — diagnostic; prints the effective config.
- **create-admin** — interactive bootstrap for the first admin.

---

## Adding a new daemon

See `docs/adding-a-daemon.md` for a step-by-step walkthrough.
