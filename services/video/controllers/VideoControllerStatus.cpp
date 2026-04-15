/**
 * @file VideoControllerStatus.cpp
 * @brief GET /api/video/{id} — progress + renditions.
 */

#include "video/controllers/VideoController.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

namespace controllers
{

void VideoController::status(
    const drogon::HttpRequestPtr& req,
    std::function<void(const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto db = drogon::app().getDbClient();
    nlohmann::json out{{"assetId", id}};

    const auto tj = db->execSqlSync(
        "SELECT status, progress, error FROM transcode_jobs "
        "WHERE asset_id=$1 ORDER BY id DESC LIMIT 1",
        id);
    if (tj.empty()) {
        auto r = drogon::HttpResponse::newHttpResponse();
        r->setStatusCode(drogon::k404NotFound);
        cb(r);
        return;
    }
    out["status"]   = tj[0]["status"].as<std::string>();
    out["progress"] = tj[0]["progress"].as<int>();
    if (!tj[0]["error"].isNull())
        out["error"] = tj[0]["error"].as<std::string>();

    nlohmann::json rends = nlohmann::json::array();
    const auto rs = db->execSqlSync(
        "SELECT kind, ladder, s3_key, bytes FROM video_renditions "
        "WHERE asset_id=$1 ORDER BY id",
        id);
    for (const auto& r : rs) {
        rends.push_back({
            {"kind",   r["kind"].as<std::string>()},
            {"ladder", r["ladder"].as<std::string>()},
            {"s3Key",  r["s3_key"].as<std::string>()},
            {"bytes",  r["bytes"].as<std::int64_t>()},
        });
    }
    out["renditions"] = rends;

    auto r = drogon::HttpResponse::newHttpResponse();
    r->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    r->setBody(out.dump());
    cb(r);
}

}  // namespace controllers
