/**
 * @file test_wiki_markdown_sanitize.cpp
 * @brief Markdown render output sanitizer strips
 *        <script> and on* handlers.
 */

#include <gtest/gtest.h>
#include <regex>
#include <string>

namespace
{

std::string sanitize(std::string html)
{
    static const std::regex script(
        "<script[^>]*>.*?</script>",
        std::regex::icase);
    static const std::regex onAttr(
        " on[a-z]+=\"[^\"]*\"", std::regex::icase);
    html = std::regex_replace(html, script, "");
    html = std::regex_replace(html, onAttr, "");
    return html;
}

} // namespace

class WikiSanitizeTest : public ::testing::Test
{
};

TEST_F(WikiSanitizeTest, StripsScriptTag)
{
    auto r = sanitize("<p>hi</p><script>alert(1)</script>");
    EXPECT_EQ(r, "<p>hi</p>");
}

TEST_F(WikiSanitizeTest, StripsOnClick)
{
    auto r =
        sanitize("<a href=\"/\" onclick=\"x()\">x</a>");
    EXPECT_EQ(r.find("onclick"), std::string::npos);
}

TEST_F(WikiSanitizeTest, BenignHtmlUntouched)
{
    auto in = std::string("<p><em>hi</em></p>");
    EXPECT_EQ(sanitize(in), in);
}
