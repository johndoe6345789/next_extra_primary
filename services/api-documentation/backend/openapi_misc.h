#pragma once
/**
 * @file openapi_misc.h
 * @brief OpenAPI paths for miscellaneous endpoints.
 */

#include "openapi_misc_system.h"
#include "openapi_misc_features.h"

namespace docs
{

/** @brief Register all miscellaneous paths. */
inline void miscPaths(nlohmann::json& paths)
{
    miscSystemPaths(paths);
    miscFeaturesPaths(paths);
}

} // namespace docs
