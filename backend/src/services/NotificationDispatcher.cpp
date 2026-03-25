/**
 * @file NotificationDispatcher.cpp
 * @brief Fire-and-forget gamification event notifications.
 */

#include "services/NotificationDispatcher.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

namespace services
{

void NotificationDispatcher::notifyBadgeEarned(
    const std::string& userId, const json& badge)
{
    auto name = badge.value("name", "Unknown Badge");
    mutator_.createNotification(
        userId,
        fmt::format("Badge Earned: {}", name),
        fmt::format("Congratulations! You earned the "
                    "\"{}\" badge.",
                    name),
        "badge", badge,
        [](const json&) {},
        [](drogon::HttpStatusCode,
           const std::string& err) {
            spdlog::error(
                "notifyBadgeEarned failed: {}", err);
        });
}

void NotificationDispatcher::notifyLevelUp(
    const std::string& userId, std::int32_t newLevel)
{
    mutator_.createNotification(
        userId,
        fmt::format("Level Up! You're now level {}",
                    newLevel),
        fmt::format("You've reached level {}. "
                    "Keep going!",
                    newLevel),
        "level_up", {{"level", newLevel}},
        [](const json&) {},
        [](drogon::HttpStatusCode,
           const std::string& err) {
            spdlog::error(
                "notifyLevelUp failed: {}", err);
        });
}

void NotificationDispatcher::notifyStreakMilestone(
    const std::string& userId, std::int32_t days)
{
    mutator_.createNotification(
        userId,
        fmt::format("{}-Day Streak!", days),
        fmt::format("Amazing! You've maintained a "
                    "{}-day streak.",
                    days),
        "streak", {{"days", days}},
        [](const json&) {},
        [](drogon::HttpStatusCode,
           const std::string& err) {
            spdlog::error(
                "notifyStreakMilestone failed: {}",
                err);
        });
}

} // namespace services
