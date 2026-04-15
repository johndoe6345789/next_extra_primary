#pragma once
/**
 * @file notification_router_config.h
 * @brief Helper types for the notification-router subcommand —
 *        kept separate so notification_router.cpp fits within
 *        the 100-LOC file cap.
 */

#include "commands/notification_router.h"

#include <nlohmann/json.hpp>

#include <fstream>
#include <stdexcept>
#include <string>

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

/// Placeholder until Phase 0.4 lands the real Kafka client.
class StubKafkaConsumer : public IKafkaConsumer
{
  public:
    void subscribe(const std::string&) override {}
    bool pollOnce(std::string&) override { return false; }
    void close() override {}
};

}  // namespace commands::notif
