/// @file EmailInboxController.cpp
#include "EmailInboxController.h"
#include "email/backend/EmailInboxService.h"
#include "imap-sync/backend/ImapSyncService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void EmailInboxController::listMessages(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto accountId =
        req->getParameter("accountId");
    auto folder =
        req->getParameter("folder");
    if (folder.empty()) folder = "INBOX";
    int page = 1;
    int pageSize = 50;
    auto p = req->getParameter("page");
    auto ps = req->getParameter("pageSize");
    if (!p.empty()) page = std::stoi(p);
    if (!ps.empty()) pageSize = std::stoi(ps);

    if (accountId.empty()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "accountId required"));
        return;
    }

    services::EmailInboxService svc;
    svc.listMessages(
        accountId, folder, page, pageSize,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void EmailInboxController::getMessage(
    const drogon::HttpRequestPtr& req,
    Cb&& cb, const std::string& id)
{
    services::EmailInboxService svc;
    svc.getMessage(id,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void EmailInboxController::syncAccount(
    const drogon::HttpRequestPtr& req,
    Cb&& cb, const std::string& accountId)
{
    spdlog::info("IMAP sync for {}", accountId);
    services::ImapSyncService svc;
    svc.syncAccount(accountId,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
