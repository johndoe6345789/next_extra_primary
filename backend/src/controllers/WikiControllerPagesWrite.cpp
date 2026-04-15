/**
 * @file WikiControllerPagesWrite.cpp
 * @brief Update + delete handlers for
 *        /api/wiki/pages.
 */

#include "WikiController.h"
#include "../services/wiki/WikiStore.h"
#include "../utils/JsonResponse.h"

namespace controllers
{

using services::wiki::WikiStore;
using services::wiki::json;

void WikiController::updatePage(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON body"));
        return;
    }
    WikiStore store;
    store.updatePage(
        std::stoll(id),
        body.value("title", std::string{}),
        body.value("bodyMd", std::string{}),
        req->getHeader("X-User-Id"),
        [cb](const json& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

void WikiController::deletePage(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    WikiStore store;
    store.deletePage(
        std::stoll(id),
        [cb](const json& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
