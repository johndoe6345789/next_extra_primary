/**
 * @file GotenbergClient.cpp
 * @brief Multipart HTTP poster for Gotenberg.
 *
 * Gotenberg accepts multipart/form-data with one part named
 * @c index.html containing the complete HTML document.  We hand-build
 * the body with a random boundary string so we do not depend on any
 * multipart helper outside Drogon's core.
 */

#include "services/pdf/GotenbergClient.h"

#include <drogon/HttpClient.h>
#include <drogon/HttpRequest.h>
#include <spdlog/spdlog.h>

#include <chrono>
#include <random>

namespace nextra::pdf
{

using namespace drogon;

namespace
{
std::string makeBoundary()
{
    static thread_local std::mt19937_64 rng{std::random_device{}()};
    return "----nextraPdfBoundary" + std::to_string(rng());
}

std::string buildMultipartBody(const std::string& html,
                               const std::string& boundary)
{
    std::string body;
    body += "--" + boundary + "\r\n";
    body += "Content-Disposition: form-data; name=\"files\"; "
            "filename=\"index.html\"\r\n";
    body += "Content-Type: text/html\r\n\r\n";
    body += html;
    body += "\r\n--" + boundary + "--\r\n";
    return body;
}
}  // namespace

GotenbergClient::GotenbergClient(PdfConfig cfg) : cfg_(std::move(cfg)) {}

void GotenbergClient::render(const std::string& html,
                             const OnSuccess& onOk,
                             const OnError&   onErr)
{
    auto client = HttpClient::newHttpClient(cfg_.gotenbergUrl);
    client->setTimeout(cfg_.timeoutMs / 1000.0);

    const auto boundary = makeBoundary();
    auto req = HttpRequest::newHttpRequest();
    req->setMethod(Post);
    req->setPath(cfg_.gotenbergPath);
    req->addHeader("Content-Type",
                   "multipart/form-data; boundary=" + boundary);
    req->setBody(buildMultipartBody(html, boundary));

    auto result = client->sendRequest(
        req, cfg_.timeoutMs / 1000.0);
    if (result.first != ReqResult::Ok || !result.second)
    {
        onErr(-1, "gotenberg network error");
        return;
    }
    const auto& resp = result.second;
    if (resp->getStatusCode() != k200OK)
    {
        onErr(static_cast<int>(resp->getStatusCode()),
              std::string(resp->getBody()));
        return;
    }
    onOk(std::string(resp->getBody()));
}

}  // namespace nextra::pdf
