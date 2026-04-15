/**
 * @file AuditConsumer.cpp
 * @brief Consumer factory + decode/write loop.
 */

#include "services/audit/AuditConsumer.h"
#include "services/audit/AuditWriter.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <atomic>
#include <chrono>
#include <thread>

namespace nextra::audit
{
namespace
{

/** @brief No-op consumer used until librdkafka is wired. */
class StubKafkaConsumer : public IKafkaConsumer
{
public:
    void subscribe(const std::string& topic) override
    {
        spdlog::info(
            "audit stub consumer: subscribe({})", topic);
    }

    int poll(std::function<bool(const std::string&)>,
             int) override
    {
        std::this_thread::sleep_for(
            std::chrono::milliseconds{500});
        return 0;
    }

    void close() override
    {
        spdlog::info("audit stub consumer: close");
    }
};

AuditEvent decode(const nlohmann::json& j)
{
    AuditEvent ev;
    ev.tenantId  = j.at("tenant_id").get<std::string>();
    ev.action    = j.at("action").get<std::string>();
    ev.createdAt = j.value("created_at", std::string{});
    auto s = [&](const char* k, std::optional<std::string>& dst) {
        if (j.contains(k) && j[k].is_string())
            dst = j[k].get<std::string>();
    };
    s("actor_id",    ev.actorId);
    s("target_type", ev.targetType);
    s("target_id",   ev.targetId);
    if (j.contains("payload")) ev.payload = j["payload"];
    return ev;
}

}  // namespace

std::unique_ptr<IKafkaConsumer>
makeKafkaConsumer(const std::string& brokers,
                  const std::string& group)
{
#ifdef NEXTRA_HAVE_KAFKA
    // Real implementation lives in infra/KafkaConsumer.* —
    // Phase 0.4 will drop it in and this branch will compile.
    return makeRealKafkaConsumer(brokers, group);
#else
    (void)brokers;
    (void)group;
    return std::make_unique<StubKafkaConsumer>();
#endif
}

void runConsumerLoop(IKafkaConsumer& consumer,
                     AuditWriter& writer,
                     const std::string& topic,
                     std::atomic<bool>& stop)
{
    consumer.subscribe(topic);
    auto handle = [&writer](const std::string& raw) {
        try {
            writer.append(decode(nlohmann::json::parse(raw)));
        } catch (const std::exception& ex) {
            spdlog::warn("audit handle failed: {}", ex.what());
        }
        return true;  // always advance offset
    };
    while (!stop.load()) consumer.poll(handle, 200);
    consumer.close();
}

}  // namespace nextra::audit
