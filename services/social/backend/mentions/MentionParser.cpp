/**
 * @file MentionParser.cpp
 * @brief Regex extraction + persistence for @mentions.
 */

#include "MentionParser.h"

#include <drogon/drogon.h>
#include <algorithm>
#include <regex>
#include <unordered_set>

using namespace drogon;
using namespace drogon::orm;

namespace services::social::mentions
{

std::vector<std::string> MentionParser::extract(
    const std::string& text)
{
    static const std::regex kRe{"@([a-zA-Z0-9_]+)"};
    std::vector<std::string> out;
    std::unordered_set<std::string> seen;
    auto b = std::sregex_iterator(
        text.begin(), text.end(), kRe);
    auto e = std::sregex_iterator();
    for (auto it = b; it != e; ++it) {
        auto h = (*it)[1].str();
        std::transform(
            h.begin(), h.end(), h.begin(),
            [](unsigned char c) {
                return std::tolower(c);
            });
        if (seen.insert(h).second) out.push_back(h);
    }
    return out;
}

int MentionParser::persist(
    const std::string& sourceType,
    const std::string& sourceId,
    const std::string& text)
{
    auto handles = extract(text);
    if (handles.empty()) return 0;
    auto db = app().getDbClient();
    int n = 0;
    for (const auto& h : handles) {
        auto u = db->execSqlSync(
            "SELECT id::text AS id FROM users "
            "WHERE lower(username) = $1 LIMIT 1", h);
        if (u.empty()) continue;
        db->execSqlSync(
            "INSERT INTO mentions "
            "(source_type, source_id, mentioned_user_id) "
            "VALUES ($1, $2, $3::uuid)",
            sourceType, sourceId,
            u[0]["id"].as<std::string>());
        ++n;
    }
    return n;
}

} // namespace services::social::mentions
