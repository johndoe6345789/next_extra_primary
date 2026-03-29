/**
 * @file AdapterRubygems.cpp
 * @brief RubyGems API protocol adapter implementation.
 */

#include "AdapterRubygems.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void RubygemsAdapterCtrl::gemInfo(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name)
{
    auto latest = pg_artifact::latest(
        Globals::repoType, "rubygems", name);

    if (latest.isNull()) {
        auto r = HttpResponse::newHttpJsonResponse(
            Json::Value{});
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }

    auto ver = latest["version"].asString();
    auto digest = latest["blob_digest"].asString();

    Json::Value doc;
    doc["name"] = name;
    doc["version"] = ver;
    doc["sha"] = digest;
    doc["gem_uri"] =
        "/rubygems/gems/" + name + "-" + ver + ".gem";

    auto r = HttpResponse::newHttpJsonResponse(doc);
    cb(r);
}

void RubygemsAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& file)
{
    // Parse "{name}-{version}.gem"
    auto pos = file.rfind(".gem");
    auto stem = (pos != std::string::npos)
                    ? file.substr(0, pos) : file;
    auto dash = stem.rfind('-');
    if (dash == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto name = stem.substr(0, dash);
    auto ver = stem.substr(dash + 1);

    serveBlob(
        "rubygems", name, ver, "default",
        "application/octet-stream", cb);
}

} // namespace repo
