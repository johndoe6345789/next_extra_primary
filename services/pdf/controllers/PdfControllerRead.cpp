/**
 * @file PdfControllerRead.cpp
 * @brief GET /api/pdf/{id} — status + download link for a render.
 */

#include "PdfController.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

#include <fstream>
#include <nlohmann/json.hpp>

namespace nextra::pdf
{

using namespace drogon;

namespace
{
std::string s3PublicBase()
{
    std::ifstream f("constants/pdf-generator.json");
    if (!f) return "http://s3:9000";
    nlohmann::json j; f >> j;
    return j.value("s3Endpoint", std::string{"http://s3:9000"});
}
}  // namespace

void PdfController::getRender(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "SELECT id, tenant_id::text, template, s3_key, status, "
        "       error, created_at, completed_at "
        "FROM pdf_renders WHERE id = $1", id);
    if (rows.empty())
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }
    const auto& row = rows[0];
    Json::Value body;
    body["id"]        = row["id"].as<std::int64_t>();
    body["template"]  = row["template"].as<std::string>();
    body["status"]    = row["status"].as<std::string>();
    body["tenant_id"] = row["tenant_id"].isNull()
        ? Json::Value(Json::nullValue)
        : Json::Value(row["tenant_id"].as<std::string>());
    body["created_at"] = row["created_at"].as<std::string>();
    body["completed_at"] = row["completed_at"].isNull()
        ? Json::Value(Json::nullValue)
        : Json::Value(row["completed_at"].as<std::string>());
    body["error"] = row["error"].isNull()
        ? Json::Value(Json::nullValue)
        : Json::Value(row["error"].as<std::string>());
    if (!row["s3_key"].isNull())
    {
        const auto key = row["s3_key"].as<std::string>();
        body["s3_key"] = key;
        body["download_url"] =
            s3PublicBase() + "/pdf-renders/" + key;
    }
    cb(HttpResponse::newHttpJsonResponse(body));
}

}  // namespace nextra::pdf
