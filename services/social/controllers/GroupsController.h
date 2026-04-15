#pragma once
/**
 * @file GroupsController.h
 * @brief HTTP routes for groups / teams (7.6).
 */

#include <drogon/HttpController.h>

namespace controllers::social
{

/**
 * @brief Group CRUD + membership endpoints.
 */
class GroupsController
    : public drogon::HttpController<GroupsController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        GroupsController::list,
        "/api/social/groups", drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GroupsController::create,
        "/api/social/groups", drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GroupsController::addMember,
        "/api/social/groups/{id}/members",
        drogon::Post, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GroupsController::removeMember,
        "/api/social/groups/{id}/members/{user}",
        drogon::Delete, "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        GroupsController::listMembers,
        "/api/social/groups/{id}/members",
        drogon::Get, "filters::JwtAuthFilter");
    METHOD_LIST_END

    /** @brief List all groups. */
    void list(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Create a group. */
    void create(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Add a member to a group. */
    void addMember(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /** @brief Remove a member from a group. */
    void removeMember(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id,
        const std::string& user);

    /** @brief List members of a group. */
    void listMembers(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers::social
