-- ------------------------------------------------------------
-- Phase 3.2 — polls / voting daemon schema.
-- Polls, options, and durable votes with rank/weight support.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS polls (
    id          bigserial PRIMARY KEY,
    tenant_id   uuid NOT NULL,
    creator_id  uuid NOT NULL,
    question    text NOT NULL,
    kind        text NOT NULL
        CHECK (kind IN ('single','multi','rank','approval')),
    opens_at    timestamptz NOT NULL DEFAULT now(),
    closes_at   timestamptz NOT NULL,
    public      boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS polls_tenant_idx
    ON polls(tenant_id, closes_at DESC);
CREATE INDEX IF NOT EXISTS polls_open_idx
    ON polls(closes_at)
    WHERE closes_at > now();

CREATE TABLE IF NOT EXISTS poll_options (
    id        bigserial PRIMARY KEY,
    poll_id   bigint NOT NULL
        REFERENCES polls(id) ON DELETE CASCADE,
    position  int NOT NULL,
    label     text NOT NULL,
    UNIQUE (poll_id, position)
);

CREATE INDEX IF NOT EXISTS poll_options_poll_idx
    ON poll_options(poll_id);

CREATE TABLE IF NOT EXISTS poll_votes (
    id         bigserial PRIMARY KEY,
    poll_id    bigint NOT NULL
        REFERENCES polls(id) ON DELETE CASCADE,
    voter_id   uuid NOT NULL,
    option_id  bigint NOT NULL
        REFERENCES poll_options(id) ON DELETE CASCADE,
    rank       int NULL,
    weight     numeric NOT NULL DEFAULT 1.0,
    cast_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (poll_id, voter_id, option_id)
);

CREATE INDEX IF NOT EXISTS poll_votes_poll_idx
    ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS poll_votes_voter_idx
    ON poll_votes(poll_id, voter_id);
