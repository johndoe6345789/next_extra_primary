-- Add write-flow columns to product_reviews:
--   user_id  : JWT sub of the review author (string).
--   updated_at: bump on edit, used for cache busting.
-- Plus a UNIQUE(product_id, user_id) so one user gets
-- one review per product (POST upserts).
-- Existing rows (seeded with `author` only) keep
-- user_id NULL and are excluded from the partial unique.

ALTER TABLE product_reviews
    ADD COLUMN IF NOT EXISTS user_id    TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS
    product_reviews_product_user_uq
    ON product_reviews (product_id, user_id)
    WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS product_reviews_user_idx
    ON product_reviews (user_id)
    WHERE user_id IS NOT NULL;
