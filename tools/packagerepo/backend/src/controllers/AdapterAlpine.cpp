/**
 * @file AdapterAlpine.cpp
 * @brief Alpine APK repository protocol adapter.
 *
 * Generates APKINDEX and serves .apk blobs for
 * Alpine Linux apk clients.
 */

#include "AdapterAlpine.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void AlpineAdapterCtrl::apkIndex(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& branch,
    const std::string& arch)
{
    auto pkgs = listByNs("alpine");

    std::string body;
    for (const auto& p : pkgs) {
        auto name = p["name"].asString();
        auto ver = p["version"].asString();
        auto size = p["blob_size"].asInt64();

        body += "P:" + name + "\n";
        body += "V:" + ver + "\n";
        body += "A:" + arch + "\n";
        body += "S:" + std::to_string(size) + "\n";
        body += "T:" + name + " package\n";
        body += "\n";
    }

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("text/plain");
    r->setBody(std::move(body));
    cb(r);
}

void AlpineAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& file)
{
    // Parse: {name}-{version}.apk
    auto dotApk = file.rfind(".apk");
    if (dotApk == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto stem = file.substr(0, dotApk);
    auto dash = stem.rfind('-');
    if (dash == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto name = stem.substr(0, dash);
    auto ver = stem.substr(dash + 1);

    serveBlob("alpine", name, ver, "default",
              "application/vnd.android.package-archive",
              cb);
}

} // namespace repo
