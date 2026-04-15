#pragma once

/**
 * @file ScheduledPublisher.h
 * @brief Job handler that promotes scheduled articles.
 *
 * The cron-manager owns a seed schedule named
 * `blog.scheduled_publish` that fires every minute and enqueues a
 * job with handler `blog.publish_due`.  A job worker resolves that
 * handler to @ref ScheduledPublisher::run, which flips every
 * scheduled article whose `scheduled_at<=now()` to `published`.
 */

#include "services/JobTypes.h"

#include <memory>

namespace drogon::orm { class DbClient; }

namespace nextra::blog
{

/**
 * @class ScheduledPublisher
 * @brief JobRegistry handler for `blog.publish_due`.
 */
class ScheduledPublisher
{
public:
    explicit ScheduledPublisher(
        std::shared_ptr<drogon::orm::DbClient> db);

    /// Invoke synchronously; used by the worker pool.
    nextra::jobs::JobResult run(
        const nextra::jobs::QueuedJob& job) const;

    /// Convenience factory for registerHandler lambdas.
    static nextra::jobs::JobHandler makeHandler(
        std::shared_ptr<drogon::orm::DbClient> db);

private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::blog
