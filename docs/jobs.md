# Jobs (job_queue)

The job-scheduler daemon is the single durable background worker
pool used by every subsystem that needs work off the request path:
audit pruning, backups, search reindex, webhook retries,
notification digests, scheduled blog publishing, stream recording
cleanup, and ad-hoc one-shots from the operator UI.

Domain source: `services/job-queue/`.
See `docs/cron.md` for how recurring schedules produce queue rows.

---

## Tables

Defined in `services/job-queue/migrations/`.

### `job_queue`

| Column             | Type         | Notes                         |
|--------------------|--------------|-------------------------------|
| `id`               | BIGSERIAL PK |                               |
| `name`             | TEXT         | Operator-facing label         |
| `handler`          | TEXT         | Key in `JobRegistry`          |
| `payload`          | JSONB        | Arguments for the handler     |
| `priority`         | INT          | Lower = sooner. Default 100   |
| `run_at`           | TIMESTAMPTZ  | Eligibility threshold         |
| `attempts`         | INT          | Incremented on each claim     |
| `max_attempts`     | INT          | Default 5                     |
| `backoff_strategy` | TEXT         | `exponential` or `fixed`      |
| `status`           | TEXT         | State machine (see below)     |
| `locked_by`        | TEXT         | Worker id                     |
| `locked_at`        | TIMESTAMPTZ  | Used by recovery sweep        |
| `scheduled_job_id` | INT FK       | Non-null when pushed by cron  |
| `created_at`       | TIMESTAMPTZ  |                               |

`status` enum: `queued`, `running`, `retrying`, `succeeded`,
`failed`. A partial index `idx_job_queue_ready` on
`(run_at, priority)` where status is `queued` or `retrying` keeps
the claim query cheap.

### `job_runs`

Append-only run history. Columns: `job_queue_id`, `attempt`,
`status`, `started_at`, `finished_at`, `duration_ms`, `error`,
`result` (JSONB), `worker_id`. Retained for
`runHistoryRetentionDays` days (default 90).

### `job_dead_letter`

When a job exhausts retries: `original_id`, `name`, `handler`,
`payload`, `attempts`, `last_error`, `failed_at`. Retained for
`deadLetterRetentionDays` days (default 30). Requeue via
`/api/jobs/retry_dead/:id`.

---

## Claim loop

In `services/job-queue/backend/JobQueue.cpp`. Each worker calls
`JobQueue::claimBatch(workerId, limit)`:

```sql
UPDATE job_queue
   SET status    = 'running',
       locked_by = $1,
       locked_at = now(),
       attempts  = attempts + 1
 WHERE id IN (
   SELECT id FROM job_queue
    WHERE status IN ('queued','retrying') AND run_at <= now()
    ORDER BY priority ASC, run_at ASC
    LIMIT $2
    FOR UPDATE SKIP LOCKED
 )
RETURNING *;
```

`FOR UPDATE SKIP LOCKED` ensures two workers never claim the same
row, making the queue safe across multiple `job-scheduler`
replicas.

---

## Retry and backoff

`services/job-queue/backend/JobBackoff.cpp` computes `run_at`
on handler failure:

- **exponential**: `min(maxDelay, baseDelay * 2^(attempts-1))`
- **fixed**: `baseDelay`, regardless of attempt count

Defaults (`services/job-queue/constants.json`): 1 000 ms base,
3 600 000 ms max. On final failure the row is deleted from
`job_queue` and a dead-letter snapshot is inserted.

---

## Recovery (crashed workers)

Every `recoveryTickSeconds` (default 60 s) the scheduler calls
`recoverAbandonedJobs(lockTimeout)` which resets rows where
`status='running'` and `locked_at < now() - lockTimeout`
(default 300 s) back to `retrying`.

---

## REST endpoints

Mounted by `services/job-queue/controllers/JobController.h` on
the `backend` daemon. All go through `JwtFilter`.

| Method | Path                       | Purpose                       |
|--------|----------------------------|-------------------------------|
| GET    | `/api/jobs/queue`          | Pending + running rows        |
| GET    | `/api/jobs/runs`           | Recent run history            |
| GET    | `/api/jobs/dead_letter`    | Dead-letter rows (paginated)  |
| POST   | `/api/jobs/enqueue`        | Enqueue an ad-hoc job         |
| POST   | `/api/jobs/retry_dead/:id` | Requeue a dead-letter row     |
| DELETE | `/api/jobs/queue/:id`      | Cancel a not-yet-running job  |

The operator UI is `services/job-queue/admin/`.

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

Handler strings must be registered in
`services/job-queue/backend/JobRegistry.cpp`.
