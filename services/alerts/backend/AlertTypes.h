#pragma once
/**
 * @file AlertTypes.h
 * @brief POD types and callbacks for the alerts domain.
 */

#include <nlohmann/json.hpp>

#include <functional>
#include <string>

namespace nextra::alerts
{

using json = nlohmann::json;

/** @brief One alert ingest payload. */
struct Alert
{
    std::string source;
    std::string severity;
    std::string message;
    std::string dedupeKey;
    json        metadata = json::object();
};

/** @brief Success callback — receives JSON result. */
using OkCb  = std::function<void(json)>;

/** @brief Error callback — HTTP-ish status + message. */
using ErrCb = std::function<void(int, std::string)>;

} // namespace nextra::alerts
