/**
 * @file ForumControllerUpload.cpp
 * @brief POST /api/forum/upload handler.
 *
 * Accepts a multipart file, stores it in the S3
 * `forum` bucket, and returns the public URL.
 */
#include "ForumController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <drogon/MultiPart.h>
#include <drogon/utils/Utilities.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <cstdlib>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;

namespace controllers
{

/** @brief Map extension to MIME type string. */
static std::string mimeFromExt(
    std::string_view ext)
{
    if (ext == "jpg" || ext == "jpeg")
        return "image/jpeg";
    if (ext == "png")  return "image/png";
    if (ext == "gif")  return "image/gif";
    if (ext == "webp") return "image/webp";
    if (ext == "pdf")
        return "application/pdf";
    return "application/octet-stream";
}

void ForumController::uploadAttachment(
    const HttpRequestPtr& req, Cb&& cb)
{
    MultiPartParser parser;
    if (parser.parse(req) != 0) {
        cb(::utils::jsonError(
            k400BadRequest,
            "multipart parse error"));
        return;
    }
    const auto& files = parser.getFiles();
    if (files.empty()) {
        cb(::utils::jsonError(
            k400BadRequest, "no file uploaded"));
        return;
    }
    const auto& file = files[0];
    const std::string ext =
        std::string{file.getFileExtension()};
    const std::string mime = mimeFromExt(ext);
    const std::string filename =
        drogon::utils::getUuid() + "." + ext;
    const auto content = file.fileContent();
    const std::string body(
        content.data(), content.size());

    const char* s3Key =
        std::getenv("S3_ACCESS_KEY");
    const std::string accessKey =
        s3Key ? s3Key : "minioadmin";
    const char* s3Ep =
        std::getenv("S3_ENDPOINT");
    const std::string endpoint =
        s3Ep ? s3Ep : "http://s3:9000";

    auto client =
        HttpClient::newHttpClient(endpoint);
    auto s3Req = HttpRequest::newHttpRequest();
    s3Req->setMethod(Put);
    s3Req->setPath("/forum/" + filename);
    s3Req->setBody(body);
    s3Req->addHeader("Content-Type", mime);
    s3Req->addHeader("Authorization",
        "Bearer " + accessKey);

    client->sendRequest(s3Req,
        [cb, filename](
            ReqResult res,
            const HttpResponsePtr& s3Resp)
        {
            if (res != ReqResult::Ok ||
                !s3Resp ||
                s3Resp->getStatusCode() >=
                    k400BadRequest)
            {
                spdlog::error(
                    "forum.upload: s3 error");
                cb(::utils::jsonError(
                    k502BadGateway,
                    "storage error"));
                return;
            }
            const std::string url =
                "/api/s3/objects/forum/" +
                filename;
            cb(::utils::jsonOk({
                {"url",      url},
                {"filename", filename},
            }));
        });
}

} // namespace controllers
