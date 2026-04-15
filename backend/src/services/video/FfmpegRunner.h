#pragma once

/**
 * @file FfmpegRunner.h
 * @brief Thin wrapper around posix_spawn for child ffmpeg processes.
 *
 * We never call system() — argv is built explicitly and passed to
 * posix_spawn so we never risk shell injection from job payloads,
 * and we keep a read end of ffmpeg's stderr/progress pipe so the
 * caller can stream `-progress pipe:1` key=value frames to
 * ProgressParser.
 */

#include <functional>
#include <string>
#include <sys/types.h>
#include <vector>

namespace nextra::video
{

/**
 * @brief Result of a completed ffmpeg invocation.
 */
struct FfmpegResult
{
    int  exitCode{-1};
    bool timedOut{false};
    std::string stderrTail; ///< last 4 KB of stderr for diagnostics
};

/**
 * @brief Run /usr/bin/ffmpeg with the supplied argv.
 *
 * Uses posix_spawn (never fork+exec+system) so the binary path and
 * arguments are passed directly to the kernel, immune to shell
 * metacharacters in job payloads.  The @p onProgressLine callback
 * is invoked once per line read from ffmpeg's `-progress pipe:1`
 * stream; the caller can forward each line to ProgressParser.
 *
 * @param binary   Absolute path to the ffmpeg executable.
 * @param argv     Arguments (NOT including argv[0]).
 * @param onProgressLine  Optional line callback from fd 3.
 * @return Exit code + captured stderr tail.
 */
FfmpegResult runFfmpeg(
    const std::string& binary,
    const std::vector<std::string>& argv,
    const std::function<void(const std::string&)>& onProgressLine);

}  // namespace nextra::video
