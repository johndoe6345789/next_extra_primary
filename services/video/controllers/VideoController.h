#pragma once
/**
 * @file VideoController.h
 * @brief REST endpoints for the Phase 4.2 video transcoder.
 *
 * Two responsibilities are split across two .cpp files so each
 * stays within the 100-LOC file size budget:
 *
 *   - VideoControllerUpload.cpp — POST /api/video to create a
 *     video_assets row and enqueue a `video.transcode` job.
 *   - VideoControllerStatus.cpp — GET /api/video/{id} to read
 *     the transcode_jobs progress and list renditions.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class VideoController
    : public drogon::HttpController<VideoController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        VideoController::upload,
        "/api/video", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        VideoController::status,
        "/api/video/{id}", drogon::Get);
    METHOD_LIST_END

    /**
     * @brief Register a new upload + enqueue a transcode job.
     * Body: { "sourceKey": "...", "mime": "video/mp4" }
     */
    void upload(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /**
     * @brief Return progress + rendition list for an asset.
     * @param id video_assets.id from the path.
     */
    void status(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

}  // namespace controllers
