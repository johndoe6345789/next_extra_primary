-- 004: Add user comments / activity feed table
CREATE TABLE IF NOT EXISTS comments (
    id          UUID        PRIMARY KEY
                            DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL
                            REFERENCES users (id)
                            ON DELETE CASCADE,
    content     TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_user_id
    ON comments (user_id);
CREATE INDEX idx_comments_created_at
    ON comments (created_at DESC);
