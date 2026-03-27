/**
 * @file MetaStore.h
 * @brief Persistent JSON-backed key-value metadata store.
 */

#pragma once

#include <json/json.h>

#include <filesystem>
#include <fstream>
#include <mutex>
#include <string>
#include <unordered_map>
#include <vector>

namespace repo
{

class MetaStore
{
public:
    explicit MetaStore(const std::filesystem::path& path)
        : path_(path)
    {
        load();
    }

    Json::Value get(const std::string& key) const
    {
        std::lock_guard lk(mu_);
        auto it = data_.find(key);
        return (it != data_.end()) ? it->second
                                   : Json::nullValue;
    }

    void put(const std::string& key, const Json::Value& val)
    {
        std::lock_guard lk(mu_);
        data_[key] = val;
        save();
    }

    /// @brief Put only if key is absent. Returns true on success.
    bool casPut(const std::string& key, const Json::Value& v)
    {
        std::lock_guard lk(mu_);
        if (data_.count(key)) return false;
        data_[key] = v;
        save();
        return true;
    }

    void del(const std::string& key)
    {
        std::lock_guard lk(mu_);
        data_.erase(key);
        save();
    }

    /// @brief List keys matching prefix.
    std::vector<std::string>
    keys(const std::string& prefix = "",
         size_t limit = 100) const
    {
        std::lock_guard lk(mu_);
        std::vector<std::string> out;
        for (const auto& [k, _] : data_) {
            if (prefix.empty() || k.starts_with(prefix))
                out.push_back(k);
            if (out.size() >= limit) break;
        }
        return out;
    }

    size_t count() const
    {
        std::lock_guard lk(mu_);
        return data_.size();
    }

private:
    std::filesystem::path path_;
    std::unordered_map<std::string, Json::Value> data_;
    mutable std::mutex mu_;

    void load()
    {
        if (!std::filesystem::exists(path_)) return;
        std::ifstream f(path_);
        Json::Value root;
        Json::CharReaderBuilder rb;
        Json::parseFromStream(rb, f, &root, nullptr);
        for (const auto& k : root.getMemberNames())
            data_[k] = root[k];
    }

    void save() const
    {
        std::filesystem::create_directories(
            path_.parent_path());
        Json::Value root(Json::objectValue);
        for (const auto& [k, v] : data_) root[k] = v;
        Json::StreamWriterBuilder wb;
        wb["indentation"] = "  ";
        std::ofstream f(path_);
        f << Json::writeString(wb, root);
    }
};

} // namespace repo
