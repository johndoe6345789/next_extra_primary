/**
 * @file S3Uploader.cpp
 * @brief S3 PUT client with AWS Signature Version 4.
 */

#include "image/backend/S3Uploader.h"

#include "image/backend/s3_signer.h"
#include "image/backend/s3_signer_hash.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <spdlog/spdlog.h>

#include <chrono>
#include <cstdlib>
#include <format>

namespace nextra::image
{

namespace
{
std::string env(const char* k, const char* fallback)
{
    const char* v = std::getenv(k);
    return v ? std::string(v) : std::string(fallback);
}
}  // namespace

S3Config S3Config::fromEnv()
{
    S3Config c;
    c.endpoint = env("S3_ENDPOINT", "http://s3:9000");
    c.accessKey = env("S3_ACCESS_KEY", "nextra-dev");
    c.secretKey = env("S3_SECRET_KEY", "nextra-dev");
    c.bucket = env("S3_BUCKET", "image-variants");
    c.region = env("S3_REGION", "us-east-1");
    return c;
}

bool S3Uploader::upload(
    const std::string& key,
    const std::vector<unsigned char>& bytes,
    const std::string& mimeType)
{
    const std::string body(
        reinterpret_cast<const char*>(bytes.data()),
        bytes.size());
    const std::string payloadHash =
        s3_signer::sha256Hex(body);

    // Generate ISO-8601 timestamp for SigV4.
    const auto now = std::chrono::system_clock::now();
    const std::time_t tt =
        std::chrono::system_clock::to_time_t(now);
    std::tm utc{};
    gmtime_r(&tt, &utc);
    char dtBuf[17]{};
    std::strftime(dtBuf, sizeof(dtBuf),
        "%Y%m%dT%H%M%SZ", &utc);
    const std::string dateTimeISO(dtBuf);

    const std::string authHeader =
        s3_signer::buildAuthHeader(
            "PUT", cfg_.bucket, key,
            payloadHash,
            cfg_.accessKey, cfg_.secretKey,
            cfg_.region, dateTimeISO);

    auto client = drogon::HttpClient::newHttpClient(
        cfg_.endpoint);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Put);
    req->setPath("/" + cfg_.bucket + "/" + key);
    req->setContentTypeString(mimeType);
    req->addHeader("Authorization", authHeader);
    req->addHeader("x-amz-date", dateTimeISO);
    req->addHeader(
        "x-amz-content-sha256", payloadHash);
    req->setBody(body);
    auto pair = client->sendRequest(req, 15.0);
    if (pair.first != drogon::ReqResult::Ok || !pair.second)
    {
        spdlog::warn("s3 upload {} failed (network)", key);
        return false;
    }
    const auto code =
        static_cast<int>(pair.second->statusCode());
    if (code < 200 || code >= 300)
    {
        spdlog::warn(
            "s3 upload {} status={}", key, code);
        return false;
    }
    return true;
}

}  // namespace nextra::image
