#pragma once
/**
 * @file GalleryTypes.h
 * @brief POD value types for the photo gallery service.
 */

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace services::gallery
{

/** One row of the galleries table. */
struct Gallery
{
    std::int64_t id{0};
    std::string tenantId;
    std::string ownerId;
    std::string slug;
    std::string title;
    std::string description;
    std::optional<std::int64_t> coverAssetId;
    std::string createdAt;
    std::string updatedAt;
    int itemCount{0};
};

/** One row of the gallery_items join table. */
struct GalleryItem
{
    std::int64_t galleryId{0};
    std::int64_t assetId{0};
    int position{0};
    std::string caption;
};

/** Patch body for PATCH /api/gallery/{id}. */
struct GalleryPatch
{
    std::optional<std::string> title;
    std::optional<std::string> description;
    std::optional<std::int64_t> coverAssetId;
};

/** One element of a bulk import request. */
struct BulkImportEntry
{
    std::string sourceKey;
    std::string mime;
    std::string caption;
};

} // namespace services::gallery
