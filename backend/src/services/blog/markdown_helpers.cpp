/**
 * @file markdown_helpers.cpp
 * @brief Escape / inline / heading helpers.
 */

#include "markdown_helpers.h"

#include <regex>

namespace nextra::blog
{

std::string mdEscape(const std::string& s)
{
    std::string o;
    o.reserve(s.size());
    for (char c : s)
    {
        switch (c)
        {
            case '&': o += "&amp;";  break;
            case '<': o += "&lt;";   break;
            case '>': o += "&gt;";   break;
            case '"': o += "&quot;"; break;
            default:  o += c;
        }
    }
    return o;
}

std::string mdInline(const std::string& line)
{
    std::string s = mdEscape(line);
    s = std::regex_replace(s,
        std::regex(R"(`([^`]+)`)"), "<code>$1</code>");
    s = std::regex_replace(s,
        std::regex(R"(\*\*([^*]+)\*\*)"),
        "<strong>$1</strong>");
    s = std::regex_replace(s,
        std::regex(R"(\*([^*]+)\*)"), "<em>$1</em>");
    s = std::regex_replace(s,
        std::regex(R"((https?://\S+))"),
        "<a href=\"$1\">$1</a>");
    return s;
}

int mdHeading(const std::string& l)
{
    int n = 0;
    while (n < 6 && n < (int)l.size() && l[n] == '#') ++n;
    if (n == 0 || n >= (int)l.size() || l[n] != ' ') return 0;
    return n;
}

}  // namespace nextra::blog
