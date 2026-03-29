/**
 * @file AdapterCtrl.h
 * @brief Generic protocol adapter controller.
 *
 * A single controller that handles npm, apt, and conan protocols
 * driven by DB-stored adapter configs. Routes are registered for
 * each known protocol prefix.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class AdapterCtrl : public drogon::HttpController<AdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    // npm: GET /npm/{name}   (metadata)
    ADD_METHOD_TO(AdapterCtrl::npmMeta,
                  "/npm/{name}", drogon::Get);
    // npm: GET /npm/{name}/-/{tarball}  (download)
    ADD_METHOD_TO(AdapterCtrl::npmTarball,
                  "/npm/-/{name}/{tarball}", drogon::Get);
    // apt: GET /apt/dists/{dist}/main/binary-amd64/Packages
    ADD_METHOD_TO(AdapterCtrl::aptPackages,
                  "/apt/dists/{dist}/main/binary-{arch}/Packages",
                  drogon::Get);
    // apt: GET /apt/pool/{name}_{version}_{arch}.deb
    ADD_METHOD_TO(AdapterCtrl::aptDownload,
                  "/apt/pool/{file}", drogon::Get);
    // conan: GET /conan/v2/conans/{name}/{version}/_/_
    ADD_METHOD_TO(AdapterCtrl::conanRecipe,
                  "/conan/v2/conans/{name}/{version}/_/_",
                  drogon::Get);
    // conan: GET /conan/v2/conans/{name}/{ver}/_/_/revisions
    ADD_METHOD_TO(AdapterCtrl::conanRevisions,
                  "/conan/v2/conans/{name}/{version}/_/_/revisions",
                  drogon::Get);
    // conan: download
    ADD_METHOD_TO(AdapterCtrl::conanDownload,
                  "/conan/v2/conans/{name}/{ver}/_/_/revisions/{rev}/files/{file}",
                  drogon::Get);
    METHOD_LIST_END

    // npm handlers
    void npmMeta(const drogon::HttpRequestPtr& req,
                 std::function<void(const drogon::HttpResponsePtr&)>&&,
                 const std::string& name);
    void npmTarball(const drogon::HttpRequestPtr& req,
                    std::function<void(const drogon::HttpResponsePtr&)>&&,
                    const std::string& name,
                    const std::string& tarball);

    // apt handlers
    void aptPackages(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&&,
                     const std::string& dist,
                     const std::string& arch);
    void aptDownload(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&&,
                     const std::string& file);

    // conan handlers
    void conanRecipe(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&&,
                     const std::string& name,
                     const std::string& version);
    void conanRevisions(const drogon::HttpRequestPtr& req,
                        std::function<void(const drogon::HttpResponsePtr&)>&&,
                        const std::string& name,
                        const std::string& version);
    void conanDownload(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&&,
                       const std::string& name,
                       const std::string& ver,
                       const std::string& rev,
                       const std::string& file);
};

} // namespace repo
