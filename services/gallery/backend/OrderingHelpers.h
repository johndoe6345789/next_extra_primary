#pragma once
/**
 * @file OrderingHelpers.h
 * @brief Position renumbering helpers for gallery_items.
 *
 * Keeps the position column dense (0..N-1) after reorder and
 * delete operations.  All methods run synchronously against
 * the default Drogon db client.
 */

#include <cstdint>
#include <vector>

namespace services::gallery
{

/**
 * @brief Dense-pack and reorder helpers for gallery items.
 */
class OrderingHelpers
{
  public:
    /**
     * @brief Renumber items of a gallery to 0..N-1 by current
     *        position (stable), filling holes left by deletes.
     * @param galleryId The gallery whose items to renumber.
     */
    static void renumber(std::int64_t galleryId);

    /**
     * @brief Apply an explicit ordering of asset ids to a gallery.
     * @param galleryId  The gallery to reorder.
     * @param assetIds   Desired order; missing items are pushed
     *                   to the end in their previous order.
     */
    static void reorder(
        std::int64_t galleryId,
        const std::vector<std::int64_t>& assetIds);
};

} // namespace services::gallery
