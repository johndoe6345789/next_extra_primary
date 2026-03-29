/**
 * @file AdapterRubygems.h
 * @brief RubyGems API protocol adapter controller.
 *
 * Implements the RubyGems v1 API so that
 * `gem install pkg --source http://host/rubygems/` works.
 */

#pragma once

#include <drogon/HttpController.h>

namespace repo
{

class RubygemsAdapterCtrl
    : public drogon::HttpController<RubygemsAdapterCtrl>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(RubygemsAdapterCtrl::gemInfo,
                  "/rubygems/api/v1/gems/{name}.json",
                  drogon::Get);
    ADD_METHOD_TO(RubygemsAdapterCtrl::download,
                  "/rubygems/gems/{file}",
                  drogon::Get);
    METHOD_LIST_END

    /// @brief Return JSON gem metadata for latest version.
    void gemInfo(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& name);

    /// @brief Serve .gem blob by filename.
    void download(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&,
        const std::string& file);
};

} // namespace repo
