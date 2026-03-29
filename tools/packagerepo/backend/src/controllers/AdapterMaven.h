/**
 * @file AdapterMaven.h
 * @brief Maven repository protocol adapter controller.
 *
 * Exposes maven-metadata.xml and .jar downloads so that
 * Maven/Gradle clients can resolve artifacts from this server.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class MavenAdapterCtrl
    : public drogon::HttpController<MavenAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(MavenAdapterCtrl::metadata,
        "/maven/{group}/{artifact}/maven-metadata.xml",
        drogon::Get);
    ADD_METHOD_TO(MavenAdapterCtrl::download,
        "/maven/{group}/{artifact}/{version}/{file}",
        drogon::Get);
    METHOD_LIST_END

    /// @brief Serve maven-metadata.xml with version list.
    /// @param req  Incoming HTTP request.
    /// @param cb   Response callback.
    /// @param group    Maven groupId (DB namespace).
    /// @param artifact Maven artifactId (DB name).
    void metadata(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& group,
        const std::string& artifact);

    /// @brief Serve a .jar blob for the given coordinates.
    /// @param req     Incoming HTTP request.
    /// @param cb      Response callback.
    /// @param group   Maven groupId (DB namespace).
    /// @param artifact Maven artifactId (DB name).
    /// @param version Artifact version string.
    /// @param file    Filename (unused, parsed for display).
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& group,
        const std::string& artifact,
        const std::string& version,
        const std::string& file);
};

} // namespace repo
