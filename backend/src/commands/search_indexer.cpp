/**
 * @file commands/search_indexer.cpp
 * @brief Daemon main loop for the search indexer.
 */

#include "commands/search_indexer.h"
#include "commands/search_indexer_config.h"

#include "services/search/ElasticClient.h"
#include "services/search/Indexer.h"
#include "services/search/KafkaConsumerStub.h"
#include "services/search/SearchTypes.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <chrono>
#include <csignal>
#include <memory>
#include <thread>

namespace
{
std::atomic<bool> g_stop{false};
void onSignal(int) { g_stop.store(true); }

void reindexAll(
    const nextra::search::IndexerConfig& cfg,
    drogon::orm::DbClientPtr db,
    std::shared_ptr<nextra::search::ElasticClient>
        es)
{
    using nextra::search::Indexer;
    for (const auto& d : cfg.indexes) {
        auto ix = std::make_shared<Indexer>(
            db, es, d, cfg.batchSize);
        ix->reindex([ix](auto) {},
                    [ix](int, std::string) {});
    }
}
} // namespace

namespace commands
{

void cmdSearchIndexer(const std::string& config)
{
    using namespace nextra::search;
    std::signal(SIGINT, onSignal);
    std::signal(SIGTERM, onSignal);

    drogon::app().loadConfigFile(config);
    auto db = drogon::app().getDbClient();
    auto cfg = loadSearchConfig(
        "constants/search-indexer.json");
    auto es = std::make_shared<ElasticClient>(
        cfg.esHost, cfg.esPort);

    KafkaConsumerStub consumer(cfg.kafkaTopic);
    consumer.start();

    std::thread httpThread(
        [] { drogon::app().run(); });
    spdlog::info(
        "search-indexer ready ({} indexes)",
        cfg.indexes.size());

    auto last = std::chrono::steady_clock::now();
    const auto tick = std::chrono::seconds(
        cfg.reindexIntervalSeconds);
    while (!g_stop.load()) {
        auto now = std::chrono::steady_clock::now();
        if (now - last >= tick) {
            reindexAll(cfg, db, es);
            last = now;
        }
        std::this_thread::sleep_for(
            std::chrono::milliseconds(500));
    }

    consumer.stop();
    drogon::app().quit();
    if (httpThread.joinable()) httpThread.join();
}

} // namespace commands
