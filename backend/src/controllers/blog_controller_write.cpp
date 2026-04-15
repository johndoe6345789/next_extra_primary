/**
 * @file blog_controller_write.cpp
 * @brief Admin write endpoints for /api/blog.
 */

#include "BlogController.h"
#include "services/blog/ArticleStore.h"
#include "services/blog/MarkdownRenderer.h"

#include <drogon/drogon.h>

namespace nextra::blog
{

using namespace drogon;

static HttpResponsePtr bad(const std::string& m)
{
    auto r = HttpResponse::newHttpResponse();
    r->setStatusCode(k400BadRequest);
    r->setContentTypeCode(CT_APPLICATION_JSON);
    r->setBody("{\"error\":\"" + m + "\"}");
    return r;
}

static Article fromJson(const Json::Value& j)
{
    Article a;
    a.tenantId = j.get("tenant_id", "").asString();
    a.authorId = j.get("author_id", "").asString();
    a.slug     = j.get("slug", "").asString();
    a.title    = j.get("title", "").asString();
    a.bodyMd   = j.get("body_md", "").asString();
    a.bodyHtml = renderMarkdown(a.bodyMd);
    if (j.isMember("hero_image"))
        a.heroImage = j["hero_image"].asString();
    a.status = statusFromString(
        j.get("status", "draft").asString());
    if (j.isMember("scheduled_at"))
        a.scheduledAt = j["scheduled_at"].asString();
    return a;
}

void BlogController::create(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb)
{
    auto j = req->getJsonObject();
    if (!j) { cb(bad("body required")); return; }
    auto a = fromJson(*j);
    if (a.slug.empty() || a.title.empty())
    { cb(bad("slug and title required")); return; }
    ArticleStore store(app().getDbClient());
    auto id = store.create(a);
    Json::Value b;
    b["id"] = static_cast<Json::Int64>(id);
    auto r = HttpResponse::newHttpJsonResponse(b);
    r->setStatusCode(k201Created);
    cb(r);
}

void BlogController::update(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    auto j = req->getJsonObject();
    if (!j) { cb(bad("body required")); return; }
    auto a = fromJson(*j);
    ArticleStore store(app().getDbClient());
    if (!store.update(id, a)) { cb(bad("not found")); return; }
    Json::Value b;
    b["id"] = static_cast<Json::Int64>(id);
    cb(HttpResponse::newHttpJsonResponse(b));
}

void BlogController::remove(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    ArticleStore store(app().getDbClient());
    if (!store.remove(id)) { cb(bad("not found")); return; }
    auto r = HttpResponse::newHttpResponse();
    r->setStatusCode(k204NoContent);
    cb(r);
}

}  // namespace nextra::blog
