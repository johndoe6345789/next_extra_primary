/**
 * @file InAppSender.cpp
 * @brief InAppSender — updates the notifications row in place.
 */

#include "notifications/backend/InAppSender.h"

#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace nextra::notifications
{

InAppSender::InAppSender(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db))
{
}

DeliveryResult InAppSender::send(
    const Notification& notif,
    const RenderedMessage& msg)
{
    try
    {
        nlohmann::json blob = notif.data;
        blob["subject"] = msg.subject;
        blob["body"] = msg.body;
        db_->execSqlSync(
            "UPDATE notifications "
            "SET status='delivered', sent_at=now(), "
            "    data=$1::jsonb "
            "WHERE id=$2",
            blob.dump(),
            notif.id);
        return {true, ""};
    }
    catch (const std::exception& ex)
    {
        spdlog::warn("InAppSender failure: {}", ex.what());
        return {false, ex.what()};
    }
}

}  // namespace nextra::notifications
