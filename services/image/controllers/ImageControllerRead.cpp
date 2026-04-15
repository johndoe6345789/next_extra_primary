/**
 * @file ImageControllerRead.cpp
 * @brief GET /api/images/jobs/{id} and /variants.
 */

#include "ImageController.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::image
{

using namespace drogon;

void ImageController::getJob(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT id, source_url, status, attempts, "
        "       error, created_at, finished_at "
        "FROM image_processing_jobs WHERE id=$1", id);
    if (rows.empty())
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }
    const auto& row = rows[0];
    Json::Value body;
    body["id"] = row["id"].as<std::int64_t>();
    body["source_url"] =
        row["source_url"].as<std::string>();
    body["status"] = row["status"].as<std::string>();
    body["attempts"] = row["attempts"].as<int>();
    body["error"] = row["error"].isNull()
        ? Json::Value(Json::nullValue)
        : Json::Value(row["error"].as<std::string>());
    cb(HttpResponse::newHttpJsonResponse(body));
}

void ImageController::listVariants(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT variant_name, width, height, format, "
        "       object_key, bytes "
        "FROM image_variants WHERE job_id=$1 "
        "ORDER BY id", id);
    Json::Value body(Json::arrayValue);
    for (const auto& row : rows)
    {
        Json::Value v;
        v["name"] = row["variant_name"].as<std::string>();
        v["width"] = row["width"].as<int>();
        v["height"] = row["height"].as<int>();
        v["format"] = row["format"].as<std::string>();
        v["object_key"] =
            row["object_key"].as<std::string>();
        v["bytes"] = row["bytes"].as<std::int64_t>();
        body.append(v);
    }
    Json::Value out;
    out["items"] = body;
    cb(HttpResponse::newHttpJsonResponse(out));
}

}  // namespace nextra::image
