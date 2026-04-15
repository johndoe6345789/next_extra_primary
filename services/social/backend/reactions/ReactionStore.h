#pragma once
/**
 * @file ReactionStore.h
 * @brief Polymorphic emoji reactions store (7.4).
 */

#include <nlohmann/json.hpp>
#include <string>

namespace services::social::reactions
{

/**
 * @class ReactionStore
 * @brief CRUD over the reactions table.
 *
 * Targets are identified by a (type, id) tuple so the
 * same backing table can serve comments, posts,
 * messages, etc.
 */
class ReactionStore
{
  public:
    /** @brief Add a reaction; idempotent. */
    bool add(const std::string& targetType,
             const std::string& targetId,
             const std::string& userId,
             const std::string& emoji);

    /** @brief Remove a reaction; returns affected. */
    int remove(const std::string& targetType,
               const std::string& targetId,
               const std::string& userId,
               const std::string& emoji);

    /** @brief Count per emoji for a target. */
    nlohmann::json summary(
        const std::string& targetType,
        const std::string& targetId);
};

} // namespace services::social::reactions
