/**
 * @file PollsControllerVote.cpp
 * @brief POST /api/polls/{id}/vote endpoint.
 */

#include "PollsController.h"

#include "../services/polls/PollStore.h"
#include "../services/polls/PollValidator.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <optional>

namespace controllers
{

using json = nlohmann::json;
using nextra::polls::PollStore;
using nextra::polls::PollVote;

void PollsController::vote(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    const auto body =
        json::parse(req->getBody(), nullptr, false);
    if (!body.is_object())
        return cb(utils::jsonError(
            drogon::k400BadRequest, "bad json"));

    PollStore store;
    auto poll = store.getPoll(id);
    if (!poll)
        return cb(utils::jsonError(
            drogon::k404NotFound, "poll not found"));

    const auto voter = req->getHeader("X-User-Id");
    PollVote v;
    v.pollId  = id;
    v.voterId = voter;
    v.optionId =
        body.value("option_id", std::int64_t{0});
    v.weight = body.value("weight", 1.0);
    if (body.contains("rank") && body["rank"].is_number())
        v.rank = body["rank"].get<int>();

    const bool already = store.hasVoted(id, voter);
    auto chk = nextra::polls::validateVote(
        *poll, v.optionId, v.rank, already);
    if (!chk.ok)
        return cb(utils::jsonError(
            drogon::k422UnprocessableEntity, chk.message));

    try
    {
        store.insertVote(v);
    }
    catch (const std::exception& e)
    {
        return cb(utils::jsonError(
            drogon::k409Conflict, e.what()));
    }
    cb(utils::jsonCreated(
        {{"ok", true}, {"poll_id", id}}));
}

}  // namespace controllers
