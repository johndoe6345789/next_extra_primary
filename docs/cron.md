# Cron (scheduled_jobs)

Nextra has its own small, library-free cron parser living in
`backend/src/services/cron/`. The goal is that a template consumer
does not inherit a transitive cron dependency just so the ticker
can compute "when does this fire next".

This page documents the supported syntax, how schedules become
queue entries, and how to add a seed schedule.

---

## Supported Vixie syntax

The parser is implemented in
`backend/src/services/cron/cron_expression_parse.cpp`.

Five fields, space separated, in this order:

```
minute  hour  day-of-month  month  day-of-week
0-59    0-23  1-31          1-12   0-6 (0 = Sunday)
```

Each field accepts:

| Form       | Example      | Meaning                      |
|------------|--------------|------------------------------|
| Star       | `*`          | Every value in the field     |
| Value      | `5`          | Exactly 5                    |
| List       | `1,5,15`     | 1, 5, or 15                  |
| Range      | `1-5`        | 1 through 5 inclusive        |
| Step       | `*/5`        | Every 5th value              |
| Range+step | `1-30/2`     | 1, 3, 5 ... 29               |

### Aliases

The following single-token aliases are accepted and expand to the
five-field equivalents:

| Alias      | Equivalent    |
|------------|---------------|
| `@hourly`  | `0 * * * *`   |
| `@daily`   | `0 0 * * *`   |
| `@weekly`  | `0 0 * * 0`   |
| `@monthly` | `0 0 1 * *`   |
| `@yearly`  | `0 0 1 1 *`   |

### Explicitly unsupported

- Named months / weekdays (`JAN`, `MON`) — rejected.
- `@reboot` — rejected; the cron-manager has no reboot concept.
- Seconds — rejected; the tick is minute-grained.

A malformed expression throws `std::invalid_argument` from
`nextra::cron::parseCron`, and the cron-manager refuses to enqueue
any schedule that fails to parse.

---

## Tick semantics

`nextFireTime` in
`backend/src/services/cron/cron_expression_next.cpp` computes the
next fire time strictly after a given `time_point` by scanning
forward minute-by-minute. The scan is capped at ~400 days so a
malformed spec cannot wedge the daemon in an infinite loop. All
time comparisons are done in UTC.

The daemon wakes every `tickIntervalSeconds`
(see `backend/src/constants/cron-manager.json`) and for every row
in `scheduled_jobs` where `enabled = true` and
`next_run_at <= now() + dueSlackSeconds`:

1. Compute the "effective run timestamp" (the schedule's
   `next_run_at`).
2. `INSERT` a matching row into `job_queue` with the same
   `handler` and `payload`, plus `scheduled_job_id` set to the
   schedule's primary key.
3. Update the schedule: `last_run_at = now()`,
   `next_run_at = nextFireTime(cron, now())`.

The job is not executed here. The ad-hoc job-scheduler daemon
(see `docs/jobs.md`) will pick up the new queue row on its next
poll and run the handler.

---

## Seed schedules

The seed schedules that ship with the template live in
`backend/src/constants/cron-manager.json` under `seedSchedules`.
On daemon start, `cron_manager_seeds.cpp` upserts each one into
`scheduled_jobs` by `name` (so editing the JSON and restarting
the daemon is the way to change the canonical defaults).

Example entry:

```json
{
  "name": "notifications.digest",
  "cron": "0 * * * *",
  "handler": "notifications.digest",
  "description": "Roll up hourly digests for users with digest preference"
}
```

### Adding a new seed schedule

1. Add the object to `seedSchedules` in
   `backend/src/constants/cron-manager.json`.
2. Make sure the `handler` string is registered in
   `backend/src/services/JobRegistry.cpp` — the cron-manager
   only enqueues; the job-scheduler is what actually dispatches
   by handler name, so an unknown handler will land in the
   dead-letter table after retries.
3. Rebuild the backend image (the JSON is baked into the
   container — there is no bind mount):
   `docker compose up --build --no-deps cron-manager`.
4. On boot, `upsertSeedSchedules` will insert the row (or update
   the cron/handler/description of an existing one).

### Editing a schedule at runtime

The `CronController` endpoints (proxied through nginx on
`/cron` and exposed via the operator UI in `tools/cron/`) let
an admin update `scheduled_jobs.enabled`, `cron`, `handler`, and
`payload` without a rebuild. Changes are picked up on the next
tick because every tick re-reads the row.

---

## Tables touched

All cron-related state lives in migration 012
(`backend/migrations/012_job_scheduler.sql`):

- `scheduled_jobs` — the canonical schedule list, one row per
  recurring job. Columns: `name` (unique), `cron`, `handler`,
  `payload`, `enabled`, `next_run_at`, `last_run_at`,
  `description`, `created_at`, `updated_at`.
- `job_queue` — the transient queue that cron pushes into.
  See `docs/jobs.md` for the column list.
