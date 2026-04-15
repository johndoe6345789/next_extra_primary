#pragma once
/**
 * @file NotificationRouter.h
 * @brief Core dispatcher that turns a Notification into a
 *        delivered message via the right ChannelSender.
 *
 * The router is intentionally transport-agnostic — it is driven
 * by a Kafka consumer in the notification-router daemon but can
 * also be invoked directly from tests or from a synchronous REST
 * endpoint.  Lookup flow:
 *   1. Pull the template row by key.
 *   2. Render subject/body via TemplateRenderer.
 *   3. Consult `notification_prefs` for the user; skip if off.
 *   4. Look up the matching ChannelSender and call `send`.
 *   5. Update the notifications ledger row with the outcome.
 */

#include "ChannelSender.h"
#include "NotificationTypes.h"

#include <memory>
#include <string>
#include <unordered_map>

namespace drogon::orm { class DbClient; }

namespace nextra::notifications
{

class NotificationRouter
{
  public:
    explicit NotificationRouter(
        std::shared_ptr<drogon::orm::DbClient> db);

    /// Register a sender under its `name()`.
    void registerSender(
        std::unique_ptr<ChannelSender> sender);

    /// Install defaults driven by the constants JSON.
    void registerDefaults(
        const std::string& emailEndpoint);

    /// Dispatch a single notification; writes the ledger.
    DeliveryResult dispatch(const Notification& n);

  private:
    bool prefAllows(
        const std::string& user,
        const std::string& channel);

    std::shared_ptr<drogon::orm::DbClient> db_;
    std::unordered_map<
        std::string,
        std::unique_ptr<ChannelSender>> senders_;
};

}  // namespace nextra::notifications
