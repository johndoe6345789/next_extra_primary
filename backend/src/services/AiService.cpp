/**
 * @file AiService.cpp
 * @brief Implementation of AI chat via Claude and OpenAI.
 */

#include "services/AiService.h"

#include <drogon/drogon.h>
#include <drogon/HttpClient.h>
#include <drogon/orm/DbClient.h>
#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <cstdlib>
#include <string>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

// ----------------------------------------------------------------
// Construction
// ----------------------------------------------------------------

AiService::AiService()
{
    auto env = [](const char* key) -> std::string {
        const char* v = std::getenv(key);
        return v ? v : "";
    };
    claudeApiKey_ = env("ANTHROPIC_API_KEY");
    openaiApiKey_ = env("OPENAI_API_KEY");

    if (claudeApiKey_.empty()) {
        spdlog::warn("ANTHROPIC_API_KEY not set; Claude "
                     "calls will fail");
    }
    if (openaiApiKey_.empty()) {
        spdlog::warn("OPENAI_API_KEY not set; OpenAI "
                     "calls will fail");
    }
}

auto AiService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

// ----------------------------------------------------------------
// Public chat entry point
// ----------------------------------------------------------------

void AiService::chat(const std::string& userId, const std::string& message,
                     AiProvider provider, Callback onSuccess,
                     ErrCallback onError)
{
    if (message.empty()) {
        onError(k400BadRequest, "Message must not be empty");
        return;
    }

    // 1. Store the user message.
    std::string provStr =
        (provider == AiProvider::OPENAI) ? "openai" : "claude";
    storeMessage(userId, "user", message, provStr, "");

    // 2. Load conversation history, then call the
    //    appropriate provider.
    loadHistory(
        userId, kHistoryLimit,
        [this, userId, message, provider, provStr, onSuccess,
         onError](json history) {
            // Append the current message.
            history.push_back({{"role", "user"}, {"content", message}});

            auto handleReply = [this, userId, provStr, onSuccess](json reply) {
                auto content = reply.value("content", "");
                auto model = reply.value("model", "");
                auto tokens =
                    reply.value("tokensUsed", static_cast<std::int64_t>(0));

                // Persist the assistant reply.
                storeMessage(userId, "assistant", content, provStr, model);

                onSuccess({{"role", "assistant"},
                           {"content", content},
                           {"provider", provStr},
                           {"model", model},
                           {"tokensUsed", tokens}});
            };

            if (provider == AiProvider::OPENAI) {
                callOpenAi(history, handleReply, onError);
            } else {
                callClaude(history, handleReply, onError);
            }
        });
}

// ----------------------------------------------------------------
// Claude (Anthropic)
// ----------------------------------------------------------------

void AiService::callClaude(const json& messages, Callback onSuccess,
                           ErrCallback onError)
{
    if (claudeApiKey_.empty()) {
        onError(k503ServiceUnavailable, "Claude API key not configured");
        return;
    }

    auto client = HttpClient::newHttpClient("https://api.anthropic.com");
    auto req = HttpRequest::newHttpRequest();
    req->setMethod(Post);
    req->setPath("/v1/messages");
    req->addHeader("x-api-key", claudeApiKey_);
    req->addHeader("anthropic-version", "2023-06-01");
    req->setContentTypeCode(CT_APPLICATION_JSON);

    json body = {{"model", kClaudeModel},
                 {"max_tokens", kMaxTokens},
                 {"messages", messages}};
    req->setBody(body.dump());

    client->sendRequest(req, [onSuccess, onError](ReqResult result,
                                                  const HttpResponsePtr& resp) {
        if (result != ReqResult::Ok || !resp) {
            spdlog::error("Claude HTTP request failed");
            onError(k502BadGateway, "Failed to reach Claude API");
            return;
        }

        try {
            auto j = json::parse(resp->getBody());

            if (resp->statusCode() != k200OK) {
                auto errMsg = j.value("error", json::object())
                                  .value("message", "Unknown Claude "
                                                    "error");
                spdlog::error("Claude API error: {}", errMsg);
                onError(k502BadGateway, errMsg);
                return;
            }

            // Extract assistant content.
            std::string content;
            if (j.contains("content") && j["content"].is_array() &&
                !j["content"].empty()) {
                content = j["content"][0].value("text", "");
            }

            std::int64_t tokens = 0;
            if (j.contains("usage")) {
                tokens = j["usage"].value("input_tokens",
                                          static_cast<std::int64_t>(0)) +
                         j["usage"].value("output_tokens",
                                          static_cast<std::int64_t>(0));
            }

            onSuccess({{"content", content},
                       {"model", j.value("model", kClaudeModel)},
                       {"tokensUsed", tokens}});
        } catch (const std::exception& e) {
            spdlog::error("Claude response parse error: "
                          "{}",
                          e.what());
            onError(k502BadGateway, "Invalid Claude API "
                                    "response");
        }
    });
}

// ----------------------------------------------------------------
// OpenAI
// ----------------------------------------------------------------

void AiService::callOpenAi(const json& messages, Callback onSuccess,
                           ErrCallback onError)
{
    if (openaiApiKey_.empty()) {
        onError(k503ServiceUnavailable, "OpenAI API key not configured");
        return;
    }

    auto client = HttpClient::newHttpClient("https://api.openai.com");
    auto req = HttpRequest::newHttpRequest();
    req->setMethod(Post);
    req->setPath("/v1/chat/completions");
    req->addHeader("Authorization", fmt::format("Bearer {}", openaiApiKey_));
    req->setContentTypeCode(CT_APPLICATION_JSON);

    json body = {{"model", kOpenAiModel},
                 {"messages", messages},
                 {"max_tokens", kMaxTokens}};
    req->setBody(body.dump());

    client->sendRequest(req, [onSuccess, onError](ReqResult result,
                                                  const HttpResponsePtr& resp) {
        if (result != ReqResult::Ok || !resp) {
            spdlog::error("OpenAI HTTP request failed");
            onError(k502BadGateway, "Failed to reach OpenAI "
                                    "API");
            return;
        }

        try {
            auto j = json::parse(resp->getBody());

            if (resp->statusCode() != k200OK) {
                auto errMsg = j.value("error", json::object())
                                  .value("message", "Unknown OpenAI "
                                                    "error");
                spdlog::error("OpenAI API error: {}", errMsg);
                onError(k502BadGateway, errMsg);
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
                       {"model", j.value("model", kOpenAiModel)},
                       {"tokensUsed", tokens}});
        } catch (const std::exception& e) {
            spdlog::error("OpenAI response parse error: "
                          "{}",
                          e.what());
            onError(k502BadGateway, "Invalid OpenAI API "
                                    "response");
        }
    });
}

// ----------------------------------------------------------------
// Message persistence
// ----------------------------------------------------------------

void AiService::storeMessage(const std::string& userId, const std::string& role,
                             const std::string& content,
                             const std::string& provider,
                             const std::string& model)
{
    auto dbClient = db();
    const std::string sql = R"(
        INSERT INTO chat_messages
            (user_id, role, content, provider,
             model, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
    )";

    *dbClient << sql << userId << role << content << provider << model >>
        [](const Result&) {
            // Fire-and-forget.
        } >>
        [](const DrogonDbException& e) {
            spdlog::error("storeMessage DB error: {}", e.base().what());
        };
}

void AiService::loadHistory(const std::string& userId, std::size_t limit,
                            std::function<void(json)> callback)
{
    auto dbClient = db();
    const std::string sql = R"(
        SELECT role, content
        FROM chat_messages
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
    )";

    *dbClient << sql << userId << static_cast<std::int64_t>(limit) >>
        [callback](const Result& result) {
            json history = json::array();
            // Results come newest-first; reverse them.
            for (auto it = result.rbegin(); it != result.rend(); ++it) {
                history.push_back(
                    {{"role", (*it)["role"].as<std::string>()},
                     {"content", (*it)["content"].as<std::string>()}});
            }
            callback(history);
        } >>
        [callback](const DrogonDbException& e) {
            spdlog::error("loadHistory DB error: {}", e.base().what());
            callback(json::array());
        };
}

} // namespace services
