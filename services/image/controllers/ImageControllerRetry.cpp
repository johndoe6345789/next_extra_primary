/**
 * @file ImageControllerRetry.cpp
 * @brief POST /api/images/jobs/{id}/retry
 *
 * Resets a failed job back to pending so the
 * image-processor daemon will pick it up again.
 * Returns 200 { "retried": true } on success,
 * 404 if the job does not exist or is not failed.
 */

#include "ImageController.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>

namespace nextra::image
{

using namespace drogon;

void ImageController::retryJob(
    const HttpRequestPtr&,
    std::function<void(const HttpResponsePtr&)>&& cb,
    std::int64_t id)
{
    auto db = app().getDbClient();
    auto rows = db->execSqlSync(
        "UPDATE image_processing_jobs "
        "SET status='pending', "
        "    attempts=0, "
        "    error=NULL "
        "WHERE id=$1 "
        "  AND status='failed' "
        "RETURNING id",
        id);

    if (rows.empty())
    {
        auto r = HttpResponse::newHttpResponse();
        r->setStatusCode(k404NotFound);
        cb(r);
        return;
    }

    Json::Value body;
    body["retried"] = true;
    cb(HttpResponse::newHttpJsonResponse(body));
}

}  // namespace nextra::image
