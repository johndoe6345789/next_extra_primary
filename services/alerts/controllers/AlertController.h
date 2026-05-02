#pragma once
/**
 * @file AlertController.h
 * @brief HTTP routes for the alerts domain.
 */

#include <drogon/HttpController.h>
#include <string>

namespace controllers
{

/**
 * @class AlertController
 * @brief Public ingest + admin list / ack / resolve.
 */
class AlertController
    : public drogon::HttpController<AlertController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AlertController::ingest,
                  "/api/alerts", drogon::Post);
    ADD_METHOD_TO(AlertController::list,
                  "/api/alerts", drogon::Get);
    ADD_METHOD_TO(AlertController::acknowledge,
                  "/api/alerts/{id}/acknowledge",
                  drogon::Post);
    ADD_METHOD_TO(AlertController::resolve,
                  "/api/alerts/{id}/resolve",
                  drogon::Post);
    METHOD_LIST_END

    /** @brief POST /api/alerts — ingest one alert. */
    void ingest(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief GET /api/alerts — paginated list. */
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief POST /api/alerts/{id}/acknowledge. */
    void acknowledge(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief POST /api/alerts/{id}/resolve. */
    void resolve(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers
