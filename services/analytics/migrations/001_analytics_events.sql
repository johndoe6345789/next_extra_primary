-- 001: Analytics event ingestion table
-- Stores raw client-side events (page views,
-- clicks, custom events) for reporting.

CREATE TABLE IF NOT EXISTS analytics_events (
    id          BIGSERIAL PRIMARY KEY,
    user_id     TEXT,
    name        TEXT        NOT NULL,
    props       JSONB       NOT NULL DEFAULT '{}',
    ip          TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL
                    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ae_created_at
    ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_name
    ON analytics_events (name);
