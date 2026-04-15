#pragma once
/**
 * @file NotificationTypes.h
 * @brief Shared POD types for the notification-router daemon.
 *
 * The router consumes envelopes off Kafka topic
 * `notifications.outbox`, resolves the template, renders
 * variables, and dispatches to a channel-specific sender.  These
 * structs are the boundary between the Kafka consumer, the
 * renderer, and the sender interface.
 */

#include <nlohmann/json.hpp>

#include <cstdint>
#include <string>

namespace nextra::notifications
{

/**
 * @brief A single notification message as it flows through the
 *        router pipeline.
 */
struct Notification
{
    std::int64_t id{0};
    std::string tenantId;
    std::string userId;
    std::string channel;      ///< email|webhook|inapp|push
    std::string templateKey;  ///< notification_templates.key
    nlohmann::json data;      ///< variable bag for {{var}}
};

/**
 * @brief Rendered body after TemplateRenderer substitution.
 */
struct RenderedMessage
{
    std::string subject;
    std::string body;
};

/**
 * @brief Result of a ChannelSender::send attempt.
 */
struct DeliveryResult
{
    bool ok{false};
    std::string error;
};

}  // namespace nextra::notifications
