/// @file SearchIndexInit.cpp — ES index bootstrap.
#include "search/backend/SearchIndexInit.h"

#include <spdlog/spdlog.h>

namespace services
{

static const json kSettings = {
    {"number_of_shards", 1},
    {"number_of_replicas", 0},
    {"refresh_interval", "1s"}
};

static const json kUsers = {{"properties", {
    {"username",     {{"type", "text"}}},
    {"display_name", {{"type", "text"}}},
    {"email",        {{"type", "text"}}},
    {"bio",          {{"type", "text"}}},
    {"role",         {{"type", "keyword"}}}
}}};

static const json kChat = {{"properties", {
    {"content",   {{"type", "text"}}},
    {"sender",    {{"type", "keyword"}}},
    {"channel",   {{"type", "keyword"}}},
    {"timestamp", {{"type", "date"}}}
}}};

static const json kBadges = {{"properties", {
    {"name",        {{"type", "text"}}},
    {"description", {{"type", "text"}}},
    {"category",    {{"type", "keyword"}}}
}}};

static const json kNotifications = {{"properties", {
    {"title",      {{"type", "text"}}},
    {"body",       {{"type", "text"}}},
    {"type",       {{"type", "keyword"}}},
    {"created_at", {{"type", "date"}}}
}}};

static const json kLeaderboard = {{"properties", {
    {"username",     {{"type", "text"}}},
    {"total_points", {{"type", "integer"}}},
    {"level",        {{"type", "integer"}}}
}}};

void SearchIndexInit::createAll(ElasticClient& es)
{
    spdlog::info("SearchIndexInit: creating indices");
    createOne(es, "nextra-users",         kUsers);
    createOne(es, "nextra-chat",          kChat);
    createOne(es, "nextra-badges",        kBadges);
    createOne(es, "nextra-notifications", kNotifications);
    createOne(es, "nextra-leaderboard",   kLeaderboard);
}

void SearchIndexInit::createOne(
    ElasticClient& es, const std::string& name,
    const json& mappings)
{
    json body = {{"settings", kSettings},
                 {"mappings", mappings}};

    es.createIndex(
        name, body,
        [name](json /*res*/) {
            spdlog::info("Index {} ready", name);
        },
        [name](int code, std::string msg) {
            // 400 = index already exists — not an error.
            if (code == 400) {
                spdlog::debug("Index {} exists", name);
            } else {
                spdlog::error("Index {} failed {}: {}",
                              name, code, msg);
            }
        });
}

} // namespace services
