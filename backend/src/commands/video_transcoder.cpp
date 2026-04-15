/**
 * @file video_transcoder.cpp
 * @brief Daemon main loop for the video-transcoder subcommand.
 */

#include "commands/video_transcoder.h"

#include "services/video/LadderSpec.h"
#include "services/video/VideoProcessor.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <atomic>
#include <chrono>
#include <csignal>
#include <format>
#include <thread>
#include <vector>

namespace
{
std::atomic<bool> g_stop{false};
void onSignal(int) { g_stop.store(true); }
}

namespace commands
{

void cmdVideoTranscoder(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    auto db  = drogon::app().getDbClient();
    auto cfg = nextra::video::loadTranscoderConfig(
        "constants/video-transcoder.json");

    spdlog::info("video-transcoder: {} workers, ffmpeg={}",
                 cfg.workerCount, cfg.ffmpegPath);

    std::vector<std::thread> workers;
    for (int i = 0; i < cfg.workerCount; ++i) {
        workers.emplace_back([db, cfg, i] {
            const auto id = std::format("video-worker-{}", i);
            nextra::video::VideoProcessor proc(db, cfg);
            while (!g_stop.load()) {
                const bool didWork = proc.processOne(id);
                if (!didWork) {
                    std::this_thread::sleep_for(
                        std::chrono::milliseconds{
                            cfg.pollIntervalMs});
                }
            }
        });
    }

    while (!g_stop.load()) {
        std::this_thread::sleep_for(
            std::chrono::milliseconds{200});
    }
    spdlog::info("video-transcoder: draining workers");
    for (auto& t : workers) {
        if (t.joinable()) t.join();
    }
}

}  // namespace commands
