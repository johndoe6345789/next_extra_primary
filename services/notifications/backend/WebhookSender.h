#pragma once
/**
 * @file WebhookSender.h
 * @brief ChannelSender that POSTs rendered notifications to an
 *        outbound webhook URL carried in the envelope.
 *
 * The target URL is read from the notification envelope itself
 * (`data.url`) so operators can subscribe independent services to
 * the same template without changing router configuration.  A
 * future dedicated webhook dispatcher daemon (Phase 5.2) will
 * replace this with signed, retriable delivery; today we do a
 * single best-effort POST and rely on the router's retry budget.
 */

#include "ChannelSender.h"

namespace nextra::notifications
{

class WebhookSender : public ChannelSender
{
  public:
    WebhookSender() = default;

    std::string name() const override { return "webhook"; }

    DeliveryResult send(
        const Notification& notif,
        const RenderedMessage& msg) override;
};

}  // namespace nextra::notifications
