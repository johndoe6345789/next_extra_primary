/**
 * @file AttestationVerifier.cpp
 * @brief Attestation verifier for fmt="none".
 */

#include "AttestationVerifier.h"
#include "Cbor.h"
#include "CoseKey.h"

#include <cstring>
#include <stdexcept>

namespace services::auth::passkeys
{

AttestationResult verifyAttestation(
    const std::vector<std::uint8_t>& attObj,
    const std::vector<std::uint8_t>& /*clientDataHash*/)
{
    std::size_t off = 0;
    auto root = cbor::decode(attObj, off);
    auto rootMap = std::get_if<cbor::Map>(&root->data);
    if (!rootMap)
        throw std::runtime_error("att root not map");

    auto fmtV = cbor::mapGetStr(*rootMap, "fmt");
    auto authDataV = cbor::mapGetStr(*rootMap, "authData");
    if (!fmtV || !authDataV)
        throw std::runtime_error("att missing fields");
    auto fmt = std::get_if<std::string>(&fmtV->data);
    auto ad = std::get_if<cbor::Bytes>(&authDataV->data);
    if (!fmt || !ad)
        throw std::runtime_error("att bad types");
    if (*fmt != "none")
        throw std::runtime_error("att fmt unsupported");

    // authData: rpIdHash(32) | flags(1) | signCount(4) |
    //           aaguid(16) | credIdLen(2) | credId | coseKey
    if (ad->size() < 37 + 18)
        throw std::runtime_error("authData too short");
    std::uint8_t flags = (*ad)[32];
    if ((flags & 0x40) == 0)
        throw std::runtime_error("AT flag not set");

    AttestationResult out;
    out.aaguid.assign(ad->begin() + 37, ad->begin() + 53);
    std::size_t p = 53;
    std::uint16_t idLen =
        (std::uint16_t((*ad)[p]) << 8) | (*ad)[p + 1];
    p += 2;
    if (p + idLen > ad->size())
        throw std::runtime_error("credId len");
    out.credentialId.assign(
        ad->begin() + p, ad->begin() + p + idLen);
    p += idLen;

    std::size_t keyOff = p;
    auto keyVal = cbor::decode(*ad, keyOff);
    auto keyMap = std::get_if<cbor::Map>(&keyVal->data);
    if (!keyMap)
        throw std::runtime_error("cose not map");
    out.parsedKey = parseCoseKey(*keyMap);
    out.publicKeyCose.assign(
        ad->begin() + p, ad->begin() + keyOff);
    return out;
}

} // namespace services::auth::passkeys
