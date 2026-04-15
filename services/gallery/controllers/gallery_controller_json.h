#pragma once
/**
 * @file gallery_controller_json.h
 * @brief JSON serializers shared by the gallery controllers.
 */

#include "gallery/backend/GalleryTypes.h"

#include <nlohmann/json.hpp>
#include <string>

namespace controllers
{

/** Convert a Gallery row to wire JSON. */
inline nlohmann::json galleryToJson(
    const services::gallery::Gallery& g)
{
    nlohmann::json j = {
        {"id", g.id},
        {"tenant_id", g.tenantId},
        {"owner_id", g.ownerId},
        {"slug", g.slug},
        {"title", g.title},
        {"description", g.description},
        {"created_at", g.createdAt},
        {"updated_at", g.updatedAt},
        {"item_count", g.itemCount},
    };
    if (g.coverAssetId)
        j["cover_asset_id"] = *g.coverAssetId;
    else
        j["cover_asset_id"] = nullptr;
    return j;
}

/** Convert an array of galleries. */
inline nlohmann::json galleriesToJson(
    const std::vector<services::gallery::Gallery>& v)
{
    auto arr = nlohmann::json::array();
    for (const auto& g : v)
        arr.push_back(galleryToJson(g));
    return arr;
}

/** Convert a GalleryItem row. */
inline nlohmann::json itemToJson(
    const services::gallery::GalleryItem& it)
{
    return {
        {"gallery_id", it.galleryId},
        {"asset_id", it.assetId},
        {"position", it.position},
        {"caption", it.caption},
    };
}

/** Convert an array of items. */
inline nlohmann::json itemsToJson(
    const std::vector<
        services::gallery::GalleryItem>& v)
{
    auto arr = nlohmann::json::array();
    for (const auto& it : v) arr.push_back(itemToJson(it));
    return arr;
}

} // namespace controllers
