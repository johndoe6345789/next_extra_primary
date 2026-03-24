#pragma once
/**
 * @file AiService.h
 * @brief AI chat service supporting Claude and OpenAI.
 *
 * Routes user messages to the selected LLM provider via
 * Drogon's async HttpClient. Persists conversation history
 * in the `chat_messages` table.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>

#include <cstdint>
#include <functional>
#include <string>

namespace services
{

using json = nlohmann::json;
using DbClientPtr = drogon::orm::DbClientPtr;
using Callback = std::function<void(json)>;
using ErrCallback = std::function<void(drogon::HttpStatusCode, std::string)>;

/**
 * @brief Supported AI provider backends.
 */
enum class AiProvider : std::uint8_t {
    CLAUDE = 0, ///< Anthropic Claude API.
    OPENAI = 1  ///< OpenAI ChatCompletion API.
};

/**
 * @brief Convert a string to AiProvider enum.
 *
 * @param s  "claude" or "openai" (case-insensitive).
 * @return Matching enum value; defaults to CLAUDE.
 */
[[nodiscard]] inline auto parseProvider(const std::string& s) -> AiProvider
{
    if (s == "openai" || s == "OPENAI") {
        return AiProvider::OPENAI;
    }
    return AiProvider::CLAUDE;
}

/**
 * @brief Response value object from an AI chat request.
 */
struct AiResponse {
    std::string role{"assistant"};
    std::string content;
    std::string provider;
    std::string model;
    std::int64_t tokensUsed{0};
};

/**
 * @class AiService
 * @brief Sends chat messages to an LLM and stores the
 *        conversation.
 */
class AiService
{
  public:
    AiService();
    ~AiService() = default;

    /**
     * @brief Send a user message to the AI provider.
     *
     * 1. Loads recent conversation history from the DB.
     * 2. Sends the prompt to Claude or OpenAI.
     * 3. Persists both the user and assistant messages.
     * 4. Returns the assistant reply via @p onSuccess.
     *
     * @param userId   Authenticated user ID.
     * @param message  User's plain-text message.
     * @param provider Which backend to use.
     * @param onSuccess Callback with AiResponse JSON.
     * @param onError   Callback on failure.
     */
    void chat(const std::string& userId, const std::string& message,
              AiProvider provider, Callback onSuccess, ErrCallback onError);

  private:
    /// Convenience DB accessor.
    [[nodiscard]] static auto db() -> DbClientPtr;

    /// Send request to Anthropic Claude.
    void callClaude(const json& messages, Callback onSuccess,
                    ErrCallback onError);

    /// Send request to OpenAI.
    void callOpenAi(const json& messages, Callback onSuccess,
                    ErrCallback onError);

    /// Persist a single chat message row.
    void storeMessage(const std::string& userId, const std::string& role,
                      const std::string& content, const std::string& provider,
                      const std::string& model);

    /// Load the last N messages for context.
    void loadHistory(const std::string& userId, std::size_t limit,
                     std::function<void(json)> callback);

    /// API keys loaded from environment.
    std::string claudeApiKey_;
    std::string openaiApiKey_;

    /// Model identifiers.
    static constexpr const char* kClaudeModel = "claude-sonnet-4-20250514";
    static constexpr const char* kOpenAiModel = "gpt-4o";

    /// Max tokens for a single completion.
    static constexpr std::int32_t kMaxTokens = 1024;

    /// Max history messages to include as context.
    static constexpr std::size_t kHistoryLimit = 20;
};

} // namespace services
