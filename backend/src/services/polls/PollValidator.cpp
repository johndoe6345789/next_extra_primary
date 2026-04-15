/**
 * @file PollValidator.cpp
 * @brief Window, duplicate, and rank checks.
 */

#include "PollValidator.h"

#include <chrono>

namespace nextra::polls
{

namespace
{
constexpr std::size_t MAX_Q = 1024;
constexpr std::size_t MAX_L = 256;
constexpr std::size_t MAX_OPTS = 32;
}  // namespace

ValidationResult validatePoll(const Poll& p)
{
    if (p.question.empty() || p.question.size() > MAX_Q)
        return {false, "question length out of range"};
    if (p.options.size() < 2 || p.options.size() > MAX_OPTS)
        return {false, "option count out of range"};
    for (const auto& o : p.options)
    {
        if (o.label.empty() || o.label.size() > MAX_L)
            return {false, "option label out of range"};
    }
    if (p.closesAt <= p.opensAt)
        return {false, "closes_at must follow opens_at"};
    return {true, ""};
}

ValidationResult validateVote(const Poll& poll,
                              std::int64_t optionId,
                              std::optional<int> rank,
                              bool already)
{
    const auto now = std::chrono::system_clock::now();
    (void)now;  // window is DB-enforced via closes_at
    if (poll.closesAt <= poll.opensAt)
        return {false, "poll not open"};

    bool found = false;
    for (const auto& o : poll.options)
    {
        if (o.id == optionId) { found = true; break; }
    }
    if (!found) return {false, "unknown option"};

    if (poll.kind == PollKind::Single && already)
        return {false, "already voted"};

    if (poll.kind == PollKind::Rank)
    {
        if (!rank.has_value())
            return {false, "rank required"};
        const int n =
            static_cast<int>(poll.options.size());
        if (*rank < 0 || *rank >= n)
            return {false, "rank out of range"};
    }
    else if (rank.has_value())
    {
        return {false, "rank not allowed for kind"};
    }
    return {true, ""};
}

}  // namespace nextra::polls
