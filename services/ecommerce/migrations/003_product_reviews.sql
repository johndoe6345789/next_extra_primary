-- Product reviews. Star rating + free-text body left
-- by buyers. Read endpoint serves these on the product
-- detail page; write flow comes later.

CREATE TABLE IF NOT EXISTS product_reviews (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT      NOT NULL
        REFERENCES products (id) ON DELETE CASCADE,
    author      TEXT        NOT NULL,
    rating      SMALLINT    NOT NULL
        CHECK (rating BETWEEN 1 AND 5),
    body        TEXT        NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_reviews_product_idx
    ON product_reviews (product_id, created_at DESC);
