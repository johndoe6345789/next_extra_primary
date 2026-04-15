/**
 * @file ecommerce_api.cpp
 * @brief CLI impl for the ecommerce-api daemon.
 *        Shares the HTTP layer with the main backend
 *        via Drogon; ShopController auto-registers.
 */

#include "ecommerce/backend/commands/ecommerce_api.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <csignal>

namespace
{
std::atomic<bool> g_stop{false};
void onSignal(int) { g_stop.store(true); }
}

namespace commands
{

void cmdEcommerceApi(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);
    drogon::app().loadConfigFile(config);

    spdlog::info("ecommerce-api daemon starting");

    std::thread httpThread([] { drogon::app().run(); });

    while (!g_stop.load())
        std::this_thread::sleep_for(
            std::chrono::milliseconds{200});

    spdlog::info("ecommerce-api: shutdown");
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
}

}  // namespace commands
