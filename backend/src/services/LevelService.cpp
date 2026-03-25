/**
 * @file LevelService.cpp
 * @brief Level computation implementation.
 */

#include "services/LevelService.h"

#include <algorithm>

namespace services
{

LevelService::LevelService(const json& config)
{
    if (config.contains("levels")) {
        for (const auto& lv : config["levels"]) {
            levels_.push_back(
                {lv.value("level", 1),
                 lv.value(
                     "min_points",
                     static_cast<std::int64_t>(0)),
                 lv.value("title", "Unknown")});
        }
    }
    std::ranges::sort(levels_, [](const auto& a,
                                  const auto& b) {
        return a.minPoints > b.minPoints;
    });
}

auto LevelService::getLevelForPoints(
    std::int64_t points) const -> std::int32_t
{
    for (const auto& lv : levels_) {
        if (points >= lv.minPoints) {
            return lv.level;
        }
    }
    return 1;
}

auto LevelService::getLevelTitle(
    std::int32_t level) const -> std::string
{
    for (const auto& lv : levels_) {
        if (lv.level == level) {
            return lv.title;
        }
    }
    return "Newcomer";
}

auto LevelService::pointsToNextLevel(
    std::int64_t currentPoints) const -> std::int64_t
{
    std::int64_t nextThreshold = 0;
    bool         found         = false;
    for (auto it = levels_.rbegin();
         it != levels_.rend(); ++it) {
        if (it->minPoints > currentPoints) {
            nextThreshold = it->minPoints;
            found         = true;
            break;
        }
    }
    if (!found) {
        return 0; // Already at max level.
    }
    return nextThreshold - currentPoints;
}

} // namespace services
