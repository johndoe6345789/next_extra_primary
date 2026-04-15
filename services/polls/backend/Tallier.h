#pragma once
/**
 * @file Tallier.h
 * @brief Pure tallying functions for the polls daemon.
 *
 * Handles single, multi, approval (plain weighted sum)
 * and rank (Borda count) kinds without any database
 * access — consumers pass in the raw vote rows.
 */

#include "PollTypes.h"

#include <vector>

namespace nextra::polls
{

/**
 * @brief Tally a poll's votes into per-option scores.
 * @param poll  Poll metadata (kind + options).
 * @param votes Raw cast votes for the poll.
 * @return One OptionTally per option in `poll.options`.
 *
 * For @c PollKind::Rank the score is a Borda count
 * where the highest-ranked option per voter earns
 * `(N - rank)` points, multiplied by the vote weight.
 * For all other kinds the score is the weighted count
 * of option rows — multi/approval allow multiple rows
 * per voter, single caps to one.
 */
std::vector<OptionTally> tally(
    const Poll& poll,
    const std::vector<PollVote>& votes);

}  // namespace nextra::polls
