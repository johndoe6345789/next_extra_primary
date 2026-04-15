#pragma once
/**
 * @file GalleryController.h
 * @brief HTTP endpoints for the photo gallery daemon.
 */

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief REST routes mounted at /api/gallery/*.
 *
 * Split across three implementation files:
 *   GalleryControllerList.cpp   — list / create / patch / delete
 *   GalleryControllerItems.cpp  — items list / add / remove
 *   GalleryControllerBulk.cpp   — bulk import via JobQueue
 */
class GalleryController
    : public drogon::HttpController<GalleryController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        GalleryController::list,
        "/api/gallery", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::create,
        "/api/gallery", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::patch,
        "/api/gallery/{id}", drogon::Patch,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::remove,
        "/api/gallery/{id}", drogon::Delete,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::items,
        "/api/gallery/{id}/items", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::addItem,
        "/api/gallery/{id}/items", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::removeItem,
        "/api/gallery/{id}/items/{asset}",
        drogon::Delete, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GalleryController::bulk,
        "/api/gallery/{id}/bulk", drogon::Post,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    using Cb = std::function<void(
        const drogon::HttpResponsePtr&)>;

    void list(
        const drogon::HttpRequestPtr& req, Cb&& cb);
    void create(
        const drogon::HttpRequestPtr& req, Cb&& cb);
    void patch(
        const drogon::HttpRequestPtr& req, Cb&& cb,
        const std::string& id);
    void remove(
        const drogon::HttpRequestPtr& req, Cb&& cb,
        const std::string& id);
    void items(
        const drogon::HttpRequestPtr& req, Cb&& cb,
        const std::string& id);
    void addItem(
        const drogon::HttpRequestPtr& req, Cb&& cb,
        const std::string& id);
    void removeItem(
        const drogon::HttpRequestPtr& req, Cb&& cb,
        const std::string& id,
        const std::string& asset);
    void bulk(
        const drogon::HttpRequestPtr& req, Cb&& cb,
        const std::string& id);
};

} // namespace controllers
