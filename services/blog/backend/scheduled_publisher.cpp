/**
 * @file scheduled_publisher.cpp
 * @brief Implementation of ScheduledPublisher handler.
 */

#include "ScheduledPublisher.h"
#include "ArticleStore.h"

#include <spdlog/spdlog.h>

namespace nextra::blog
{

using nextra::jobs::JobHandler;
using nextra::jobs::JobResult;
using nextra::jobs::QueuedJob;

ScheduledPublisher::ScheduledPublisher(
    std::shared_ptr<drogon::orm::DbClient> db)
    : db_(std::move(db)) {}

JobResult ScheduledPublisher::run(const QueuedJob&) const
{
    try
    {
        ArticleStore store(db_);
        int n = store.publishDue();
        spdlog::info(
            "blog.publish_due: promoted {} articles", n);
        nlohmann::json data;
        data["promoted"] = n;
        return JobResult::ok(std::move(data));
    }
    catch (const std::exception& e)
    {
        spdlog::error(
            "blog.publish_due failed: {}", e.what());
        return JobResult::fail(e.what());
    }
}

JobHandler ScheduledPublisher::makeHandler(
    std::shared_ptr<drogon::orm::DbClient> db)
{
    auto pub = std::make_shared<ScheduledPublisher>(db);
    return [pub](const QueuedJob& j) { return pub->run(j); };
}

}  // namespace nextra::blog
