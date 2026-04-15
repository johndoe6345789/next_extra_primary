/**
 * @file test_ecommerce_cart_service.cpp
 * @brief CartService add/remove/total semantics.
 */

#include <gtest/gtest.h>
#include <string>
#include <unordered_map>

namespace
{

struct Cart
{
    struct Line { int qty; int priceCents; };
    std::unordered_map<std::string, Line> items;

    void add(const std::string& sku, int qty, int cents)
    {
        auto it = items.find(sku);
        if (it == items.end())
            items[sku] = {qty, cents};
        else
            it->second.qty += qty;
    }
    void remove(const std::string& sku)
    {
        items.erase(sku);
    }
    int total() const
    {
        int t = 0;
        for (const auto& [_, l] : items)
            t += l.qty * l.priceCents;
        return t;
    }
};

} // namespace

class CartServiceTest : public ::testing::Test
{
protected:
    Cart c;
};

TEST_F(CartServiceTest, AddLineAccumulatesQty)
{
    c.add("a", 2, 100);
    c.add("a", 3, 100);
    EXPECT_EQ(c.items["a"].qty, 5);
}

TEST_F(CartServiceTest, RemoveDropsLine)
{
    c.add("a", 1, 50);
    c.remove("a");
    EXPECT_EQ(c.items.size(), 0u);
}

TEST_F(CartServiceTest, TotalSumsLines)
{
    c.add("a", 2, 100);
    c.add("b", 1, 250);
    EXPECT_EQ(c.total(), 450);
}

TEST_F(CartServiceTest, EmptyCartTotalZero)
{
    EXPECT_EQ(c.total(), 0);
}
