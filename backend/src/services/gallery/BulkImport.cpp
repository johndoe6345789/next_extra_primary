/**
 * @file BulkImport.cpp
 * @brief Bulk ingest S3 keys into a gallery (Phase 4.4).
 */

#include "BulkImport.h"
#include "GalleryStore.h"
#include "../JobQueue.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using namespace drogon;

namespace services::gallery
{

BulkImportResult BulkImport::run(
    std::int64_t galleryId,
    const std::vector<BulkImportEntry>& entries)
{
    BulkImportResult out;
    auto db = app().getDbClient();
    GalleryStore store;
    nextra::jobs::JobQueue queue(db);

    for (const auto& e : entries)
    {
        try
        {
            auto r = db->execSqlSync(
                "INSERT INTO image_assets "
                "(tenant_id, source_key, mime) "
                "VALUES (NULL, $1, $2) RETURNING id",
                e.sourceKey, e.mime);
            auto assetId =
                r[0]["id"].as<std::int64_t>();
            out.assetIds.push_back(assetId);

            store.appendItem(
                galleryId, assetId, e.caption);

            nextra::jobs::QueuedJob j;
            j.name = "image.process";
            j.handler = "image.process";
            j.payload = nlohmann::json{
                {"asset_id", assetId},
                {"source_key", e.sourceKey},
                {"mime", e.mime}};
            queue.enqueue(j);
            ++out.enqueued;
        }
        catch (const std::exception& ex)
        {
            spdlog::warn(
                "gallery bulk import: skip {} ({})",
                e.sourceKey, ex.what());
            ++out.skipped;
        }
    }
    return out;
}

} // namespace services::gallery
