/**
 * @file ProgressParser.cpp
 * @brief Implementation of the ffmpeg progress pipe parser.
 */

#include "video/backend/ProgressParser.h"

#include <algorithm>
#include <charconv>
#include <string_view>

namespace nextra::video
{

ProgressParser::ProgressParser(std::int64_t totalDurationMs)
    : totalMs_(totalDurationMs)
{
}

bool ProgressParser::feed(const std::string& line)
{
    const auto eq = line.find('=');
    if (eq == std::string::npos) return false;
    const std::string_view key(line.data(), eq);
    const std::string_view val(
        line.data() + eq + 1, line.size() - eq - 1);

    if (key == "out_time_ms" || key == "out_time_us") {
        std::int64_t us = 0;
        std::from_chars(val.data(), val.data() + val.size(), us);
        outTimeMs_ = us / 1000;
    } else if (key == "progress") {
        if (totalMs_ > 0) {
            const auto pct =
                (outTimeMs_ * 100) / totalMs_;
            percent_ = static_cast<int>(
                std::clamp<std::int64_t>(pct, 0, 100));
        }
        if (val == "end") percent_ = 100;
        return true;
    }
    return false;
}

}  // namespace nextra::video
