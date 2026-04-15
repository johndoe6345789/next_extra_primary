#pragma once
/**
 * @file gamification_facade_types.h
 * @brief Leaderboard and progress method declarations
 *        for GamificationService.
 *
 * Extracted from GamificationService.h to keep each
 * header under 90 lines.
 */

#include "gamification/backend/gamification_types.h"

#include <cstdint>
#include <string>

namespace services
{

/**
 * @brief Leaderboard query parameters.
 */
struct LeaderboardParams {
    std::string period{"weekly"};
    std::int32_t limit{10};
};

} // namespace services
