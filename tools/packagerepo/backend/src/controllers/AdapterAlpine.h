/**
 * @file AdapterAlpine.h
 * @brief Alpine APK repository protocol adapter controller.
 *
 * Implements the Alpine package index format so that
 * `apk add pkg` works with this server as a repo.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class AlpineAdapterCtrl
    : public drogon::HttpController<AlpineAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AlpineAdapterCtrl::apkIndex,
                  "/alpine/{branch}/main/{arch}/APKINDEX",
                  drogon::Get);
    ADD_METHOD_TO(AlpineAdapterCtrl::download,
                  "/alpine/packages/{file}",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief Serve APKINDEX listing all Alpine packages.
    void apkIndex(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& branch,
        const std::string& arch);

    /// @brief Serve an APK blob by filename.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& file);
};

} // namespace repo
