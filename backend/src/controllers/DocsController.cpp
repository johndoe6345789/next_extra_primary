/**
 * @file DocsController.cpp
 * @brief Swagger UI and OpenAPI spec serving.
 */

#include "DocsController.h"
#include "../docs/openapi_spec.h"

namespace controllers
{

void DocsController::swagger(
    const drogon::HttpRequestPtr& /*req*/,
    std::function<void(const drogon::HttpResponsePtr&)>&& cb)
{
    static const std::string html = R"html(<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nextra API Docs</title>
  <link rel="stylesheet" href=
    "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src=
    "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js">
  </script>
  <script>
    SwaggerUIBundle({
      url: '/api/docs/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: 'BaseLayout'
    });
  </script>
</body>
</html>)html";

    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(drogon::k200OK);
    resp->setContentTypeCode(drogon::CT_TEXT_HTML);
    resp->setBody(html);
    cb(resp);
}

void DocsController::spec(
    const drogon::HttpRequestPtr& /*req*/,
    std::function<void(const drogon::HttpResponsePtr&)>&& cb)
{
    static const std::string json =
        docs::buildSpec().dump();

    auto resp = drogon::HttpResponse::newHttpResponse();
    resp->setStatusCode(drogon::k200OK);
    resp->setContentTypeCode(drogon::CT_APPLICATION_JSON);
    resp->setBody(json);
    cb(resp);
}

} // namespace controllers
