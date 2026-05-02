/**
 * @file AlertService.cpp
 * @brief Constructor + acknowledge/resolve helpers.
 *        Ingest and list live in their own .cpp files
 *        so each translation unit stays under 100 LOC.
 */

#include "alerts/backend/AlertService.h"

#include <drogon/drogon.h>
#include <drogon/orm/Exception.h>
#include <spdlog/spdlog.h>

namespace nextra::alerts
{

AlertService::AlertService()
    : db_(drogon::app().getDbClient())
{}

namespace
{

/// Update status to a new value, return updated row.
void setStatus(
    drogon::orm::DbClientPtr db,
    const std::string& id,
    const std::string& newStatus,
    const std::string& actor,
    OkCb ok, ErrCb err)
{
    static const char* kSql =
        "UPDATE alerts "
        "   SET status = $1, "
        "       acknowledged_by = NULLIF($2,'')::uuid, "
        "       updated_at = now() "
        " WHERE id = $3::uuid "
        " RETURNING id, status";
    db->execSqlAsync(kSql,
        [ok, err](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(404, "alert not found");
                return;
            }
            json out = {
                {"id",     r[0]["id"].as<std::string>()},
                {"status", r[0]["status"].as<std::string>()}
            };
            ok(out);
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::error("alerts setStatus: {}",
                          e.base().what());
            err(500, e.base().what());
        },
        newStatus, actor, id);
}

} // namespace

void AlertService::acknowledge(
    const std::string& id, const std::string& actor,
    OkCb ok, ErrCb err)
{
    setStatus(db_, id, "acknowledged", actor, ok, err);
}

void AlertService::resolve(
    const std::string& id, OkCb ok, ErrCb err)
{
    setStatus(db_, id, "resolved", std::string{}, ok, err);
}

} // namespace nextra::alerts
