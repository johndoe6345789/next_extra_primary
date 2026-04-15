/**
 * @file StreamsControllerCrud.cpp
 * @brief GET /api/streams + POST /api/streams + webhook handling.
 */

#include "StreamsController.h"
#include "streaming/backend/StreamStore.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::streaming
{

using namespace drogon;

static Json::Value toJson(const LiveStream& s)
{
    Json::Value o;
    o["id"]          = static_cast<Json::Int64>(s.id);
    o["slug"]        = s.slug;
    o["title"]       = s.title;
    o["ingest_key"]  = s.ingestKey;
    o["status"]      = statusToString(s.status);
    o["started_at"]  = s.startedAt.value_or("");
    o["ended_at"]    = s.endedAt.value_or("");
    o["recording"]   = s.recordingKey.value_or("");
    return o;
}

void StreamsController::list(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    StreamStore store(app().getDbClient());
    Json::Value items(Json::arrayValue);
    for (const auto& s : store.listAll()) items.append(toJson(s));
    Json::Value body;
    body["items"] = items;
    cb(HttpResponse::newHttpJsonResponse(body));
}

void StreamsController::create(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto j = req->getJsonObject();
    if (!j)
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k400BadRequest);
        r->setBody("{\"error\":\"body required\"}");
        cb(r);
        return;
    }
    const auto slug  = (*j)["slug"].asString();
    const auto title = (*j)["title"].asString();
    if (slug.empty() || title.empty())
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k400BadRequest);
        r->setBody("{\"error\":\"slug, title required\"}");
        cb(r);
        return;
    }
    StreamStore store(app().getDbClient());
    auto s = store.create(slug, title, std::nullopt);
    auto r = HttpResponse::newHttpJsonResponse(toJson(s));
    r->setStatusCode(k201Created);
    cb(r);
}

void StreamsController::publishHook(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto j = req->getJsonObject();
    if (!j)
    {
        cb(HttpResponse::newHttpResponse());
        return;
    }
    const auto path   = (*j).get("path", "").asString();
    const auto action = (*j).get("action", "publish").asString();
    StreamStore store(app().getDbClient());
    auto row = store.getByKey(path);
    if (!row)
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }
    if (action == "publish") store.markLive(row->id);
    else store.markEnded(row->id, std::nullopt);
    cb(HttpResponse::newHttpResponse());
}

}  // namespace nextra::streaming
