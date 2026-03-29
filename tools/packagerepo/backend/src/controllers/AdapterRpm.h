/**
 * @file AdapterRpm.h
 * @brief RPM/YUM repository protocol adapter controller.
 *
 * Implements the YUM repository format so that
 * `yum install pkg` works with this server as a repo.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class RpmAdapterCtrl
    : public drogon::HttpController<RpmAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(RpmAdapterCtrl::repomd,
                  "/rpm/repodata/repomd.xml",
                  drogon::Get);
    ADD_METHOD_TO(RpmAdapterCtrl::primary,
                  "/rpm/repodata/primary.xml",
                  drogon::Get);
    ADD_METHOD_TO(RpmAdapterCtrl::download,
                  "/rpm/packages/{file}",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief Serve repomd.xml pointing to primary.xml.
    void repomd(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief Serve primary.xml listing all RPM packages.
    void primary(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief Serve an RPM blob by filename.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& file);
};

} // namespace repo
