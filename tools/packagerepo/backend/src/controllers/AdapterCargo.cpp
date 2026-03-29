/**
 * @file AdapterCargo.cpp
 * @brief Cargo sparse registry protocol adapter implementation.
 */

#include "AdapterCargo.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void CargoAdapterCtrl::crateMeta(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name)
{
    auto vers = pg_artifact::versions(
        Globals::repoType, "cargo", name);

    if (vers.empty()) {
        auto r = HttpResponse::newHttpJsonResponse(
            Json::Value{});
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }

    auto maxVer = vers[0]["version"].asString();

    Json::Value doc;
    doc["crate"]["id"] = name;
    doc["crate"]["name"] = name;
    doc["crate"]["max_version"] = maxVer;
    doc["versions"] = Json::arrayValue;

    for (const auto& v : vers) {
        auto ver = v["version"].asString();
        Json::Value entry;
        entry["num"] = ver;
        entry["dl_path"] =
            "/cargo/api/v1/crates/" + name
            + "/" + ver + "/download";
        doc["versions"].append(entry);
    }

    auto r = HttpResponse::newHttpJsonResponse(doc);
    cb(r);
}

void CargoAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& version)
{
    serveBlob(
        "cargo", name, version, "default",
        "application/x-tar", cb);
}

} // namespace repo
