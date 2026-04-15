#pragma once

/**
 * @file PdfRenderer.h
 * @brief Job handler that turns @c pdf.render jobs into stored PDFs.
 *
 * Registered with @ref nextra::jobs::JobRegistry under the handler
 * name from @c pdf-generator.json (default @c pdf.render).  The job
 * payload references a row in @c pdf_renders by id; the handler
 * loads source HTML, calls Gotenberg, uploads the result to s3server,
 * and updates the row with success or failure.
 */

#include "services/JobTypes.h"
#include "services/pdf/GotenbergClient.h"
#include "services/pdf/PdfTypes.h"
#include "services/pdf/S3Upload.h"

#include <drogon/orm/DbClient.h>

#include <memory>

namespace nextra::pdf
{

/**
 * @class PdfRenderer
 * @brief Self-contained handler for @c pdf.render jobs.
 */
class PdfRenderer
{
public:
    PdfRenderer(std::shared_ptr<drogon::orm::DbClient> db,
                PdfConfig cfg);

    /// Register the handler under @c cfg_.handlerName.
    void registerHandler();

    /// Execute one render; called by the job worker loop.
    nextra::jobs::JobResult run(const nextra::jobs::QueuedJob& job);

private:
    PdfRender loadRow(std::int64_t id) const;
    void markRendering(std::int64_t id) const;
    void markSucceeded(std::int64_t id,
                       const std::string& s3Key) const;
    void markFailed(std::int64_t id,
                    const std::string& err) const;

    std::shared_ptr<drogon::orm::DbClient> db_;
    PdfConfig cfg_;
    GotenbergClient gotenberg_;
    S3Upload s3_;
};

}  // namespace nextra::pdf
