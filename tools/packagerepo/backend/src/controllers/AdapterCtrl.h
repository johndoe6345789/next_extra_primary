/**
 * @file AdapterCtrl.h
 * @brief Legacy header — kept for backward compat with existing
 *        AdapterNpm.cpp, AdapterApt.cpp, AdapterConan.cpp.
 *
 * New adapters use their own per-protocol headers instead.
 * This file will be removed once npm/apt/conan are migrated.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class NpmAdapterCtrl
    : public drogon::HttpController<NpmAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(NpmAdapterCtrl::meta,
                  "/npm/{name}", drogon::Get);
    ADD_METHOD_TO(NpmAdapterCtrl::tarball,
                  "/npm/-/{name}/{tarball}", drogon::Get);
    METHOD_LIST_END

    void meta(const drogon::HttpRequestPtr& req,
              std::function<void(const drogon::HttpResponsePtr&)>&&,
              const std::string& name);
    void tarball(const drogon::HttpRequestPtr& req,
                 std::function<void(const drogon::HttpResponsePtr&)>&&,
                 const std::string& name,
                 const std::string& tarball);
};

class AptAdapterCtrl
    : public drogon::HttpController<AptAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AptAdapterCtrl::packages,
                  "/apt/dists/{dist}/main/binary-{arch}/Packages",
                  drogon::Get);
    ADD_METHOD_TO(AptAdapterCtrl::download,
                  "/apt/pool/{file}", drogon::Get);
    METHOD_LIST_END

    void packages(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&&,
                  const std::string& dist,
                  const std::string& arch);
    void download(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&&,
                  const std::string& file);
};

class ConanAdapterCtrl
    : public drogon::HttpController<ConanAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ConanAdapterCtrl::recipe,
                  "/conan/v2/conans/{name}/{version}/_/_",
                  drogon::Get);
    ADD_METHOD_TO(ConanAdapterCtrl::revisions,
                  "/conan/v2/conans/{name}/{version}/_/_/revisions",
                  drogon::Get);
    ADD_METHOD_TO(ConanAdapterCtrl::download,
                  "/conan/v2/conans/{name}/{ver}/_/_/revisions/{rev}/files/{file}",
                  drogon::Get);
    METHOD_LIST_END

    void recipe(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&&,
                const std::string& name,
                const std::string& version);
    void revisions(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&&,
                   const std::string& name,
                   const std::string& version);
    void download(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&&,
                  const std::string& name,
                  const std::string& ver,
                  const std::string& rev,
                  const std::string& file);
};

} // namespace repo
