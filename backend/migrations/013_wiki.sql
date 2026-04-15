-- 013: Collaborative wiki — pages, revisions, attachments.
-- Hierarchy uses ltree paths; unique per tenant.

CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE IF NOT EXISTS wiki_pages (
    id          BIGSERIAL   PRIMARY KEY,
    tenant_id   UUID        NOT NULL,
    parent_id   BIGINT      NULL
                            REFERENCES wiki_pages (id)
                            ON DELETE CASCADE,
    slug        TEXT        NOT NULL,
    title       TEXT        NOT NULL,
    body_md     TEXT        NOT NULL DEFAULT '',
    path        LTREE       NOT NULL,
    depth       INT         NOT NULL DEFAULT 0,
    created_by  UUID        NULL,
    updated_by  UUID        NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, path)
);

CREATE INDEX IF NOT EXISTS idx_wiki_pages_tenant
    ON wiki_pages (tenant_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_parent
    ON wiki_pages (parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_path
    ON wiki_pages USING GIST (path);

CREATE TABLE IF NOT EXISTS wiki_revisions (
    page_id     BIGINT      NOT NULL
                            REFERENCES wiki_pages (id)
                            ON DELETE CASCADE,
    rev         INT         NOT NULL,
    title       TEXT        NOT NULL,
    body_md     TEXT        NOT NULL,
    at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_id   UUID        NULL,
    PRIMARY KEY (page_id, rev)
);

CREATE INDEX IF NOT EXISTS idx_wiki_rev_at
    ON wiki_revisions (page_id, at DESC);

CREATE TABLE IF NOT EXISTS wiki_attachments (
    id          BIGSERIAL   PRIMARY KEY,
    page_id     BIGINT      NOT NULL
                            REFERENCES wiki_pages (id)
                            ON DELETE CASCADE,
    s3_key      TEXT        NOT NULL,
    name        TEXT        NOT NULL,
    bytes       BIGINT      NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wiki_att_page
    ON wiki_attachments (page_id);
