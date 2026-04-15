-- -----------------------------------------------------------------
-- Migration 017 — image processor (Phase 4.3)
-- -----------------------------------------------------------------
-- Adds the job queue and variant ledger consumed by the
-- image-processor daemon. Status values:
--   pending  — queued, waiting for a worker to claim
--   running  — claimed by a worker, processing in-flight
--   success  — all variants produced and uploaded to S3
--   failed   — exhausted retry budget; see error column
-- -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS image_processing_jobs (
    id            BIGSERIAL PRIMARY KEY,
    source_url    TEXT        NOT NULL,
    variants_json JSONB       NOT NULL,
    status        TEXT        NOT NULL DEFAULT 'pending',
    attempts      INT         NOT NULL DEFAULT 0,
    error         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at    TIMESTAMPTZ,
    finished_at   TIMESTAMPTZ,
    CONSTRAINT image_jobs_status_chk CHECK (
        status IN ('pending', 'running',
                   'success', 'failed')
    )
);

CREATE INDEX IF NOT EXISTS image_jobs_status_created_idx
    ON image_processing_jobs (status, created_at);

CREATE TABLE IF NOT EXISTS image_variants (
    id           BIGSERIAL PRIMARY KEY,
    job_id       BIGINT      NOT NULL
                  REFERENCES image_processing_jobs(id)
                  ON DELETE CASCADE,
    variant_name TEXT        NOT NULL,
    width        INT         NOT NULL,
    height       INT         NOT NULL,
    format       TEXT        NOT NULL,
    object_key   TEXT        NOT NULL,
    bytes        BIGINT      NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS image_variants_job_idx
    ON image_variants (job_id);
