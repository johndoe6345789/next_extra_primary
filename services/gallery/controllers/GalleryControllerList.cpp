/**
 * @file GalleryControllerList.cpp
 * @brief Gallery list / create endpoints.
 */

#include "GalleryController.h"
#include "gallery_controller_json.h"
#include "gallery/backend/GalleryStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/backend/SearchEventPublisher.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using namespace drogon;
using Cb = controllers::GalleryController::Cb;

namespace controllers
{

void GalleryController::list(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto tenant = req->attributes()->get<
            std::string>("tenant_id");
        services::gallery::GalleryStore store;
        auto rows = store.listForTenant(tenant, 200);
        cb(::utils::jsonOk(
            {{"galleries", galleriesToJson(rows)}}));
    } catch (const std::exception& e) {
        spdlog::error("gallery list: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "list failed"));
    }
}

void GalleryController::create(
    const HttpRequestPtr& req, Cb&& cb)
{
    try {
        auto body = nlohmann::json::parse(
            std::string(req->getBody()), nullptr, false);
        if (body.is_discarded() || !body.is_object()) {
            cb(::utils::jsonError(
                k400BadRequest, "invalid body"));
            return;
        }
        services::gallery::Gallery g;
        g.tenantId = req->attributes()->get<
            std::string>("tenant_id");
        g.ownerId = req->attributes()->get<
            std::string>("user_id");
        g.slug = body.value("slug", "");
        g.title = body.value("title", "");
        g.description = body.value("description", "");
        if (g.slug.empty() || g.title.empty()) {
            cb(::utils::jsonError(
                k400BadRequest,
                "slug and title required"));
            return;
        }
        services::gallery::GalleryStore store;
        auto out = store.create(g);
        nextra::search::SearchEventPublisher::publish(
            "upsert", "gallery_items",
            std::to_string(out.id),
            {{"slug", out.slug},
             {"title", out.title},
             {"description", out.description},
             {"owner_id", out.ownerId}});
        cb(::utils::jsonCreated(
            {{"gallery", galleryToJson(out)}}));
    } catch (const std::exception& e) {
        spdlog::error("gallery create: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "create failed"));
    }
}

} // namespace controllers
