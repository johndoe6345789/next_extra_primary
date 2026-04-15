/**
 * @file notification_router.h
 * @brief CLI subcommand that runs the notification-router daemon.
 */

#pragma once

#include <string>

namespace commands
{

/**
 * @brief Run the Kafka-consuming notification router.
 *
 * Loads `constants/notification-router.json`, spins up a Kafka
 * consumer attached to the `notifications.outbox` topic, and
 * dispatches each message through `NotificationRouter` to the
 * appropriate channel sender.  Also mounts the
 * `/api/notifications` REST surface for the operator tool.
 *
 * @param config Path to a Drogon JSON config with DB credentials.
 * @throws std::runtime_error if config/constants are missing.
 */
void cmdNotificationRouter(const std::string& config);

/**
 * @interface IKafkaConsumer
 * @brief Transport-agnostic Kafka consumer handle.
 *
 * Phase 1.3 ships with a stub implementation; Phase 0.4 will
 * replace this with a real librdkafka-backed consumer in
 * `services/infra/KafkaConsumer`.  Defining the interface here
 * lets later wiring land without touching command code.
 */
class IKafkaConsumer
{
  public:
    virtual ~IKafkaConsumer() = default;
    virtual void subscribe(const std::string& topic) = 0;
    virtual bool pollOnce(std::string& outPayload) = 0;
    virtual void close() = 0;
};

}  // namespace commands
