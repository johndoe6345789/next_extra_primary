#pragma once
/**
 * @file SearchController.h
 * @brief REST controller for full-text search.
 */

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @class SearchController
 * @brief Exposes GET /api/search for cross-index queries.
 */
class SearchController
    : public drogon::HttpController<SearchController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        SearchController::search,
        "/api/search", drogon::Get);
    METHOD_LIST_END

    /**
     * @brief Handle full-text search requests.
     * @param req Incoming request with q, page, size params.
     * @param cb  Response callback.
     */
    void search(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&
            cb);
};

} // namespace controllers
