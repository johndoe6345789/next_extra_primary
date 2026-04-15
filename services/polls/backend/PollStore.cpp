/**
 * @file PollStore.cpp
 * @brief Write-side implementation: createPoll + insertVote.
 */

#include "PollStore.h"

#include <spdlog/spdlog.h>

namespace nextra::polls
{

PollStore::PollStore()
    : db_(drogon::app().getDbClient())
{
}

std::int64_t PollStore::createPoll(Poll& p)
{
    auto r = db_->execSqlSync(
        "INSERT INTO polls(tenant_id, creator_id, question, "
        "kind, opens_at, closes_at, public) "
        "VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        p.tenantId, p.creatorId, p.question,
        kindToString(p.kind), p.opensAt, p.closesAt,
        p.isPublic);
    p.id = r[0]["id"].as<std::int64_t>();
    for (auto& o : p.options)
    {
        auto ro = db_->execSqlSync(
            "INSERT INTO poll_options(poll_id, position, "
            "label) VALUES($1,$2,$3) RETURNING id",
            p.id, o.position, o.label);
        o.id = ro[0]["id"].as<std::int64_t>();
        o.pollId = p.id;
    }
    spdlog::info("polls: created poll id={}", p.id);
    return p.id;
}

void PollStore::insertVote(const PollVote& v)
{
    db_->execSqlSync(
        "INSERT INTO poll_votes(poll_id, voter_id, "
        "option_id, rank, weight) "
        "VALUES($1,$2,$3,$4,$5)",
        v.pollId, v.voterId, v.optionId,
        v.rank.value_or(0), v.weight);
}

std::int64_t PollStore::countActive(const std::string& t)
{
    auto r = db_->execSqlSync(
        "SELECT count(*) AS c FROM polls "
        "WHERE tenant_id=$1 AND closes_at > now()", t);
    return r[0]["c"].as<std::int64_t>();
}

bool PollStore::hasVoted(std::int64_t id,
                         const std::string& voter)
{
    auto r = db_->execSqlSync(
        "SELECT 1 FROM poll_votes WHERE poll_id=$1 "
        "AND voter_id=$2 LIMIT 1", id, voter);
    return !r.empty();
}

}  // namespace nextra::polls
