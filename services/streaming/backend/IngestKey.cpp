/**
 * @file IngestKey.cpp
 * @brief RAND_bytes-backed ingest-key generator.
 */

#include "streaming/backend/IngestKey.h"

#include <openssl/rand.h>

#include <array>
#include <stdexcept>
#include <vector>

namespace nextra::streaming
{

std::string generateIngestKey(std::size_t nBytes)
{
    std::vector<unsigned char> buf(nBytes);
    if (RAND_bytes(buf.data(), static_cast<int>(nBytes)) != 1)
    {
        throw std::runtime_error(
            "ingest key generation: RAND_bytes failed");
    }
    static constexpr std::array<char, 16> kHex{
        '0','1','2','3','4','5','6','7',
        '8','9','a','b','c','d','e','f'};
    std::string out;
    out.reserve(nBytes * 2);
    for (auto b : buf)
    {
        out.push_back(kHex[(b >> 4) & 0x0F]);
        out.push_back(kHex[b & 0x0F]);
    }
    return out;
}

}  // namespace nextra::streaming
