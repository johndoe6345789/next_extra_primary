/**
 * @file WikiControllerTree.cpp
 * @brief GET /api/wiki/tree — nested page tree.
 */

#include "WikiController.h"
#include "wiki/backend/WikiStore.h"
#include "wiki/backend/WikiTree.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

static std::string tenantFromReq(
    const drogon::HttpRequestPtr& req)
{
    auto t = req->getHeader("X-Tenant-Id");
    if (t.empty()) {
        // Fallback to the default nil uuid so the
        // single-tenant dev stack still works.
        return "00000000-0000-0000-0000-000000000000";
    }
    return t;
}

void WikiController::tree(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto tenant = tenantFromReq(req);
    services::wiki::WikiStore store;
    store.listTree(
        tenant,
        [cb](const services::wiki::json& flat) {
            cb(::utils::jsonOk(
                services::wiki::buildTree(flat)));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
