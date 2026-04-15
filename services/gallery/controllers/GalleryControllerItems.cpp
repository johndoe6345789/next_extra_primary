/**
 * @file GalleryControllerItems.cpp
 * @brief Gallery item list / add / remove endpoints.
 */

#include "GalleryController.h"
#include "gallery_controller_json.h"
#include "gallery/backend/GalleryStore.h"
#include "gallery/backend/OrderingHelpers.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using namespace drogon;
using Cb = controllers::GalleryController::Cb;

namespace controllers
{

void GalleryController::items(
    const HttpRequestPtr&, Cb&& cb,
    const std::string& id)
{
    try {
        services::gallery::GalleryStore store;
        auto rows = store.listItems(std::stoll(id));
        cb(::utils::jsonOk(
            {{"items", itemsToJson(rows)}}));
    } catch (const std::exception& e) {
        spdlog::error("gallery items: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "items failed"));
    }
}

void GalleryController::addItem(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    try {
        auto body = nlohmann::json::parse(
            std::string(req->getBody()), nullptr, false);
        if (body.is_discarded() || !body.is_object()) {
            cb(::utils::jsonError(
                k400BadRequest, "invalid body"));
            return;
        }
        auto assetId =
            body.value<std::int64_t>("asset_id", 0);
        auto caption =
            body.value<std::string>("caption", "");
        if (assetId <= 0) {
            cb(::utils::jsonError(
                k400BadRequest, "asset_id required"));
            return;
        }
        services::gallery::GalleryStore store;
        auto it = store.appendItem(
            std::stoll(id), assetId, caption);
        cb(::utils::jsonCreated(
            {{"item", itemToJson(it)}}));
    } catch (const std::exception& e) {
        spdlog::error("gallery addItem: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "add failed"));
    }
}

void GalleryController::removeItem(
    const HttpRequestPtr&, Cb&& cb,
    const std::string& id,
    const std::string& asset)
{
    auto gid = std::stoll(id);
    services::gallery::GalleryStore store;
    if (!store.removeItem(gid, std::stoll(asset))) {
        cb(::utils::jsonError(
            k404NotFound, "item not found"));
        return;
    }
    services::gallery::OrderingHelpers::renumber(gid);
    cb(::utils::jsonOk({{"deleted", true}}));
}

} // namespace controllers
