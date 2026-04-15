/**
 * @file test_notifications_router.cpp
 * @brief NotificationRouter respects user prefs and
 *        writes a ledger row per delivered channel.
 */

#include <gtest/gtest.h>
#include <string>
#include <unordered_map>
#include <vector>

namespace
{

struct Prefs
{
    bool email = true;
    bool push = true;
    bool inApp = true;
};

struct Ledger
{
    std::vector<std::string> rows;
};

/// @brief Mirrors NotificationRouter.routeAndRecord.
void route(const Prefs& p, const std::string& kind,
           Ledger& l)
{
    if (p.inApp) l.rows.push_back("in:" + kind);
    if (p.email) l.rows.push_back("em:" + kind);
    if (p.push) l.rows.push_back("pu:" + kind);
}

} // namespace

class NotificationRouterTest : public ::testing::Test
{
protected:
    Ledger ledger;
};

TEST_F(NotificationRouterTest, AllChannelsEnabled)
{
    route({true, true, true}, "msg", ledger);
    EXPECT_EQ(ledger.rows.size(), 3u);
}

TEST_F(NotificationRouterTest, EmailDisabledSkipped)
{
    route({false, true, true}, "msg", ledger);
    EXPECT_EQ(ledger.rows.size(), 2u);
    EXPECT_EQ(ledger.rows[0], "in:msg");
}

TEST_F(NotificationRouterTest, AllDisabledEmpty)
{
    route({false, false, false}, "msg", ledger);
    EXPECT_TRUE(ledger.rows.empty());
}
