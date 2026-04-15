#pragma once

/**
 * @file ImageController.h
 * @brief REST surface for the image-processor daemon.
 *
 * Mounted at @c /api/images:
 *   POST /api/images/jobs
 *     Enqueue a new processing job. Body:
 *       @c source_url (string), @c variants (array).
 *   GET  /api/images/jobs/{id}
 *     Return the current status of a job.
 *   GET  /api/images/jobs/{id}/variants
 *     Return the list of produced variants for a job.
 */

#include <drogon/HttpController.h>

namespace nextra::image
{

class ImageController
    : public drogon::HttpController<ImageController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(ImageController::submitJob,
                  "/api/images/jobs",
                  drogon::Post, "JwtFilter");
    ADD_METHOD_TO(ImageController::getJob,
                  "/api/images/jobs/{id}",
                  drogon::Get, "JwtFilter");
    ADD_METHOD_TO(ImageController::listVariants,
                  "/api/images/jobs/{id}/variants",
                  drogon::Get, "JwtFilter");
    METHOD_LIST_END

    void submitJob(
        const drogon::HttpRequestPtr& req,
        std::function<
            void(const drogon::HttpResponsePtr&)>&& cb);

    void getJob(
        const drogon::HttpRequestPtr& req,
        std::function<
            void(const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);

    void listVariants(
        const drogon::HttpRequestPtr& req,
        std::function<
            void(const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
};

}  // namespace nextra::image
