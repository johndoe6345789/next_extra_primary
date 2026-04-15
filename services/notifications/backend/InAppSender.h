#pragma once
/**
 * @file InAppSender.h
 * @brief ChannelSender that persists notifications to the
 *        `notifications` table with status=delivered.
 *
 * The in-app channel has no external transport — the user polls
 * or subscribes via the in-app inbox UI, so delivery is
 * equivalent to a row update.  This sender is special because it
 * is the only one that touches the database directly instead of
 * calling an HTTP endpoint; the router ensures the row already
 * exists in status=pending before dispatch, so InAppSender just
 * flips it to delivered and writes the rendered subject/body
 * into `data`.
 */

#include "ChannelSender.h"

#include <memory>

namespace drogon::orm { class DbClient; }

namespace nextra::notifications
{

class InAppSender : public ChannelSender
{
  public:
    explicit InAppSender(
        std::shared_ptr<drogon::orm::DbClient> db);

    std::string name() const override { return "inapp"; }

    DeliveryResult send(
        const Notification& notif,
        const RenderedMessage& msg) override;

  private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::notifications
