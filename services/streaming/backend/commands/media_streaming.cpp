/**
 * @file media_streaming.cpp
 * @brief Daemon entry point for the media-streaming control plane.
 */

#include "streaming/backend/commands/media_streaming.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <csignal>
#include <fstream>
#include <stdexcept>
#include <thread>

namespace
{
std::atomic<bool> g_stop{false};

void onSignal(int) { g_stop.store(true); }

void loadConstants(const std::string& path)
{
    std::ifstream f(path);
    if (!f)
        throw std::runtime_error("cannot open " + path);
    nlohmann::json j;
    f >> j;
    spdlog::info("media-streaming: mediamtx at {}",
                 j.value("mediamtxAdminUrl",
                         std::string{"http://mediamtx:9997"}));
    spdlog::info("media-streaming: rtsp={} webrtc={} hls={}",
                 j.value("rtspPort", 8554),
                 j.value("webrtcPort", 8889),
                 j.value("hlsPort", 8888));
}
}  // namespace

namespace commands
{

void cmdMediaStreaming(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    loadConstants("constants/media-streaming.json");

    spdlog::info("media-streaming daemon ready");

    std::thread httpThread([] { drogon::app().run(); });
    while (!g_stop.load())
        std::this_thread::sleep_for(std::chrono::milliseconds{200});

    spdlog::info("media-streaming: shutdown signal received");
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
}

}  // namespace commands
