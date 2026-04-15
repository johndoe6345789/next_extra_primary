#pragma once
/**
 * @file BulkImport.h
 * @brief Bulk ingest S3 keys as gallery items.
 */

#include "GalleryTypes.h"

#include <cstdint>
#include <string>
#include <vector>

namespace services::gallery
{

/** Result of a BulkImport::run() call. */
struct BulkImportResult
{
    int enqueued{0};
    int skipped{0};
    std::vector<std::int64_t> assetIds;
};

/**
 * @brief Create image_assets rows + enqueue image.process.
 *
 * For each entry the helper inserts one image_assets row and
 * one gallery_items row (with pending position), then enqueues
 * an `image.process` job via the JobQueue so the image
 * processor daemon can produce variants.  Failures on a given
 * entry are counted in `skipped` but do not abort the batch.
 */
class BulkImport
{
  public:
    /**
     * @brief Import a batch into a gallery.
     * @param galleryId Target gallery id.
     * @param entries   Source S3 keys and captions.
     */
    BulkImportResult run(
        std::int64_t galleryId,
        const std::vector<BulkImportEntry>& entries);
};

} // namespace services::gallery
