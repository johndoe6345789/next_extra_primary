#pragma once

/**
 * @file StreamsController.h
 * @brief REST surface for the media-streaming control plane.
 *
 * Endpoints:
 *   GET    /api/streams                  List every known stream
 *   POST   /api/streams                  Create a new stream (returns key)
 *   DELETE /api/streams/{id}             Admin: delete a stream row
 *   POST   /api/streams/{id}/block       Admin: flip to blocked
 *   POST   /api/streams/{id}/kick        Admin: kick current publisher
 *   POST   /api/streams/hook/publish     mediamtx webhook: publish/unpublish
 *
 * Implementation lives across StreamsControllerCrud.cpp and
 * StreamsControllerAdmin.cpp to honour the 100-LOC per file rule.
 */

#include <drogon/HttpController.h>

namespace nextra::streaming
{

class StreamsController
    : public drogon::HttpController<StreamsController>
{
public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(StreamsController::list,
                  "/api/streams", drogon::Get, "JwtFilter");
    ADD_METHOD_TO(StreamsController::create,
                  "/api/streams", drogon::Post, "JwtFilter");
    ADD_METHOD_TO(StreamsController::remove,
                  "/api/streams/{id}", drogon::Delete, "JwtFilter");
    ADD_METHOD_TO(StreamsController::block,
                  "/api/streams/{id}/block",
                  drogon::Post, "JwtFilter");
    ADD_METHOD_TO(StreamsController::kick,
                  "/api/streams/{id}/kick",
                  drogon::Post, "JwtFilter");
    ADD_METHOD_TO(StreamsController::publishHook,
                  "/api/streams/hook/publish", drogon::Post);
    METHOD_LIST_END

    void list(const drogon::HttpRequestPtr&,
              std::function<void(const drogon::HttpResponsePtr&)>&&);
    void create(const drogon::HttpRequestPtr&,
                std::function<void(const drogon::HttpResponsePtr&)>&&);
    void remove(const drogon::HttpRequestPtr&,
                std::function<void(const drogon::HttpResponsePtr&)>&&,
                std::int64_t id);
    void block(const drogon::HttpRequestPtr&,
               std::function<void(const drogon::HttpResponsePtr&)>&&,
               std::int64_t id);
    void kick(const drogon::HttpRequestPtr&,
              std::function<void(const drogon::HttpResponsePtr&)>&&,
              std::int64_t id);
    void publishHook(
        const drogon::HttpRequestPtr&,
        std::function<void(const drogon::HttpResponsePtr&)>&&);
};

}  // namespace nextra::streaming
