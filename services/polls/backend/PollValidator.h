#pragma once
/**
 * @file PollValidator.h
 * @brief Validation helpers for incoming poll requests.
 */

#include "PollTypes.h"

#include <string>

namespace nextra::polls
{

/** @brief Validation outcome. */
struct ValidationResult
{
    bool ok{true};
    std::string message;
};

/**
 * @brief Validate a newly submitted poll definition.
 * Checks question / label length, option count, kind.
 * Call this before invoking PollStore::createPoll.
 */
ValidationResult validatePoll(const Poll& p);

/**
 * @brief Validate a vote against an open poll.
 * @param poll     Current poll row (already loaded).
 * @param optionId Target option id for this vote.
 * @param rank     Optional rank (for `rank` kind).
 * @param already  True if the voter already has rows.
 *
 * Enforces the open window, duplicate guard for
 * single-choice, and rank-consistency (rank value
 * must be 0..N-1 for rank kind, must be absent
 * otherwise).
 */
ValidationResult validateVote(const Poll& poll,
                              std::int64_t optionId,
                              std::optional<int> rank,
                              bool already);

}  // namespace nextra::polls
