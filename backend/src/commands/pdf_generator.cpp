/**
 * @file pdf_generator.cpp
 * @brief Implementation of the @c pdf-generator CLI subcommand.
 */

#include "commands/pdf_generator.h"

#include "services/JobScheduler.h"
#include "services/pdf/PdfRenderer.h"
#include "services/pdf/PdfTypes.h"

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

nextra::pdf::PdfConfig loadConfig(const std::string& path)
{
    std::ifstream f(path);
    if (!f) throw std::runtime_error("cannot open " + path);
    nlohmann::json j;
    f >> j;

    nextra::pdf::PdfConfig c;
    c.gotenbergUrl  = j.value("gotenbergUrl", c.gotenbergUrl);
    c.gotenbergPath = j.value("gotenbergPath", c.gotenbergPath);
    c.timeoutMs     = j.value("timeoutMs", c.timeoutMs);
    c.workerCount   = j.value("workerCount", c.workerCount);
    c.s3Bucket      = j.value("s3Bucket", c.s3Bucket);
    c.s3Endpoint    = j.value("s3Endpoint", c.s3Endpoint);
    c.handlerName   = j.value("handlerName", c.handlerName);
    return c;
}
}  // namespace

namespace commands
{

void cmdPdfGenerator(const std::string& config)
{
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    auto db = drogon::app().getDbClient();

    auto cfg = loadConfig("constants/pdf-generator.json");
    nextra::pdf::PdfRenderer renderer(db, cfg);
    renderer.registerHandler();

    nextra::jobs::SchedulerConfig sc;
    sc.workers = cfg.workerCount;
    sc.workerIdPrefix = "nextra-pdf";
    nextra::jobs::JobScheduler scheduler(db, sc);
    scheduler.start();
    spdlog::info("pdf-generator daemon ready ({} workers)",
                 cfg.workerCount);

    std::thread httpThread([] { drogon::app().run(); });

    while (!g_stop.load())
        std::this_thread::sleep_for(std::chrono::milliseconds{200});

    spdlog::info("pdf-generator: shutdown signal received");
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
    scheduler.stop();
}

}  // namespace commands
