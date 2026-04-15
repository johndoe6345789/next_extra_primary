/**
 * @file NotificationRouter.cpp
 * @brief Router implementation — template lookup + dispatch.
 */

#include "services/notifications/NotificationRouter.h"

#include "services/notifications/EmailSender.h"
#include "services/notifications/InAppSender.h"
#include "services/notifications/TemplateRenderer.h"
#include "services/notifications/WebhookSender.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace nextra::notifications
{

NotificationRouter::NotificationRouter(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db))
{
}

void NotificationRouter::registerSender(
    std::unique_ptr<ChannelSender> s)
{
    senders_[s->name()] = std::move(s);
}

void NotificationRouter::registerDefaults(
    const std::string& emailEndpoint)
{
    registerSender(
        std::make_unique<EmailSender>(emailEndpoint));
    registerSender(std::make_unique<WebhookSender>());
    registerSender(std::make_unique<InAppSender>(db_));
}

bool NotificationRouter::prefAllows(
    const std::string& user, const std::string& channel)
{
    if (user.empty()) return true;
    auto rows = db_->execSqlSync(
        "SELECT enabled FROM notification_prefs "
        "WHERE user_id=$1::uuid AND channel=$2",
        user, channel);
    if (rows.empty()) return true;
    return rows[0]["enabled"].as<bool>();
}

DeliveryResult NotificationRouter::dispatch(
    const Notification& n)
{
    auto tmpl = db_->execSqlSync(
        "SELECT subject, body FROM notification_templates "
        "WHERE key=$1",
        n.templateKey);
    if (tmpl.empty())
        return {false, "unknown template " + n.templateKey};
    auto msg = TemplateRenderer::renderMessage(
        tmpl[0]["subject"].as<std::string>(),
        tmpl[0]["body"].as<std::string>(),
        n.data);
    if (!prefAllows(n.userId, n.channel))
    {
        db_->execSqlSync(
            "UPDATE notifications SET status='skipped' "
            "WHERE id=$1", n.id);
        return {true, "skipped by pref"};
    }
    auto it = senders_.find(n.channel);
    if (it == senders_.end())
        return {false, "no sender for " + n.channel};
    auto r = it->second->send(n, msg);
    db_->execSqlSync(
        "UPDATE notifications SET "
        "status=$1, attempts=attempts+1, "
        "sent_at=CASE WHEN $1='delivered' "
        "             THEN now() ELSE sent_at END, "
        "error=$2 WHERE id=$3",
        r.ok ? std::string{"delivered"}
             : std::string{"failed"},
        r.error, n.id);
    return r;
}

}  // namespace nextra::notifications
