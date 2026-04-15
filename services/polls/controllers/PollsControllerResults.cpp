/**
 * @file PollsControllerResults.cpp
 * @brief GET /api/polls/{id}/results endpoint.
 */

#include "PollsController.h"

#include "polls/backend/PollStore.h"
#include "polls/backend/Tallier.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>

namespace controllers
{

using json = nlohmann::json;
using nextra::polls::PollStore;

void PollsController::results(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    (void)req;
    PollStore store;
    auto poll = store.getPoll(id);
    if (!poll)
        return cb(utils::jsonError(
            drogon::k404NotFound, "poll not found"));
    const auto votes = store.listVotes(id);
    const auto tallies =
        nextra::polls::tally(*poll, votes);

    json items = json::array();
    for (const auto& t : tallies)
    {
        items.push_back({
            {"option_id", t.optionId},
            {"label", t.label},
            {"score", t.score},
            {"vote_count", t.voteCount}});
    }
    cb(utils::jsonOk({
        {"poll_id", id},
        {"kind",
         nextra::polls::kindToString(poll->kind)},
        {"items", items},
        {"total_votes",
         static_cast<std::int64_t>(votes.size())}}));
}

}  // namespace controllers
