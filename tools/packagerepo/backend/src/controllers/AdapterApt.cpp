/**
 * @file AdapterApt.cpp
 * @brief apt/deb repository protocol adapter.
 *
 * Implements the Debian repository format so that
 * `apt-get install pkg` works with this server as a source.
 * Generates Packages index and serves .deb blobs.
 */

#include "AdapterCtrl.h"
#include "../services/AdapterGlobals.h"
#include "../services/Globals.h"
#include "../services/PgArtifactQuery.h"
#include "../services/PgArtifactStore.h"

using namespace drogon;

namespace repo
{

void AptAdapterCtrl::packages(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& dist,
    const std::string& arch)
{
    auto* a = AdapterGlobals::byName("apt");
    auto ns = a ? a->ns : std::string("apt");

    auto pkgs = pg_artifact::list(Globals::repoType);

    std::string body;
    for (const auto& p : pkgs) {
        if (p["namespace"].asString() != ns) continue;

        auto name = p["name"].asString();
        auto ver = p["version"].asString();
        auto digest = p["blob_digest"].asString();
        auto size = p["blob_size"].asInt64();
        auto file = name + "_" + ver + "_" + arch + ".deb";

        body += "Package: " + name + "\n";
        body += "Version: " + ver + "\n";
        body += "Architecture: " + arch + "\n";
        body += "Maintainer: packagerepo\n";
        body += "Filename: pool/" + file + "\n";
        body += "Size: " + std::to_string(size) + "\n";
        body += "SHA256: " + digest + "\n";
        body += "Description: " + name + " " + ver + "\n";
        body += "\n";
    }

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("text/plain");
    r->setBody(std::move(body));
    cb(r);
}

void AptAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& file)
{
    // Parse: {name}_{version}_{arch}.deb
    auto u1 = file.find('_');
    auto u2 = file.find('_', u1 + 1);
    if (u1 == std::string::npos || u2 == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto name = file.substr(0, u1);
    auto ver = file.substr(u1 + 1, u2 - u1 - 1);

    auto* a = AdapterGlobals::byName("apt");
    auto ns = a ? a->ns : std::string("apt");

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
    r->setContentTypeString(
        "application/vnd.debian.binary-package");
    r->setBody(std::move(data));
    cb(r);
}

} // namespace repo
