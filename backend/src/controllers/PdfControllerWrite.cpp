/**
 * @file PdfControllerWrite.cpp
 * @brief POST /api/pdf/render — enqueue an HTML -> PDF job.
 */

#include "PdfController.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace nextra::pdf
{

using namespace drogon;

void PdfController::enqueueRender(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto json = req->getJsonObject();
    if (!json || !json->isMember("template") || !json->isMember("html"))
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k400BadRequest);
        r->setBody("{\"error\":\"template and html required\"}");
        r->setContentTypeCode(CT_APPLICATION_JSON);
        cb(r);
        return;
    }

    const auto templateName = (*json)["template"].asString();
    const auto html         = (*json)["html"].asString();
    const bool hasTenant    = json->isMember("tenant_id") &&
                              !(*json)["tenant_id"].isNull();
    const auto tenantId     = hasTenant
        ? (*json)["tenant_id"].asString() : std::string{};

    auto db = app().getDbClient();
    auto rows = hasTenant
        ? db->execSqlSync(
            "INSERT INTO pdf_renders "
            "(tenant_id, template, source_html, status) "
            "VALUES ($1::uuid, $2, $3, 'queued') RETURNING id",
            tenantId, templateName, html)
        : db->execSqlSync(
            "INSERT INTO pdf_renders "
            "(template, source_html, status) "
            "VALUES ($1, $2, 'queued') RETURNING id",
            templateName, html);

    const auto renderId = rows[0]["id"].as<std::int64_t>();
    const auto payload = std::string{"{\"render_id\":"} +
                         std::to_string(renderId) + "}";

    db->execSqlSync(
        "INSERT INTO job_queue "
        "(name, handler, payload, priority, max_attempts, "
        " backoff_strategy) "
        "VALUES ($1,$2,$3::jsonb,$4,$5,'exponential')",
        std::string{"pdf:"} + templateName,
        std::string{"pdf.render"},
        payload, 100, 3);

    spdlog::info("pdf: enqueued render id={} template={}",
                 renderId, templateName);

    Json::Value body;
    body["id"]     = static_cast<Json::Int64>(renderId);
    body["status"] = "queued";
    cb(HttpResponse::newHttpJsonResponse(body));
}

}  // namespace nextra::pdf
