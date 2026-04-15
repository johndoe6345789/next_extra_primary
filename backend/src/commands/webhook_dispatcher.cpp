/**
 * @file webhook_dispatcher.cpp
 * @brief CLI subcommand implementation for webhook-dispatcher.
 */

#include "commands/webhook_dispatcher.h"

#include "services/webhooks/WebhookDispatcher.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <atomic>
#include <csignal>
#include <fstream>
#include <thread>

namespace
{
std::atomic<bool> g_stop{false};
void onSignal(int) { g_stop.store(true); }

nextra::webhooks::DispatcherConfig loadCfg(const nlohmann::json& j)
{
    nextra::webhooks::DispatcherConfig c;
    c.claimBatchSize = j.value("claimBatchSize", 25U);
    c.pollInterval = std::chrono::milliseconds{
        j.value("pollIntervalMs", 2000)};
    c.requestTimeout = std::chrono::milliseconds{
        j.value("requestTimeoutMs", 15000)};
    c.maxAttempts = j.value("maxAttempts", 8);
    c.baseDelay = std::chrono::milliseconds{
        j.value("baseDelayMs", 5000)};
    c.maxDelay = std::chrono::milliseconds{
        j.value("maxDelayMs", 3600000)};
    c.jitterRatio = j.value("jitterRatio", 0.2);
    c.circuitFailThreshold = j.value("circuitFailThreshold", 5);
    c.circuitCooldown = std::chrono::milliseconds{
        j.value("circuitCooldownMs", 300000)};
    c.signatureHeader = j.value("signatureHeader",
                                 std::string{"X-Nextra-Signature"});
    c.timestampHeader = j.value("timestampHeader",
                                 std::string{"X-Nextra-Timestamp"});
    return c;
}
}  // namespace

namespace commands
{

void cmdWebhookDispatcher(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    auto db = drogon::app().getDbClient();

    std::ifstream f("constants/webhook-dispatcher.json");
    if (!f)
        throw std::runtime_error("cannot open webhook-dispatcher.json");
    nlohmann::json j;
    f >> j;

    nextra::webhooks::WebhookDispatcher dispatcher(db, loadCfg(j));
    dispatcher.start();
    spdlog::info("webhook-dispatcher daemon ready");

    std::thread httpThread([] { drogon::app().run(); });
    while (!g_stop.load())
        std::this_thread::sleep_for(std::chrono::milliseconds{200});

    spdlog::info("webhook-dispatcher: shutdown signal received");
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
    dispatcher.stop();
}

}  // namespace commands
