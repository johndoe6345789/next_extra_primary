#pragma once

/**
 * @file VipsProcessor.h
 * @brief libvips-backed image resizer / encoder.
 *
 * Wraps the vips C API behind a narrow interface so the
 * rest of the daemon can be built and tested without the
 * library present. When @c NEXTRA_HAVE_VIPS is NOT defined
 * the implementation returns a stub failure result; see
 * VipsProcessor.cpp for the real path.
 */

#include "services/image/ImageTypes.h"

#include <cstddef>

namespace nextra::image
{

/**
 * @brief Stateless wrapper around vips_thumbnail + save.
 *
 * Callers must construct a single instance per process and
 * ensure vips_init has been invoked via @ref ensureInit
 * before calling @ref process.
 */
class VipsProcessor
{
  public:
    VipsProcessor();
    ~VipsProcessor();

    /**
     * @brief Initialise the libvips runtime if needed.
     * @return true on success, false if vips is missing.
     */
    static bool ensureInit();

    /**
     * @brief Produce one encoded variant from a source.
     * @param src      Raw encoded source image bytes.
     * @param srcLen   Length of @p src in bytes.
     * @param spec     Target dimensions / format / quality.
     * @return ProcessingResult carrying encoded bytes.
     */
    ProcessingResult process(
        const unsigned char* src,
        std::size_t srcLen,
        const VariantSpec& spec);
};

}  // namespace nextra::image
