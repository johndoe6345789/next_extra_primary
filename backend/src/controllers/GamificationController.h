#pragma once
/**
 * @file GamificationController.h
 * @brief Gamification endpoints: badges, leaderboard,
 *        streaks, points, and progress.
 */

#include <drogon/HttpController.h>

namespace controllers {

class GamificationController
    : public drogon::HttpController<GamificationController>
{
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(GamificationController::listBadges,
                  "/api/gamification/badges",
                  drogon::Get);
    ADD_METHOD_TO(GamificationController::leaderboard,
                  "/api/gamification/leaderboard",
                  drogon::Get);
    ADD_METHOD_TO(GamificationController::myStreaks,
                  "/api/gamification/streaks/me",
                  drogon::Get,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(GamificationController::awardPoints,
                  "/api/gamification/points/award",
                  drogon::Post,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(GamificationController::myProgress,
                  "/api/gamification/progress/me",
                  drogon::Get,
                  "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief List all available badges. */
    void listBadges(
        const drogon::HttpRequestPtr &req,
        std::function<void(const drogon::HttpResponsePtr &)>
            &&cb);

    /** @brief Get the leaderboard (query: period, limit). */
    void leaderboard(
        const drogon::HttpRequestPtr &req,
        std::function<void(const drogon::HttpResponsePtr &)>
            &&cb);

    /** @brief Get authenticated user's streaks. */
    void myStreaks(
        const drogon::HttpRequestPtr &req,
        std::function<void(const drogon::HttpResponsePtr &)>
            &&cb);

    /** @brief Award points to a user (admin only). */
    void awardPoints(
        const drogon::HttpRequestPtr &req,
        std::function<void(const drogon::HttpResponsePtr &)>
            &&cb);

    /** @brief Get authenticated user's progress. */
    void myProgress(
        const drogon::HttpRequestPtr &req,
        std::function<void(const drogon::HttpResponsePtr &)>
            &&cb);
};

}  // namespace controllers
