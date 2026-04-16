# Cron (scheduled_jobs)

Nextra has its own small, library-free cron parser living in
`services/cron/backend/`. The goal is that a template
consumer does not inherit a transitive cron dependency just so
the ticker can compute "when does this fire next".

This page documents the supported syntax, how schedules
become queue entries, and how to add a seed schedule. See
[jobs.md](jobs.md) for the scheduler that actually runs them
and [services.md](services.md) for how `cron-manager` is
wired into the Drogon host.

---

## Supported Vixie syntax

The parser is implemented in
`services/cron/backend/cron_expression_parse.cpp`.

Five fields, space separated:

```
minute  hour  day-of-month  month  day-of-week
0-59    0-23  1-31          1-12   0-6 (0 = Sunday)
```

| Form       | Example  | Meaning                   |
|------------|----------|---------------------------|
| Star       | `*`      | Every value in the field  |
| Value      | `5`      | Exactly 5                 |
| List       | `1,5,15` | 1, 5, or 15               |
| Range      | `1-5`    | 1 through 5 inclusive     |
| Step       | `*/5`    | Every 5th value           |
| Range+step | `1-30/2` | 1, 3, 5 ... 29            |

### Aliases

| Alias      | Equivalent  |
|------------|-------------|
| `@hourly`  | `0 * * * *` |
| `@daily`   | `0 0 * * *` |
| `@weekly`  | `0 0 * * 0` |
| `@monthly` | `0 0 1 * *` |
| `@yearly`  | `0 0 1 1 *` |

Named months / weekdays, `@reboot`, and seconds are
explicitly rejected. A malformed expression throws
`std::invalid_argument` from `nextra::cron::parseCron`.

---

## Tick semantics

`nextFireTime` in
`services/cron/backend/cron_expression_next.cpp` computes
the next fire time by scanning forward minute-by-minute.
The scan is capped at ~400 days so a malformed spec cannot
wedge the daemon. All time comparisons are UTC.

The daemon wakes every `tickIntervalSeconds` (see
`services/cron/constants.json`) and for every enabled row in
`scheduled_jobs` where `next_run_at <= now() + dueSlackSeconds`:

1. Compute the effective run timestamp.
2. `INSERT` a matching row into `job_queue` with the same
   `handler` and `payload`, plus `scheduled_job_id` set to
   the schedule's primary key.
3. Update the schedule: `last_run_at = now()`,
   `next_run_at = nextFireTime(cron, now())`.

The job is not executed here — the `job-scheduler` daemon
picks up the new queue row on its next poll.

---

## Seed schedules

Seed schedules ship in `services/cron/constants.json` under
`seedSchedules`. On daemon start,
`cron_manager_seeds.cpp` upserts each one into
`scheduled_jobs` by `name`:

```json
{
  "name": "notifications.digest",
  "cron": "0 * * * *",
  "handler": "notifications.digest",
  "description": "Hourly digest roll-up"
}
```

### Adding a new seed schedule

1. Add the object to `seedSchedules` in
   `services/cron/constants.json`.
2. Make sure the `handler` string is registered in the
   job registry (see
   `services/job-queue/backend/JobRegistry.cpp`) — the
   cron-manager only enqueues, so an unknown handler
   eventually dead-letters.
3. Rebuild the cron-manager image:
   `docker compose up --build --no-deps cron-manager`.

### Editing a schedule at runtime

The `CronController` endpoints in
`services/cron/controllers/` (proxied as `/api/cron/...`)
let an admin update `enabled`, `cron`, `handler`, and
`payload` without a rebuild. The `services/cron/admin/`
Next.js tool is the operator UI for these endpoints.

---

## Tables touched

All cron-related state is declared in
`services/cron/migrations/` and `services/job-queue/migrations/`
(the `cron` domain depends on `job-queue` through the
[migration DAG](migration-dag.md)):

- `scheduled_jobs` — canonical schedule list.
- `job_queue` — transient queue that cron pushes into.
  See [jobs.md](jobs.md) for the column list.
