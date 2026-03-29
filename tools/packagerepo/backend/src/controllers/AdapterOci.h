/**
 * @file AdapterOci.h
 * @brief OCI Distribution protocol adapter controller.
 *
 * Implements the OCI Distribution Spec v2 so that
 * `docker pull host/name:tag` works with this server.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class OciAdapterCtrl
    : public drogon::HttpController<OciAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(OciAdapterCtrl::ping,
                  "/v2", drogon::Get);
    ADD_METHOD_TO(OciAdapterCtrl::pingSlash,
                  "/v2/", drogon::Get);
    ADD_METHOD_TO(OciAdapterCtrl::manifest,
                  "/v2/{name}/manifests/{reference}",
                  drogon::Get);
    ADD_METHOD_TO(OciAdapterCtrl::blob,
                  "/v2/{name}/blobs/{digest}",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief OCI version check (ping) endpoint.
    void ping(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief OCI version check with trailing slash.
    void pingSlash(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief Serve an OCI image manifest by tag or digest.
    void manifest(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name,
        const std::string& reference);

    /// @brief Serve a blob layer by digest.
    void blob(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name,
        const std::string& digest);
};

} // namespace repo
