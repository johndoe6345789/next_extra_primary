-- 013: Polymorphic threaded comments + forum
-- Extends the simple v1 comments table shipped
-- in migration 004 with a new polymorphic
-- threaded system using PostgreSQL ltree for
-- materialized-path threading. This powers both
-- blog comments (shallow) and forum boards /
-- threads / posts (deep) via a single table.
--
-- Resource addressing:
--   target_type = 'blog_post' | 'forum_board'
--                 | 'forum_thread' | ...
--   target_id   = opaque string (UUID or slug)
--
-- Threading:
--   path  = ltree materialized path from root
--   depth = integer depth (0 = top-level)
-- The path is auto-derived on insert: for a
-- top-level comment path = text(id); for a
-- reply, path = parent.path || text(id).

CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE IF NOT EXISTS comments_v2 (
    id          BIGSERIAL   PRIMARY KEY,
    tenant_id   UUID        NULL,
    target_type TEXT        NOT NULL,
    target_id   TEXT        NOT NULL,
    parent_id   BIGINT      NULL
                            REFERENCES comments_v2 (id)
                            ON DELETE CASCADE,
    author_id   UUID        NOT NULL,
    body        TEXT        NOT NULL,
    path        LTREE       NULL,
    depth       INT         NOT NULL DEFAULT 0,
    flag_count  INT         NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_v2_target
    ON comments_v2 (target_type, target_id, path);
CREATE INDEX IF NOT EXISTS idx_comments_v2_path_gist
    ON comments_v2 USING GIST (path);
CREATE INDEX IF NOT EXISTS idx_comments_v2_parent
    ON comments_v2 (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_v2_flagged
    ON comments_v2 (flag_count)
    WHERE flag_count > 0;

CREATE TABLE IF NOT EXISTS comment_flags (
    id           BIGSERIAL   PRIMARY KEY,
    comment_id   BIGINT      NOT NULL
                             REFERENCES comments_v2 (id)
                             ON DELETE CASCADE,
    reporter_id  UUID        NOT NULL,
    reason       TEXT        NOT NULL,
    at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (comment_id, reporter_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_flags_comment
    ON comment_flags (comment_id);

CREATE TABLE IF NOT EXISTS comment_reactions (
    id          BIGSERIAL   PRIMARY KEY,
    comment_id  BIGINT      NOT NULL
                            REFERENCES comments_v2 (id)
                            ON DELETE CASCADE,
    user_id     UUID        NOT NULL,
    kind        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (comment_id, user_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_comment_reactions_cmt
    ON comment_reactions (comment_id);
