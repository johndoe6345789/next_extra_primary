/**
 * @file StreamsControllerAdmin.cpp
 * @brief Admin-only mutating endpoints on /api/streams/{id}/*.
 */

#include "StreamsController.h"
#include "services/streaming/MediamtxClient.h"
#include "services/streaming/StreamStore.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>

#include <fstream>

namespace nextra::streaming
{

using namespace drogon;

static std::string mediamtxUrl()
{
    std::ifstream f("constants/media-streaming.json");
    if (!f) return "http://mediamtx:9997";
    nlohmann::json j;
    f >> j;
    return j.value("mediamtxAdminUrl", std::string{"http://mediamtx:9997"});
}

void StreamsController::remove(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    StreamStore(app().getDbClient()).remove(id);
    auto r = HttpResponse::newHttpResponse();
    r->setStatusCode(k204NoContent);
    cb(r);
}

void StreamsController::block(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    StreamStore(app().getDbClient()).block(id);
    cb(HttpResponse::newHttpResponse());
}

void StreamsController::kick(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    StreamStore store(app().getDbClient());
    auto rows = app().getDbClient()->execSqlSync(
        "SELECT ingest_key FROM live_streams WHERE id=$1", id);
    if (rows.empty())
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }
    MediamtxClient mtx(mediamtxUrl());
    const bool ok = mtx.kickPublisher(
        rows[0]["ingest_key"].as<std::string>());
    Json::Value body;
    body["kicked"] = ok;
    cb(HttpResponse::newHttpJsonResponse(body));
}

}  // namespace nextra::streaming
