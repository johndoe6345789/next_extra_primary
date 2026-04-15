#pragma once
/**
 * @file notification_router_config.h
 * @brief Helper types for the notification-router subcommand —
 *        kept separate so notification_router.cpp fits within
 *        the 100-LOC file cap.
 */

#include "commands/notification_router.h"
#include "services/infra/IKafkaConsumer.h"

#include <nlohmann/json.hpp>

#include <deque>
#include <fstream>
#include <memory>
#include <stdexcept>
#include <string>
#include <utility>

namespace commands::notif
{

/// Runtime configuration for the notification-router daemon.
struct RouterConfig
{
    std::string topic{"notifications.outbox"};
    std::string emailEndpoint{
        "http://emailclient-api:5000/send"};
    int defaultRetries{5};
};

/// Load notification-router.json from disk.
inline RouterConfig loadConfig(const std::string& path)
{
    std::ifstream f(path);
    if (!f)
        throw std::runtime_error("cannot open " + path);
    nlohmann::json j; f >> j;
    RouterConfig cfg;
    cfg.topic = j.value("kafkaTopic", cfg.topic);
    cfg.defaultRetries =
        j.value("defaultRetries", cfg.defaultRetries);
    if (j.contains("channels") && j["channels"].is_array())
        for (const auto& c : j["channels"])
            if (c.value("name", std::string{}) == "email")
                cfg.emailEndpoint = c.value(
                    "endpoint", cfg.emailEndpoint);
    return cfg;
}

/**
 * @brief Adapter bridging the legacy single-shot
 *        @c pollOnce API onto the unified
 *        @ref nextra::infra::IKafkaConsumer handler model.
 *
 * Buffers incoming messages in a small queue so the existing
 * notification_router.cpp main loop (which repeatedly calls
 * @c pollOnce) does not need to change.
 */
class InfraConsumerAdapter : public IKafkaConsumer
{
  public:
    explicit InfraConsumerAdapter(std::string group)
        : group_(std::move(group)) {}

    void subscribe(const std::string& topic) override;
    bool pollOnce(std::string& out) override;
    void close() override;

  private:
    std::unique_ptr<nextra::infra::IKafkaConsumer> inner_;
    std::deque<std::string> queue_;
    std::string group_;
};

}  // namespace commands::notif
