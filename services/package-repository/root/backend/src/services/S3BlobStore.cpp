/**
 * @file S3BlobStore.cpp
 * @brief S3-backed blob storage implementation.
 */

#include "S3BlobStore.h"

#include <drogon/HttpAppFramework.h>

namespace repo
{

S3BlobStore::S3BlobStore(const std::string& endpoint, const std::string& bucket,
                         const std::string& accessKey)
    : endpoint_(endpoint), bucket_(bucket), accessKey_(accessKey)
{
    // Create bucket asynchronously (event loop must be running).
    LOG_TRACE << "S3: ensuring bucket '" << bucket_ << "' exists";
    auto client = drogon::HttpClient::newHttpClient(endpoint_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath("/" + bucket_);
    req->setMethod(drogon::Put);
    req->addHeader("Authorization", "Bearer " + accessKey_);
    client->sendRequest(req, [bucket](drogon::ReqResult r,
                                      const drogon::HttpResponsePtr&) {
        LOG_TRACE << "S3: bucket '" << bucket << "' result=" << (int)r;
    }, 5.0);
}

std::string S3BlobStore::sha256(const std::string& data)
{
    return sha256hex(data);
}

std::pair<std::string, size_t> S3BlobStore::store(const std::string& data)
{
    auto digest = sha256(data);
    auto key = stripPrefix(digest);

    auto client = drogon::HttpClient::newHttpClient(endpoint_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath("/" + bucket_ + "/" + key);
    req->setMethod(drogon::Put);
    req->addHeader("Authorization", "Bearer " + accessKey_);
    req->setContentTypeString("application/octet-stream");
    req->setBody(data);

    // Timeout scales with payload size: 30 s + 1 s per MB,
    // capped at 600 s. A fresh nextra-base-conan layer is
    // ~500 MB and must fit inside this window.
    const auto sizeMb = static_cast<double>(data.size()) /
                        (1024.0 * 1024.0);
    const auto timeout = std::min(600.0, 30.0 + sizeMb);

    auto [result, resp] = client->sendRequest(req, timeout);
    if (result != drogon::ReqResult::Ok || !resp) {
        LOG_ERROR << "S3 PUT failed key=" << key
                  << " size=" << data.size()
                  << " result=" << static_cast<int>(result);
        return {"", 0};
    }
    const auto code = resp->statusCode();
    if (code < drogon::k200OK || code >= drogon::k300MultipleChoices) {
        LOG_ERROR << "S3 PUT rejected key=" << key
                  << " size=" << data.size()
                  << " status=" << static_cast<int>(code);
        return {"", 0};
    }
    return {digest, data.size()};
}

std::string S3BlobStore::read(const std::string& digest) const
{
    auto key = stripPrefix(digest);
    auto client = drogon::HttpClient::newHttpClient(endpoint_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath("/" + bucket_ + "/" + key);
    req->setMethod(drogon::Get);
    req->addHeader("Authorization", "Bearer " + accessKey_);

    auto [result, resp] = client->sendRequest(req, 30.0);
    if (result != drogon::ReqResult::Ok || !resp ||
        resp->statusCode() != drogon::k200OK) {
        return {};
    }
    return std::string(resp->body());
}

bool S3BlobStore::exists(const std::string& digest) const
{
    auto key = stripPrefix(digest);
    auto client = drogon::HttpClient::newHttpClient(endpoint_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath("/" + bucket_ + "/" + key);
    req->setMethod(drogon::Head);
    req->addHeader("Authorization", "Bearer " + accessKey_);

    auto [result, resp] = client->sendRequest(req, 5.0);
    return result == drogon::ReqResult::Ok && resp &&
           resp->statusCode() == drogon::k200OK;
}

std::string S3BlobStore::stripPrefix(const std::string& d)
{
    auto pos = d.find(':');
    return (pos != std::string::npos) ? d.substr(pos + 1) : d;
}

} // namespace repo
