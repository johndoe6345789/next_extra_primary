/**
 * @file ElasticClientAdmin.cpp
 * @brief Admin ops: deleteDoc, health, createIndex.
 */

#include "services/ElasticClient.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

#include <format>

namespace services
{

void ElasticClient::deleteDoc(
    const std::string& index, const std::string& docId,
    EsCallback onOk, EsErrCb onErr)
{
    auto path = std::format("/{}/_doc/{}", index, docId);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath(path);
    req->setMethod(drogon::Delete);

    client_->sendRequest(
        req,
        [onOk, onErr](drogon::ReqResult r,
                       const drogon::HttpResponsePtr& resp) {
            if (r != drogon::ReqResult::Ok) {
                onErr(502, "ES connection failed");
                return;
            }
            onOk(json::parse(resp->getBody(),
                             nullptr, false));
        });
}

void ElasticClient::health(EsCallback onOk, EsErrCb onErr)
{
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath("/_cluster/health");
    req->setMethod(drogon::Get);

    client_->sendRequest(
        req,
        [onOk, onErr](drogon::ReqResult r,
                       const drogon::HttpResponsePtr& resp) {
            if (r != drogon::ReqResult::Ok) {
                onErr(502, "ES connection failed");
                return;
            }
            onOk(json::parse(resp->getBody(),
                             nullptr, false));
        });
}

void ElasticClient::createIndex(
    const std::string& index, const json& settings,
    EsCallback onOk, EsErrCb onErr)
{
    auto path = std::format("/{}", index);
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setPath(path);
    req->setMethod(drogon::Put);
    req->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    req->setBody(settings.dump());

    client_->sendRequest(
        req,
        [onOk, onErr, index](
            drogon::ReqResult r,
            const drogon::HttpResponsePtr& resp) {
            if (r != drogon::ReqResult::Ok) {
                onErr(502, "ES connection failed");
                return;
            }
            auto code = resp->getStatusCode();
            if (code >= 200 && code < 300) {
                spdlog::info("ES index created: {}", index);
                onOk(json::parse(resp->getBody(),
                                 nullptr, false));
            } else {
                spdlog::warn("ES create index {}: {}",
                    index, code);
                onErr(code, std::string(resp->getBody()));
            }
        });
}

} // namespace services
