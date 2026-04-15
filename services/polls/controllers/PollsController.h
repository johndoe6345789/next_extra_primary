#pragma once
/**
 * @file PollsController.h
 * @brief REST endpoints for the polls / voting daemon.
 *
 * The implementation is split across three .cpp files
 * (crud, vote, results) so each stays inside the
 * 100-LOC per-file cap imposed by CLAUDE.md.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class PollsController
    : public drogon::HttpController<PollsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(PollsController::list,
                  "/api/polls", drogon::Get);
    ADD_METHOD_TO(PollsController::create,
                  "/api/polls", drogon::Post,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(PollsController::get,
                  "/api/polls/{id}", drogon::Get);
    ADD_METHOD_TO(PollsController::vote,
                  "/api/polls/{id}/vote",
                  drogon::Post,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(PollsController::results,
                  "/api/polls/{id}/results",
                  drogon::Get);
    METHOD_LIST_END

    /** @brief List recent polls for the caller's tenant. */
    void list(const drogon::HttpRequestPtr& req,
              std::function<void(
                  const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Create a poll (requires auth). */
    void create(const drogon::HttpRequestPtr& req,
                std::function<void(
                    const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Fetch a single poll with its options. */
    void get(const drogon::HttpRequestPtr& req,
             std::function<void(
                 const drogon::HttpResponsePtr&)>&& cb,
             std::int64_t id);

    /** @brief Cast a vote on a poll (requires auth). */
    void vote(const drogon::HttpRequestPtr& req,
              std::function<void(
                  const drogon::HttpResponsePtr&)>&& cb,
              std::int64_t id);

    /** @brief Tallied results for a poll. */
    void results(const drogon::HttpRequestPtr& req,
                 std::function<void(
                     const drogon::HttpResponsePtr&)>&& cb,
                 std::int64_t id);
};

}  // namespace controllers
