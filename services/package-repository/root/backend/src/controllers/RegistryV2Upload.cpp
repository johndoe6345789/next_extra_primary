#include "RegistryV2Ctrl.h"
#include "../services/RegistryAuth.h"
#include "../services/RegistryUploadStore.h"

using namespace drogon;

namespace repo
{
namespace
{
void setUploadHeaders(const HttpResponsePtr& resp, const std::string& ns,
                      const std::string& name, const std::string& uuid,
                      int64_t size)
{
    registry_auth::addHeaders(resp);
    resp->addHeader("Docker-Upload-UUID", uuid);
    resp->addHeader("Location", "/v2/" + ns + "/" + name + "/blobs/uploads/" + uuid);
    resp->addHeader("Range", size > 0 ? "0-" + std::to_string(size - 1) : "0-0");
}
}

void RegistryV2Ctrl::startUpload(const HttpRequestPtr& req,
                                 std::function<void(const HttpResponsePtr&)>&& cb,
                                 const std::string& ns, const std::string& name)
{
    auto principal = registry_auth::authenticate(req);
    if (principal.isNull()) return cb(registry_auth::challenge());
    if (!registry_auth::hasScope(principal, "write")) return cb(registry_auth::denied());
    const auto digest = req->getParameter("digest");
    if (!digest.empty()) {
        const auto stored =
            Globals::blobs->store(std::string(req->body())).first;
        auto resp = HttpResponse::newHttpResponse();
        resp->setStatusCode(stored == digest ? k201Created : k400BadRequest);
        registry_auth::addHeaders(resp);
        if (stored == digest) {
            resp->addHeader("Docker-Content-Digest", stored);
            resp->addHeader("Location",
                            "/v2/" + ns + "/" + name + "/blobs/" + stored);
        }
        return cb(resp);
    }
    const auto mount = req->getParameter("mount");
    if (!mount.empty() && Globals::blobs->exists(mount)) {
        auto resp = HttpResponse::newHttpResponse();
        resp->setStatusCode(k201Created);
        registry_auth::addHeaders(resp);
        resp->addHeader("Docker-Content-Digest", mount);
        resp->addHeader("Location", "/v2/" + ns + "/" + name + "/blobs/" + mount);
        return cb(resp);
    }
    const auto uuid = registry_upload::start();
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(k202Accepted);
    setUploadHeaders(resp, ns, name, uuid, 0);
    cb(resp);
}

void RegistryV2Ctrl::uploadStatus(const HttpRequestPtr& req,
                                  std::function<void(const HttpResponsePtr&)>&& cb,
                                  const std::string& ns, const std::string& name,
                                  const std::string& uuid)
{
    auto principal = registry_auth::authenticate(req);
    if (principal.isNull()) return cb(registry_auth::challenge());
    if (!registry_auth::hasScope(principal, "write")) return cb(registry_auth::denied());
    const auto current = registry_upload::size(uuid);
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(current < 0 ? k404NotFound : k204NoContent);
    setUploadHeaders(resp, ns, name, uuid, current < 0 ? 0 : current);
    cb(resp);
}

void RegistryV2Ctrl::patchUpload(const HttpRequestPtr& req,
                                 std::function<void(const HttpResponsePtr&)>&& cb,
                                 const std::string& ns, const std::string& name,
                                 const std::string& uuid)
{
    auto principal = registry_auth::authenticate(req);
    if (principal.isNull()) return cb(registry_auth::challenge());
    if (!registry_auth::hasScope(principal, "write")) return cb(registry_auth::denied());
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(k202Accepted);
    setUploadHeaders(resp, ns, name, uuid,
                     registry_upload::append(uuid, std::string(req->body())));
    cb(resp);
}

void RegistryV2Ctrl::completeUpload(const HttpRequestPtr& req,
                                    std::function<void(const HttpResponsePtr&)>&& cb,
                                    const std::string& ns, const std::string& name,
                                    const std::string& uuid)
{
    auto principal = registry_auth::authenticate(req);
    if (principal.isNull()) return cb(registry_auth::challenge());
    if (!registry_auth::hasScope(principal, "write")) return cb(registry_auth::denied());
    const auto digest = req->getParameter("digest");
    if (digest.empty()) {
        auto resp = HttpResponse::newHttpResponse();
        resp->setStatusCode(k400BadRequest);
        registry_auth::addHeaders(resp);
        return cb(resp);
    }
    const auto stored = registry_upload::finalize(uuid, digest, std::string(req->body()));
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(stored.empty() ? k400BadRequest : k201Created);
    registry_auth::addHeaders(resp);
    if (!stored.empty()) {
        resp->addHeader("Docker-Content-Digest", stored);
        resp->addHeader("Location", "/v2/" + ns + "/" + name + "/blobs/" + stored);
    }
    cb(resp);
}

void RegistryV2Ctrl::cancelUpload(const HttpRequestPtr& req,
                                  std::function<void(const HttpResponsePtr&)>&& cb,
                                  const std::string&, const std::string&,
                                  const std::string& uuid)
{
    auto principal = registry_auth::authenticate(req);
    if (principal.isNull()) return cb(registry_auth::challenge());
    if (!registry_auth::hasScope(principal, "write")) return cb(registry_auth::denied());
    registry_upload::cancel(uuid);
    auto resp = HttpResponse::newHttpResponse();
    resp->setStatusCode(k204NoContent);
    registry_auth::addHeaders(resp);
    cb(resp);
}
} // namespace repo
