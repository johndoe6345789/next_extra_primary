#pragma once
/**
 * @file gamification_config.h
 * @brief Config loading helpers for
 *        GamificationService.
 */

#include <algorithm>
#include <cstdint>
#include <fstream>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <vector>

namespace services
{

using json = nlohmann::json;

/**
 * @brief Load gamification config from JSON file.
 * @return Parsed config or empty object on failure.
 */
inline auto loadGamificationConfig() -> json
{
    try {
        std::ifstream ifs(
            "src/constants/gamification.json");
        if (!ifs.is_open()) {
            ifs.open("backend/src/constants/"
                     "gamification.json");
        }
        if (ifs.is_open()) {
            return json::parse(ifs);
        }
        spdlog::warn(
            "gamification.json not found;"
            " using defaults");
    } catch (const std::exception& e) {
        spdlog::error(
            "Failed to parse "
            "gamification.json: {}",
            e.what());
    }
    return json::object();
}

/**
 * @brief Extract sorted milestone values from config.
 * @param cfg  Gamification config JSON.
 * @return Sorted vector of milestone thresholds.
 */
inline auto buildMilestones(
    const json& cfg) -> std::vector<std::int32_t>
{
    std::vector<std::int32_t> ms;
    if (cfg.contains("streaks")
        && cfg["streaks"].contains("milestones")) {
        for (const auto& m :
             cfg["streaks"]["milestones"]) {
            ms.push_back(m.get<std::int32_t>());
        }
    }
    std::ranges::sort(ms);
    return ms;
}

} // namespace services
