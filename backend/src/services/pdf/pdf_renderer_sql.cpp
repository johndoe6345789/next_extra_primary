/**
 * @file pdf_renderer_sql.cpp
 * @brief DB helpers for @ref nextra::pdf::PdfRenderer.
 *
 * Kept in a separate translation unit so @c PdfRenderer.cpp stays
 * under the 100-LOC per-file cap.  These methods are the only place
 * the daemon touches the @c pdf_renders table directly.
 */

#include "services/pdf/PdfRenderer.h"

#include <stdexcept>

namespace nextra::pdf
{

PdfRender PdfRenderer::loadRow(std::int64_t id) const
{
    auto rows = db_->execSqlSync(
        "SELECT id, tenant_id::text, template, source_html, "
        "       s3_key, status, error "
        "FROM pdf_renders WHERE id = $1", id);
    if (rows.empty())
        throw std::runtime_error("pdf_renders row missing: " +
                                 std::to_string(id));
    const auto& r = rows[0];
    PdfRender out;
    out.id = r["id"].as<std::int64_t>();
    if (!r["tenant_id"].isNull())
        out.tenantId = r["tenant_id"].as<std::string>();
    out.templateName = r["template"].as<std::string>();
    out.sourceHtml   = r["source_html"].as<std::string>();
    if (!r["s3_key"].isNull())
        out.s3Key = r["s3_key"].as<std::string>();
    out.status = parsePdfStatus(r["status"].as<std::string>());
    if (!r["error"].isNull())
        out.error = r["error"].as<std::string>();
    return out;
}

void PdfRenderer::markRendering(std::int64_t id) const
{
    db_->execSqlSync(
        "UPDATE pdf_renders SET status='rendering' WHERE id=$1", id);
}

void PdfRenderer::markSucceeded(std::int64_t id,
                                const std::string& s3Key) const
{
    db_->execSqlSync(
        "UPDATE pdf_renders SET status='succeeded', s3_key=$2, "
        "completed_at=now() WHERE id=$1",
        id, s3Key);
}

void PdfRenderer::markFailed(std::int64_t id,
                             const std::string& err) const
{
    db_->execSqlSync(
        "UPDATE pdf_renders SET status='failed', error=$2, "
        "completed_at=now() WHERE id=$1",
        id, err);
}

}  // namespace nextra::pdf
