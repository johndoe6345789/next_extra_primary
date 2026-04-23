/**
 * @file S3Upload.cpp
 * @brief PUTs a single object to the in-repo s3server via Drogon.
 */

#include "pdf/backend/S3Upload.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <spdlog/spdlog.h>

#include <stdexcept>

namespace nextra::pdf
{

using namespace drogon;

S3Upload::S3Upload(PdfConfig cfg) : cfg_(std::move(cfg)) {}

std::string S3Upload::put(const std::string& key,
                          const std::string& bytes) const
{
    auto client = HttpClient::newHttpClient(cfg_.s3Endpoint);

    auto req = HttpRequest::newHttpRequest();
    req->setMethod(Put);
    req->setPath("/" + cfg_.s3Bucket + "/" + key);
    req->addHeader("Content-Type", "application/pdf");
    req->setBody(bytes);

    auto result = client->sendRequest(req, cfg_.timeoutMs / 1000.0);
    if (result.first != ReqResult::Ok || !result.second)
        throw std::runtime_error("s3 upload network error");

    const auto code = result.second->getStatusCode();
    if (code != k200OK && code != k201Created && code != k204NoContent)
        throw std::runtime_error("s3 upload http " +
                                 std::to_string(static_cast<int>(code)));

    spdlog::info("pdf s3 upload ok: {}/{} ({} bytes)",
                 cfg_.s3Bucket, key, bytes.size());
    return key;
}

}  // namespace nextra::pdf
