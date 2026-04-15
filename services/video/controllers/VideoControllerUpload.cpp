/**
 * @file VideoControllerUpload.cpp
 * @brief POST /api/video — register + enqueue a transcode job.
 */

#include "video/controllers/VideoController.h"

#include "video/backend/VideoJobStore.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

namespace controllers
{

void VideoController::upload(
    const drogon::HttpRequestPtr& req,
    std::function<void(const drogon::HttpResponsePtr&)>&& cb)
{
    nlohmann::json body;
    try {
        body = nlohmann::json::parse(req->getBody());
    } catch (...) {
        auto r = drogon::HttpResponse::newHttpResponse();
        r->setStatusCode(drogon::k400BadRequest);
        r->setBody("invalid json");
        cb(r);
        return;
    }
    const auto sourceKey = body.value("sourceKey", std::string{});
    const auto mime = body.value("mime", std::string{"video/mp4"});
    if (sourceKey.empty()) {
        auto r = drogon::HttpResponse::newHttpResponse();
        r->setStatusCode(drogon::k400BadRequest);
        r->setBody("sourceKey required");
        cb(r);
        return;
    }

    auto db = drogon::app().getDbClient();
    nextra::video::VideoJobStore store(db);
    const auto assetId = store.insertAsset(sourceKey, mime);
    const auto tjId = store.insertTranscodeJob(assetId);

    nlohmann::json payload{
        {"assetId", assetId},
        {"transcodeJobId", tjId},
        {"sourceKey", sourceKey},
        {"mime", mime},
    };
    db->execSqlSync(
        "INSERT INTO job_queue(name,handler,payload) "
        "VALUES('video-transcode','video.transcode',$1::jsonb)",
        payload.dump());

    nlohmann::json out{
        {"assetId", assetId},
        {"transcodeJobId", tjId},
        {"status", "queued"},
    };
    auto r = drogon::HttpResponse::newHttpResponse();
    r->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    r->setBody(out.dump());
    cb(r);
}

}  // namespace controllers
