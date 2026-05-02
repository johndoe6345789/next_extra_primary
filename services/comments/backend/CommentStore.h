#pragma once
/**
 * @file CommentStore.h
 * @brief Persistence layer for polymorphic
 *        threaded comments (comments_v2).
 */

#include "CommentTypes.h"
#include <drogon/drogon.h>
#include <functional>
#include <string>
#include <vector>

namespace services::comments
{

using Rows = std::vector<CommentRow>;
using RowsCb = std::function<void(Rows)>;
using RowCb =
    std::function<void(CommentRow)>;
using ErrCb = std::function<void(
    drogon::HttpStatusCode, std::string)>;

/**
 * @brief CRUD + moderation store for
 *        comments_v2 and friends.
 */
class CommentStore
{
  public:
    /** @brief List a thread's comments. */
    void listForTarget(
        const std::string& targetType,
        const std::string& targetId,
        int limit, int offset,
        RowsCb ok, ErrCb err);

    /** @brief List flagged comments. */
    void listFlagged(
        int limit, int offset,
        RowsCb ok, ErrCb err);

    /** @brief Insert a new comment. */
    void insert(const CreateCommentInput& in,
                RowCb ok, ErrCb err);

    /** @brief Look up one comment by id. */
    void findById(std::int64_t id,
                  RowCb ok, ErrCb err);

    /** @brief Flag a comment. */
    void flag(std::int64_t commentId,
              const std::string& reporterId,
              const std::string& reason,
              ErrCb done);

    /** @brief Moderator action. */
    void moderate(std::int64_t commentId,
                  ModAction action,
                  ErrCb done);

  private:
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::comments
