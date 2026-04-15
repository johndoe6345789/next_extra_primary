#pragma once
/**
 * @file GroupStore.h
 * @brief Named groups / teams store (7.6).
 */

#include <cstdint>
#include <nlohmann/json.hpp>
#include <optional>
#include <string>

namespace services::social::groups
{

/**
 * @class GroupStore
 * @brief CRUD over groups and group_members.
 */
class GroupStore
{
  public:
    /** @brief Create a group; returns new id. */
    std::int64_t create(
        const std::string& slug,
        const std::string& name,
        const std::string& description);

    /** @brief Look up a group by its slug. */
    std::optional<nlohmann::json>
    findBySlug(const std::string& slug);

    /** @brief List all groups newest first. */
    nlohmann::json listAll(int limit);

    /** @brief Add a member with a named role. */
    bool addMember(std::int64_t groupId,
                   const std::string& userId,
                   const std::string& role);

    /** @brief Remove a member. */
    int removeMember(
        std::int64_t groupId,
        const std::string& userId);

    /** @brief List members of a group. */
    nlohmann::json listMembers(
        std::int64_t groupId, int limit);
};

} // namespace services::social::groups
