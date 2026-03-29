/**
 * @file AdapterGo.h
 * @brief Go module proxy protocol adapter controller.
 *
 * Implements the GOPROXY protocol so that
 * `GOPROXY=http://host/go/ go get pkg` works.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class GoAdapterCtrl
    : public drogon::HttpController<GoAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(GoAdapterCtrl::list,
                  "/go/{name}/@v/list", drogon::Get);
    ADD_METHOD_TO(GoAdapterCtrl::info,
                  "/go/{name}/@v/{version}.info",
                  drogon::Get);
    ADD_METHOD_TO(GoAdapterCtrl::download,
                  "/go/{name}/@v/{version}.zip",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief List all versions as plain text.
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name);

    /// @brief Return version info as JSON.
    void info(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name,
        const std::string& version);

    /// @brief Serve module zip blob.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name,
        const std::string& version);
};

} // namespace repo
