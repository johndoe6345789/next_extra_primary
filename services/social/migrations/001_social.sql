-- Migration 016: Social / multiplayer features
--
-- Phase 7.1-7.6 — follows, direct messages, presence,
-- reactions, mentions, and groups/teams. All six domains
-- ship as one migration so the social feature set can be
-- toggled as a unit via constants/social.json.

-- 7.1 Follows: directed user -> user graph
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID NOT NULL,
    followee_id UUID NOT NULL,
    at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, followee_id),
    CHECK (follower_id <> followee_id)
);
CREATE INDEX IF NOT EXISTS follows_followee_idx
    ON follows (followee_id, at DESC);

-- 7.2 Direct messages
CREATE TABLE IF NOT EXISTS dm_threads (
    id             BIGSERIAL PRIMARY KEY,
    participant_a  UUID NOT NULL,
    participant_b  UUID NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS dm_threads_pair_idx
    ON dm_threads (
        LEAST(participant_a, participant_b),
        GREATEST(participant_a, participant_b)
    );

CREATE TABLE IF NOT EXISTS dm_messages (
    id         BIGSERIAL PRIMARY KEY,
    thread_id  BIGINT NOT NULL
               REFERENCES dm_threads(id) ON DELETE CASCADE,
    sender_id  UUID NOT NULL,
    body       TEXT NOT NULL,
    sent_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS dm_messages_thread_idx
    ON dm_messages (thread_id, sent_at DESC);

-- 7.4 Reactions (polymorphic targets)
CREATE TABLE IF NOT EXISTS reactions (
    id           BIGSERIAL PRIMARY KEY,
    target_type  TEXT NOT NULL,
    target_id    TEXT NOT NULL,
    user_id      UUID NOT NULL,
    emoji        TEXT NOT NULL,
    at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (target_type, target_id, user_id, emoji)
);
CREATE INDEX IF NOT EXISTS reactions_target_idx
    ON reactions (target_type, target_id);

-- 7.5 Mentions
CREATE TABLE IF NOT EXISTS mentions (
    id                 BIGSERIAL PRIMARY KEY,
    source_type        TEXT NOT NULL,
    source_id          TEXT NOT NULL,
    mentioned_user_id  UUID NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mentions_user_idx
    ON mentions (mentioned_user_id, created_at DESC);

-- 7.6 Groups / teams
CREATE TABLE IF NOT EXISTS groups (
    id          BIGSERIAL PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id   BIGINT NOT NULL
               REFERENCES groups(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL,
    role       TEXT NOT NULL DEFAULT 'member',
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS group_members_user_idx
    ON group_members (user_id);
