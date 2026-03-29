/**
 * @file AdapterHelm.cpp
 * @brief Helm chart repository protocol adapter.
 *
 * Generates index.yaml and serves .tgz chart blobs
 * for Helm clients.
 */

#include "AdapterHelm.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void HelmAdapterCtrl::index(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto pkgs = listByNs("helm");

    // Group versions by package name.
    std::map<std::string, std::vector<Json::Value>> byName;
    for (const auto& p : pkgs)
        byName[p["name"].asString()].push_back(p);

    std::string yaml = "apiVersion: v1\nentries:\n";
    for (const auto& [name, vers] : byName) {
        yaml += "  " + name + ":\n";
        for (const auto& v : vers) {
            auto ver = v["version"].asString();
            yaml += "  - name: " + name + "\n";
            yaml += "    version: " + ver + "\n";
            yaml += "    urls:\n";
            yaml += "    - charts/" + name + "-"
                    + ver + ".tgz\n";
        }
    }

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("application/x-yaml");
    r->setBody(std::move(yaml));
    cb(r);
}

void HelmAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& file)
{
    // Parse: {name}-{version}.tgz
    auto dotTgz = file.rfind(".tgz");
    if (dotTgz == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto stem = file.substr(0, dotTgz);
    auto dash = stem.rfind('-');
    if (dash == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto name = stem.substr(0, dash);
    auto ver = stem.substr(dash + 1);

    serveBlob("helm", name, ver, "default",
              "application/gzip", cb);
}

} // namespace repo
