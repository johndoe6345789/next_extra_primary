/**
 * @file S3Uploader.cpp
 * @brief Minimal S3 PUT against the dev s3server.
 */

#include "image/backend/S3Uploader.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <spdlog/spdlog.h>

#include <cstdlib>

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
    return c;
}

bool S3Uploader::upload(
    const std::string& key,
    const std::vector<unsigned char>& bytes,
    const std::string& mimeType)
{
    // TODO(phase prod): swap the static auth header for a
    // real AWS Signature v4 implementation. Dev s3server
    // accepts any non-empty Authorization header.
    auto client = drogon::HttpClient::newHttpClient(
        cfg_.endpoint);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Put);
    req->setPath("/" + cfg_.bucket + "/" + key);
    req->setContentTypeString(mimeType);
    req->addHeader(
        "Authorization",
        "AWS4-HMAC-SHA256 Credential=" + cfg_.accessKey);
    req->setBody(std::string(
        reinterpret_cast<const char*>(bytes.data()),
        bytes.size()));
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
