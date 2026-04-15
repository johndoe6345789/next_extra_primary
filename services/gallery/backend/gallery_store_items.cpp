/**
 * @file gallery_store_items.cpp
 * @brief GalleryStore methods for the gallery_items join table.
 */

#include "GalleryStore.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::gallery
{

GalleryItem GalleryStore::rowToItem(const Row& r) const
{
    GalleryItem it;
    it.galleryId = r["gallery_id"].as<std::int64_t>();
    it.assetId = r["asset_id"].as<std::int64_t>();
    it.position = r["position"].as<int>();
    it.caption = r["caption"].as<std::string>();
    return it;
}

std::vector<GalleryItem>
GalleryStore::listItems(std::int64_t galleryId)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "SELECT gallery_id, asset_id, position, caption "
        "FROM gallery_items WHERE gallery_id = $1 "
        "ORDER BY position ASC, asset_id ASC",
        galleryId);
    std::vector<GalleryItem> out;
    out.reserve(r.size());
    for (const auto& row : r)
        out.push_back(rowToItem(row));
    return out;
}

GalleryItem GalleryStore::appendItem(
    std::int64_t galleryId, std::int64_t assetId,
    const std::string& caption)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "INSERT INTO gallery_items "
        "(gallery_id, asset_id, position, caption) "
        "VALUES ($1, $2, "
        "COALESCE((SELECT MAX(position)+1 "
        " FROM gallery_items WHERE gallery_id=$1), 0), "
        "$3) ON CONFLICT DO NOTHING",
        galleryId, assetId, caption);
    auto r = db->execSqlSync(
        "SELECT gallery_id, asset_id, position, caption "
        "FROM gallery_items WHERE gallery_id=$1 "
        "AND asset_id=$2",
        galleryId, assetId);
    return rowToItem(r[0]);
}

bool GalleryStore::removeItem(
    std::int64_t galleryId, std::int64_t assetId)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "DELETE FROM gallery_items "
        "WHERE gallery_id=$1 AND asset_id=$2",
        galleryId, assetId);
    return r.affectedRows() > 0;
}

} // namespace services::gallery
