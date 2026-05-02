#pragma once
/**
 * @file comments_search_emit.h
 * @brief Tiny header-only emitters for
 *        @c search.reindex events keyed off
 *        moderation actions on @c comments_v2.
 *        Forum content is indexed under
 *        @c forum_posts.
 */

#include "comments/backend/CommentStore.h"
#include "search/backend/SearchEventPublisher.h"

#include <cstdint>
#include <string>

namespace controllers
{

/// Emit a delete event for one moderated comment id.
inline void emitForumPostDelete(std::int64_t id)
{
    nextra::search::SearchEventPublisher
        ::publishDelete("forum_posts",
                        std::to_string(id));
}

/// Re-fetch comment row and emit upsert. Best-
/// effort: row missing or DB error is silently
/// swallowed — the periodic resync will repair.
inline void emitForumPostReindex(std::int64_t id)
{
    services::comments::CommentStore store;
    store.findById(
        id,
        [](services::comments::CommentRow row) {
            nextra::search::SearchEventPublisher
                ::publish("upsert", "forum_posts",
                    std::to_string(row.id),
                    {{"target_type", row.targetType},
                     {"target_id", row.targetId},
                     {"author_id", row.authorId},
                     {"body", row.body},
                     {"created_at", row.createdAt}});
        },
        [](drogon::HttpStatusCode,
           const std::string&) {});
}

} // namespace controllers
