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
    // Ensure the bucket exists on the S3 server.
    auto client = drogon::HttpClient::newHttpClient(endpoint_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath("/" + bucket_);
    req->setMethod(drogon::Put);
    req->addHeader("Authorization", "Bearer " + accessKey_);
    auto [result, resp] = client->sendRequest(req, 5.0);
    // 200 = created, 409 = already exists — both OK.
    (void)result;
    (void)resp;
}

std::string S3BlobStore::sha256(const std::string& data)
{
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256((const unsigned char*)data.data(), data.size(), hash);
    std::ostringstream ss;
    ss << "sha256:";
    for (auto b : hash)
        ss << std::hex << std::setfill('0') << std::setw(2) << (int)b;
    return ss.str();
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

    auto [result, resp] = client->sendRequest(req, 30.0);
    (void)result;
    (void)resp;
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
