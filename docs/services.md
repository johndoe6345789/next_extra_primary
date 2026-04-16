# Backend Services (Drogon Daemons)

The Nextra backend is a single binary (`nextra-api`) built
from `services/drogon-host/` that dispatches many CLI
sub-commands. Docker-compose runs each long-running
sub-command as its own container. They all share the same
PostgreSQL database and the server config in
`services/drogon-host/config/config.json`.

Each daemon's implementation lives inside its owning
domain at `services/<domain>/backend/commands/`. The
dispatch table wiring CLI names to handlers is
`services/drogon-host/backend/cli_dispatch_daemons_table.h`.

See [architecture.md](architecture.md) for the high-level
picture and [adding-a-daemon.md](adding-a-daemon.md) for the
walkthrough of adding a new one.

---

## serve (main API)

- **CLI**: `./nextra-api serve --config config/config.json`
- **Source**: `services/drogon-host/backend/commands/serve.cpp`
- **Compose service**: `backend`
- **Purpose**: Main HTTP API. At link time every domain's
  `controllers/` are pulled in, so `serve` mounts every
  `drogon::HttpController` in the repo.
- **Config**: `services/drogon-host/config/config.json`.

---

## job-scheduler

- **Domain**: [`services/job-queue`](../services/job-queue/README.md)
- **CLI**: `./nextra-api job-scheduler`
- **Source**: `services/job-queue/backend/commands/job_scheduler.cpp`
- **Purpose**: Durable background worker pool. Drains
  `job_queue` using `SELECT ... FOR UPDATE SKIP LOCKED`,
  runs each claimed job via a handler registered in the
  `JobRegistry`, writes a `job_runs` row, retries with
  backoff, dead-letters on exhaustion.
- **Migrations**: `services/job-queue/migrations/`.
- **Admin UI**: `services/job-queue/admin/` (mounted at `/jobs`).
- **Reference**: [jobs.md](jobs.md).

---

## cron-manager

- **Domain**: [`services/cron`](../services/cron/README.md)
- **CLI**: `./nextra-api cron-manager`
- **Source**: `services/cron/backend/commands/cron_manager.cpp`
- **Purpose**: Evaluates `scheduled_jobs`; whenever a row
  is due, enqueues a matching `job_queue` row for the
  job-scheduler to execute.
- **Admin UI**: `services/cron/admin/` (mounted at `/cron`).
- **Reference**: [cron.md](cron.md).

---

## Other daemons

| Domain                    | CLI                  |
|---------------------------|----------------------|
| `services/backup`         | `backup-manager`     |
| `services/image`          | `image-processor`    |
| `services/streaming`      | `media-streaming`    |
| `services/notifications`  | `notification-router`|
| `services/pdf`            | `pdf-generator`      |
| `services/search`         | `search-indexer`     |
| `services/video`          | `video-transcoder`   |
| `services/webhooks`       | `webhook-dispatcher` |

Each one follows the same shape: a `commands/<name>.{h,cpp}`
that builds a config struct, constructs the daemon class
from `services/<domain>/backend/`, and spins a stop loop.
The dispatch table that ties these CLI names to their cmd
entry points is
`services/drogon-host/backend/cli_dispatch_daemons_table.h`.

---

## One-shot sub-commands

| CLI            | Source                                                      |
|----------------|-------------------------------------------------------------|
| `migrate`      | `services/migration-runner/backend/commands/migrate.cpp`    |
| `seed`         | `services/drogon-host/backend/commands/seed.cpp`            |
| `serve-advice` | `services/drogon-host/backend/commands/serve_advice.cpp`    |

The `migrate` sub-command walks
[`services/migration-graph.json`](../services/migration-graph.json),
topo-sorts the domains, and applies each
`services/<domain>/migrations/NNN_*.sql` in order. See
[migration-dag.md](migration-dag.md) for the full strategy.

---

## Adding a new daemon

See [adding-a-daemon.md](adding-a-daemon.md).
