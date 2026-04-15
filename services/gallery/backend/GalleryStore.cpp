/**
 * @file GalleryStore.cpp
 * @brief Gallery read paths; writes live in gallery_store_write.
 */

#include "GalleryStore.h"
#include "gallery_store_sql.h"

#include <drogon/drogon.h>

using namespace drogon;
using namespace drogon::orm;

namespace services::gallery
{

Gallery GalleryStore::rowToGallery(const Row& r) const
{
    Gallery g;
    g.id = r["id"].as<std::int64_t>();
    if (!r["tenant_id"].isNull())
        g.tenantId = r["tenant_id"].as<std::string>();
    if (!r["owner_id"].isNull())
        g.ownerId = r["owner_id"].as<std::string>();
    g.slug = r["slug"].as<std::string>();
    g.title = r["title"].as<std::string>();
    g.description = r["description"].as<std::string>();
    if (!r["cover_asset_id"].isNull())
        g.coverAssetId =
            r["cover_asset_id"].as<std::int64_t>();
    g.createdAt = r["created_at"].as<std::string>();
    g.updatedAt = r["updated_at"].as<std::string>();
    if (!r["item_count"].isNull())
        g.itemCount = r["item_count"].as<int>();
    return g;
}

std::vector<Gallery>
GalleryStore::listForTenant(
    const std::string& tenantId, int limit)
{
    std::vector<Gallery> out;
    auto db = app().getDbClient();
    auto r = tenantId.empty()
        ? db->execSqlSync(
              std::string(kGallerySelect) +
              "ORDER BY g.created_at DESC LIMIT $1",
              limit)
        : db->execSqlSync(
              std::string(kGallerySelect) +
              "WHERE g.tenant_id = $1::uuid "
              "ORDER BY g.created_at DESC LIMIT $2",
              tenantId, limit);
    out.reserve(r.size());
    for (const auto& row : r)
        out.push_back(rowToGallery(row));
    return out;
}

std::optional<Gallery>
GalleryStore::findById(std::int64_t id)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        std::string(kGallerySelect) +
        "WHERE g.id = $1", id);
    if (r.empty()) return std::nullopt;
    return rowToGallery(r[0]);
}

} // namespace services::gallery
