#pragma once

/**
 * @file ImageTypes.h
 * @brief Value types shared by the image-processor daemon.
 *
 * Kept header-only so both the daemon's worker loop and the
 * REST controller can construct / inspect jobs without
 * pulling in libvips or any Drogon headers.
 */

#include <nlohmann/json.hpp>

#include <cstdint>
#include <string>
#include <vector>

namespace nextra::image
{

/**
 * @brief A single variant produced from a source image.
 *
 * Bytes are the already-encoded (webp/jpeg/png) payload
 * that gets uploaded straight to the object store.
 */
struct Variant
{
    std::string name;
    int width{0};
    int height{0};
    std::string format;
    std::vector<unsigned char> bytes;
};

/**
 * @brief Declarative specification for a single variant.
 *
 * Loaded from @c constants/image-processor.json or supplied
 * per-job via the @c variants_json column.
 */
struct VariantSpec
{
    std::string name;
    int maxWidth{0};
    int maxHeight{0};
    std::string format{"webp"};
    int quality{85};
};

/**
 * @brief A job pulled from @c image_processing_jobs.
 *
 * @ref variants holds the parsed spec list; @ref rawJson
 * preserves the raw JSON column for auditing.
 */
struct ImageJob
{
    std::int64_t id{0};
    std::string sourceUrl;
    std::vector<VariantSpec> variants;
    int attempts{0};
    nlohmann::json rawJson;
};

/// @brief Outcome of processing one spec against a source.
struct ProcessingResult
{
    bool ok{false};
    Variant variant;
    std::string error;
};

}  // namespace nextra::image
