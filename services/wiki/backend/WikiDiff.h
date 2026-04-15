#pragma once
/**
 * @file WikiDiff.h
 * @brief Minimal line-based diff producing a
 *        +/- list between two markdown bodies.
 */

#include <nlohmann/json.hpp>
#include <string>

namespace services::wiki
{

using json = nlohmann::json;

/**
 * @brief Compute a line-based diff.
 *
 * Uses a naive common-prefix/suffix strip plus
 * line-by-line comparison. Output format:
 *   [{"op":"=" | "-" | "+", "line":"..."}]
 *
 * @param oldBody The previous version body.
 * @param newBody The current version body.
 * @return JSON array of diff ops.
 */
json lineDiff(const std::string& oldBody,
              const std::string& newBody);

} // namespace services::wiki
