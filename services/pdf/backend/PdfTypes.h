#pragma once

/**
 * @file PdfTypes.h
 * @brief Shared types for the pdf-generator daemon (Phase 6.2).
 *
 * The daemon consumes @c pdf.render jobs from the durable job_queue,
 * asks the Gotenberg sidecar to convert HTML to a PDF, uploads the
 * resulting bytes to s3server, and updates the @c pdf_renders row.
 * These POD types are shared by the renderer, the Gotenberg client,
 * the s3 uploader, and the @c PdfController REST surface.
 */

#include <cstdint>
#include <optional>
#include <string>

namespace nextra::pdf
{

/// Lifecycle state of a row in pdf_renders.
enum class PdfStatus
{
    Queued,
    Rendering,
    Succeeded,
    Failed
};

/// A single render request tracked end-to-end.
struct PdfRender
{
    std::int64_t id{0};
    std::optional<std::string> tenantId;
    std::string templateName;
    std::string sourceHtml;
    std::optional<std::string> s3Key;
    PdfStatus status{PdfStatus::Queued};
    std::optional<std::string> error;
};

/// Config loaded from @c constants/pdf-generator.json.
struct PdfConfig
{
    std::string gotenbergUrl{"http://gotenberg:3000"};
    std::string gotenbergPath{"/forms/chromium/convert/html"};
    int timeoutMs{60000};
    int workerCount{2};
    std::string s3Bucket{"pdf-renders"};
    std::string s3Endpoint{"http://s3:9000"};
    std::string handlerName{"pdf.render"};
};

std::string toString(PdfStatus s);
PdfStatus parsePdfStatus(const std::string& s);

}  // namespace nextra::pdf
