#pragma once
/**
 * @file PollStore.h
 * @brief Postgres persistence for polls, options, and votes.
 */

#include "PollTypes.h"

#include <drogon/drogon.h>
#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace nextra::polls
{

/**
 * @brief Thin DAO over the polls schema.
 * All methods are synchronous and run on the Drogon
 * default DB client.  Callers are expected to invoke
 * them from worker threads, not the event loop.
 */
class PollStore
{
  public:
    /** @brief Construct a store against the default DB. */
    PollStore();

    /** @brief Insert a poll + options in one transaction. */
    std::int64_t createPoll(Poll& p);

    /** @brief Fetch a poll by id (with options). */
    std::optional<Poll> getPoll(std::int64_t id);

    /** @brief List recent polls for a tenant. */
    std::vector<Poll> listPolls(const std::string& tenant,
                                int limit, int offset);

    /** @brief Insert a single cast vote. */
    void insertVote(const PollVote& v);

    /** @brief All votes for a poll (for tallying). */
    std::vector<PollVote> listVotes(std::int64_t pollId);

    /** @brief Count of active polls for a tenant. */
    std::int64_t countActive(const std::string& tenant);

    /** @brief True if a voter has any row for a poll. */
    bool hasVoted(std::int64_t pollId,
                  const std::string& voterId);

  private:
    drogon::orm::DbClientPtr db_;
};

}  // namespace nextra::polls
