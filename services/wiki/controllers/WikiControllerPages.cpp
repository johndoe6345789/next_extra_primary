/**
 * @file WikiControllerPages.cpp
 * @brief Read + create handlers for
 *        /api/wiki/pages. Update/delete split
 *        into WikiControllerPagesWrite.cpp.
 */

#include "WikiController.h"
#include "wiki/backend/WikiStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

using services::wiki::WikiStore;
using services::wiki::json;

static std::string tenantOf(
    const drogon::HttpRequestPtr& req)
{
    auto t = req->getHeader("X-Tenant-Id");
    return t.empty()
        ? "00000000-0000-0000-0000-000000000000"
        : t;
}

void WikiController::getPage(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    WikiStore store;
    store.getPage(
        std::stoll(id),
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void WikiController::createPage(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()
        || !body.contains("slug")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON body"));
        return;
    }
    std::optional<std::int64_t> parent;
    if (body.contains("parentId")
        && !body["parentId"].is_null()) {
        parent =
            body["parentId"].get<std::int64_t>();
    }
    WikiStore store;
    store.createPage(
        tenantOf(req), parent,
        body.value("slug", std::string{}),
        body.value("title", std::string{}),
        body.value("bodyMd", std::string{}),
        req->getHeader("X-User-Id"),
        [cb](const json& d) {
            cb(::utils::jsonCreated(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
