/**
 * @file AdapterMaven.cpp
 * @brief Maven repository protocol adapter.
 *
 * Implements maven-metadata.xml generation and .jar blob
 * serving so Maven/Gradle clients can use this server.
 */

#include "AdapterMaven.h"
#include "AdapterUtil.h"
#include "../services/AdapterGlobals.h"
#include "../services/PgArtifactQuery.h"

using namespace drogon;

namespace repo
{

void MavenAdapterCtrl::metadata(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& group,
    const std::string& artifact)
{
    auto* a = AdapterGlobals::byName("maven");
    auto ns = a ? a->ns : std::string("maven");

    auto vers = pg_artifact::versions(
        Globals::repoType, group, artifact);

    if (vers.empty()) {
        cb(HttpResponse::newNotFoundResponse());
        return;
    }

    auto latest = vers[0]["version"].asString();

    std::string xml;
    xml += "<?xml version=\"1.0\"?>\n";
    xml += "<metadata>\n";
    xml += "  <groupId>" + group + "</groupId>\n";
    xml += "  <artifactId>" + artifact
         + "</artifactId>\n";
    xml += "  <versioning>\n";
    xml += "    <latest>" + latest + "</latest>\n";
    xml += "    <versions>\n";
    for (const auto& v : vers) {
        xml += "      <version>"
             + v["version"].asString()
             + "</version>\n";
    }
    xml += "    </versions>\n";
    xml += "  </versioning>\n";
    xml += "</metadata>\n";

    auto r = HttpResponse::newHttpResponse();
    r->setContentTypeString("application/xml");
    r->setBody(std::move(xml));
    cb(r);
}

void MavenAdapterCtrl::download(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    const std::string& group,
    const std::string& artifact,
    const std::string& version,
    const std::string& /*file*/)
{
    auto* a = AdapterGlobals::byName("maven");
    auto ns = a ? a->ns : std::string("maven");

    serveBlob(group, artifact, version, "default",
              "application/java-archive", cb);
}

} // namespace repo
