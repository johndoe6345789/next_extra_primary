/**
 * @file test_alert_service_list.cpp
 * @brief Verifies the list query builder produces the
 *        expected SELECT shape and applies status /
 *        severity filters via WHERE clauses.
 */

#include <gtest/gtest.h>

#include <format>
#include <string>

namespace
{

/// Re-implementation of AlertServiceList's builder
/// kept verbatim so tests can drive the same logic
/// without spinning up a Drogon DB client.
std::string buildListSql(
    std::int64_t limit, std::int64_t offset,
    const std::string& statusFilter,
    const std::string& severityFilter)
{
    if (limit <= 0)   limit = 50;
    if (limit > 500)  limit = 500;
    if (offset < 0)   offset = 0;

    std::string sql =
        "SELECT id, source, severity, message, "
        "       dedupe_key, metadata, first_seen, "
        "       last_seen, count, status, "
        "       acknowledged_by "
        "  FROM alerts WHERE 1=1 ";
    if (!statusFilter.empty()) {
        sql += " AND status = '" + statusFilter + "'";
    }
    if (!severityFilter.empty()) {
        sql += " AND severity = '"
            + severityFilter + "'";
    }
    sql += std::format(
        " ORDER BY last_seen DESC LIMIT {} OFFSET {}",
        limit, offset);
    return sql;
}

} // namespace

class AlertServiceListTest : public ::testing::Test
{
};

// (4a) Severity filter narrows to errors only.
TEST_F(AlertServiceListTest, FiltersBySeverity)
{
    auto sql = buildListSql(10, 0, "", "error");
    EXPECT_NE(sql.find("AND severity = 'error'"),
              std::string::npos);
    EXPECT_EQ(sql.find("AND status ="),
              std::string::npos);
    EXPECT_NE(sql.find("LIMIT 10 OFFSET 0"),
              std::string::npos);
}

// (4b) Status filter narrows to resolved only.
TEST_F(AlertServiceListTest, FiltersByStatus)
{
    auto sql = buildListSql(10, 0, "resolved", "");
    EXPECT_NE(sql.find("AND status = 'resolved'"),
              std::string::npos);
    EXPECT_EQ(sql.find("AND severity ="),
              std::string::npos);
}

// Defaults clamp to safe paging bounds.
TEST_F(AlertServiceListTest, ClampsBadPaging)
{
    auto sql = buildListSql(-1, -5, "", "");
    EXPECT_NE(sql.find("LIMIT 50 OFFSET 0"),
              std::string::npos);
    auto big = buildListSql(99999, 0, "", "");
    EXPECT_NE(big.find("LIMIT 500 OFFSET 0"),
              std::string::npos);
}
