/**
 * @file AdapterUtil.h
 * @brief Shared helpers for protocol adapter controllers.
 *
 * Every adapter needs to: look up a package, read its blob,
 * increment the download counter, and serve it. This header
 * provides a single inline function for that common pattern.
 */

#pragma once

#include "../services/Globals.h"
#include "../services/PgArtifactQuery.h"
#include "../services/PgArtifactStore.h"

#include <drogon/HttpResponse.h>

#include <string>

namespace repo
{

/// @brief Serve a blob for the given coordinates.
/// @return true if response was sent, false if not found.
inline bool serveBlob(
    const std::string& ns, const std::string& name,
    const std::string& ver, const std::string& variant,
    const std::string& contentType,
    std::function<void(const drogon::HttpResponsePtr&)>& cb)
{
    auto meta = PgArtifactStore::get(
        Globals::repoType, ns, name, ver, variant);
    if (meta.isNull()) {
        cb(drogon::HttpResponse::newNotFoundResponse());
        return false;
    }

    auto data = Globals::blobs->read(
        meta["blob_digest"].asString());
    if (data.empty()) {
        cb(drogon::HttpResponse::newNotFoundResponse());
        return false;
    }

    PgArtifactStore::incrementDownloads(
        Globals::repoType, ns, name, ver, variant);

    auto r = drogon::HttpResponse::newHttpResponse();
    r->setContentTypeString(contentType);
    r->setBody(std::move(data));
    cb(r);
    return true;
}

/// @brief Build base URL from request headers.
inline std::string baseUrl(const drogon::HttpRequestPtr& req)
{
    auto host = req->getHeader("Host");
    auto scheme = req->getHeader("X-Forwarded-Proto");
    if (scheme.empty()) scheme = "http";
    return scheme + "://" + host;
}

/// @brief List all artifacts in a namespace.
inline std::vector<Json::Value> listByNs(
    const std::string& ns)
{
    auto all = pg_artifact::list(Globals::repoType);
    std::vector<Json::Value> out;
    for (auto& p : all) {
        if (p["namespace"].asString() == ns)
            out.push_back(std::move(p));
    }
    return out;
}

} // namespace repo
