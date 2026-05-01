/**
 * @file blog_controller_read.cpp
 * @brief Public read endpoints for /api/blog.
 */

#include "BlogController.h"
#include "blog/backend/ArticleStore.h"

#include <drogon/drogon.h>

namespace nextra::blog
{

using namespace drogon;

static Json::Value toJson(const Article& a)
{
    Json::Value o;
    o["id"]        = static_cast<Json::Int64>(a.id);
    o["tenant_id"] = a.tenantId;
    o["author_id"] = a.authorId;
    o["slug"]      = a.slug;
    o["title"]     = a.title;
    o["body_md"]   = a.bodyMd;
    o["body_html"] = a.bodyHtml;
    o["hero_image"]= a.heroImage.value_or(std::string{});
    o["status"]    = statusToString(a.status);
    o["published_at"] = a.publishedAt.value_or("");
    o["scheduled_at"] = a.scheduledAt.value_or("");
    o["created_at"]   = a.createdAt;
    o["updated_at"]   = a.updatedAt;
    return o;
}

static HttpResponsePtr notFound()
{
    auto r = HttpResponse::newHttpResponse();
    r->setStatusCode(k404NotFound);
    r->setBody("{\"error\":\"not found\"}");
    r->setContentTypeCode(CT_APPLICATION_JSON);
    return r;
}

void BlogController::list(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    ArticleStore store(app().getDbClient());
    ListFilter f;
    auto s = req->getParameter("status");
    if (!s.empty()) f.status = statusFromString(s);
    auto lim = req->getParameter("limit");
    if (!lim.empty()) f.limit = std::stoi(lim);
    auto off = req->getParameter("offset");
    if (!off.empty()) f.offset = std::stoi(off);
    const int total = store.count(f);
    Json::Value items(Json::arrayValue);
    for (const auto& a : store.list(f))
        items.append(toJson(a));
    Json::Value body;
    body["items"] = items;
    body["total"] = total;
    cb(HttpResponse::newHttpJsonResponse(body));
}

void BlogController::getOne(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    ArticleStore store(app().getDbClient());
    auto a = store.getById(id);
    if (!a) { cb(notFound()); return; }
    cb(HttpResponse::newHttpJsonResponse(toJson(*a)));
}

void BlogController::getBySlug(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::string slug)
{
    ArticleStore store(app().getDbClient());
    auto a = store.getBySlug(slug);
    if (!a) { cb(notFound()); return; }
    cb(HttpResponse::newHttpJsonResponse(toJson(*a)));
}

}  // namespace nextra::blog
