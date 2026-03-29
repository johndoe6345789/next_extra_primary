/**
 * @file AdapterNpm.cpp
 * @brief npm registry protocol adapter.
 *
 * Implements the npm registry v1 API so that
 * `npm install pkg@ver --registry http://host/npm/` works.
 */

#include "AdapterCtrl.h"
#include "../services/AdapterGlobals.h"
#include "../services/Globals.h"
#include "../services/PgArtifactQuery.h"
#include "../services/PgArtifactStore.h"

using namespace drogon;

namespace repo
{

void NpmAdapterCtrl::meta(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name)
{
    auto* a = AdapterGlobals::byName("npm");
    auto ns = a ? a->ns : std::string("npm");

    auto vers = pg_artifact::versions(
        Globals::repoType, ns, name);

    if (vers.empty()) {
        auto r = HttpResponse::newHttpJsonResponse(Json::Value{});
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }

    auto host = req->getHeader("Host");
    auto scheme = req->getHeader("X-Forwarded-Proto");
    if (scheme.empty()) scheme = "http";
    auto base = scheme + "://" + host;

    Json::Value doc;
    doc["name"] = name;
    doc["versions"] = Json::objectValue;
    doc["dist-tags"]["latest"] = vers[0]["version"].asString();

    for (const auto& v : vers) {
        auto ver = v["version"].asString();
        auto digest = v["blob_digest"].asString();
        auto tarball = base + "/npm/-/" + name + "/"
                       + name + "-" + ver + ".tgz";

        Json::Value entry;
        entry["name"] = name;
        entry["version"] = ver;
        entry["dist"]["tarball"] = tarball;
        entry["dist"]["shasum"] = digest;
        doc["versions"][ver] = entry;
    }

    auto r = HttpResponse::newHttpJsonResponse(doc);
    r->addHeader("Content-Type", "application/json");
    cb(r);
}

void NpmAdapterCtrl::tarball(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& tarball)
{
    // Parse version from tarball: "{name}-{version}.tgz"
    auto prefix = name + "-";
    auto suffix = std::string(".tgz");
    auto ver = tarball;
    if (ver.find(prefix) == 0)
        ver = ver.substr(prefix.size());
    if (ver.size() > suffix.size() &&
        ver.substr(ver.size() - suffix.size()) == suffix)
        ver = ver.substr(0, ver.size() - suffix.size());

    auto* a = AdapterGlobals::byName("npm");
    auto ns = a ? a->ns : std::string("npm");

    auto meta = PgArtifactStore::get(
        Globals::repoType, ns, name, ver, "default");
    if (meta.isNull()) {
        auto r = HttpResponse::newNotFoundResponse();
        cb(r);
        return;
    }

    auto data = Globals::blobs->read(
        meta["blob_digest"].asString());
    if (data.empty()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    PgArtifactStore::incrementDownloads(
        Globals::repoType, ns, name, ver, "default");

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeCode(CT_APPLICATION_OCTET_STREAM);
    r->setBody(std::move(data));
    cb(r);
}

} // namespace repo
