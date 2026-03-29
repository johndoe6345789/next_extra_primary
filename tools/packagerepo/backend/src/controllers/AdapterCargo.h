/**
 * @file AdapterCargo.h
 * @brief Cargo sparse registry protocol adapter controller.
 *
 * Implements the crates.io compatible API so that
 * `cargo install pkg --registry http://host/cargo/` works.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class CargoAdapterCtrl
    : public drogon::HttpController<CargoAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(CargoAdapterCtrl::crateMeta,
                  "/cargo/api/v1/crates/{name}",
                  drogon::Get);
    ADD_METHOD_TO(CargoAdapterCtrl::download,
                  "/cargo/api/v1/crates/{name}/{version}/download",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief Return JSON crate metadata with versions.
    void crateMeta(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name);

    /// @brief Serve crate tarball blob.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name,
        const std::string& version);
};

} // namespace repo
