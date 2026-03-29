/**
 * @file AdapterComposer.cpp
 * @brief Composer/Packagist protocol adapter.
 *
 * Implements the Composer v2 repository API so that
 * `composer require vendor/pkg` works against this server.
 */

#include "AdapterComposer.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void ComposerAdapterCtrl::packagesJson(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    Json::Value doc;
    doc["packages"] = Json::objectValue;
    doc["metadata-url"] =
        "/composer/p2/%package%.json";

    cb(HttpResponse::newHttpJsonResponse(doc));
}

void ComposerAdapterCtrl::provider(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& vendor,
    const std::string& package)
{
    auto* a = AdapterGlobals::byName("composer");
    auto ns = a ? a->ns : std::string("composer");
    auto base = baseUrl(req);

    auto vers = pg_artifact::versions(
        Globals::repoType, vendor, package);

    if (vers.empty()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    auto fullName = vendor + "/" + package;
    Json::Value entries(Json::arrayValue);

    for (const auto& v : vers) {
        auto ver = v["version"].asString();
        Json::Value entry;
        entry["name"] = fullName;
        entry["version"] = ver;
        entry["dist"]["url"] = base
            + "/composer/dist/" + vendor + "/"
            + package + "/" + ver + ".zip";
        entry["dist"]["type"] = "zip";
        entries.append(entry);
    }

    Json::Value doc;
    doc["packages"][fullName] = entries;

    cb(HttpResponse::newHttpJsonResponse(doc));
}

void ComposerAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& vendor,
    const std::string& package,
    const std::string& version)
{
    auto* a = AdapterGlobals::byName("composer");
    auto ns = a ? a->ns : std::string("composer");

    serveBlob(vendor, package, version, "default",
              "application/zip", cb);
}

} // namespace repo
