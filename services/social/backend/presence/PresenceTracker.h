#pragma once
/**
 * @file PresenceTracker.h
 * @brief Redis-backed online/idle/offline tracker (7.3).
 */

#include <nlohmann/json.hpp>
#include <string>
#include <vector>

namespace services::social::presence
{

/**
 * @class PresenceTracker
 * @brief SETEX-based presence with a short TTL.
 *
 * Heartbeat from a connected WebSocket keeps the key
 * alive; expiration falls through to "offline".
 */
class PresenceTracker
{
  public:
    /** @brief Mark user as online with a TTL refresh. */
    bool heartbeat(
        const std::string& user,
        const std::string& status);

    /** @brief Read the live status of one user. */
    std::string status(const std::string& user);

    /** @brief Explicit offline (DEL). */
    bool offline(const std::string& user);

    /** @brief Bulk status for a list of users. */
    nlohmann::json bulk(
        const std::vector<std::string>& users);
};

} // namespace services::social::presence
