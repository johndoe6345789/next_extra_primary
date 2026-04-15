#pragma once
/**
 * @file NotificationController.h
 * @brief Notification endpoints: list, unread count, read,
 *        mark-all-read, and delete.
 */

#include <drogon/HttpController.h>
#include <string>

namespace controllers
{

class NotificationController
    : public drogon::HttpController<NotificationController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(NotificationController::list, "/api/notifications",
                  drogon::Get, "filters::JwtAuthFilter");
    ADD_METHOD_TO(NotificationController::unreadCount,
                  "/api/notifications/unread-count", drogon::Get,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(NotificationController::markRead,
                  "/api/notifications/{id}/read", drogon::Patch,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(NotificationController::markAllRead,
                  "/api/notifications/mark-all-read", drogon::Post,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(NotificationController::remove, "/api/notifications/{id}",
                  drogon::Delete, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief List notifications with pagination. */
    void list(const drogon::HttpRequestPtr& req,
              std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Get count of unread notifications. */
    void unreadCount(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Mark a single notification as read. */
    void markRead(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&& cb,
                  const std::string& id);

    /** @brief Mark all notifications as read. */
    void markAllRead(const drogon::HttpRequestPtr& req,
                     std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Delete a notification. */
    void remove(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& cb,
                const std::string& id);
};

} // namespace controllers
