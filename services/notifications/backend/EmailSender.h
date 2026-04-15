#pragma once
/**
 * @file EmailSender.h
 * @brief ChannelSender that POSTs notifications to the
 *        emailclient service's /send endpoint.
 *
 * The template repo ships a real Postfix + Dovecot stack accessed
 * through the Flask API in `tools/emailclient`.  This sender is a
 * thin HTTP client; it does not open an SMTP connection itself.
 * The emailclient-api URL is read from
 * `constants/notification-router.json` and defaulted to
 * `http://emailclient-api:5000/send`.
 */

#include "ChannelSender.h"

#include <string>

namespace nextra::notifications
{

class EmailSender : public ChannelSender
{
  public:
    explicit EmailSender(std::string endpoint);

    std::string name() const override { return "email"; }

    DeliveryResult send(
        const Notification& notif,
        const RenderedMessage& msg) override;

  private:
    std::string endpoint_;
};

}  // namespace nextra::notifications
