-- 013_articles.sql
-- Article/blog storage for Phase 4.6.
-- Two tables: articles (current state) and
-- article_revisions (append-only history).

CREATE TABLE IF NOT EXISTS articles (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      UUID NOT NULL,
    author_id      UUID NOT NULL,
    slug           TEXT NOT NULL UNIQUE,
    title          TEXT NOT NULL,
    body_md        TEXT NOT NULL DEFAULT '',
    body_html      TEXT NOT NULL DEFAULT '',
    hero_image     TEXT,
    tags           TEXT[] NOT NULL DEFAULT '{}',
    status         TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft','scheduled',
                          'published','archived')),
    published_at   TIMESTAMPTZ,
    scheduled_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_status
    ON articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at
    ON articles (scheduled_at)
    WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_articles_tenant
    ON articles (tenant_id, status);

CREATE TABLE IF NOT EXISTS article_revisions (
    article_id  BIGINT NOT NULL
        REFERENCES articles(id) ON DELETE CASCADE,
    rev         INT NOT NULL,
    title       TEXT NOT NULL,
    body_md     TEXT NOT NULL,
    at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    author_id   UUID NOT NULL,
    PRIMARY KEY (article_id, rev)
);

CREATE INDEX IF NOT EXISTS idx_article_revisions_at
    ON article_revisions (article_id, at DESC);
