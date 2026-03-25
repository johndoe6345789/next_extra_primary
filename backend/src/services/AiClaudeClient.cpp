/**
 * @file AiClaudeClient.cpp
 * @brief Implementation of the Anthropic Claude HTTP client.
 */

#include "services/AiClaudeClient.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <spdlog/spdlog.h>

#include <cstdlib>

namespace services
{

using namespace drogon;
AiClaudeClient::AiClaudeClient()
{
    const char* v = std::getenv("ANTHROPIC_API_KEY");
    apiKey_ = v ? v : "";
    if (apiKey_.empty())
        spdlog::warn("ANTHROPIC_API_KEY not set");
}

void AiClaudeClient::call(const json& messages,
                          Callback onSuccess,
                          ErrCallback onError)
{
    if (apiKey_.empty()) {
        onError(k503ServiceUnavailable,
                "Claude API key not configured");
        return;
    }

    auto client =
        HttpClient::newHttpClient("https://api.anthropic.com");
    auto req = HttpRequest::newHttpRequest();
    req->setMethod(Post);
    req->setPath("/v1/messages");
    req->addHeader("x-api-key", apiKey_);
    req->addHeader("anthropic-version", "2023-06-01");
    req->setContentTypeCode(CT_APPLICATION_JSON);

    json body = {{"model", kModel},
                 {"max_tokens", kMaxTokens},
                 {"messages", messages}};
    req->setBody(body.dump());

    client->sendRequest(
        req,
        [onSuccess, onError](ReqResult result,
                             const HttpResponsePtr& resp) {
            if (result != ReqResult::Ok || !resp) {
                spdlog::error("Claude HTTP request failed");
                onError(k502BadGateway,
                        "Failed to reach Claude API");
                return;
            }
            try {
                auto j = json::parse(resp->getBody());
                if (resp->statusCode() != k200OK) {
                    auto msg =
                        j.value("error", json::object())
                         .value("message",
                                "Unknown Claude error");
                    spdlog::error("Claude API error: {}", msg);
                    onError(k502BadGateway, msg);
                    return;
                }
                std::string content;
                if (j.contains("content") &&
                    j["content"].is_array() &&
                    !j["content"].empty()) {
                    content =
                        j["content"][0].value("text", "");
                }
                std::int64_t tokens = 0;
                if (j.contains("usage")) {
                    tokens =
                        j["usage"].value(
                            "input_tokens",
                            static_cast<std::int64_t>(0)) +
                        j["usage"].value(
                            "output_tokens",
                            static_cast<std::int64_t>(0));
                }
                onSuccess(
                    {{"content", content},
                     {"model", j.value("model", kModel)},
                     {"tokensUsed", tokens}});
            } catch (const std::exception& e) {
                spdlog::error("Claude parse error: {}",
                              e.what());
                onError(k502BadGateway,
                        "Invalid Claude API response");
            }
        });
}
} // namespace services
