#pragma once
/**
 * @file services/search/KafkaConsumerStub.h
 * @brief No-op IKafkaConsumer used until the
 *        real librdkafka impl lands behind
 *        NEXTRA_HAVE_KAFKA.
 */

#include "services/search/SearchTypes.h"

#include <spdlog/spdlog.h>

namespace nextra::search
{

/**
 * @class KafkaConsumerStub
 * @brief Logs start/stop and otherwise sleeps.
 *
 * The real consumer (to be added when librdkafka
 * is wired up) will subscribe to `search.reindex`
 * and dispatch messages to an @ref Indexer based
 * on the `indexName` field of each event.
 */
class KafkaConsumerStub : public IKafkaConsumer
{
  public:
    explicit KafkaConsumerStub(std::string topic)
        : topic_(std::move(topic)) {}

    void start() override
    {
        spdlog::info(
            "search: Kafka consumer stub "
            "(topic={}) started — no real "
            "librdkafka build",
            topic_);
    }

    void stop() override
    {
        spdlog::info(
            "search: Kafka consumer stub "
            "(topic={}) stopped",
            topic_);
    }

  private:
    std::string topic_;
};

} // namespace nextra::search
