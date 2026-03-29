/**
 * @file AdapterOci.cpp
 * @brief OCI Distribution protocol adapter.
 *
 * Implements the OCI Distribution Spec v2 ping,
 * manifest, and blob endpoints for docker/podman.
 */

#include "AdapterOci.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void OciAdapterCtrl::ping(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto r = HttpResponse::newHttpJsonResponse(
        Json::Value(Json::objectValue));
    cb(r);
}

void OciAdapterCtrl::pingSlash(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    ping(req, std::move(cb));
}

void OciAdapterCtrl::manifest(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& reference)
{
    auto vers = pg_artifact::versions(
        Globals::repoType, "docker", name);

    // Find version matching tag or digest.
    Json::Value match;
    for (const auto& v : vers) {
        if (v["version"].asString() == reference ||
            v["blob_digest"].asString() == reference) {
            match = v;
            break;
        }
    }
    if (match.isNull()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    auto digest = match["blob_digest"].asString();
    auto size = match["blob_size"].asInt64();

    std::string json =
        "{\"schemaVersion\":2,"
        "\"mediaType\":\"application/vnd.oci."
        "image.manifest.v1+json\","
        "\"config\":{\"mediaType\":\"application/"
        "vnd.oci.image.config.v1+json\","
        "\"size\":0,\"digest\":\"sha256:empty\"},"
        "\"layers\":[{\"mediaType\":\"application/"
        "vnd.oci.image.layer.v1.tar+gzip\","
        "\"size\":" + std::to_string(size)
        + ",\"digest\":\"" + digest + "\"}]}";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString(
        "application/vnd.oci.image.manifest.v1+json");
    r->setBody(std::move(json));
    cb(r);
}

void OciAdapterCtrl::blob(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name,
    const std::string& digest)
{
    auto vers = pg_artifact::versions(
        Globals::repoType, "docker", name);

    for (const auto& v : vers) {
        if (v["blob_digest"].asString() == digest) {
            auto ver = v["version"].asString();
            serveBlob("docker", name, ver, "default",
                      "application/octet-stream", cb);
            return;
        }
    }
    cb(HttpResponse::newNotFoundResponse());
}

} // namespace repo
