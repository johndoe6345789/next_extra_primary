-- Migration: Photo gallery / album tables (Phase 4.4)
--
-- Backs the gallery daemon + /gallery operator tool.
-- References image_assets/image_variants (Phase 4.3), but
-- uses soft foreign keys (no REFERENCES clause) so either
-- phase can land independently of the other.

CREATE TABLE galleries (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      UUID,
    owner_id       UUID,
    slug           TEXT NOT NULL UNIQUE,
    title          TEXT NOT NULL,
    description    TEXT NOT NULL DEFAULT '',
    cover_asset_id BIGINT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_galleries_tenant
    ON galleries (tenant_id);
CREATE INDEX idx_galleries_owner
    ON galleries (owner_id);
CREATE INDEX idx_galleries_created
    ON galleries (created_at DESC);

CREATE TABLE gallery_items (
    gallery_id BIGINT NOT NULL,
    asset_id   BIGINT NOT NULL,
    position   INT NOT NULL DEFAULT 0,
    caption    TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (gallery_id, asset_id)
);

CREATE INDEX idx_gallery_items_gallery_pos
    ON gallery_items (gallery_id, position);
