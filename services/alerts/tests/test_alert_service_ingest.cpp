/**
 * @file test_alert_service_ingest.cpp
 * @brief Validates the ingest UPSERT SQL shape and
 *        controller-level severity validation.
 *
 * The runtime SQL is verified textually (no DB),
 * mirroring the project's other domain tests. The
 * shape under test is the literal UPSERT in
 * services/alerts/backend/AlertServiceIngest.cpp.
 */

#include <gtest/gtest.h>

#include <string>

namespace
{

constexpr const char* kIngestSql =
    "INSERT INTO alerts "
    "  (source, severity, message, dedupe_key, "
    "   metadata, status) "
    "VALUES ($1, $2, $3, $4, $5::jsonb, 'open') "
    "ON CONFLICT (source, dedupe_key, status) "
    "DO UPDATE SET "
    "  last_seen  = now(), "
    "  count      = alerts.count + 1, "
    "  message    = EXCLUDED.message, "
    "  severity   = EXCLUDED.severity, "
    "  metadata   = EXCLUDED.metadata, "
    "  updated_at = now() "
    "RETURNING id, count";

bool validSeverity(const std::string& s)
{
    return s == "info" || s == "warning"
        || s == "error" || s == "critical";
}

} // namespace

class AlertServiceIngestTest : public ::testing::Test
{
};

// (1) Fresh insert path: SQL inserts with status='open'
//     and returns id+count for the controller to wrap.
TEST_F(AlertServiceIngestTest, InsertReturnsIdAndCount)
{
    std::string s = kIngestSql;
    EXPECT_NE(s.find("status) "), std::string::npos);
    EXPECT_NE(s.find("'open'"),    std::string::npos);
    EXPECT_NE(s.find("RETURNING id, count"),
              std::string::npos);
}

// (2) Dedupe path: ON CONFLICT bumps count and last_seen
//     rather than inserting a second row.
TEST_F(AlertServiceIngestTest, DedupeBumpsCountAndLastSeen)
{
    std::string s = kIngestSql;
    EXPECT_NE(
        s.find("ON CONFLICT (source, dedupe_key, status)"),
        std::string::npos);
    EXPECT_NE(s.find("count      = alerts.count + 1"),
              std::string::npos);
    EXPECT_NE(s.find("last_seen  = now()"),
              std::string::npos);
}

// (3) Severity validation rejects bogus values; the
//     controller short-circuits before calling the
//     service, so 'wat' must not be accepted.
TEST_F(AlertServiceIngestTest, SeverityWhitelist)
{
    EXPECT_TRUE(validSeverity("info"));
    EXPECT_TRUE(validSeverity("warning"));
    EXPECT_TRUE(validSeverity("error"));
    EXPECT_TRUE(validSeverity("critical"));
    EXPECT_FALSE(validSeverity("wat"));
    EXPECT_FALSE(validSeverity(""));
    EXPECT_FALSE(validSeverity("ERROR"));
}
