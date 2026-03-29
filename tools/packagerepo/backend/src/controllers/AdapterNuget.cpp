/**
 * @file AdapterNuget.cpp
 * @brief NuGet v3 protocol adapter.
 *
 * Implements the NuGet v3 API so that `dotnet restore`
 * and `nuget install` work against this server.
 */

#include "AdapterNuget.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void NugetAdapterCtrl::serviceIndex(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto base = baseUrl(req);

    Json::Value reg;
    reg["@id"] = base + "/nuget/v3/registration/";
    reg["@type"] = "RegistrationsBaseUrl";

    Json::Value flat;
    flat["@id"] = base + "/nuget/v3/flatcontainer/";
    flat["@type"] = "PackageBaseAddress/3.0.0";

    Json::Value doc;
    doc["version"] = "3.0.0";
    doc["resources"] = Json::arrayValue;
    doc["resources"].append(reg);
    doc["resources"].append(flat);

    cb(HttpResponse::newHttpJsonResponse(doc));
}

void NugetAdapterCtrl::registration(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto* a = AdapterGlobals::byName("nuget");
    auto ns = a ? a->ns : std::string("nuget");
    auto base = baseUrl(req);

    auto vers = pg_artifact::versions(
        Globals::repoType, ns, id);

    if (vers.empty()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    Json::Value entries(Json::arrayValue);
    for (const auto& v : vers) {
        auto ver = v["version"].asString();
        Json::Value entry;
        entry["catalogEntry"]["id"] = id;
        entry["catalogEntry"]["version"] = ver;
        entry["packageContent"] = base
            + "/nuget/v3/flatcontainer/" + id + "/"
            + ver + "/" + id + "." + ver + ".nupkg";
        entries.append(entry);
    }

    Json::Value page;
    page["items"] = entries;

    Json::Value doc;
    doc["items"] = Json::arrayValue;
    doc["items"].append(page);

    cb(HttpResponse::newHttpJsonResponse(doc));
}

void NugetAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& id,
    const std::string& version,
    const std::string& /*file*/)
{
    auto* a = AdapterGlobals::byName("nuget");
    auto ns = a ? a->ns : std::string("nuget");

    serveBlob(ns, id, version, "default",
              "application/octet-stream", cb);
}

} // namespace repo
