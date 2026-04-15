/**
 * @file notification_router.cpp
 * @brief Implementation of the notification-router subcommand.
 */

#include "commands/notification_router.h"
#include "commands/notification_router_config.h"

#include "services/notifications/NotificationRouter.h"
#include "services/notifications/NotificationTypes.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <atomic>
#include <csignal>
#include <thread>

namespace
{
std::atomic<bool> g_stop{false};
void onSignal(int) { g_stop.store(true); }

void handleOne(
    const std::string& payload,
    nextra::notifications::NotificationRouter& router)
{
    try
    {
        auto j = nlohmann::json::parse(payload);
        nextra::notifications::Notification n;
        n.id = j.value("id", 0LL);
        n.tenantId = j.value("tenant_id", "");
        n.userId = j.value("user_id", "");
        n.channel = j.value("channel", "");
        n.templateKey = j.value("template", "");
        n.data = j.value(
            "data", nlohmann::json::object());
        router.dispatch(n);
    }
    catch (const std::exception& ex)
    {
        spdlog::warn("bad envelope: {}", ex.what());
    }
}
}  // namespace

namespace commands
{

void cmdNotificationRouter(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    auto db = drogon::app().getDbClient();

    auto cfg = notif::loadConfig(
        "constants/notification-router.json");
    nextra::notifications::NotificationRouter router(db);
    router.registerDefaults(cfg.emailEndpoint);
    spdlog::info(
        "notification-router ready, topic={}", cfg.topic);

    notif::InfraConsumerAdapter consumer("notification-router");
    consumer.subscribe(cfg.topic);
    std::thread httpThread([] { drogon::app().run(); });

    while (!g_stop.load())
    {
        std::string payload;
        if (consumer.pollOnce(payload))
            handleOne(payload, router);
        std::this_thread::sleep_for(
            std::chrono::milliseconds{100});
    }

    spdlog::info("notification-router: shutdown");
    consumer.close();
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
}

}  // namespace commands
