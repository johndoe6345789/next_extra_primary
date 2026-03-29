/**
 * @file AdapterGo.cpp
 * @brief Go module proxy protocol adapter implementation.
 */

#include "AdapterGo.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void GoAdapterCtrl::list(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name)
{
    auto vers = pg_artifact::versions(
        Globals::repoType, "go", name);

    std::string body;
    for (const auto& v : vers)
        body += v["version"].asString() + "\n";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("text/plain");
    r->setBody(std::move(body));
    cb(r);
}

void GoAdapterCtrl::info(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& version)
{
    auto vers = pg_artifact::versions(
        Globals::repoType, "go", name);

    for (const auto& v : vers) {
        if (v["version"].asString() != version)
            continue;

        Json::Value doc;
        doc["Version"] = "v" + version;
        doc["Time"] = v["created_at"].asString();

        auto r =
            HttpResponse::newHttpJsonResponse(doc);
        cb(r);
        return;
    }

    cb(HttpResponse::newNotFoundResponse());
}

void GoAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& version)
{
    serveBlob(
        "go", name, version, "default",
        "application/zip", cb);
}

} // namespace repo
