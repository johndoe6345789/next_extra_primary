#pragma once
/**
 * @file DocsController.h
 * @brief Serves Swagger UI and OpenAPI JSON spec.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class DocsController
    : public drogon::HttpController<DocsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(DocsController::swagger,
                  "/api/docs", drogon::Get);
    ADD_METHOD_TO(DocsController::spec,
                  "/api/docs/openapi.json", drogon::Get);
    METHOD_LIST_END

    /**
     * @brief Serve the Swagger UI HTML page.
     * @param req  Incoming HTTP request.
     * @param cb   Response callback.
     */
    void swagger(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&
            cb);

    /**
     * @brief Serve the OpenAPI 3.0 JSON spec.
     * @param req  Incoming HTTP request.
     * @param cb   Response callback.
     */
    void spec(
        const drogon::HttpRequestPtr& req,
        std::function<void(const drogon::HttpResponsePtr&)>&&
            cb);
};

} // namespace controllers
