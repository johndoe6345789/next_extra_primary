#pragma once
/**
 * @file polls_json.h
 * @brief JSON serialisation helpers for Poll rows.
 * Kept separate so PollsController*.cpp files can
 * stay under the 100-LOC per-file cap.
 */

#include "polls/backend/PollTypes.h"

#include <nlohmann/json.hpp>

namespace controllers::polls_json
{

using json = nlohmann::json;

inline json pollToJson(const nextra::polls::Poll& p)
{
    json opts = json::array();
    for (const auto& o : p.options)
        opts.push_back({{"id", o.id},
                        {"position", o.position},
                        {"label", o.label}});
    return {{"id", p.id},
            {"tenant_id", p.tenantId},
            {"creator_id", p.creatorId},
            {"question", p.question},
            {"kind", kindToString(p.kind)},
            {"opens_at", p.opensAt},
            {"closes_at", p.closesAt},
            {"public", p.isPublic},
            {"options", opts}};
}

}  // namespace controllers::polls_json
