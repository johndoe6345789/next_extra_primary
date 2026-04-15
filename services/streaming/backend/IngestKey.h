#pragma once

/**
 * @file IngestKey.h
 * @brief Cryptographically strong ingest-key generator.
 *
 * A publisher is handed a 24-byte random token (48 hex chars) when a
 * stream row is created; the token becomes the mediamtx path name so
 * nobody can guess another tenant's ingest URL.  Implementation uses
 * OpenSSL's RAND_bytes which is seeded from the system CSPRNG.
 */

#include <cstddef>
#include <string>

namespace nextra::streaming
{

/**
 * @brief Produce a fresh ingest key as a lowercase hex string.
 * @param nBytes Number of random bytes to draw (default 24).
 * @return 2 * nBytes characters of hex.
 * @throws std::runtime_error if the CSPRNG call fails.
 */
std::string generateIngestKey(std::size_t nBytes = 24);

}  // namespace nextra::streaming
