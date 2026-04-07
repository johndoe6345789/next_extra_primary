/**
 * @file TranslationService.cpp
 * @brief Read operations for translations.
 */

#include "services/TranslationService.h"

#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

auto TranslationService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

/// Set a value at a dot-notation path in JSON.
static void setNested(
    json& obj, const std::string& key,
    const std::string& val)
{
    auto pos = key.find('.');
    if (pos == std::string::npos) {
        obj[key] = val;
        return;
    }
    setNested(
        obj[key.substr(0, pos)],
        key.substr(pos + 1), val);
}

void TranslationService::listLocales(
    Callback onOk, ErrCallback onErr)
{
    *db() << "SELECT DISTINCT locale "
             "FROM translations ORDER BY locale"
        >> [onOk](const Result& r) {
            json arr = json::array();
            for (const auto& row : r)
                arr.push_back(
                    row["locale"].as<std::string>());
            onOk({{"locales", arr}});
        }
        >> [onErr](const DrogonDbException& e) {
            spdlog::error("listLocales: {}",
                e.base().what());
            onErr(k500InternalServerError,
                  "Internal server error");
        };
}

void TranslationService::getByLocale(
    const std::string& locale,
    Callback onOk, ErrCallback onErr)
{
    const std::string sql =
        "SELECT namespace, key, value "
        "FROM translations WHERE locale = $1 "
        "ORDER BY namespace, key";

    *db() << sql << locale
        >> [onOk](const Result& r) {
            json out = json::object();
            for (const auto& row : r) {
                auto ns = row["namespace"]
                    .as<std::string>();
                auto k = row["key"]
                    .as<std::string>();
                auto v = row["value"]
                    .as<std::string>();
                setNested(out[ns], k, v);
            }
            onOk(out);
        }
        >> [onErr](const DrogonDbException& e) {
            spdlog::error("getByLocale: {}",
                e.base().what());
            onErr(k500InternalServerError,
                  "Internal server error");
        };
}

void TranslationService::coverage(
    const std::string& ref,
    Callback onOk, ErrCallback onErr)
{
    const std::string sql = R"(
WITH ref AS (
  SELECT namespace, key
    FROM translations
   WHERE locale = $1
),
totals AS (
  SELECT COUNT(*) AS total FROM ref
),
per_locale AS (
  SELECT t.locale,
         COUNT(*) AS present
    FROM translations t
    JOIN ref r ON t.namespace = r.namespace
              AND t.key       = r.key
   GROUP BY t.locale
)
SELECT p.locale,
       p.present,
       tt.total
  FROM per_locale p
  CROSS JOIN totals tt
 ORDER BY p.locale
)";

    *db() << sql << ref
        >> [onOk, ref](const Result& r) {
            json arr = json::array();
            for (const auto& row : r) {
                auto lc = row["locale"]
                    .as<std::string>();
                auto present =
                    row["present"].as<int64_t>();
                auto total =
                    row["total"].as<int64_t>();
                arr.push_back({
                    {"locale", lc},
                    {"present", present},
                    {"total", total},
                    {"isReference", lc == ref},
                });
            }
            onOk({{"reference", ref},
                  {"locales", arr}});
        }
        >> [onErr](const DrogonDbException& e) {
            spdlog::error("coverage: {}",
                e.base().what());
            onErr(k500InternalServerError,
                  "Internal server error");
        };
}

} // namespace services
