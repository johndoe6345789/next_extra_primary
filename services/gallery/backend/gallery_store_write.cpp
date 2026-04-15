/**
 * @file gallery_store_write.cpp
 * @brief GalleryStore create / patch / delete methods.
 */

#include "GalleryStore.h"

#include <drogon/drogon.h>

using namespace drogon;

namespace services::gallery
{

Gallery GalleryStore::create(const Gallery& in)
{
    auto db = app().getDbClient();
    auto r = db->execSqlSync(
        "INSERT INTO galleries "
        "(tenant_id, owner_id, slug, title, description) "
        "VALUES (NULLIF($1,'')::uuid, "
        "NULLIF($2,'')::uuid, $3, $4, $5) "
        "RETURNING id",
        in.tenantId, in.ownerId, in.slug, in.title,
        in.description);
    auto id = r[0]["id"].as<std::int64_t>();
    return findById(id).value();
}

std::optional<Gallery> GalleryStore::patch(
    std::int64_t id, const GalleryPatch& p)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "UPDATE galleries SET "
        "title = COALESCE($2, title), "
        "description = COALESCE($3, description), "
        "cover_asset_id = "
        " COALESCE($4, cover_asset_id), "
        "updated_at = now() WHERE id = $1",
        id,
        p.title.value_or(std::string{}),
        p.description.value_or(std::string{}),
        p.coverAssetId.value_or(0));
    return findById(id);
}

bool GalleryStore::remove(std::int64_t id)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "DELETE FROM gallery_items WHERE gallery_id=$1",
        id);
    auto r = db->execSqlSync(
        "DELETE FROM galleries WHERE id = $1", id);
    return r.affectedRows() > 0;
}

} // namespace services::gallery
