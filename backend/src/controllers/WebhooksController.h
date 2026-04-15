#pragma once

/**
 * @file WebhooksController.h
 * @brief REST surface for the webhook-dispatcher daemon.
 *
 * Mounted at /api/webhooks — CRUD over webhook_endpoints, listing
 * and replaying webhook_deliveries, and the static event catalogue
 * used by the operator tool to populate its endpoint-editor form.
 *
 * Endpoints:
 *   GET    /api/webhooks/endpoints
 *   POST   /api/webhooks/endpoints
 *   PUT    /api/webhooks/endpoints/{id}
 *   DELETE /api/webhooks/endpoints/{id}
 *   GET    /api/webhooks/deliveries
 *   POST   /api/webhooks/deliveries/{id}/replay
 *   GET    /api/webhooks/events
 */

#include <drogon/HttpController.h>

namespace nextra::webhooks
{

class WebhooksController
    : public drogon::HttpController<WebhooksController>
{
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(WebhooksController::listEndpoints,
                  "/api/webhooks/endpoints",
                  drogon::Get, "JwtFilter");
    ADD_METHOD_TO(WebhooksController::createEndpoint,
                  "/api/webhooks/endpoints",
                  drogon::Post, "JwtFilter");
    ADD_METHOD_TO(WebhooksController::updateEndpoint,
                  "/api/webhooks/endpoints/{id}",
                  drogon::Put, "JwtFilter");
    ADD_METHOD_TO(WebhooksController::deleteEndpoint,
                  "/api/webhooks/endpoints/{id}",
                  drogon::Delete, "JwtFilter");
    ADD_METHOD_TO(WebhooksController::listDeliveries,
                  "/api/webhooks/deliveries",
                  drogon::Get, "JwtFilter");
    ADD_METHOD_TO(WebhooksController::replayDelivery,
                  "/api/webhooks/deliveries/{id}/replay",
                  drogon::Post, "JwtFilter");
    ADD_METHOD_TO(WebhooksController::listEvents,
                  "/api/webhooks/events",
                  drogon::Get, "JwtFilter");
    METHOD_LIST_END

    void listEndpoints(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb);
    void createEndpoint(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb);
    void updateEndpoint(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
    void deleteEndpoint(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
    void listDeliveries(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb);
    void replayDelivery(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb,
        std::int64_t id);
    void listEvents(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&& cb);
};

}  // namespace nextra::webhooks
