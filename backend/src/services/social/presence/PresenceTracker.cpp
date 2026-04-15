/**
 * @file PresenceTracker.cpp
 * @brief Redis SETEX presence implementation (7.3).
 */

#include "PresenceTracker.h"
#include "../../infra/RedisClient.h"

namespace
{

/** @brief Presence TTL must exceed client heartbeat. */
constexpr int kPresenceTtlSec = 60;

/** @brief Namespaced key helper. */
std::string key(const std::string& user)
{
    return "social:presence:" + user;
}

} // namespace

namespace services::social::presence
{

bool PresenceTracker::heartbeat(
    const std::string& user, const std::string& status)
{
    auto& r = nextra::infra::RedisClient::instance();
    return r.set(key(user), status, kPresenceTtlSec);
}

std::string PresenceTracker::status(
    const std::string& user)
{
    auto& r = nextra::infra::RedisClient::instance();
    auto v = r.get(key(user));
    if (!v.has_value()) return "offline";
    return *v;
}

bool PresenceTracker::offline(const std::string& user)
{
    auto& r = nextra::infra::RedisClient::instance();
    // Re-set with a 1-second TTL to age out reliably.
    return r.set(key(user), "offline", 1);
}

nlohmann::json PresenceTracker::bulk(
    const std::vector<std::string>& users)
{
    nlohmann::json out = nlohmann::json::object();
    for (const auto& u : users) out[u] = status(u);
    return out;
}

} // namespace services::social::presence
