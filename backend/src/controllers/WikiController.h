#pragma once
/**
 * @file WikiController.h
 * @brief REST endpoints for the collaborative wiki.
 *        Implemented in three .cpp files:
 *        - WikiControllerTree.cpp
 *        - WikiControllerPages.cpp
 *        - WikiControllerRevisions.cpp
 */

#include <drogon/HttpController.h>

namespace controllers
{

class WikiController
    : public drogon::HttpController<WikiController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(WikiController::tree,
                  "/api/wiki/tree",
                  drogon::Get);
    ADD_METHOD_TO(WikiController::getPage,
                  "/api/wiki/pages/{id}",
                  drogon::Get);
    ADD_METHOD_TO(WikiController::createPage,
                  "/api/wiki/pages",
                  drogon::Post,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(WikiController::updatePage,
                  "/api/wiki/pages/{id}",
                  drogon::Put,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(WikiController::deletePage,
                  "/api/wiki/pages/{id}",
                  drogon::Delete,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(WikiController::listRevisions,
                  "/api/wiki/pages/{id}/revisions",
                  drogon::Get);
    ADD_METHOD_TO(WikiController::diffRevisions,
                  "/api/wiki/pages/{id}/diff",
                  drogon::Get);
    METHOD_LIST_END

    void tree(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    void getPage(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    void createPage(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    void updatePage(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    void deletePage(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    void listRevisions(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    void diffRevisions(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers
