#pragma once
/**
 * @file DmStore.h
 * @brief Direct message thread + message persistence (7.2).
 */

#include <cstdint>
#include <nlohmann/json.hpp>
#include <string>

namespace services::social::dm
{

/**
 * @class DmStore
 * @brief CRUD over dm_threads and dm_messages.
 *
 * Threads are canonical on the unordered pair of
 * participants; the UNIQUE expression index on
 * (least, greatest) guarantees de-duplication.
 */
class DmStore
{
  public:
    /** @brief Find or create the thread for a user pair. */
    std::int64_t upsertThread(
        const std::string& a, const std::string& b);

    /** @brief Append a message to a thread. */
    std::int64_t sendMessage(
        std::int64_t threadId,
        const std::string& sender,
        const std::string& body);

    /** @brief Threads involving a given user. */
    nlohmann::json listThreads(
        const std::string& user, int limit);

    /** @brief Messages for a thread, newest first. */
    nlohmann::json listMessages(
        std::int64_t threadId, int limit);

    /** @brief Mark a single message as read. */
    bool markRead(std::int64_t messageId);
};

} // namespace services::social::dm
