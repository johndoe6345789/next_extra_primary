/**
 * @file UserService.cpp
 * @brief Implementation of user profile operations.
 */

#include "services/UserService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <string>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto UserService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

// ----------------------------------------------------------------
// Row mapping helper
// ----------------------------------------------------------------

auto UserService::rowToJson(const Row& row) -> json
{
    json user = {{"id", row["id"].as<std::string>()},
                 {"email", row["email"].as<std::string>()},
                 {"username", row["username"].as<std::string>()},
                 {"displayName", row["display_name"].as<std::string>()},
                 {"role", row["role"].as<std::string>()},
                 {"emailConfirmed", row["email_confirmed"].as<bool>()},
                 {"totalPoints", row["total_points"].as<std::int64_t>()},
                 {"currentStreak", row["current_streak"].as<std::int32_t>()},
                 {"createdAt", row["created_at"].as<std::string>()}};

    // Optional nullable columns.
    if (!row["avatar_url"].isNull()) {
        user["avatarUrl"] = row["avatar_url"].as<std::string>();
    }
    if (!row["bio"].isNull()) {
        user["bio"] = row["bio"].as<std::string>();
    }

    return user;
}

// ----------------------------------------------------------------
// getUserById
// ----------------------------------------------------------------

void UserService::getUserById(const std::string& id, Callback onSuccess,
                              ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT id, email, username, display_name,
               role, email_confirmed, total_points,
               current_streak, avatar_url, bio,
               created_at
        FROM users
        WHERE id = $1
        LIMIT 1
    )";

    *dbClient << sql << id >> [onSuccess, onError](const Result& result) {
        if (result.empty()) {
            onError(k404NotFound, "User not found");
            return;
        }
        onSuccess(rowToJson(result[0]));
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getUserById DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// getUserByEmail
// ----------------------------------------------------------------

void UserService::getUserByEmail(const std::string& email, Callback onSuccess,
                                 ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT id, email, username, display_name,
               role, email_confirmed, total_points,
               current_streak, avatar_url, bio,
               created_at
        FROM users
        WHERE email = $1
        LIMIT 1
    )";

    *dbClient << sql << email >> [onSuccess, onError](const Result& result) {
        if (result.empty()) {
            onError(k404NotFound, "User not found");
            return;
        }
        onSuccess(rowToJson(result[0]));
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getUserByEmail DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// updateUser
// ----------------------------------------------------------------

void UserService::updateUser(const std::string& id, const json& fields,
                             Callback onSuccess, ErrCallback onError)
{
    // Build SET clause from whitelisted fields only.
    std::vector<std::string> setClauses;
    std::vector<std::string> values;
    int paramIdx = 1;

    for (const auto& col : kEditableFields) {
        if (fields.contains(col) && fields[col].is_string()) {
            setClauses.push_back(fmt::format("{} = ${}", col, ++paramIdx));
            values.push_back(fields[col].get<std::string>());
        }
    }

    if (setClauses.empty()) {
        onError(k400BadRequest, "No valid fields to update");
        return;
    }

    // Always bump updated_at.
    setClauses.emplace_back("updated_at = NOW()");

    std::string setStr;
    for (std::size_t i = 0; i < setClauses.size(); ++i) {
        if (i > 0)
            setStr += ", ";
        setStr += setClauses[i];
    }

    auto sql = fmt::format(R"(
        UPDATE users
        SET {}
        WHERE id = $1
        RETURNING id, email, username, display_name,
                  role, email_confirmed, total_points,
                  current_streak, avatar_url, bio,
                  created_at
    )",
                           setStr);

    auto dbClient = db();

    // Build a stream-style binder dynamically.
    auto binder = *dbClient << sql;
    binder << id;
    for (const auto& v : values) {
        binder << v;
    }
    binder >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound, "User not found");
            return;
        }
        onSuccess(rowToJson(r[0]));
    };
    binder >> [onError](const DrogonDbException& e) {
        spdlog::error("updateUser DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
    binder.exec();
}

// ----------------------------------------------------------------
// listUsers
// ----------------------------------------------------------------

void UserService::listUsers(std::int32_t page, std::int32_t perPage,
                            Callback onSuccess, ErrCallback onError)
{
    if (page < 1)
        page = 1;
    if (perPage < 1)
        perPage = 20;
    if (perPage > 100)
        perPage = 100;

    auto dbClient = db();
    auto offset = static_cast<std::int64_t>(page - 1) * perPage;

    const std::string countSql = R"(
        SELECT COUNT(*) AS total FROM users
    )";

    *dbClient << countSql >> [dbClient, page, perPage, offset, onSuccess,
                              onError](const Result& countResult) {
        std::int64_t total = 0;
        if (!countResult.empty()) {
            total = countResult[0]["total"].as<std::int64_t>();
        }

        const std::string dataSql = R"(
                SELECT id, email, username,
                       display_name, role,
                       email_confirmed,
                       total_points,
                       current_streak,
                       avatar_url, bio,
                       created_at
                FROM users
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
            )";

        *dbClient << dataSql << perPage << offset >>
            [total, page, perPage, onSuccess](const Result& result) {
                json items = json::array();
                for (const auto& row : result) {
                    items.push_back(rowToJson(row));
                }

                std::int64_t totalPages = (total + perPage - 1) / perPage;
                onSuccess({{"data", items},
                           {"pagination",
                            {{"total", total},
                             {"page", page},
                             {"perPage", perPage},
                             {"totalPages", totalPages}}}});
            } >>
            [onError](const DrogonDbException& e) {
                spdlog::error("listUsers data DB error:"
                              " {}",
                              e.base().what());
                onError(k500InternalServerError, "Internal server error");
            };
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("listUsers count DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// getUserBadges
// ----------------------------------------------------------------

void UserService::getUserBadges(const std::string& userId, Callback onSuccess,
                                ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT b.id, b.slug, b.name,
               b.description, b.icon_url,
               ub.earned_at
        FROM user_badges ub
        JOIN badges b ON b.id = ub.badge_id
        WHERE ub.user_id = $1
        ORDER BY ub.earned_at DESC
    )";

    *dbClient << sql << userId >> [onSuccess](const Result& result) {
        json badges = json::array();
        for (const auto& row : result) {
            json badge = {{"id", row["id"].as<std::string>()},
                          {"slug", row["slug"].as<std::string>()},
                          {"name", row["name"].as<std::string>()},
                          {"description", row["description"].as<std::string>()},
                          {"earnedAt", row["earned_at"].as<std::string>()}};
            if (!row["icon_url"].isNull()) {
                badge["iconUrl"] = row["icon_url"].as<std::string>();
            }
            badges.push_back(badge);
        }
        onSuccess(badges);
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getUserBadges DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

// ----------------------------------------------------------------
// getUserStats
// ----------------------------------------------------------------

void UserService::getUserStats(const std::string& userId, Callback onSuccess,
                               ErrCallback onError)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT u.total_points, u.current_streak,
               u.longest_streak,
               COUNT(DISTINCT ub.badge_id)
                   AS badge_count,
               COUNT(DISTINCT cm.id)
                   AS message_count
        FROM users u
        LEFT JOIN user_badges ub
            ON ub.user_id = u.id
        LEFT JOIN chat_messages cm
            ON cm.user_id = u.id
        WHERE u.id = $1
        GROUP BY u.id
    )";

    *dbClient << sql << userId >> [onSuccess, onError](const Result& result) {
        if (result.empty()) {
            onError(k404NotFound, "User not found");
            return;
        }
        const auto& r = result[0];
        auto pts = r["total_points"].as<std::int64_t>();

        // Inline level calc (mirrors
        // GamificationService logic).
        std::int32_t level = 1;
        constexpr std::array<std::pair<std::int64_t, std::int32_t>, 8>
            kThresholds = {{{10000, 8},
                            {5000, 7},
                            {2000, 6},
                            {1000, 5},
                            {500, 4},
                            {250, 3},
                            {100, 2},
                            {0, 1}}};
        for (auto [threshold, lv] : kThresholds) {
            if (pts >= threshold) {
                level = lv;
                break;
            }
        }

        onSuccess({{"totalPoints", pts},
                   {"level", level},
                   {"currentStreak", r["current_streak"].as<std::int32_t>()},
                   {"longestStreak", r["longest_streak"].as<std::int32_t>()},
                   {"badgeCount", r["badge_count"].as<std::int64_t>()},
                   {"messageCount", r["message_count"].as<std::int64_t>()}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("getUserStats DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
