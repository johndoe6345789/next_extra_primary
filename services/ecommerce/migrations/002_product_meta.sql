-- Add slug + image URL columns to products so the
-- frontend product listing and detail pages can show
-- a hero image and use a stable URL slug.

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS slug      TEXT
        NOT NULL DEFAULT '';
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS image_url TEXT
        NOT NULL DEFAULT '';

-- Backfill slug from sku for any pre-existing rows so
-- the unique index below can be created safely.
UPDATE products
   SET slug = sku
 WHERE slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx
    ON products (slug);
