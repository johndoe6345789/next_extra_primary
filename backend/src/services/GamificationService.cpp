/**
 * @file GamificationService.cpp
 * @brief Facade — delegates to gamification
 *        sub-services.
 */

#include "services/GamificationService.h"

#include <spdlog/spdlog.h>

#include <algorithm>
#include <fstream>

namespace services
{

static auto loadConfig() -> json
{
    try {
        std::ifstream ifs(
            "src/constants/gamification.json");
        if (!ifs.is_open())
            ifs.open("backend/src/constants/"
                     "gamification.json");
        if (ifs.is_open())
            return json::parse(ifs);
        spdlog::warn("gamification.json not found;"
                     " using defaults");
    } catch (const std::exception& e) {
        spdlog::error("Failed to parse "
                      "gamification.json: {}",
                      e.what());
    }
    return json::object();
}

static auto buildMilestones(const json& cfg)
    -> std::vector<std::int32_t>
{
    std::vector<std::int32_t> ms;
    if (cfg.contains("streaks") &&
        cfg["streaks"].contains("milestones")) {
        for (const auto& m :
             cfg["streaks"]["milestones"])
            ms.push_back(m.get<std::int32_t>());
    }
    std::ranges::sort(ms);
    return ms;
}

GamificationService::GamificationService()
    : config_(loadConfig())
    , levels_(config_)
    , streak_(buildMilestones(config_))
    , leaderboard_(&levels_)
    , progress_(&levels_)
{
}

void GamificationService::awardPoints(
    const std::string& userId, std::int64_t amount,
    const std::string& reason,
    const std::string& source,
    Callback onSuccess, ErrCallback onError)
{
    xp_.awardPoints(userId, amount, reason, source,
        std::move(onSuccess), std::move(onError));
}
void GamificationService::checkAndAwardBadges(
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    badges_.checkAndAwardBadges(userId,
        std::move(onSuccess), std::move(onError));
}
void GamificationService::updateStreak(
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    streak_.updateStreak(userId,
        std::move(onSuccess), std::move(onError));
}

void GamificationService::getLeaderboard(
    const std::string& period, std::int32_t limit,
    Callback onSuccess, ErrCallback onError)
{
    leaderboard_.getLeaderboard(period, limit,
        std::move(onSuccess), std::move(onError));
}

void GamificationService::getUserProgress(
    const std::string& userId,
    Callback onSuccess, ErrCallback onError)
{
    progress_.getUserProgress(userId,
        std::move(onSuccess), std::move(onError));
}

} // namespace services
