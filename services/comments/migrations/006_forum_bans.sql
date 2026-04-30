-- Forum ban table.
-- Moderators and admins can ban a user from posting
-- for a fixed duration. banned_until = NULL means
-- permanent. Multiple rows per user are allowed;
-- the most recent active row wins.

CREATE TABLE IF NOT EXISTS forum_bans (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID        NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,
    banned_by   UUID        NOT NULL
                    REFERENCES users(id),
    reason      TEXT        NOT NULL DEFAULT '',
    banned_until TIMESTAMPTZ,           -- NULL = permanent
    created_at  TIMESTAMPTZ NOT NULL
                    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_bans_user
    ON forum_bans(user_id, banned_until);
