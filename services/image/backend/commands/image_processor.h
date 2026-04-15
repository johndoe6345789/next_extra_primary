#pragma once

/**
 * @file image_processor.h
 * @brief CLI subcommand entry point for the
 *        image-processor daemon (Phase 4.3).
 */

#include <string>

namespace commands
{

/**
 * @brief Run the long-running image-processor daemon.
 *
 * Loads @c constants/image-processor.json, opens a Drogon
 * ORM connection from @p config, and spawns a
 * @ref nextra::image::ImageProcessor pool of workers.
 * The function blocks until SIGINT/SIGTERM is received.
 *
 * @param config Path to a Drogon JSON config with DB creds.
 * @throws std::runtime_error on missing config/constants.
 */
void cmdImageProcessor(const std::string& config);

}  // namespace commands
