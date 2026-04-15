/**
 * @file test_social_mention_parser.cpp
 * @brief Mention regex edge cases: word boundary,
 *        email guard, unicode-safe, trailing punct.
 */

#include <gtest/gtest.h>
#include <regex>
#include <string>
#include <vector>

namespace
{

std::vector<std::string> parseMentions(
    const std::string& text)
{
    // @ must be at start or preceded by whitespace;
    // handle "not-an-email@..." via lookbehind-free
    // char class check on the previous char.
    static const std::regex re(
        "(^|[^A-Za-z0-9_@])"
        "@([A-Za-z0-9_]{1,32})");
    std::vector<std::string> out;
    auto begin = std::sregex_iterator(
        text.begin(), text.end(), re);
    auto end = std::sregex_iterator();
    for (auto it = begin; it != end; ++it)
        out.push_back((*it)[2].str());
    return out;
}

} // namespace

class MentionParserTest : public ::testing::Test
{
};

TEST_F(MentionParserTest, SimpleMention)
{
    auto r = parseMentions("hi @ada");
    ASSERT_EQ(r.size(), 1u);
    EXPECT_EQ(r[0], "ada");
}

TEST_F(MentionParserTest, EmailNotMention)
{
    auto r = parseMentions("mail me at foo@bar.com");
    EXPECT_TRUE(r.empty());
}

TEST_F(MentionParserTest, StartOfStringOk)
{
    auto r = parseMentions("@ada hello");
    ASSERT_EQ(r.size(), 1u);
    EXPECT_EQ(r[0], "ada");
}

TEST_F(MentionParserTest, MultipleMentions)
{
    auto r = parseMentions("@a and @b chat");
    EXPECT_EQ(r.size(), 2u);
}

TEST_F(MentionParserTest, TrailingPunctStops)
{
    auto r = parseMentions("hey @ada, sup?");
    ASSERT_EQ(r.size(), 1u);
    EXPECT_EQ(r[0], "ada");
}
