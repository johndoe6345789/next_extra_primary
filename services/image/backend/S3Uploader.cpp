/**
 * @file S3Uploader.cpp
 * @brief S3 PUT with real AWS SigV4 authorization.
 */

#include "image/backend/S3Uploader.h"
#include "image/backend/s3_signer.h"
#include "image/backend/s3_uploader_helpers.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <spdlog/spdlog.h>

namespace nextra::image
{

S3Config S3Config::fromEnv()
{
    S3Config c;
    c.endpoint = s3help::env(
        "S3_ENDPOINT", "http://s3:9000");
    c.accessKey = s3help::env(
        "S3_ACCESS_KEY", "nextra-dev");
    c.secretKey = s3help::env(
        "S3_SECRET_KEY", "nextra-dev");
    c.bucket = s3help::env(
        "S3_BUCKET", "image-variants");
    c.region = s3help::env(
        "S3_REGION", "us-east-1");
    return c;
}

bool S3Uploader::upload(
    const std::string& key,
    const std::vector<unsigned char>& bytes,
    const std::string& mimeType)
{
    const std::string payload(
        reinterpret_cast<const char*>(bytes.data()),
        bytes.size());
    const std::string uri =
        "/" + cfg_.bucket + "/" + key;
    const std::string date = s3help::utcNow();
    const std::string host =
        s3help::hostFromUrl(cfg_.endpoint);

    const std::string auth =
        s3_signer::signRequest(
            "PUT", uri, "", host, date, payload,
            cfg_.accessKey, cfg_.secretKey,
            cfg_.region, "s3");

    auto client =
        drogon::HttpClient::newHttpClient(
            cfg_.endpoint);
    auto req =
        drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Put);
    req->setPath(uri);
    req->setContentTypeString(mimeType);
    req->addHeader("Authorization", auth);
    req->addHeader("x-amz-date", date);
    req->addHeader(
        "x-amz-content-sha256",
        s3_signer::sha256hex(payload));
    req->setBody(payload);

    auto [result, resp] =
        client->sendRequest(req, 15.0);
    if (result != drogon::ReqResult::Ok || !resp)
    {
        spdlog::warn(
            "s3 upload {} failed (net)", key);
        return false;
    }
    const int code =
        static_cast<int>(resp->statusCode());
    if (code < 200 || code >= 300)
    {
        spdlog::warn(
            "s3 upload {} status={}", key, code);
        return false;
    }
    return true;
}

}  // namespace nextra::image
