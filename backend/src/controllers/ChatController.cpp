/**
 * @file ChatController.cpp
 * @brief AI chat endpoint implementations.
 */

#include "ChatController.h"
#include "../utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(const drogon::HttpResponsePtr&)>;

/// @brief Safely parse a string to long long, returning @p fallback on error.
static auto safeStoll(
    const std::string& s,
    long long fallback) noexcept -> long long
{
    try {
        return std::stoll(s);
    } catch (...) {
        return fallback;
    }
}

namespace controllers
{

void ChatController::sendMessage(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");

    auto body = json::parse(
        req->bodyData(), req->bodyData() + req->bodyLength(), nullptr, false);
    if (body.is_discarded() || !body.contains("message")) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "message field required"));
        return;
    }

    auto message = body["message"].get<std::string>();
    auto provider = body.value("provider", "default");

    if (message.empty()) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "message cannot be empty"));
        return;
    }

    // TODO: forward to AI provider, persist exchange.
    json result = {{"id", "msg-uuid"},
                   {"user_id", userId},
                   {"message", message},
                   {"provider", provider},
                   {"response", "AI response placeholder"},
                   {"created_at", "2025-01-01T00:00:00Z"}};
    cb(::utils::jsonCreated(result));
}

// ----------------------------------------------------------
void ChatController::history(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    auto pageStr = req->getParameter("page");
    auto perPageStr = req->getParameter("per_page");
    int64_t page = safeStoll(pageStr, 1);
    int64_t perPage = safeStoll(perPageStr, 20);

    // TODO: query chat history from database.
    json messages = json::array();
    cb(::utils::jsonPaginated(messages, 0, page, perPage));
}

// ----------------------------------------------------------
void ChatController::clearHistory(const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->attributes()->get<std::string>("user_id");
    // TODO: delete all chat records for userId from DB.
    cb(::utils::jsonOk({{"message", "Chat history cleared"}}));
}

} // namespace controllers
