/**
 * @file WikiControllerRevisions.cpp
 * @brief Revision list + diff endpoints.
 */

#include "WikiController.h"
#include "../services/wiki/WikiStore.h"
#include "../services/wiki/WikiDiff.h"
#include "../utils/JsonResponse.h"

namespace controllers
{

using services::wiki::WikiStore;
using services::wiki::json;

void WikiController::listRevisions(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    WikiStore store;
    store.listRevisions(
        std::stoll(id),
        [cb](const json& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

void WikiController::diffRevisions(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto fromStr = req->getParameter("from");
    auto toStr = req->getParameter("to");
    if (fromStr.empty() || toStr.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "from + to query params required"));
        return;
    }
    int fromRev = std::stoi(fromStr);
    int toRev = std::stoi(toStr);
    auto pageId = std::stoll(id);
    auto store =
        std::make_shared<WikiStore>();
    store->getRevision(
        pageId, fromRev,
        [cb, store, pageId, toRev](
            const json& from) {
            store->getRevision(
                pageId, toRev,
                [cb, from](const json& to) {
                    cb(::utils::jsonOk({
                        {"diff",
                         services::wiki::lineDiff(
                             from["bodyMd"]
                                 .get<std::string>(),
                             to["bodyMd"]
                                 .get<std::string>())},
                    }));
                },
                [cb](drogon::HttpStatusCode c,
                     const std::string& m) {
                    cb(::utils::jsonError(c, m));
                });
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
