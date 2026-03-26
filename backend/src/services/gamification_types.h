#pragma once
/**
 * @file gamification_types.h
 * @brief Shared types for the gamification sub-services.
 *
 * Defines common type aliases, value objects, and
 * callback signatures used across XpService,
 * BadgeService, StreakService, LeaderboardService,
 * LevelService, and GamificationService.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <cstdint>
#include <functional>
#include <string>

namespace services
{

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback = std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @brief Value object returned by StreakService::updateStreak.
 */
struct StreakInfo {
    std::int32_t currentStreak{0};
    std::int32_t longestStreak{0};
    bool milestonReached{false};
    std::int32_t milestoneValue{0};
};

/**
 * @brief Single entry on the leaderboard.
 */
struct LeaderboardEntry {
    std::string userId;
    std::string username;
    std::int64_t points{0};
    std::int32_t level{1};
    std::int32_t rank{0};
};

} // namespace services
