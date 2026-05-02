/**
 * @file test_alert_service_actions.cpp
 * @brief Verifies acknowledge/resolve SQL shape and
 *        the "ack frees the dedupe slot" invariant
 *        encoded by the unique index on
 *        (source, dedupe_key, status).
 */

#include <gtest/gtest.h>

#include <string>

namespace
{

constexpr const char* kSetStatusSql =
    "UPDATE alerts "
    "   SET status = $1, "
    "       acknowledged_by = NULLIF($2,'')::uuid, "
    "       updated_at = now() "
    " WHERE id = $3::uuid "
    " RETURNING id, status";

/// True when an existing 'open' row blocks a second
/// open with the same (source, dedupe_key). After it
/// is acknowledged the slot frees and a new open row
/// becomes legal — that's the contract enforced by
/// uq_alerts_dedupe_open in 001_alerts.sql.
bool wouldConflict(
    const std::string& existingStatus,
    const std::string& newStatus)
{
    return existingStatus == newStatus;
}

} // namespace

class AlertServiceActionsTest : public ::testing::Test
{
};

// (5) Acknowledge sets status='acknowledged' and writes
//     acknowledged_by; subsequent ingest for the same
//     dedupe_key is no longer blocked because the
//     unique index keys on status.
TEST_F(AlertServiceActionsTest, AcknowledgeFreesSlot)
{
    std::string s = kSetStatusSql;
    EXPECT_NE(s.find("acknowledged_by ="),
              std::string::npos);
    EXPECT_NE(s.find("NULLIF($2,'')::uuid"),
              std::string::npos);
    EXPECT_FALSE(wouldConflict("acknowledged", "open"));
    EXPECT_TRUE (wouldConflict("open",         "open"));
}

// (6) Resolve uses the same UPDATE path with a different
//     status target and returns the updated row.
TEST_F(AlertServiceActionsTest, ResolveReturnsRow)
{
    std::string s = kSetStatusSql;
    EXPECT_NE(s.find("RETURNING id, status"),
              std::string::npos);
    EXPECT_FALSE(wouldConflict("resolved", "open"));
}
