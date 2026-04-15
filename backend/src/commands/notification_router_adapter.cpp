/**
 * @file commands/notification_router_adapter.cpp
 * @brief Implementation of
 *        @ref commands::notif::InfraConsumerAdapter — buffers
 *        handler pushes from the unified infra consumer into a
 *        queue so the existing @c pollOnce main loop keeps
 *        working unchanged.
 */

#include "commands/notification_router_config.h"
#include "services/infra/KafkaFactory.h"

#include <spdlog/spdlog.h>

#include <utility>

namespace commands::notif
{

void InfraConsumerAdapter::subscribe(
    const std::string& topic)
{
    inner_ = nextra::infra::makeKafkaConsumer(
        std::string{}, group_, topic);
    inner_->setHandler(
        [this](const std::string&,
               const std::string& payload) {
            queue_.push_back(payload);
        });
    spdlog::info(
        "notification-router: subscribed to {}", topic);
}

bool InfraConsumerAdapter::pollOnce(std::string& out)
{
    if (inner_) inner_->poll(50);
    if (queue_.empty()) return false;
    out = std::move(queue_.front());
    queue_.pop_front();
    if (inner_) inner_->commit();
    return true;
}

void InfraConsumerAdapter::close()
{
    if (inner_) inner_->close();
}

}  // namespace commands::notif
