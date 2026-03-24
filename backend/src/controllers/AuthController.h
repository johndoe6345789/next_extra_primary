#pragma once
/**
 * @file AuthController.h
 * @brief Authentication endpoints: register, login, logout,
 *        refresh, me, forgot/reset password, confirm email.
 */

#include <drogon/HttpController.h>
#include <string>

namespace controllers
{

class AuthController : public drogon::HttpController<AuthController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(AuthController::registerUser, "/api/auth/register",
                  drogon::Post);
    ADD_METHOD_TO(AuthController::login, "/api/auth/login", drogon::Post);
    ADD_METHOD_TO(AuthController::logout, "/api/auth/logout", drogon::Post,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(AuthController::refresh, "/api/auth/refresh", drogon::Post);
    ADD_METHOD_TO(AuthController::me, "/api/auth/me", drogon::Get,
                  "filters::JwtAuthFilter");
    ADD_METHOD_TO(AuthController::forgotPassword, "/api/auth/forgot-password",
                  drogon::Post);
    ADD_METHOD_TO(AuthController::resetPassword,
                  "/api/auth/reset-password/{token}", drogon::Post);
    ADD_METHOD_TO(AuthController::confirmEmail, "/api/auth/confirm/{token}",
                  drogon::Get);
    METHOD_LIST_END

    /** @brief Register a new user account. */
    void registerUser(const drogon::HttpRequestPtr& req,
                      std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Authenticate and issue tokens. */
    void login(const drogon::HttpRequestPtr& req,
               std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Invalidate the current access token. */
    void logout(const drogon::HttpRequestPtr& req,
                std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Issue a new access token via refresh token. */
    void refresh(const drogon::HttpRequestPtr& req,
                 std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Return the authenticated user's profile. */
    void me(const drogon::HttpRequestPtr& req,
            std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Send a password-reset email. */
    void
    forgotPassword(const drogon::HttpRequestPtr& req,
                   std::function<void(const drogon::HttpResponsePtr&)>&& cb);

    /** @brief Reset password using a one-time token. */
    void resetPassword(const drogon::HttpRequestPtr& req,
                       std::function<void(const drogon::HttpResponsePtr&)>&& cb,
                       const std::string& token);

    /** @brief Confirm a user's email address. */
    void confirmEmail(const drogon::HttpRequestPtr& req,
                      std::function<void(const drogon::HttpResponsePtr&)>&& cb,
                      const std::string& token);
};

} // namespace controllers
