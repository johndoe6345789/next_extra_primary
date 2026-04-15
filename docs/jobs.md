# Jobs (job_queue)

The job-scheduler daemon is the single, durable background worker
pool used by every other subsystem that needs to run work off the
request path — audit pruning, backups, search reindex, webhook
retries, notification digests, scheduled blog publishing, stream
recording cleanup, and any ad-hoc one-shot enqueued through the
operator UI.

This page documents the tables, the claim loop, the retry and
dead-letter semantics, and the REST endpoints under `/api/jobs`.

See also `docs/cron.md` for how recurring schedules produce the
queue entries the scheduler drains.

---

## Tables

Defined in `backend/migrations/012_job_scheduler.sql`.

### `job_queue`

| Column              | Type         | Notes                        |
|---------------------|--------------|------------------------------|
| `id`                | BIGSERIAL PK |                              |
| `name`              | TEXT         | Operator-facing label        |
| `handler`           | TEXT         | Lookup key in `JobRegistry`  |
| `payload`           | JSONB        | Arguments for the handler    |
| `priority`          | INT          | Lower = sooner. Default 100  |
| `run_at`            | TIMESTAMPTZ  | Eligibility threshold        |
| `attempts`          | INT          | Incremented on each claim    |
| `max_attempts`      | INT          | Default 5                    |
| `backoff_strategy`  | TEXT         | `exponential` or `fixed`     |
| `status`            | TEXT         | See state machine below      |
| `locked_by`         | TEXT         | Worker id (e.g. `nextra-worker-7`) |
| `locked_at`         | TIMESTAMPTZ  | Used by recovery sweep       |
| `scheduled_job_id`  | INT FK       | Non-null when pushed by cron |
| `created_at`        | TIMESTAMPTZ  |                              |

`status` enum: `queued`, `running`, `retrying`, `succeeded`,
`failed`. The queue uses a partial index
`idx_job_queue_ready` on `(run_at, priority)` where status is
`queued` or `retrying` so the claim query stays cheap as the
table grows.

### `job_runs`

Append-only run history. Every time a worker finishes (or fails)
a job, a row is written here: `job_queue_id`, `attempt`, `status`,
`started_at`, `finished_at`, `duration_ms`, `error`, `result`
(JSONB), `worker_id`. Retained for
`runHistoryRetentionDays` days (default 90).

### `job_dead_letter`

When a job exhausts its retry budget, the queue row is deleted
and a snapshot is inserted here: `original_id`, `name`, `handler`,
`payload`, `attempts`, `last_error`, `failed_at`. Retained for
`deadLetterRetentionDays` days (default 30). An operator can
requeue a dead row through the `/api/jobs/retry_dead/:id`
endpoint, which inserts a fresh `job_queue` row.

---

## Claim loop

Implemented in `backend/src/services/JobQueue.cpp` and
`backend/src/services/job_queue_claim.cpp`. Each worker calls
`JobQueue::claimBatch(workerId, limit)` which runs, inside a
single transaction:

```sql
UPDATE job_queue
   SET status      = 'running',
       locked_by   = $1,
       locked_at   = now(),
       attempts    = attempts + 1
 WHERE id IN (
     SELECT id FROM job_queue
      WHERE status IN ('queued','retrying')
        AND run_at <= now()
      ORDER BY priority ASC, run_at ASC
      LIMIT $2
      FOR UPDATE SKIP LOCKED
 )
RETURNING *;
```

`FOR UPDATE SKIP LOCKED` is the key — two workers polling at the
same moment will never observe the same row, so the queue is safe
across any number of `job-scheduler` replicas without a
distributed lock service.

Each claimed row is handed to `JobWorker::runOne` (see
`backend/src/services/job_worker_run_one.cpp`), which looks up
the handler in `JobRegistry`, invokes it, captures any
exception, and calls `markSucceeded` or `markFailed`.

---

## Retry and backoff

`backend/src/services/JobBackoff.cpp` computes the next
`run_at` whenever a handler throws and the attempt count is
still below `max_attempts`:

- **exponential**: `min(maxDelay, baseDelay * 2 ^ (attempts-1))`.
- **fixed**: `baseDelay`, regardless of attempt count.

`baseDelay` and `maxDelay` come from `backoffBaseMs` /
`backoffMaxMs` in `backend/src/constants/job-scheduler.json`
(defaults: 1000 ms / 3 600 000 ms). On failure the row is
flipped back to `status='retrying'` with `locked_by = NULL` and
`run_at = now() + nextDelay`. On final failure (attempts >=
max_attempts) `markFailed` deletes the row from `job_queue` and
inserts the dead-letter snapshot in a single transaction.

---

## Recovery (crashed workers)

A worker that crashes mid-job leaves its rows at
`status='running'` with `locked_at` set. Every
`recoveryTickSeconds` (default 60 s) the scheduler calls
`recoverAbandonedJobs(lockTimeout)` which finds rows where
`status='running'` and `locked_at < now() - lockTimeout`
(default 300 s) and flips them back to `retrying`. This is the
only mechanism by which a genuinely stuck row can re-enter the
ready set, so `lockTimeoutSeconds` should be comfortably larger
than the longest legitimate handler runtime.

---

## REST endpoints

Mounted by `backend/src/controllers/JobController.h` on the main
`backend` daemon (not the job-scheduler daemon — the scheduler
has no HTTP server of its own). All endpoints go through
`JwtFilter`.

| Method | Path                         | Purpose                       |
|--------|------------------------------|-------------------------------|
| GET    | `/api/jobs/queue`            | List pending + running rows   |
| GET    | `/api/jobs/runs`             | Recent `job_runs` history     |
| GET    | `/api/jobs/dead_letter`      | Dead-letter rows (paginated)  |
| POST   | `/api/jobs/enqueue`          | Enqueue an ad-hoc job         |
| POST   | `/api/jobs/retry_dead/:id`   | Requeue a dead-letter row     |
| DELETE | `/api/jobs/queue/:id`        | Cancel a not-yet-running job  |

Read handlers live in `job_controller_read.cpp`, mutating
handlers in `job_controller_write.cpp`. The `tools/jobs/`
Next.js tool is the operator UI for these endpoints.

---

## Enqueue example

```bash
curl -X POST http://localhost:8889/api/jobs/enqueue \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "manual.search.reindex",
    "handler": "search.reindex",
    "payload": {"index": "users"},
    "priority": 50,
    "max_attempts": 3,
    "backoff_strategy": "exponential"
  }'
```

Priority 50 runs sooner than the default 100. The handler string
must correspond to a registration in
`backend/src/services/JobRegistry.cpp`; unknown handlers retry
until `max_attempts` and then dead-letter.
