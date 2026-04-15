#pragma once

/**
 * @file StreamStore.h
 * @brief Persistence helper for the live_streams / stream_viewers tables.
 *
 * Controllers talk to this class and never issue raw SQL themselves, in
 * line with the services-layer rule from CLAUDE.md.  Every method is
 * synchronous because the caller is always a Drogon controller running
 * on the event loop and the daemon's QPS is very low compared with the
 * main app — stream CRUD happens at human speed (create, start, stop).
 */

#include "services/streaming/StreamTypes.h"

#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace drogon::orm { class DbClient; }

namespace nextra::streaming
{

class StreamStore
{
public:
    explicit StreamStore(std::shared_ptr<drogon::orm::DbClient> db);

    /// List every row, newest first.
    std::vector<LiveStream> listAll();

    /// Single row lookup by slug; nullopt if no such stream.
    std::optional<LiveStream> getBySlug(const std::string& slug);

    /// Single row lookup by ingest key (used by the webhook).
    std::optional<LiveStream> getByKey(const std::string& ingestKey);

    /// Create a new idle stream and return it with its ingest key.
    LiveStream create(const std::string& slug,
                      const std::string& title,
                      const std::optional<std::string>& ownerId);

    /// Flip status to @c live and stamp started_at.
    void markLive(std::int64_t id);

    /// Flip status to @c ended, stamp ended_at, set recording_key.
    void markEnded(std::int64_t id,
                   const std::optional<std::string>& recordingKey);

    /// Mark a stream blocked so mediamtx's hook denies future publishes.
    void block(std::int64_t id);

    /// Remove a row (admin only — cascades to stream_viewers).
    void remove(std::int64_t id);

    /// Insert a viewer join row; returns the new viewer id.
    std::int64_t viewerJoin(std::int64_t streamId,
                            const std::string& sessionId);

    /// Close an open viewer row by session id.
    void viewerLeave(std::int64_t streamId, const std::string& sessionId);

private:
    std::shared_ptr<drogon::orm::DbClient> db_;
};

}  // namespace nextra::streaming
