/**
 * @file AdapterComposer.h
 * @brief Composer/Packagist protocol adapter controller.
 *
 * Exposes packages.json, p2 provider endpoints, and zip
 * downloads so `composer require vendor/pkg` works.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class ComposerAdapterCtrl
    : public drogon::HttpController<ComposerAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ComposerAdapterCtrl::packagesJson,
        "/composer/packages.json", drogon::Get);
    ADD_METHOD_TO(ComposerAdapterCtrl::provider,
        "/composer/p2/{vendor}/{package}.json",
        drogon::Get);
    ADD_METHOD_TO(ComposerAdapterCtrl::download,
        "/composer/dist/{vendor}/{package}/{version}.zip",
        drogon::Get);
    METHOD_LIST_END

    /// @brief Serve root packages.json with metadata URL.
    /// @param req Incoming HTTP request.
    /// @param cb  Response callback.
    void packagesJson(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief Serve p2 provider JSON with version list.
    /// @param req     Incoming HTTP request.
    /// @param cb      Response callback.
    /// @param vendor  Composer vendor (DB namespace).
    /// @param package Composer package name (DB name).
    void provider(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& vendor,
        const std::string& package);

    /// @brief Serve a .zip blob for given coordinates.
    /// @param req     Incoming HTTP request.
    /// @param cb      Response callback.
    /// @param vendor  Composer vendor (DB namespace).
    /// @param package Composer package name (DB name).
    /// @param version Package version string.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& vendor,
        const std::string& package,
        const std::string& version);
};

} // namespace repo
