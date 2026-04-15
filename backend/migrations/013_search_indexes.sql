-- 013_search_indexes.sql
-- Registry of Elasticsearch indexes maintained by the
-- search-indexer daemon (Phase 4.5).
--
-- Each row describes one logical index: where its source
-- rows come from (target_table), which ES index receives
-- the documents (es_index), and the last reindex / count
-- / status snapshot as reported by the daemon.

CREATE TABLE IF NOT EXISTS search_indexes (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE,
    target_table    TEXT NOT NULL,
    es_index        TEXT NOT NULL,
    last_reindex_at TIMESTAMPTZ,
    doc_count       BIGINT NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'idle',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_indexes_status
    ON search_indexes (status);

-- Seed the four definitions shipped in
-- constants/search-indexer.json.  ON CONFLICT makes
-- this migration idempotent across reruns.
INSERT INTO search_indexes (name, target_table, es_index)
VALUES
    ('users',         'users',         'nextra-users'),
    ('comments',      'comments',      'nextra-comments'),
    ('blog_articles', 'blog_articles', 'nextra-blog'),
    ('packages',      'packages',      'nextra-packages')
ON CONFLICT (name) DO NOTHING;
