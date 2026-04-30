/**
 * @file ForumBoardControllerList.cpp
 * @brief GET /api/forum/boards handler.
 */
#include "ForumBoardController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

// Defined in ForumBoardRow.cpp
json boardRowToJson(const Row& row);

void ForumBoardController::list(
    const HttpRequestPtr& /*req*/, Cb&& cb)
{
    auto db = app().getDbClient();
    *db << "SELECT slug, label, description, icon,"
           "  requires_auth, min_posts,"
           "  is_guest_visible, sort_order"
           " FROM forum_boards"
           " ORDER BY sort_order"
        >> [cb](const Result& r) {
            json arr = json::array();
            for (const auto& row : r)
                arr.push_back(boardRowToJson(row));
            cb(::utils::jsonOk(arr));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::error("forum.boards.list: {}",
                e.base().what());
            cb(::utils::jsonError(
                k500InternalServerError,
                "internal error"));
        };
}

} // namespace controllers
