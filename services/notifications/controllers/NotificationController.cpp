/**
 * @file NotificationController.cpp
 * @brief Read-only notification endpoints: list, unread count.
 */

#include "NotificationController.h"
#include "notifications/backend/NotificationService.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "drogon-host/backend/utils/parse_helpers.h"

#include <nlohmann/json.hpp>

using json = nlohmann::json;
using Cb =
    std::function<void(const drogon::HttpResponsePtr&)>;

namespace controllers
{

void NotificationController::list(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId =
        req->attributes()->get<std::string>("user_id");
    auto page = ::utils::safeStoll(
        req->getParameter("page"), 1);
    auto perPage = ::utils::safeStoll(
        req->getParameter("per_page"), 20);

    services::NotificationService svc;
    svc.getNotifications(
        userId, static_cast<int32_t>(page),
        static_cast<int32_t>(perPage),
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void NotificationController::unreadCount(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId =
        req->attributes()->get<std::string>("user_id");

    services::NotificationService svc;
    svc.getUnreadCount(
        userId,
        [cb](const json& data) {
            json mapped = {
                {"unread_count", data.value("count", 0)}};
            cb(::utils::jsonOk(mapped));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
