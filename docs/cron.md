# Cron (scheduled_jobs)

Nextra has its own library-free cron parser living in
`services/cron/backend/`. The goal is that a template consumer
does not inherit a transitive cron dependency just for next-fire
time computation.

This page documents the syntax, how schedules become queue entries,
and how to add a seed schedule.

---

## Supported Vixie syntax

The parser is in
`services/cron/backend/cron_expression_parse.cpp`.

Five fields, space separated:

```
minute  hour  day-of-month  month  day-of-week
0-59    0-23  1-31          1-12   0-6 (0=Sunday)
```

Each field accepts:

| Form       | Example  | Meaning               |
|------------|----------|-----------------------|
| Star       | `*`      | Every value           |
| Value      | `5`      | Exactly 5             |
| List       | `1,5,15` | 1, 5, or 15           |
| Range      | `1-5`    | 1 through 5           |
| Step       | `*/5`    | Every 5th value       |
| Range+step | `1-30/2` | 1, 3, 5 ... 29        |

### Aliases

| Alias      | Equivalent  |
|------------|-------------|
| `@hourly`  | `0 * * * *` |
| `@daily`   | `0 0 * * *` |
| `@weekly`  | `0 0 * * 0` |
| `@monthly` | `0 0 1 * *` |
| `@yearly`  | `0 0 1 1 *` |

### Explicitly unsupported

- Named months / weekdays (`JAN`, `MON`) — rejected.
- `@reboot` — no reboot concept.
- Seconds — tick is minute-grained.

A malformed expression throws `std::invalid_argument` from
`nextra::cron::parseCron`.

---

## Tick semantics

`nextFireTime` in
`services/cron/backend/cron_expression_next.cpp` scans forward
minute-by-minute, capped at ~400 days. All times are UTC.

The daemon wakes every `tickIntervalSeconds`
(see `services/cron/constants.json`) and for every row in
`scheduled_jobs` where `enabled = true` and
`next_run_at <= now() + dueSlackSeconds`:

1. Compute the effective run timestamp.
2. `INSERT` a row into `job_queue` with the same `handler` and
   `payload`, setting `scheduled_job_id`.
3. Update `last_run_at = now()`,
   `next_run_at = nextFireTime(cron, now())`.

The job is not executed here; the job-scheduler drains the queue.

---

## Seed schedules

Seed schedules live in `services/cron/constants.json` under
`seedSchedules`. On daemon start, `cron_manager_seeds.cpp`
upserts each by `name`:

```json
{
  "name": "notifications.digest",
  "cron": "0 * * * *",
  "handler": "notifications.digest",
  "description": "Hourly digests for users with digest preference"
}
```

### Adding a new seed schedule

1. Add the object to `seedSchedules` in
   `services/cron/constants.json`.
2. Register the `handler` string in
   `services/job-queue/backend/JobRegistry.cpp`.
3. Rebuild: `docker compose up --build --no-deps cron-manager`.
4. At boot, `upsertSeedSchedules` inserts or updates the row.

### Editing a schedule at runtime

The `CronController` endpoints (under `/cron` in the operator UI
at `services/cron/admin/`) let an admin update `enabled`, `cron`,
`handler`, and `payload` without a rebuild. Every tick re-reads
the row from `scheduled_jobs`.

---

## Tables touched

All cron-related state lives in `services/job-queue/migrations/`:

- `scheduled_jobs` — recurring schedules. Columns: `name`
  (unique), `cron`, `handler`, `payload`, `enabled`,
  `next_run_at`, `last_run_at`, `description`, `created_at`,
  `updated_at`.
- `job_queue` — the transient queue cron pushes into. See
  `docs/jobs.md` for the full column list.
