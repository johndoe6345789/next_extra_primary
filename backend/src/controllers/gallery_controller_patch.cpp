/**
 * @file gallery_controller_patch.cpp
 * @brief Gallery patch + delete endpoints.
 */

#include "GalleryController.h"
#include "gallery_controller_json.h"
#include "../services/gallery/GalleryStore.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using namespace drogon;
using Cb = controllers::GalleryController::Cb;

namespace controllers
{

void GalleryController::patch(
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
        services::gallery::GalleryPatch p;
        if (body.contains("title"))
            p.title = body["title"].get<std::string>();
        if (body.contains("description"))
            p.description =
                body["description"].get<std::string>();
        if (body.contains("cover_asset_id")
            && body["cover_asset_id"].is_number())
            p.coverAssetId =
                body["cover_asset_id"]
                    .get<std::int64_t>();
        services::gallery::GalleryStore store;
        auto g = store.patch(std::stoll(id), p);
        if (!g) {
            cb(::utils::jsonError(
                k404NotFound, "gallery not found"));
            return;
        }
        cb(::utils::jsonOk(
            {{"gallery", galleryToJson(*g)}}));
    } catch (const std::exception& e) {
        spdlog::error("gallery patch: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "patch failed"));
    }
}

void GalleryController::remove(
    const HttpRequestPtr&, Cb&& cb,
    const std::string& id)
{
    services::gallery::GalleryStore store;
    if (!store.remove(std::stoll(id))) {
        cb(::utils::jsonError(
            k404NotFound, "gallery not found"));
        return;
    }
    cb(::utils::jsonOk({{"deleted", true}}));
}

} // namespace controllers
