/**
 * @file RateLimitFilter.cpp
 * @brief In-memory sliding-window rate limiter.
 */

#include "RateLimitFilter.h"
#include "../utils/JsonResponse.h"

#include <algorithm>
#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

namespace filters
{

auto RateLimitFilter::getLimit() -> int
{
    auto& cfg = drogon::app().getCustomConfig();
    if (cfg.isMember("rate_limit_rpm") && cfg["rate_limit_rpm"].isInt()) {
        return cfg["rate_limit_rpm"].asInt();
    }
    return 60;
}

void RateLimitFilter::doFilter(const drogon::HttpRequestPtr& req,
                               drogon::FilterCallback&& cb,
                               drogon::FilterChainCallback&& ccb)
{
    const auto ip = req->peerAddr().toIp();
    const auto now = Clock::now();
    const auto limit = getLimit();
    const auto window = std::chrono::minutes{1};

    std::lock_guard lock{mutex_};

    auto& bucket = buckets_[ip];

    // Record access time on every request, including rejected ones.
    bucket.lastSeen = now;

    // Remove timestamps older than the window.
    std::erase_if(bucket.timestamps,
                  [&](auto& ts) { return (now - ts) > window; });

    if (static_cast<int>(bucket.timestamps.size()) >= limit) {
        auto oldest = bucket.timestamps.front();
        auto retryAt = oldest + window;
        auto retrySec =
            std::chrono::duration_cast<std::chrono::seconds>(
                retryAt - now)
                .count();

        auto resp = ::utils::jsonError(drogon::k429TooManyRequests,
                                       "Rate limit exceeded");
        resp->addHeader("Retry-After",
                        std::to_string(std::max(1L, retrySec)));
        cb(resp);
        return;
    }

    bucket.timestamps.push_back(now);

    if (requestCount_.fetch_add(1, std::memory_order_relaxed) %
            SWEEP_INTERVAL == 0) {
        sweepStaleBuckets(now);
    }

    ccb();
}

void RateLimitFilter::sweepStaleBuckets(TimePoint now)
{
    std::erase_if(buckets_, [&](const auto& kv) {
        return (now - kv.second.lastSeen) > BUCKET_TTL;
    });

    if (buckets_.size() <= MAX_BUCKETS) {
        return;
    }

    spdlog::warn(
        "RateLimitFilter: bucket count {} exceeds MAX_BUCKETS {}; "
        "evicting oldest entries.",
        buckets_.size(), MAX_BUCKETS);

    // Collect pointers to entries sorted by lastSeen ascending.
    std::vector<std::unordered_map<std::string, Bucket>::iterator> order;
    order.reserve(buckets_.size());
    for (auto it = buckets_.begin(); it != buckets_.end(); ++it) {
        order.push_back(it);
    }
    std::sort(order.begin(), order.end(), [](const auto& a, const auto& b) {
        return a->second.lastSeen < b->second.lastSeen;
    });

    const auto excess = buckets_.size() - MAX_BUCKETS;
    for (std::size_t i = 0; i < excess; ++i) {
        buckets_.erase(order[i]);
    }
}

} // namespace filters
