/**
 * @file PdfRenderer.cpp
 * @brief Job handler entry points for the pdf-generator daemon.
 */

#include "pdf/backend/PdfRenderer.h"

#include "job-queue/backend/JobRegistry.h"

#include <spdlog/spdlog.h>

namespace nextra::pdf
{

using nextra::jobs::JobResult;
using nextra::jobs::QueuedJob;

PdfRenderer::PdfRenderer(
    std::shared_ptr<drogon::orm::DbClient> db, PdfConfig cfg)
    : db_(std::move(db)),
      cfg_(std::move(cfg)),
      gotenberg_(cfg_),
      s3_(cfg_)
{
}

void PdfRenderer::registerHandler()
{
    nextra::jobs::JobRegistry::instance().reg(
        cfg_.handlerName,
        [this](const QueuedJob& j) { return run(j); });
    spdlog::info("pdf-generator: handler '{}' registered",
                 cfg_.handlerName);
}

JobResult PdfRenderer::run(const QueuedJob& job)
{
    if (!job.payload.contains("render_id"))
        return JobResult::fail("payload missing render_id");

    const auto id = job.payload["render_id"].get<std::int64_t>();
    try
    {
        auto row = loadRow(id);
        markRendering(id);

        std::string pdfBytes;
        std::string errMsg;
        gotenberg_.render(
            row.sourceHtml,
            [&](std::string bytes) { pdfBytes = std::move(bytes); },
            [&](int status, std::string msg) {
                errMsg = "gotenberg " +
                         std::to_string(status) + ": " + msg;
            });
        if (!errMsg.empty())
        {
            markFailed(id, errMsg);
            return JobResult::fail(errMsg);
        }

        const auto key = "renders/" + std::to_string(id) + ".pdf";
        s3_.put(key, pdfBytes);
        markSucceeded(id, key);

        nlohmann::json out;
        out["render_id"] = id;
        out["s3_key"]    = key;
        return JobResult::ok(std::move(out));
    }
    catch (const std::exception& ex)
    {
        markFailed(id, ex.what());
        return JobResult::fail(ex.what());
    }
}

}  // namespace nextra::pdf
