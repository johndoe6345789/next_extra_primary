/**
 * @file test_blog_slug_collision.cpp
 * @brief Blog slug generator handles duplicates by
 *        appending a numeric suffix.
 */

#include <gtest/gtest.h>
#include <string>
#include <unordered_set>

namespace
{

std::string baseSlug(const std::string& title)
{
    std::string s;
    for (char c : title)
    {
        if (c >= 'A' && c <= 'Z') c += 32;
        if ((c >= 'a' && c <= 'z') ||
            (c >= '0' && c <= '9'))
            s += c;
        else if (!s.empty() && s.back() != '-')
            s += '-';
    }
    while (!s.empty() && s.back() == '-') s.pop_back();
    return s;
}

std::string uniqueSlug(
    const std::string& title,
    const std::unordered_set<std::string>& existing)
{
    auto base = baseSlug(title);
    if (!existing.count(base)) return base;
    for (int i = 2;; ++i)
    {
        auto s = base + "-" + std::to_string(i);
        if (!existing.count(s)) return s;
    }
}

} // namespace

class BlogSlugTest : public ::testing::Test
{
};

TEST_F(BlogSlugTest, BasicSlug)
{
    EXPECT_EQ(baseSlug("Hello World!"), "hello-world");
}

TEST_F(BlogSlugTest, NoCollision)
{
    EXPECT_EQ(uniqueSlug("Hello", {}), "hello");
}

TEST_F(BlogSlugTest, CollisionAppendsTwo)
{
    EXPECT_EQ(uniqueSlug("Hello", {"hello"}), "hello-2");
}

TEST_F(BlogSlugTest, MultipleCollisions)
{
    EXPECT_EQ(uniqueSlug("Hello",
                         {"hello", "hello-2", "hello-3"}),
              "hello-4");
}
