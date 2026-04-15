#pragma once
/**
 * @file services/search/KafkaConsumerStub.h
 * @brief Adapter implementing the search-local
 *        @ref nextra::search::IKafkaConsumer (start/stop) on
 *        top of the unified @ref nextra::infra::IKafkaConsumer
 *        factory.
 *
 * The name is kept for backwards compatibility with existing
 * include sites — the class is no longer a stub when
 * @c NEXTRA_HAVE_KAFKA is defined, it is a real librdkafka
 * consumer via @ref nextra::infra::makeKafkaConsumer.
 */

#include "infra/backend/IKafkaConsumer.h"
#include "infra/backend/KafkaFactory.h"
#include "search/backend/SearchTypes.h"

#include <spdlog/spdlog.h>

#include <atomic>
#include <memory>
#include <string>
#include <thread>
#include <utility>

namespace nextra::search
{

/**
 * @class KafkaConsumerStub
 * @brief Thin start/stop wrapper around an infra consumer.
 *
 * Spawns a background thread that polls the infra consumer
 * in a loop until @ref stop is called. Search-indexer will
 * enrich the handler once @c search.reindex message shapes
 * stabilise; for now it just logs receipts.
 */
class KafkaConsumerStub : public IKafkaConsumer
{
  public:
    explicit KafkaConsumerStub(std::string topic)
        : topic_(std::move(topic)) {}

    ~KafkaConsumerStub() override { stop(); }

    void start() override
    {
        inner_ = nextra::infra::makeKafkaConsumer(
            std::string{}, "search-indexer", topic_);
        inner_->setHandler(
            [this](const std::string& k,
                   const std::string& v) {
                spdlog::debug(
                    "search reindex msg key={} len={}",
                    k, v.size());
            });
        running_.store(true);
        worker_ = std::thread([this] {
            while (running_.load()) inner_->poll(500);
        });
        spdlog::info(
            "search consumer started (topic={})",
            topic_);
    }

    void stop() override
    {
        if (!running_.exchange(false)) return;
        if (worker_.joinable()) worker_.join();
        if (inner_) inner_->close();
        spdlog::info(
            "search consumer stopped (topic={})",
            topic_);
    }

  private:
    std::string topic_;
    std::unique_ptr<nextra::infra::IKafkaConsumer> inner_;
    std::atomic<bool> running_{false};
    std::thread worker_;
};

} // namespace nextra::search
