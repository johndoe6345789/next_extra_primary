#pragma once
/**
 * @file comment_service.h
 * @brief Service for CRUD operations on user
 *        comments / activity feed.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <functional>
#include <string>

namespace services
{

using json = nlohmann::json;
using Callback =
    std::function<void(json)>;
using ErrCallback =
    std::function<void(
        drogon::HttpStatusCode,
        std::string)>;

/**
 * @brief Manages the comments table.
 */
class CommentService
{
  public:
    /**
     * @brief List comments, newest first.
     * @param limit  Max rows to return.
     * @param offset Pagination offset.
     * @param ok     Success callback.
     * @param err    Error callback.
     */
    void list(int limit, int offset,
              Callback ok,
              ErrCallback err);

    /**
     * @brief Create a new comment.
     * @param userId Author's user ID.
     * @param content Comment body text.
     * @param ok      Success callback.
     * @param err     Error callback.
     */
    void create(const std::string& userId,
                const std::string& content,
                Callback ok,
                ErrCallback err);

    /**
     * @brief Delete a comment by ID.
     * @param commentId UUID of the comment.
     * @param userId    Requesting user (owner).
     * @param ok        Success callback.
     * @param err       Error callback.
     */
    void remove(const std::string& commentId,
                const std::string& userId,
                Callback ok,
                ErrCallback err);

  private:
    /** @brief Get the default DB client. */
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services
