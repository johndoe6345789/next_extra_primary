/**
 * @file blog_controller_revisions.cpp
 * @brief Revision history endpoint for /api/blog.
 */

#include "BlogController.h"
#include "services/blog/ArticleStore.h"

#include <drogon/drogon.h>

namespace nextra::blog
{

using namespace drogon;

void BlogController::revisions(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    ArticleStore store(app().getDbClient());
    Json::Value items(Json::arrayValue);
    for (const auto& r : store.revisions(id))
    {
        Json::Value o;
        o["title"]   = r.title;
        o["body_md"] = r.bodyMd;
        o["author"]  = r.authorId;
        o["at"]      = r.updatedAt;
        items.append(o);
    }
    Json::Value b;
    b["items"] = items;
    cb(HttpResponse::newHttpJsonResponse(b));
}

}  // namespace nextra::blog
