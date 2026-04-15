/**
 * @file GamificationService.cpp
 * @brief Facade -- delegates to gamification
 *        sub-services.
 */

#include "gamification/backend/GamificationService.h"
#include "gamification/backend/gamification_config.h"

namespace services
{

GamificationService::GamificationService()
    : config_(loadGamificationConfig())
    , levels_(config_)
    , streak_(buildMilestones(config_))
    , leaderboard_(&levels_)
    , progress_(&levels_)
{
}

void GamificationService::awardPoints(
    const std::string& userId,
    std::int64_t amount,
    const std::string& reason,
    const std::string& source,
    Callback onSuccess,
    ErrCallback onError)
{
    xp_.awardPoints(
        userId, amount, reason, source,
        std::move(onSuccess),
        std::move(onError));
}

void GamificationService::checkAndAwardBadges(
    const std::string& userId,
    Callback onSuccess,
    ErrCallback onError)
{
    badges_.checkAndAwardBadges(
        userId,
        std::move(onSuccess),
        std::move(onError));
}

void GamificationService::updateStreak(
    const std::string& userId,
    Callback onSuccess,
    ErrCallback onError)
{
    streak_.updateStreak(
        userId,
        std::move(onSuccess),
        std::move(onError));
}

void GamificationService::getLeaderboard(
    const std::string& period,
    std::int32_t limit,
    Callback onSuccess,
    ErrCallback onError)
{
    leaderboard_.getLeaderboard(
        period, limit,
        std::move(onSuccess),
        std::move(onError));
}

void GamificationService::getUserProgress(
    const std::string& userId,
    Callback onSuccess,
    ErrCallback onError)
{
    progress_.getUserProgress(
        userId,
        std::move(onSuccess),
        std::move(onError));
}

} // namespace services
