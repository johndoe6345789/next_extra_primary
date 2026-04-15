/**
 * @file PollStoreQuery.cpp
 * @brief Read-side implementation: getPoll, listPolls,
 *        listVotes.  Split from PollStore.cpp to stay
 *        inside the 100-LOC per-file cap.
 */

#include "PollStore.h"

namespace nextra::polls
{

std::optional<Poll> PollStore::getPoll(std::int64_t id)
{
    auto r = db_->execSqlSync(
        "SELECT id, tenant_id, creator_id, question, kind,"
        " opens_at::text, closes_at::text, public,"
        " created_at::text FROM polls WHERE id=$1", id);
    if (r.empty()) return std::nullopt;
    Poll p;
    p.id        = r[0]["id"].as<std::int64_t>();
    p.tenantId  = r[0]["tenant_id"].as<std::string>();
    p.creatorId = r[0]["creator_id"].as<std::string>();
    p.question  = r[0]["question"].as<std::string>();
    p.kind      = parseKind(r[0]["kind"].as<std::string>());
    p.opensAt   = r[0]["opens_at"].as<std::string>();
    p.closesAt  = r[0]["closes_at"].as<std::string>();
    p.isPublic  = r[0]["public"].as<bool>();
    p.createdAt = r[0]["created_at"].as<std::string>();
    auto ro = db_->execSqlSync(
        "SELECT id, position, label FROM poll_options "
        "WHERE poll_id=$1 ORDER BY position", id);
    for (const auto& row : ro)
    {
        p.options.push_back({
            row["id"].as<std::int64_t>(), id,
            row["position"].as<int>(),
            row["label"].as<std::string>()});
    }
    return p;
}

std::vector<Poll> PollStore::listPolls(
    const std::string& tenant, int limit, int offset)
{
    std::vector<Poll> out;
    auto r = db_->execSqlSync(
        "SELECT id FROM polls WHERE tenant_id=$1 "
        "ORDER BY closes_at DESC LIMIT $2 OFFSET $3",
        tenant, limit, offset);
    for (const auto& row : r)
    {
        if (auto p = getPoll(row["id"].as<std::int64_t>()))
            out.push_back(std::move(*p));
    }
    return out;
}

std::vector<PollVote> PollStore::listVotes(std::int64_t id)
{
    std::vector<PollVote> out;
    auto r = db_->execSqlSync(
        "SELECT id, poll_id, voter_id, option_id, rank, "
        "weight FROM poll_votes WHERE poll_id=$1", id);
    for (const auto& row : r)
    {
        PollVote v;
        v.id       = row["id"].as<std::int64_t>();
        v.pollId   = row["poll_id"].as<std::int64_t>();
        v.voterId  = row["voter_id"].as<std::string>();
        v.optionId = row["option_id"].as<std::int64_t>();
        if (!row["rank"].isNull())
            v.rank = row["rank"].as<int>();
        v.weight = row["weight"].as<double>();
        out.push_back(std::move(v));
    }
    return out;
}

}  // namespace nextra::polls
