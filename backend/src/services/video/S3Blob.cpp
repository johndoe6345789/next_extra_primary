/**
 * @file S3Blob.cpp
 * @brief Curl-free s3 client built on Drogon HttpClient.
 */

#include "services/video/S3Blob.h"

#include <drogon/HttpClient.h>
#include <spdlog/spdlog.h>

#include <filesystem>
#include <format>
#include <fstream>
#include <sstream>

namespace nextra::video
{
namespace
{
std::string readFile(const std::string& path)
{
    std::ifstream f(path, std::ios::binary);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

void writeFile(const std::string& path, const std::string& data)
{
    std::filesystem::create_directories(
        std::filesystem::path(path).parent_path());
    std::ofstream f(path, std::ios::binary);
    f.write(data.data(), static_cast<std::streamsize>(data.size()));
}

std::string objectPath(const TranscoderConfig& cfg,
                       const std::string& key)
{
    return std::format("/{}/{}", cfg.s3Bucket, key);
}
}  // namespace

bool s3Download(const TranscoderConfig& cfg,
                const std::string& key,
                const std::string& localPath)
{
    auto cli = drogon::HttpClient::newHttpClient(cfg.s3Endpoint);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Get);
    req->setPath(objectPath(cfg, key));
    auto [res, resp] = cli->sendRequest(req, 120.0);
    if (res != drogon::ReqResult::Ok || !resp ||
        resp->statusCode() != drogon::k200OK) {
        spdlog::error("s3 GET {} failed", key);
        return false;
    }
    writeFile(localPath, std::string(resp->body()));
    return true;
}

std::int64_t s3Upload(const TranscoderConfig& cfg,
                      const std::string& localPath,
                      const std::string& key)
{
    const auto body = readFile(localPath);
    auto cli = drogon::HttpClient::newHttpClient(cfg.s3Endpoint);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Put);
    req->setPath(objectPath(cfg, key));
    req->addHeader("x-amz-access-key", cfg.s3AccessKey);
    req->setBody(body);
    auto [res, resp] = cli->sendRequest(req, 300.0);
    if (res != drogon::ReqResult::Ok || !resp ||
        resp->statusCode() >= drogon::k300MultipleChoices) {
        spdlog::error("s3 PUT {} failed", key);
        return -1;
    }
    return static_cast<std::int64_t>(body.size());
}

}  // namespace nextra::video
