#pragma once
/**
 * @file RateLimitFilter.h
 * @brief Simple in-memory per-IP rate limiter filter.
 *
 * Configurable via Drogon custom config key
 * "rate_limit_rpm" (requests per minute). Default: 60.
 */

#include <drogon/HttpFilter.h>
#include <chrono>
#include <mutex>
#include <string>
#include <unordered_map>
#include <vector>

namespace filters {

class RateLimitFilter
    : public drogon::HttpFilter<RateLimitFilter>
{
public:
    RateLimitFilter() = default;

    /**
     * @brief Check per-IP request rate; reject with 429.
     * @param req  Incoming HTTP request.
     * @param cb   Callback to invoke on rate limit exceeded.
     * @param ccb  Chain callback to continue the pipeline.
     */
    void doFilter(
        const drogon::HttpRequestPtr &req,
        drogon::FilterCallback &&cb,
        drogon::FilterChainCallback &&ccb) override;

private:
    using Clock     = std::chrono::steady_clock;
    using TimePoint = Clock::time_point;

    struct Bucket {
        std::vector<TimePoint> timestamps;
    };

    std::mutex mutex_;
    std::unordered_map<std::string, Bucket> buckets_;

    /**
     * @brief Read configured requests-per-minute limit.
     * @return Limit value from config or 60.
     */
    [[nodiscard]] static auto getLimit() -> int;
};

}  // namespace filters
