/**
 * @file UserStore.h
 * @brief JSON-persisted user store with SHA256 password hashing.
 */

#pragma once

#include "BlobStore.h"

#include <json/json.h>

#include <filesystem>
#include <fstream>
#include <mutex>
#include <string>
#include <unordered_map>

namespace repo
{

class UserStore
{
public:
    explicit UserStore(const std::filesystem::path& path)
        : path_(path)
    {
        load();
        seedAdmin();
    }

    /// @brief Verify credentials. Returns user JSON or null.
    Json::Value verify(const std::string& user,
                       const std::string& pass) const
    {
        std::lock_guard lk(mu_);
        auto it = users_.find(user);
        if (it == users_.end()) return Json::nullValue;
        auto hash = hashPass(pass, it->second["salt"].asString());
        if (hash != it->second["hash"].asString())
            return Json::nullValue;

        Json::Value out;
        out["username"] = user;
        out["scopes"] = it->second["scopes"];
        return out;
    }

    /// @brief Change password. Returns true on success.
    bool changePass(const std::string& user,
                    const std::string& oldP,
                    const std::string& newP)
    {
        if (verify(user, oldP).isNull()) return false;
        std::lock_guard lk(mu_);
        auto salt = makeSalt();
        users_[user]["salt"] = salt;
        users_[user]["hash"] = hashPass(newP, salt);
        save();
        return true;
    }

private:
    std::filesystem::path path_;
    std::unordered_map<std::string, Json::Value> users_;
    mutable std::mutex mu_;

    static std::string makeSalt()
    {
        char buf[16];
        for (auto& c : buf) c = "abcdef0123456789"[rand() % 16];
        return {buf, 16};
    }

    static std::string hashPass(const std::string& pass,
                                const std::string& salt)
    {
        return BlobStore::sha256(salt + ":" + pass);
    }

    void seedAdmin()
    {
        std::lock_guard lk(mu_);
        if (users_.count("admin")) return;
        auto salt = makeSalt();
        Json::Value u;
        u["salt"] = salt;
        u["hash"] = hashPass("admin", salt);
        u["scopes"].append("read");
        u["scopes"].append("write");
        u["scopes"].append("admin");
        users_["admin"] = u;
        save();
    }

    void load()
    {
        if (!std::filesystem::exists(path_)) return;
        std::ifstream f(path_);
        Json::Value root;
        Json::CharReaderBuilder rb;
        Json::parseFromStream(rb, f, &root, nullptr);
        for (const auto& k : root.getMemberNames())
            users_[k] = root[k];
    }

    void save() const
    {
        namespace fs = std::filesystem;
        fs::create_directories(path_.parent_path());
        Json::Value root(Json::objectValue);
        for (const auto& [k, v] : users_) root[k] = v;
        std::ofstream f(path_);
        Json::StreamWriterBuilder wb;
        f << Json::writeString(wb, root);
    }
};

} // namespace repo
