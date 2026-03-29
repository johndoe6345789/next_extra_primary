/**
 * @file AdapterConan.cpp
 * @brief Conan 2 registry protocol adapter.
 *
 * Implements enough of the Conan v2 revisions API so that
 * `conan install --requires=pkg/ver` works with this server.
 */

#include "AdapterCtrl.h"
#include "../services/AdapterGlobals.h"
#include "../services/Globals.h"
#include "../services/PgArtifactQuery.h"
#include "../services/PgArtifactStore.h"

using namespace drogon;

namespace repo
{

void AdapterCtrl::conanRecipe(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& version)
{
    auto* a = AdapterGlobals::byName("conan");
    auto ns = a ? a->ns : std::string("conan");

    auto meta = PgArtifactStore::get(
        Globals::repoType, ns, name, version, "default");
    if (meta.isNull()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    Json::Value doc;
    doc["name"] = name;
    doc["version"] = version;
    doc["user"] = "_";
    doc["channel"] = "_";
    cb(HttpResponse::newHttpJsonResponse(doc));
}

void AdapterCtrl::conanRevisions(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& version)
{
    auto* a = AdapterGlobals::byName("conan");
    auto ns = a ? a->ns : std::string("conan");

    auto meta = PgArtifactStore::get(
        Globals::repoType, ns, name, version, "default");
    if (meta.isNull()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    // Use blob digest as the revision ID.
    auto digest = meta["blob_digest"].asString();
    auto rev = digest.substr(digest.find(':') + 1, 12);

    Json::Value doc;
    doc["revisions"] = Json::arrayValue;
    Json::Value entry;
    entry["revision"] = rev;
    entry["time"] = "2026-01-01T00:00:00Z";
    doc["revisions"].append(entry);

    cb(HttpResponse::newHttpJsonResponse(doc));
}

void AdapterCtrl::conanDownload(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& ver,
    const std::string& rev,
    const std::string& file)
{
    auto* a = AdapterGlobals::byName("conan");
    auto ns = a ? a->ns : std::string("conan");

    auto meta = PgArtifactStore::get(
        Globals::repoType, ns, name, ver, "default");
    if (meta.isNull()) {
        cb(HttpResponse::newNotFoundResponse());
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
