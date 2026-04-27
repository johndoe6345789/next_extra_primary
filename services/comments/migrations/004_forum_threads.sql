-- 004: Add title column for forum threads.
-- comments_v2 doubles as forum threads;
-- forum thread rows (target_type='forum_board')
-- need a title field; other comment types leave
-- it NULL.

ALTER TABLE comments_v2
    ADD COLUMN IF NOT EXISTS title TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_cv2_forum_threads
    ON comments_v2 (target_type, created_at DESC)
    WHERE target_type = 'forum_board'
      AND deleted_at IS NULL;
