/**
 * @file OrderingHelpers.cpp
 * @brief Dense-pack and explicit reorder for gallery_items.
 */

#include "OrderingHelpers.h"

#include <drogon/drogon.h>

using namespace drogon;

namespace services::gallery
{

void OrderingHelpers::renumber(std::int64_t galleryId)
{
    auto db = app().getDbClient();
    db->execSqlSync(
        "WITH ranked AS ("
        " SELECT asset_id, "
        " row_number() OVER ("
        "  ORDER BY position ASC, asset_id ASC"
        " ) - 1 AS new_pos "
        " FROM gallery_items WHERE gallery_id = $1"
        ") UPDATE gallery_items i SET position = r.new_pos "
        "FROM ranked r WHERE i.gallery_id = $1 "
        "AND i.asset_id = r.asset_id",
        galleryId);
}

void OrderingHelpers::reorder(
    std::int64_t galleryId,
    const std::vector<std::int64_t>& assetIds)
{
    auto db = app().getDbClient();
    // Push unknown items far out so they end up last.
    db->execSqlSync(
        "UPDATE gallery_items SET position = position "
        "+ 100000 WHERE gallery_id = $1",
        galleryId);
    int idx = 0;
    for (auto a : assetIds)
    {
        db->execSqlSync(
            "UPDATE gallery_items SET position = $3 "
            "WHERE gallery_id = $1 AND asset_id = $2",
            galleryId, a, idx++);
    }
    renumber(galleryId);
}

} // namespace services::gallery
