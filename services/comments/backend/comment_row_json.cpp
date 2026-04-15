/**
 * @file comment_row_json.cpp
 * @brief CommentRow::toJson implementation.
 */

#include "CommentTypes.h"

namespace services::comments
{

json CommentRow::toJson() const
{
    json j;
    j["id"] = id;
    j["target_type"] = targetType;
    j["target_id"] = targetId;
    j["author_id"] = authorId;
    j["body"] = body;
    j["path"] = path;
    j["depth"] = depth;
    j["flag_count"] = flagCount;
    j["created_at"] = createdAt;
    j["updated_at"] = updatedAt;
    if (tenantId)
        j["tenant_id"] = *tenantId;
    if (parentId)
        j["parent_id"] = *parentId;
    if (deletedAt)
        j["deleted_at"] = *deletedAt;
    else
        j["deleted_at"] = nullptr;
    return j;
}

} // namespace services::comments
