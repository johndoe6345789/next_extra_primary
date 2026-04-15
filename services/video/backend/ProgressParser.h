#pragma once

/**
 * @file ProgressParser.h
 * @brief Parser for ffmpeg's `-progress pipe:1` key=value stream.
 *
 * ffmpeg writes frames like:
 *   frame=120
 *   fps=30
 *   out_time_ms=4000000
 *   progress=continue
 *   ...
 *   progress=end
 *
 * The parser accumulates key=value pairs, and when `progress=` is
 * seen it flushes a snapshot and resets.  The caller gets a
 * percentage (0..100) based on duration_ms if known, otherwise 0.
 */

#include <cstdint>
#include <string>

namespace nextra::video
{

/**
 * @brief Stateful parser for a single ffmpeg run.
 */
class ProgressParser
{
public:
    /**
     * @param totalDurationMs  Total asset duration in ms, or 0 if
     *                         unknown — in which case @c percent()
     *                         always returns 0.
     */
    explicit ProgressParser(std::int64_t totalDurationMs);

    /**
     * @brief Feed one line of the -progress pipe:1 stream.
     * @return true if a full frame was flushed (i.e. `progress=...`).
     */
    bool feed(const std::string& line);

    /// Current percentage (0..100), last flushed frame.
    int percent() const { return percent_; }

    /// Out-time in milliseconds from the latest flushed frame.
    std::int64_t outTimeMs() const { return outTimeMs_; }

private:
    std::int64_t totalMs_{0};
    std::int64_t outTimeMs_{0};
    int          percent_{0};
};

}  // namespace nextra::video
