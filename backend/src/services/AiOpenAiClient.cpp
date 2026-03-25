/**
 * @file AiOpenAiClient.cpp
 * @brief Implementation of the OpenAI ChatCompletion HTTP client.
 */

#include "services/AiOpenAiClient.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <cstdlib>

namespace services
{

using namespace drogon;
AiOpenAiClient::AiOpenAiClient()
{
    const char* v = std::getenv("OPENAI_API_KEY");
    apiKey_ = v ? v : "";
    if (apiKey_.empty())
        spdlog::warn("OPENAI_API_KEY not set");
}

void AiOpenAiClient::call(const json& messages, Callback onSuccess,
                          ErrCallback onError)
{
    if (apiKey_.empty()) {
        onError(k503ServiceUnavailable, "OpenAI API key not configured");
        return;
    }

    auto client = HttpClient::newHttpClient("https://api.openai.com");
    auto req = HttpRequest::newHttpRequest();
    req->setMethod(Post);
    req->setPath("/v1/chat/completions");
    req->addHeader("Authorization", fmt::format("Bearer {}", apiKey_));
    req->setContentTypeCode(CT_APPLICATION_JSON);

    json body = {
        {"model", kModel}, {"messages", messages}, {"max_tokens", kMaxTokens}};
    req->setBody(body.dump());

    client->sendRequest(req, [onSuccess, onError](ReqResult result,
                                                  const HttpResponsePtr& resp) {
        if (result != ReqResult::Ok || !resp) {
            spdlog::error("OpenAI HTTP request failed");
            onError(k502BadGateway, "Failed to reach OpenAI API");
            return;
        }
        try {
            auto j = json::parse(resp->getBody());
            if (resp->statusCode() != k200OK) {
                auto msg = j.value("error", json::object())
                               .value("message", "Unknown OpenAI error");
                spdlog::error("OpenAI API error: {}", msg);
                onError(k502BadGateway, msg);
                return;
            }
            std::string content;
            if (j.contains("choices") && j["choices"].is_array() &&
                !j["choices"].empty()) {
                content = j["choices"][0]
                              .value("message", json::object())
                              .value("content", "");
            }
            std::int64_t tokens = 0;
            if (j.contains("usage")) {
                tokens = j["usage"].value("total_tokens",
                                          static_cast<std::int64_t>(0));
            }
            onSuccess({{"content", content},
                       {"model", j.value("model", kModel)},
                       {"tokensUsed", tokens}});
        } catch (const std::exception& e) {
            spdlog::error("OpenAI parse error: {}", e.what());
            onError(k502BadGateway, "Invalid OpenAI API response");
        }
    });
}
} // namespace services
