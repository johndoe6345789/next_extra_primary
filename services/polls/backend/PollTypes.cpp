/**
 * @file PollTypes.cpp
 * @brief PollKind text conversion helpers.
 */

#include "PollTypes.h"

#include <stdexcept>

namespace nextra::polls
{

PollKind parseKind(const std::string& s)
{
    if (s == "single")   return PollKind::Single;
    if (s == "multi")    return PollKind::Multi;
    if (s == "rank")     return PollKind::Rank;
    if (s == "approval") return PollKind::Approval;
    throw std::invalid_argument("polls: unknown kind: " + s);
}

std::string kindToString(PollKind k)
{
    switch (k)
    {
        case PollKind::Single:   return "single";
        case PollKind::Multi:    return "multi";
        case PollKind::Rank:     return "rank";
        case PollKind::Approval: return "approval";
    }
    return "single";
}

}  // namespace nextra::polls
