#pragma once
/**
 * @file LevelService.h
 * @brief Level calculation from accumulated points.
 *
 * Loads the levels table from
 * `constants/gamification.json` and exposes pure
 * query methods for level number, title, and the
 * gap to the next threshold.
 */

#include "services/gamification_types.h"

#include <nlohmann/json.hpp>

#include <cstdint>
#include <string>
#include <vector>

namespace services
{

/**
 * @class LevelService
 * @brief Pure level-computation helpers.
 *
 * Stateless after construction; safe to share.
 */
class LevelService
{
  public:
    /**
     * @brief Construct and load levels from config.
     *
     * @param config Parsed gamification.json root.
     */
    explicit LevelService(const json& config);

    /**
     * @brief Compute level from total points.
     *
     * @param points Accumulated point total.
     * @return Level number (1-based).
     */
    [[nodiscard]] auto getLevelForPoints(std::int64_t points) const
        -> std::int32_t;

    /**
     * @brief Human-readable title for a level.
     *
     * @param level Level number.
     * @return Title string (e.g. "Expert").
     */
    [[nodiscard]] auto getLevelTitle(std::int32_t level) const -> std::string;

    /**
     * @brief Points needed to reach the next level.
     *
     * @param currentPoints Current point total.
     * @return Remaining points, or 0 at max level.
     */
    [[nodiscard]] auto pointsToNextLevel(std::int64_t currentPoints) const
        -> std::int64_t;

  private:
    struct LevelDef {
        std::int32_t level;
        std::int64_t minPoints;
        std::string title;
    };

    /// Sorted descending by minPoints for fast lookup.
    std::vector<LevelDef> levels_;
};

} // namespace services
