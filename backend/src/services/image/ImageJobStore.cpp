/**
 * @file ImageJobStore.cpp
 * @brief Implementation of the image-processor repo layer.
 */

#include "services/image/ImageJobStore.h"

#include <spdlog/spdlog.h>

namespace nextra::image
{

namespace
{
VariantSpec specFromJson(const nlohmann::json& j)
{
    VariantSpec s;
    s.name = j.value("name", "variant");
    s.maxWidth = j.value("maxWidth", 800);
    s.maxHeight = j.value("maxHeight", 800);
    s.format = j.value("format", std::string{"webp"});
    s.quality = j.value("quality", 85);
    return s;
}
}  // namespace

std::optional<ImageJob> ImageJobStore::claimNext()
{
    auto rows = db_->execSqlSync(
        "UPDATE image_processing_jobs SET "
        "  status='running', started_at=NOW(), "
        "  attempts = attempts + 1 "
        "WHERE id = ("
        "  SELECT id FROM image_processing_jobs "
        "  WHERE status='pending' "
        "  ORDER BY created_at "
        "  FOR UPDATE SKIP LOCKED LIMIT 1) "
        "RETURNING id, source_url, variants_json, "
        "          attempts");
    if (rows.empty()) return std::nullopt;
    ImageJob job;
    const auto& row = rows[0];
    job.id = row["id"].as<std::int64_t>();
    job.sourceUrl = row["source_url"].as<std::string>();
    job.attempts = row["attempts"].as<int>();
    job.rawJson = nlohmann::json::parse(
        row["variants_json"].as<std::string>());
    if (job.rawJson.is_array())
        for (const auto& v : job.rawJson)
            job.variants.push_back(specFromJson(v));
    return job;
}

void ImageJobStore::markSuccess(std::int64_t jobId)
{
    db_->execSqlSync(
        "UPDATE image_processing_jobs SET "
        "  status='success', finished_at=NOW(), "
        "  error=NULL WHERE id=$1", jobId);
}

void ImageJobStore::markFailed(std::int64_t jobId,
                               const std::string& error,
                               int maxTries)
{
    const char* next =
        "CASE WHEN attempts >= $2 "
        "     THEN 'failed' ELSE 'pending' END";
    const auto sql = std::string(
        "UPDATE image_processing_jobs SET "
        "  status=") + next +
        ", error=$3, finished_at=NOW() "
        "WHERE id=$1";
    db_->execSqlSync(sql, jobId, maxTries, error);
    spdlog::warn("image job {} failed: {}", jobId, error);
}

void ImageJobStore::recordVariant(
    std::int64_t jobId, const Variant& v,
    const std::string& key, std::int64_t bytes)
{
    db_->execSqlSync(
        "INSERT INTO image_variants("
        " job_id, variant_name, width, height, "
        " format, object_key, bytes) "
        "VALUES($1,$2,$3,$4,$5,$6,$7)",
        jobId, v.name, v.width, v.height,
        v.format, key, bytes);
}

}  // namespace nextra::image
