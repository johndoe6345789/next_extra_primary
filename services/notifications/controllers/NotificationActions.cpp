/**
 * @file NotificationActions.cpp
 * @brief Mutation notification endpoints: mark-read,
 *        mark-all-read, delete.
 */

#include "NotificationController.h"
#include "notifications/backend/NotificationService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>

using json = nlohmann::json;
using Cb =
    std::function<void(const drogon::HttpResponsePtr&)>;

namespace controllers
{

void NotificationController::markRead(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    auto userId =
        req->attributes()->get<std::string>("user_id");

    services::NotificationService svc;
    svc.markAsRead(
        id, userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void NotificationController::markAllRead(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId =
        req->attributes()->get<std::string>("user_id");

    services::NotificationService svc;
    svc.markAllAsRead(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void NotificationController::remove(
    const drogon::HttpRequestPtr& req, Cb&& cb,
    const std::string& id)
{
    auto userId =
        req->attributes()->get<std::string>("user_id");

    services::NotificationService svc;
    svc.deleteNotification(
        id, userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
