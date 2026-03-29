/**
 * @file AdapterHelm.h
 * @brief Helm chart repository protocol adapter controller.
 *
 * Implements the Helm chart repo format so that
 * `helm install repo/chart` works with this server.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class HelmAdapterCtrl
    : public drogon::HttpController<HelmAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(HelmAdapterCtrl::index,
                  "/helm/index.yaml", drogon::Get);
    ADD_METHOD_TO(HelmAdapterCtrl::download,
                  "/helm/charts/{file}",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief Serve index.yaml listing all Helm charts.
    void index(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief Serve a chart .tgz blob by filename.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& file);
};

} // namespace repo
