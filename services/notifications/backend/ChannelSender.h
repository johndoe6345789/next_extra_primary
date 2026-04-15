#pragma once
/**
 * @file ChannelSender.h
 * @brief Pluggable interface implemented by every notification
 *        channel backend.
 *
 * The router owns one `std::unique_ptr<ChannelSender>` per channel
 * name (email, webhook, inapp, push) and dispatches by looking up
 * `Notification::channel` in a map.  Adding a new channel means
 * writing a new ChannelSender subclass and registering it in
 * NotificationRouter::registerDefaults — no changes to the router
 * itself.
 *
 * Senders must be thread-safe: the router calls `send`
 * concurrently from multiple Kafka consumer threads.
 */

#include "NotificationTypes.h"

#include <string>

namespace nextra::notifications
{

/**
 * @interface ChannelSender
 * @brief Delivers a rendered notification to a specific channel.
 */
class ChannelSender
{
  public:
    virtual ~ChannelSender() = default;

    /// Stable channel id (`email`, `webhook`, `inapp`, ...).
    virtual std::string name() const = 0;

    /**
     * @brief Attempt to deliver @p msg on behalf of @p notif.
     * @return Success flag plus optional error message.  On
     *         failure the router will retry according to
     *         notification-router.json backoff settings.
     */
    virtual DeliveryResult send(
        const Notification& notif,
        const RenderedMessage& msg) = 0;
};

}  // namespace nextra::notifications
