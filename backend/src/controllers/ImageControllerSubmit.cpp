/**
 * @file ImageControllerSubmit.cpp
 * @brief POST /api/images/jobs — enqueue a job.
 */

#include "ImageController.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <json/json.h>

namespace nextra::image
{

using namespace drogon;

void ImageController::submitJob(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    const auto json = req->getJsonObject();
    if (!json || !json->isMember("source_url"))
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k400BadRequest);
        cb(r);
        return;
    }
    const auto url = (*json)["source_url"].asString();
    Json::FastWriter writer;
    const auto variants =
        json->isMember("variants")
            ? writer.write((*json)["variants"])
            : std::string("[]");
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "INSERT INTO image_processing_jobs("
        " source_url, variants_json) "
        "VALUES($1, $2::jsonb) RETURNING id",
        url, variants);
    Json::Value body;
    body["id"] = rows[0]["id"].as<std::int64_t>();
    body["status"] = "pending";
    auto resp = HttpResponse::newHttpJsonResponse(body);
    resp->setStatusCode(k201Created);
    cb(resp);
}

}  // namespace nextra::image
