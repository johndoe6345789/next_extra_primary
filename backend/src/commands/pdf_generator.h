#pragma once

/**
 * @file pdf_generator.h
 * @brief CLI subcommand that runs the pdf-generator daemon.
 */

#include <string>

namespace commands
{

/**
 * @brief Run the PDF generator daemon (Phase 6.2).
 *
 * Loads @c constants/pdf-generator.json, registers the @c pdf.render
 * job handler against the shared @ref nextra::jobs::JobRegistry, then
 * starts a small Drogon HTTP listener that exposes @c PdfController
 * and consumes @c pdf.render jobs via the shared job-scheduler
 * infrastructure.  Blocks until SIGINT/SIGTERM.
 *
 * @param config  Path to a Drogon JSON config with DB credentials.
 * @throws std::runtime_error if config/constants are missing or malformed.
 */
void cmdPdfGenerator(const std::string& config);

}  // namespace commands
