/**
 * @file AdapterPypi.h
 * @brief PyPI Simple API protocol adapter controller.
 *
 * Implements PEP 503 Simple Repository API so that
 * `pip install pkg --index-url http://host/pypi/simple/` works.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class PypiAdapterCtrl
    : public drogon::HttpController<PypiAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(PypiAdapterCtrl::index,
                  "/pypi/simple/", drogon::Get);
    ADD_METHOD_TO(PypiAdapterCtrl::package,
                  "/pypi/simple/{name}/", drogon::Get);
    ADD_METHOD_TO(PypiAdapterCtrl::download,
                  "/pypi/packages/{file}",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief List all package names as HTML links.
    void index(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&);

    /// @brief List version download links for a package.
    void package(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name);

    /// @brief Serve a .whl blob by filename.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& file);
};

} // namespace repo
