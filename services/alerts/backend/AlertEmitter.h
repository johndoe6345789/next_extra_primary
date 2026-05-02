#pragma once
/**
 * @file AlertEmitter.h
 * @brief Fire-and-forget HTTP client that POSTs to
 *        /api/alerts. Used by other services to record
 *        operational issues without blocking.
 */

#include <drogon/HttpClient.h>
#include <nlohmann/json.hpp>

#include <cstdint>
#include <memory>
#include <string>

namespace nextra::alerts
{

/**
 * @class AlertEmitter
 * @brief Drogon HttpClient bound to the app event loop.
 *
 * Host/port are read from @c ALERTS_HOST / @c ALERTS_PORT
 * env vars (defaults @c backend / @c 8080).
 */
class AlertEmitter
{
  public:
    /** @brief Construct using env-driven defaults. */
    AlertEmitter();

    /**
     * @brief Send an alert. Never throws, never blocks.
     *
     * @param source     Emitting service name.
     * @param severity   info|warning|error|critical.
     * @param message    Human-readable message.
     * @param dedupeKey  Stable key collapsing repeats.
     * @param metadata   Optional JSON metadata.
     */
    void emit(const std::string& source,
              const std::string& severity,
              const std::string& message,
              const std::string& dedupeKey,
              const nlohmann::json& metadata
                  = nlohmann::json::object());

  private:
    std::string host_;
    std::uint16_t port_;
    drogon::HttpClientPtr client_;
};

/** @brief Process-wide singleton accessor. */
AlertEmitter& alertEmitter();

} // namespace nextra::alerts
