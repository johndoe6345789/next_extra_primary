/**
 * @file PollsControllerCrud.cpp
 * @brief List / create / get endpoints for /api/polls.
 */

#include "PollsController.h"
#include "polls_json.h"

#include "../services/polls/PollStore.h"
#include "../services/polls/PollValidator.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>

namespace controllers
{

using json = nlohmann::json;
using nextra::polls::Poll;
using nextra::polls::PollStore;
using controllers::polls_json::pollToJson;

void PollsController::list(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    const auto tenant = req->getHeader("X-Tenant-Id");
    PollStore store;
    json items = json::array();
    for (const auto& p : store.listPolls(tenant, 50, 0))
        items.push_back(pollToJson(p));
    cb(utils::jsonOk({{"items", items}}));
}

void PollsController::create(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    const auto body =
        json::parse(req->getBody(), nullptr, false);
    if (!body.is_object())
        return cb(utils::jsonError(
            drogon::k400BadRequest, "bad json"));
    Poll p;
    p.tenantId  = body.value("tenant_id", "");
    p.creatorId = req->getHeader("X-User-Id");
    p.question  = body.value("question", "");
    p.kind = nextra::polls::parseKind(
        body.value("kind", "single"));
    p.opensAt  = body.value("opens_at", "now()");
    p.closesAt = body.value("closes_at", "");
    p.isPublic = body.value("public", true);
    int pos = 0;
    for (const auto& o :
         body.value("options", json::array()))
    {
        p.options.push_back(
            {0, 0, pos++, o.value("label", "")});
    }
    auto v = nextra::polls::validatePoll(p);
    if (!v.ok)
        return cb(utils::jsonError(
            drogon::k422UnprocessableEntity, v.message));
    PollStore store;
    store.createPoll(p);
    cb(utils::jsonCreated(pollToJson(p)));
}

void PollsController::get(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    (void)req;
    PollStore store;
    auto p = store.getPoll(id);
    if (!p)
        return cb(utils::jsonError(
            drogon::k404NotFound, "poll not found"));
    cb(utils::jsonOk(pollToJson(*p)));
}

}  // namespace controllers
