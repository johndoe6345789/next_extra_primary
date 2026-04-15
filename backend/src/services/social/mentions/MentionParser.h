#pragma once
/**
 * @file MentionParser.h
 * @brief @username extraction + mention persistence (7.5).
 */

#include <string>
#include <vector>

namespace services::social::mentions
{

/**
 * @class MentionParser
 * @brief Scans text for `@handle` tokens and resolves
 *        them to user ids via the users table.
 *
 * Inserts a row into the `mentions` table for every
 * resolved handle so downstream notification workers
 * can consume it.
 */
class MentionParser
{
  public:
    /**
     * @brief Parse @p text and return the raw handles.
     * @return All `@word` tokens, lowercased, deduped.
     */
    std::vector<std::string> extract(
        const std::string& text);

    /**
     * @brief Parse @p text and persist resolved mentions.
     * @param sourceType e.g. "comment", "dm".
     * @param sourceId   opaque id of the source record.
     * @return Count of rows inserted.
     */
    int persist(
        const std::string& sourceType,
        const std::string& sourceId,
        const std::string& text);
};

} // namespace services::social::mentions
