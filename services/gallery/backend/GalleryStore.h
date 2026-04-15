#pragma once
/**
 * @file GalleryStore.h
 * @brief Persistence layer for photo galleries.
 */

#include "GalleryTypes.h"

#include <drogon/orm/Result.h>
#include <optional>
#include <string>
#include <vector>

namespace services::gallery
{

/**
 * @brief Synchronous CRUD over galleries + gallery_items.
 *
 * All calls run on the default Drogon db client.  Designed
 * to be instantiated cheaply per request by controllers.
 */
class GalleryStore
{
  public:
    /** @brief List galleries for a tenant, newest first. */
    std::vector<Gallery> listForTenant(
        const std::string& tenantId, int limit);

    /** @brief Look up a gallery by id. */
    std::optional<Gallery> findById(std::int64_t id);

    /** @brief Insert a new empty gallery. */
    Gallery create(const Gallery& input);

    /** @brief Patch a gallery by id. */
    std::optional<Gallery>
    patch(std::int64_t id, const GalleryPatch& p);

    /** @brief Delete a gallery and its items. */
    bool remove(std::int64_t id);

    /** @brief List items of a gallery by position. */
    std::vector<GalleryItem>
    listItems(std::int64_t galleryId);

    /** @brief Insert an item at the end. */
    GalleryItem appendItem(
        std::int64_t galleryId,
        std::int64_t assetId,
        const std::string& caption);

    /** @brief Remove an item from a gallery. */
    bool removeItem(
        std::int64_t galleryId,
        std::int64_t assetId);

  private:
    Gallery rowToGallery(
        const drogon::orm::Row& r) const;
    GalleryItem rowToItem(
        const drogon::orm::Row& r) const;
};

} // namespace services::gallery
