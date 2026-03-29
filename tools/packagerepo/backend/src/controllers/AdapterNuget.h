/**
 * @file AdapterNuget.h
 * @brief NuGet v3 protocol adapter controller.
 *
 * Exposes the NuGet v3 service index, package registration,
 * and flat container endpoints for `dotnet restore`.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class NugetAdapterCtrl
    : public drogon::HttpController<NugetAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(NugetAdapterCtrl::serviceIndex,
        "/nuget/v3/index.json", drogon::Get);
    ADD_METHOD_TO(NugetAdapterCtrl::registration,
        "/nuget/v3/registration/{id}/index.json",
        drogon::Get);
    ADD_METHOD_TO(NugetAdapterCtrl::download,
        "/nuget/v3/flatcontainer/{id}/{version}/{file}",
        drogon::Get);
    METHOD_LIST_END

    /// @brief Serve NuGet v3 service index JSON.
    /// @param req Incoming HTTP request.
    /// @param cb  Response callback.
    void serviceIndex(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief Serve package registration with versions.
    /// @param req Incoming HTTP request.
    /// @param cb  Response callback.
    /// @param id  NuGet package identifier.
    void registration(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& id);

    /// @brief Serve a .nupkg blob for given coordinates.
    /// @param req     Incoming HTTP request.
    /// @param cb      Response callback.
    /// @param id      NuGet package identifier.
    /// @param version Package version string.
    /// @param file    Filename (unused, parsed for display).
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& id,
        const std::string& version,
        const std::string& file);
};

} // namespace repo
