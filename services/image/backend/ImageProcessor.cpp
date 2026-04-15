/**
 * @file ImageProcessor.cpp
 * @brief Construction + start/stop for the image-processor.
 *
 * The per-job worker logic lives in
 * @c image_processor_worker.cpp so this file stays within
 * the 100-LOC project limit.
 */

#include "image/backend/ImageProcessor.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <spdlog/spdlog.h>

#include <fstream>
#include <nlohmann/json.hpp>

namespace nextra::image
{

ProcessorConfig loadProcessorConfig(const std::string& p)
{
    ProcessorConfig c;
    std::ifstream f(p);
    if (!f) return c;
    nlohmann::json j; f >> j;
    c.workerCount = j.value("workerCount", c.workerCount);
    c.pollIntervalMs =
        j.value("pollIntervalMs", c.pollIntervalMs);
    c.maxAttempts = j.value("maxAttempts", c.maxAttempts);
    return c;
}

ImageProcessor::ImageProcessor(
    ImageJobStore s, S3Uploader u, ProcessorConfig c)
    : store_(std::move(s)), uploader_(std::move(u)),
      cfg_(c) {}

void ImageProcessor::start()
{
    for (int i = 0; i < cfg_.workerCount; ++i)
        workers_.emplace_back(
            [this] { workerLoop(); });
    spdlog::info(
        "image-processor: {} workers up", cfg_.workerCount);
}

void ImageProcessor::stop()
{
    stop_.store(true);
    for (auto& t : workers_)
        if (t.joinable()) t.join();
    workers_.clear();
}

std::vector<unsigned char>
ImageProcessor::fetchSource(const std::string& url)
{
    auto client = drogon::HttpClient::newHttpClient(url);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Get);
    req->setPath("/");
    auto pair = client->sendRequest(req, 30.0);
    if (pair.first != drogon::ReqResult::Ok || !pair.second)
        return {};
    const auto& body = pair.second->getBody();
    return {body.begin(), body.end()};
}

}  // namespace nextra::image
