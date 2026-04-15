#pragma once
/**
 * @file gallery_store_sql.h
 * @brief Shared SQL fragments for GalleryStore split TUs.
 */

namespace services::gallery
{

/// SELECT list for a full Gallery row incl. item_count.
constexpr const char* kGallerySelect =
    "SELECT g.id, g.tenant_id::text AS tenant_id, "
    "g.owner_id::text AS owner_id, g.slug, g.title, "
    "g.description, g.cover_asset_id, "
    "g.created_at::text AS created_at, "
    "g.updated_at::text AS updated_at, "
    "(SELECT count(*) FROM gallery_items i "
    " WHERE i.gallery_id = g.id) AS item_count "
    "FROM galleries g ";

} // namespace services::gallery
