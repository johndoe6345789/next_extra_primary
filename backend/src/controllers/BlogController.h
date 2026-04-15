#pragma once

/**
 * @file BlogController.h
 * @brief REST surface for the article/blog daemon.
 *
 * Mounted at /api/blog — public read endpoints for rendered
 * articles, admin write endpoints gated behind JwtFilter for the
 * operator tool.  The split across read/write cpp files keeps
 * each translation unit under the 100 LOC project limit.
 *
 * Endpoints:
 *   GET    /api/blog/articles            List (public)
 *   GET    /api/blog/articles/{id}       Get by id (public)
 *   GET    /api/blog/articles/slug/{s}   Get by slug (public)
 *   POST   /api/blog/articles            Create draft (admin)
 *   PUT    /api/blog/articles/{id}       Update (admin)
 *   DELETE /api/blog/articles/{id}       Delete (admin)
 *   GET    /api/blog/revisions/{id}      Revision history (admin)
 */

#include <drogon/HttpController.h>

namespace nextra::blog
{

class BlogController
    : public drogon::HttpController<BlogController>
{
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(BlogController::list,
        "/api/blog/articles", drogon::Get);
    ADD_METHOD_TO(BlogController::getOne,
        "/api/blog/articles/{id}", drogon::Get);
    ADD_METHOD_TO(BlogController::getBySlug,
        "/api/blog/articles/slug/{slug}", drogon::Get);
    ADD_METHOD_TO(BlogController::create,
        "/api/blog/articles",
        drogon::Post, "JwtFilter");
    ADD_METHOD_TO(BlogController::update,
        "/api/blog/articles/{id}",
        drogon::Put, "JwtFilter");
    ADD_METHOD_TO(BlogController::remove,
        "/api/blog/articles/{id}",
        drogon::Delete, "JwtFilter");
    ADD_METHOD_TO(BlogController::revisions,
        "/api/blog/revisions/{id}",
        drogon::Get, "JwtFilter");
    METHOD_LIST_END

    void list(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
    void getOne(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
    void getBySlug(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        std::string slug);
    void create(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
    void update(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
    void remove(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
    void revisions(const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
};

}  // namespace nextra::blog
