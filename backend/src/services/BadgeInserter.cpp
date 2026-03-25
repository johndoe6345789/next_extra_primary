/**
 * @file BadgeInserter.cpp
 * @brief Implementation of BadgeInserter::insertOne.
 */

#include "services/BadgeInserter.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto BadgeInserter::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void BadgeInserter::insertOne(
    const std::string&           userId,
    const json&                  badge,
    std::shared_ptr<std::size_t> remaining,
    std::shared_ptr<json>        result,
    Callback                     onSuccess)
{
    auto slug = badge["slug"].get<std::string>();
    auto name = badge["name"].get<std::string>();
    auto desc =
        badge["description"].get<std::string>();

    const std::string ins = R"(
        INSERT INTO badges (slug, name, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO UPDATE
            SET slug = EXCLUDED.slug
        RETURNING id
    )";

    auto dbClient = db();
    *dbClient << ins << slug << name << desc >>
        [dbClient, userId, badge, remaining,
         result, onSuccess](const Result& br) {
            if (br.empty()) {
                if (--(*remaining) == 0)
                    onSuccess(*result);
                return;
            }
            auto badgeId =
                br[0]["id"].as<std::string>();
            const std::string link = R"(
                INSERT INTO user_badges
                    (user_id, badge_id, earned_at)
                VALUES ($1, $2, NOW())
                ON CONFLICT DO NOTHING
                RETURNING badge_id
            )";
            *dbClient << link << userId << badgeId >>
                [badge, remaining, result,
                 onSuccess](const Result& lr) {
                    if (!lr.empty())
                        result->push_back(badge);
                    if (--(*remaining) == 0)
                        onSuccess(*result);
                } >>
                [remaining, result,
                 onSuccess](const DrogonDbException&) {
                    if (--(*remaining) == 0)
                        onSuccess(*result);
                };
        } >>
        [remaining, result,
         onSuccess](const DrogonDbException&) {
            if (--(*remaining) == 0)
                onSuccess(*result);
        };
}

} // namespace services
