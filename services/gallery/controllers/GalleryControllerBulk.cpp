/**
 * @file GalleryControllerBulk.cpp
 * @brief Bulk import endpoint for the gallery daemon.
 */

#include "GalleryController.h"
#include "gallery/backend/BulkImport.h"
#include "gallery/backend/GalleryStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/backend/SearchEventPublisher.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using namespace drogon;
using Cb = controllers::GalleryController::Cb;

namespace controllers
{

void GalleryController::bulk(
    const HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    try {
        auto body = nlohmann::json::parse(
            std::string(req->getBody()), nullptr, false);
        if (body.is_discarded()
            || !body.contains("entries")
            || !body["entries"].is_array()) {
            cb(::utils::jsonError(
                k400BadRequest, "entries[] required"));
            return;
        }
        std::vector<
            services::gallery::BulkImportEntry> list;
        list.reserve(body["entries"].size());
        for (const auto& e : body["entries"]) {
            services::gallery::BulkImportEntry b;
            b.sourceKey =
                e.value("source_key", std::string{});
            b.mime =
                e.value("mime", std::string{"image/jpeg"});
            b.caption =
                e.value("caption", std::string{});
            if (!b.sourceKey.empty())
                list.push_back(std::move(b));
        }
        services::gallery::BulkImport importer;
        auto res = importer.run(std::stoll(id), list);
        nlohmann::json out{
            {"enqueued", res.enqueued},
            {"skipped", res.skipped},
            {"asset_ids", res.assetIds},
        };
        if (res.enqueued > 0) {
            services::gallery::GalleryStore gs;
            if (auto g = gs.findById(std::stoll(id))) {
                nextra::search::SearchEventPublisher
                    ::publish("upsert", "gallery_items",
                        std::to_string(g->id),
                        {{"slug", g->slug},
                         {"title", g->title},
                         {"description", g->description},
                         {"owner_id", g->ownerId}});
            }
        }
        cb(::utils::jsonOk(out));
    } catch (const std::exception& e) {
        spdlog::error("gallery bulk: {}", e.what());
        cb(::utils::jsonError(
            k500InternalServerError, "bulk failed"));
    }
}

} // namespace controllers
