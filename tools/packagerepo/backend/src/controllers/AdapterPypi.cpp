/**
 * @file AdapterPypi.cpp
 * @brief PyPI Simple API protocol adapter implementation.
 */

#include "AdapterPypi.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void PypiAdapterCtrl::index(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto pkgs = listByNs("pypi");

    std::string html =
        "<!DOCTYPE html><html><body>\n";
    for (const auto& p : pkgs) {
        auto n = p["name"].asString();
        html += "<a href=\"/pypi/simple/" + n
                + "/\">" + n + "</a>\n";
    }
    html += "</body></html>\n";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("text/html");
    r->setBody(std::move(html));
    cb(r);
}

void PypiAdapterCtrl::package(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& name)
{
    auto vers = pg_artifact::versions(
        Globals::repoType, "pypi", name);

    std::string html =
        "<!DOCTYPE html><html><body>\n";
    for (const auto& v : vers) {
        auto ver = v["version"].asString();
        auto fn = name + "-" + ver + ".whl";
        html += "<a href=\"/pypi/packages/" + fn
                + "\">" + fn + "</a>\n";
    }
    html += "</body></html>\n";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("text/html");
    r->setBody(std::move(html));
    cb(r);
}

void PypiAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& file)
{
    // Parse "{name}-{version}.whl"
    auto pos = file.rfind(".whl");
    auto stem = (pos != std::string::npos)
                    ? file.substr(0, pos) : file;
    auto dash = stem.rfind('-');
    if (dash == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto name = stem.substr(0, dash);
    auto ver = stem.substr(dash + 1);

    serveBlob(
        "pypi", name, ver, "default",
        "application/zip", cb);
}

} // namespace repo
