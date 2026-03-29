/**
 * @file AdapterRpm.cpp
 * @brief RPM/YUM repository protocol adapter.
 *
 * Generates repomd.xml, primary.xml index, and serves
 * .rpm blobs for yum/dnf clients.
 */

#include "AdapterRpm.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void RpmAdapterCtrl::repomd(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    std::string xml =
        "<?xml version=\"1.0\"?>\n"
        "<repomd xmlns=\"http://linux.duke.edu/"
        "metadata/repo\">\n"
        "  <data type=\"primary\">"
        "<location href=\"repodata/primary.xml\"/>"
        "</data>\n"
        "</repomd>\n";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("application/xml");
    r->setBody(std::move(xml));
    cb(r);
}

void RpmAdapterCtrl::primary(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto pkgs = listByNs("rpm");

    std::string xml =
        "<?xml version=\"1.0\"?>\n<metadata>\n";
    for (const auto& p : pkgs) {
        auto name = p["name"].asString();
        auto ver = p["version"].asString();
        auto size = p["blob_size"].asInt64();
        auto arch = std::string("x86_64");
        xml += "<package type=\"rpm\">\n";
        xml += "  <name>" + name + "</name>";
        xml += "<version ver=\"" + ver + "\"/>\n";
        xml += "  <location href=\"packages/"
               + name + "-" + ver + "." + arch
               + ".rpm\"/>\n";
        xml += "  <size package=\""
               + std::to_string(size) + "\"/>\n";
        xml += "</package>\n";
    }
    xml += "</metadata>\n";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("application/xml");
    r->setBody(std::move(xml));
    cb(r);
}

void RpmAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& file)
{
    // Parse: {name}-{version}.{arch}.rpm
    auto dotRpm = file.rfind(".rpm");
    if (dotRpm == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto stem = file.substr(0, dotRpm);
    auto dotArch = stem.rfind('.');
    if (dotArch == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto nameVer = stem.substr(0, dotArch);
    auto dash = nameVer.rfind('-');
    if (dash == std::string::npos) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }
    auto name = nameVer.substr(0, dash);
    auto ver = nameVer.substr(dash + 1);

    serveBlob("rpm", name, ver, "x86_64",
              "application/x-rpm", cb);
}

} // namespace repo
