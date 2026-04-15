#pragma once

/**
 * @file PdfController.h
 * @brief REST surface for the pdf-generator daemon (Phase 6.2).
 *
 * Mounted at @c /api/pdf:
 *   POST /api/pdf/render  Enqueue a new HTML -> PDF render and
 *                         push a @c pdf.render job onto the shared
 *                         job_queue.  Body: @c template, @c html,
 *                         optional @c tenant_id.
 *   GET  /api/pdf/{id}    Return the current status of a render,
 *                         including the s3 key when finished.
 */

#include <drogon/HttpController.h>

namespace nextra::pdf
{

class PdfController : public drogon::HttpController<PdfController>
{
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(PdfController::enqueueRender,
                  "/api/pdf/render", drogon::Post, "JwtFilter");
    ADD_METHOD_TO(PdfController::getRender,
                  "/api/pdf/{id}", drogon::Get, "JwtFilter");
    METHOD_LIST_END

    void enqueueRender(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    void getRender(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
};

}  // namespace nextra::pdf
