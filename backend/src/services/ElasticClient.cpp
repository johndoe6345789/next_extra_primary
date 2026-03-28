/// @file ElasticClient.cpp — ES HTTP client (core ops).
#include "services/ElasticClient.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <cstdlib>
#include <format>

namespace services
{
// deleteDoc, health, createIndex in ElasticClientAdmin.cpp

ElasticClient::ElasticClient()
    : host_([] {
          auto* env = std::getenv("ES_HOST");
          return env ? std::string(env) : "localhost";
      }())
    , port_([] {
          auto* env = std::getenv("ES_PORT");
          return env ? static_cast<std::uint16_t>(
                           std::stoi(env))
                     : std::uint16_t{9200};
      }())
{
    auto base = std::format("http://{}:{}", host_, port_);
    client_ = drogon::HttpClient::newHttpClient(base,
        drogon::app().getLoop());
    spdlog::info("ElasticClient -> {}:{}", host_, port_);
}

void ElasticClient::indexDoc(
    const std::string& index, const std::string& docId,
    const json& body, EsCallback onOk, EsErrCb onErr)
{
    auto path = std::format("/{}/_doc/{}", index, docId);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath(path);
    req->setMethod(drogon::Put);
    req->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    req->setBody(body.dump());

    client_->sendRequest(
        req,
        [onOk, onErr, index, docId](
            drogon::ReqResult result,
            const drogon::HttpResponsePtr& resp) {
            if (result != drogon::ReqResult::Ok) {
                onErr(502, "ES connection failed");
                return;
            }
            auto code = resp->getStatusCode();
            if (code >= 200 && code < 300) {
                onOk(json::parse(resp->getBody(),
                                 nullptr, false));
            } else {
                spdlog::warn("ES index {}/{}: {}",
                    index, docId, code);
                onErr(code, std::string(resp->getBody()));
            }
        });
}

void ElasticClient::search(
    const std::string& index, const json& query,
    EsCallback onOk, EsErrCb onErr)
{
    auto path = std::format("/{}/_search", index);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath(path);
    req->setMethod(drogon::Post);
    req->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    req->setBody(query.dump());

    client_->sendRequest(
        req,
        [onOk, onErr](drogon::ReqResult result,
                       const drogon::HttpResponsePtr& resp) {
            if (result != drogon::ReqResult::Ok) {
                onErr(502, "ES connection failed");
                return;
            }
            auto code = resp->getStatusCode();
            if (code >= 200 && code < 300) {
                onOk(json::parse(resp->getBody(),
                                 nullptr, false));
            } else {
                onErr(code, std::string(resp->getBody()));
            }
        });
}

} // namespace services
