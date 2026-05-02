-- ============================================================
-- Migration 001 (alerts domain): alerts table.
-- ============================================================
-- Stores cross-service operational alerts. The unique key on
-- (source, dedupe_key, status) lets the open row absorb repeats
-- via UPSERT (last_seen + count++) instead of inserting dupes.
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS alerts (
    id              UUID         PRIMARY KEY
                                 DEFAULT gen_random_uuid(),
    source          VARCHAR(64)  NOT NULL,
    severity        VARCHAR(16)  NOT NULL
                    CHECK (severity IN (
                        'info', 'warning', 'error', 'critical'
                    )),
    message         TEXT         NOT NULL,
    dedupe_key      VARCHAR(200) NOT NULL,
    metadata        JSONB        NOT NULL DEFAULT '{}'::jsonb,
    first_seen      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_seen       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    count           INTEGER      NOT NULL DEFAULT 1,
    status          VARCHAR(16)  NOT NULL DEFAULT 'open'
                    CHECK (status IN (
                        'open', 'acknowledged', 'resolved'
                    )),
    acknowledged_by UUID
                    REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS
    uq_alerts_dedupe_open
    ON alerts (source, dedupe_key, status);

CREATE INDEX IF NOT EXISTS idx_alerts_status_severity
    ON alerts (status, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_source
    ON alerts (source);
CREATE INDEX IF NOT EXISTS idx_alerts_last_seen
    ON alerts (last_seen DESC);

INSERT INTO schema_migrations (filename)
VALUES ('alerts/001_alerts.sql')
ON CONFLICT (filename) DO NOTHING;

COMMIT;
