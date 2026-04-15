#pragma once
/**
 * @file SearchController.h
 * @brief Public + admin REST controllers for the
 *        search indexer daemon (Phase 4.5).
 */

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @class SearchController
 * @brief Public GET /api/search endpoint.
 *
 * Accepts a free-text @c q parameter, an optional
 * @c type filter, and returns hits across every
 * registered ES index.
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
     * @brief Handle a public search request.
     * @param req incoming request.
     * @param cb  response callback.
     */
    void search(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
};

/**
 * @class SearchAdminController
 * @brief Admin-only routes for index health and
 *        manual reindex triggers.
 */
class SearchAdminController
    : public drogon::HttpController<
          SearchAdminController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        SearchAdminController::listIndexes,
        "/api/search/indexes", drogon::Get);
    ADD_METHOD_TO(
        SearchAdminController::reindex,
        "/api/search/reindex/{name}",
        drogon::Post);
    METHOD_LIST_END

    /// List all rows from search_indexes.
    void listIndexes(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /**
     * @brief Trigger a reindex for a named index.
     * @param name The logical index name.
     */
    void reindex(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        std::string name);
};

} // namespace controllers
