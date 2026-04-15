/**
 * @file markdown_renderer.cpp
 * @brief Minimal Markdown -> HTML implementation.
 */

#include "MarkdownRenderer.h"
#include "markdown_helpers.h"

#include <sstream>
#include <string>

namespace nextra::blog
{

std::string renderMarkdown(const std::string& md)
{
    std::stringstream in(md), out;
    std::string line;
    bool inCode = false, inList = false, inPara = false;
    auto closePara = [&]{
        if (inPara) { out << "</p>\n"; inPara = false; } };
    auto closeList = [&]{
        if (inList) { out << "</ul>\n"; inList = false; } };
    while (std::getline(in, line))
    {
        if (line.rfind("```", 0) == 0)
        {
            closePara(); closeList();
            out << (inCode ? "</code></pre>\n"
                           : "<pre><code>\n");
            inCode = !inCode; continue;
        }
        if (inCode) { out << mdEscape(line) << "\n"; continue; }
        if (line.empty()) { closePara(); closeList(); continue; }
        int h = mdHeading(line);
        if (h > 0)
        {
            closePara(); closeList();
            out << "<h" << h << ">"
                << mdInline(line.substr(h + 1))
                << "</h" << h << ">\n";
            continue;
        }
        if (line.rfind("- ", 0) == 0)
        {
            closePara();
            if (!inList) { out << "<ul>\n"; inList = true; }
            out << "<li>" << mdInline(line.substr(2))
                << "</li>\n";
            continue;
        }
        closeList();
        if (!inPara) { out << "<p>"; inPara = true; }
        else out << " ";
        out << mdInline(line);
    }
    closePara(); closeList();
    if (inCode) out << "</code></pre>\n";
    return out.str();
}

}  // namespace nextra::blog
