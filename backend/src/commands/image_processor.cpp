/**
 * @file image_processor.cpp
 * @brief Implementation of the image-processor subcommand.
 */

#include "commands/image_processor.h"

#include "services/image/ImageJobStore.h"
#include "services/image/ImageProcessor.h"
#include "services/image/S3Uploader.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <atomic>
#include <chrono>
#include <csignal>
#include <thread>

namespace
{
std::atomic<bool> g_stop{false};
void onSignal(int) { g_stop.store(true); }
}  // namespace

namespace commands
{

void cmdImageProcessor(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    auto db = drogon::app().getDbClient();

    auto cfg = nextra::image::loadProcessorConfig(
        "constants/image-processor.json");
    nextra::image::ImageJobStore store(db);
    nextra::image::S3Uploader uploader(
        nextra::image::S3Config::fromEnv());
    nextra::image::ImageProcessor proc(
        std::move(store), std::move(uploader), cfg);

    proc.start();
    spdlog::info("image-processor: ready");

    std::thread httpThread([] { drogon::app().run(); });

    while (!g_stop.load())
        std::this_thread::sleep_for(
            std::chrono::milliseconds(200));

    spdlog::info("image-processor: shutdown");
    proc.stop();
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
}

}  // namespace commands
