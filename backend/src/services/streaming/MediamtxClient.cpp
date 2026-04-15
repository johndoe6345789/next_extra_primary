/**
 * @file MediamtxClient.cpp
 * @brief Drogon HttpClient-backed mediamtx admin bridge.
 */

#include "services/streaming/MediamtxClient.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <spdlog/spdlog.h>

namespace nextra::streaming
{

MediamtxClient::MediamtxClient(std::string baseUrl)
    : baseUrl_(std::move(baseUrl))
{
}

std::vector<PathInfo> MediamtxClient::listPaths()
{
    auto client = drogon::HttpClient::newHttpClient(baseUrl_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Get);
    req->setPath("/v3/paths/list");
    auto [res, rsp] = client->sendRequest(req, 3.0);

    std::vector<PathInfo> out;
    if (res != drogon::ReqResult::Ok || !rsp) return out;
    try
    {
        auto j = nlohmann::json::parse(rsp->body());
        for (const auto& item : j.value("items", nlohmann::json::array()))
        {
            PathInfo p;
            p.name    = item.value("name", "");
            p.ready   = item.value("ready", false);
            p.source  = item.value("/source/type"_json_pointer, "");
            p.bytesRx = item.value("bytesReceived", 0LL);
            p.readers = item.value("/readers/size"_json_pointer, 0LL);
            out.push_back(std::move(p));
        }
    }
    catch (const std::exception& e)
    {
        spdlog::warn("mediamtx list parse failed: {}", e.what());
    }
    return out;
}

bool MediamtxClient::kickPublisher(const std::string& path)
{
    auto client = drogon::HttpClient::newHttpClient(baseUrl_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Post);
    req->setPath("/v3/paths/kick/" + path);
    auto [res, rsp] = client->sendRequest(req, 3.0);
    return res == drogon::ReqResult::Ok && rsp
        && rsp->statusCode() < drogon::k300MultipleChoices;
}

bool MediamtxClient::kickReader(const std::string& readerId)
{
    auto client = drogon::HttpClient::newHttpClient(baseUrl_);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Post);
    req->setPath("/v3/rtspsessions/kick/" + readerId);
    auto [res, rsp] = client->sendRequest(req, 3.0);
    return res == drogon::ReqResult::Ok && rsp
        && rsp->statusCode() < drogon::k300MultipleChoices;
}

}  // namespace nextra::streaming
