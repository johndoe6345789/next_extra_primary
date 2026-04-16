/**
 * @file s3_uploader_helpers.cpp
 * @brief Implementations of env, utcNow, hostFromUrl.
 */

#include "image/backend/s3_uploader_helpers.h"

#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iomanip>
#include <sstream>

namespace nextra::image::s3help
{

std::string env(const char* k, const char* fallback)
{
    const char* v = std::getenv(k);
    return v ? std::string(v) : std::string(fallback);
}

std::string utcNow()
{
    auto now = std::chrono::system_clock::now();
    std::time_t t =
        std::chrono::system_clock::to_time_t(now);
    std::tm tm{};
    gmtime_r(&t, &tm);
    std::ostringstream oss;
    oss << std::put_time(&tm, "%Y%m%dT%H%M%SZ");
    return oss.str();
}

std::string hostFromUrl(const std::string& url)
{
    std::string h = url;
    for (const auto& s :
         {std::string("https://"),
          std::string("http://")})
    {
        if (h.starts_with(s))
        {
            h = h.substr(s.size());
            break;
        }
    }
    // Strip any trailing path.
    const auto slash = h.find('/');
    if (slash != std::string::npos)
        h = h.substr(0, slash);
    return h;
}

}  // namespace nextra::image::s3help
