/**
 * @file NotificationController.cpp
 * @brief Notification endpoint implementations.
 */

#include "NotificationController.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

/// @brief Safely parse a string to long long, returning @p fallback on error.
static auto safeStoll(
    const std::string& s,
    long long fallback) noexcept -> long long
{
    try {
        return std::stoll(s);
    } catch (...) {
        return fallback;
    }
}

namespace controllers
{

void NotificationController::list(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    auto pageStr = req->getParameter("page");
    auto perPageStr = req->getParameter("per_page");
    int64_t page = safeStoll(pageStr, 1);
    int64_t perPage = safeStoll(perPageStr, 20);

    // TODO: query database filtered by userId.
    json items = json::array();
    cb(::utils::jsonPaginated(items, 0, page, perPage));
}

// ----------------------------------------------------------
void NotificationController::unreadCount(const drogon::HttpRequestPtr& req,
                                         Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: count unread from database.
    cb(::utils::jsonOk({{"unread_count", 0}}));
}

// ----------------------------------------------------------
void NotificationController::markRead(const drogon::HttpRequestPtr& req,
                                      Cb&& cb, const std::string& id)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: verify ownership and update in DB.
    cb(::utils::jsonOk({{"id", id}, {"read", true}}));
}

// ----------------------------------------------------------
void NotificationController::markAllRead(const drogon::HttpRequestPtr& req,
                                         Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: bulk update in database.
    cb(::utils::jsonOk({{"message", "All notifications marked as read"}}));
}

// ----------------------------------------------------------
void NotificationController::remove(const drogon::HttpRequestPtr& req, Cb&& cb,
                                    const std::string& id)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: verify ownership and delete from DB.
    cb(::utils::jsonOk({{"message", "Notification deleted"}, {"id", id}}));
}

} // namespace controllers
