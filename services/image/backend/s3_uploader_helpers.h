#pragma once

/**
 * @file s3_uploader_helpers.h
 * @brief Small utilities for S3Uploader: env lookup,
 *        UTC timestamp, and URL host extraction.
 */

#include <string>

namespace nextra::image::s3help
{

/**
 * @brief Read environment variable with fallback.
 * @param k        Variable name.
 * @param fallback Default if unset.
 * @return Variable value or fallback.
 */
std::string env(const char* k, const char* fallback);

/**
 * @brief Return current UTC as "YYYYMMDDTHHmmSSZ".
 * @return ISO-8601 compact date-time string.
 */
std::string utcNow();

/**
 * @brief Strip scheme from URL and return host[:port].
 * @param url  Full URL like "https://s3.amazonaws.com".
 * @return     Host portion.
 */
std::string hostFromUrl(const std::string& url);

}  // namespace nextra::image::s3help
