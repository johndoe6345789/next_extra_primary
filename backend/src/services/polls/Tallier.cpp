/**
 * @file Tallier.cpp
 * @brief Single/multi/approval weighted-sum tally and
 *        rank Borda count.
 */

#include "Tallier.h"

#include <unordered_map>

namespace nextra::polls
{

std::vector<OptionTally> tally(
    const Poll& poll,
    const std::vector<PollVote>& votes)
{
    std::unordered_map<std::int64_t, OptionTally> by;
    for (const auto& o : poll.options)
    {
        by[o.id] = {o.id, o.label, 0.0, 0};
    }

    const auto n = static_cast<int>(poll.options.size());
    for (const auto& v : votes)
    {
        auto it = by.find(v.optionId);
        if (it == by.end()) continue;
        it->second.voteCount += 1;
        if (poll.kind == PollKind::Rank && v.rank.has_value())
        {
            const int r = *v.rank;
            const double pts =
                static_cast<double>(n - r) * v.weight;
            it->second.score += pts > 0 ? pts : 0.0;
        }
        else
        {
            it->second.score += v.weight;
        }
    }

    std::vector<OptionTally> out;
    out.reserve(poll.options.size());
    for (const auto& o : poll.options)
    {
        out.push_back(by[o.id]);
    }
    return out;
}

}  // namespace nextra::polls
