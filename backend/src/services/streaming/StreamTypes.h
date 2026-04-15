#pragma once

/**
 * @file StreamTypes.h
 * @brief Value types shared by the media-streaming service layer.
 *
 * A @c LiveStream row mirrors the @c live_streams table one-for-one
 * so StreamStore can lift rows straight into JSON without touching
 * controllers.  @c StreamStatus is a plain enum class; status strings
 * round-trip through @ref statusToString / @ref statusFromString to
 * keep the DB CHECK constraint honest at the edge of the process.
 */

#include <cstdint>
#include <optional>
#include <string>

namespace nextra::streaming
{

/// Lifecycle states mirroring the live_streams CHECK constraint.
enum class StreamStatus
{
    Idle,
    Live,
    Ended,
    Blocked,
};

/// Serialise a StreamStatus to its canonical database string form.
std::string statusToString(StreamStatus s);

/// Parse a database status string; returns Idle on unknown input.
StreamStatus statusFromString(const std::string& s);

/// In-memory projection of a live_streams row.
struct LiveStream
{
    std::int64_t id{0};
    std::optional<std::string> tenantId;
    std::optional<std::string> ownerId;
    std::string slug;
    std::string title;
    std::string ingestKey;
    StreamStatus status{StreamStatus::Idle};
    std::optional<std::string> startedAt;
    std::optional<std::string> endedAt;
    std::optional<std::string> recordingKey;
};

/// Params for a mediamtx webhook publish event.
struct PublishHook
{
    std::string path;        // mediamtx "path" (== ingest_key)
    std::string action;      // publish | unpublish
    std::string sourceAddr;  // optional IP
};

}  // namespace nextra::streaming
