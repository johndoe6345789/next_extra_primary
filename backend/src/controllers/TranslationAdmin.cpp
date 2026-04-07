/**
 * @file TranslationAdmin.cpp
 * @brief Admin-only translation endpoints.
 */

#include "TranslationController.h"
#include "../services/TranslationService.h"
#include "../utils/JsonResponse.h"
#include "../utils/RoleCheck.h"

#include <nlohmann/json.hpp>

namespace controllers
{

using json = nlohmann::json;

void TranslationController::coverage(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto role = req->attributes()
        ->get<std::string>("user_role");
    if (!::utils::hasRole(role, "admin")) {
        cb(::utils::jsonError(
            drogon::k403Forbidden, "Admin only"));
        return;
    }

    auto ref = req->getOptionalParameter<
        std::string>("ref").value_or("en");

    services::TranslationService::coverage(
        ref,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void TranslationController::upsert(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto role = req->attributes()
        ->get<std::string>("user_role");
    if (!::utils::hasRole(role, "admin")) {
        cb(::utils::jsonError(
            drogon::k403Forbidden, "Admin only"));
        return;
    }

    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);

    if (!body.contains("locale") ||
        !body.contains("namespace") ||
        !body.contains("key") ||
        !body.contains("value"))
    {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "locale, namespace, key, value "
            "required"));
        return;
    }

    auto userId = req->attributes()
        ->get<std::string>("user_id");

    services::TranslationService::upsert(
        body["locale"].get<std::string>(),
        body["namespace"].get<std::string>(),
        body["key"].get<std::string>(),
        body["value"].get<std::string>(),
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void TranslationController::remove(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& locale,
    const std::string& ns,
    const std::string& key)
{
    auto role = req->attributes()
        ->get<std::string>("user_role");
    if (!::utils::hasRole(role, "admin")) {
        cb(::utils::jsonError(
            drogon::k403Forbidden, "Admin only"));
        return;
    }

    services::TranslationService::remove(
        locale, ns, key,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
