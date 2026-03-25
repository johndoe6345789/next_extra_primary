/**
 * @file AiService.cpp
 * @brief Thin facade orchestrating AI chat sub-modules.
 *
 * Delegates history persistence to AiHistoryStore and
 * provider calls to AiClaudeClient / AiOpenAiClient.
 */

#include "services/AiService.h"

namespace services
{

// ----------------------------------------------------------------
// Construction
// ----------------------------------------------------------------

AiService::AiService()
    : historyStore_{}
    , claudeClient_{}
    , openAiClient_{}
{
}

// ----------------------------------------------------------------
// Public chat entry point
// ----------------------------------------------------------------

void AiService::chat(const std::string& userId,
                     const std::string& message,
                     AiProvider provider,
                     Callback onSuccess,
                     ErrCallback onError)
{
    if (message.empty()) {
        onError(drogon::k400BadRequest,
                "Message must not be empty");
        return;
    }

    const std::string provStr =
        (provider == AiProvider::OPENAI) ? "openai" : "claude";

    // 1. Persist the user turn (fire-and-forget).
    historyStore_.storeMessage(userId, "user",
                               message, provStr, "");

    // 2. Load context, then dispatch to the provider.
    historyStore_.loadHistory(
        userId, kHistoryLimit,
        [this, userId, message, provider,
         provStr, onSuccess, onError](json history) {

            history.push_back(
                {{"role", "user"}, {"content", message}});

            auto handleReply =
                [this, userId, provStr,
                 onSuccess](json reply) {
                    auto content =
                        reply.value("content", "");
                    auto model =
                        reply.value("model", "");
                    auto tokens = reply.value(
                        "tokensUsed",
                        static_cast<std::int64_t>(0));

                    // 4. Persist the assistant reply.
                    historyStore_.storeMessage(
                        userId, "assistant",
                        content, provStr, model);

                    // 5. Return result to caller.
                    onSuccess(
                        {{"role", "assistant"},
                         {"content", content},
                         {"provider", provStr},
                         {"model", model},
                         {"tokensUsed", tokens}});
                };

            // 3. Dispatch to the selected provider.
            if (provider == AiProvider::OPENAI) {
                openAiClient_.call(history,
                                   handleReply, onError);
            } else {
                claudeClient_.call(history,
                                   handleReply, onError);
            }
        });
}

} // namespace services
