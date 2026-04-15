#pragma once

/**
 * @file markdown_helpers.h
 * @brief Internal helpers for markdown_renderer.cpp.
 */

#include <string>

namespace nextra::blog
{

/// HTML-escape the five special characters.
std::string mdEscape(const std::string& s);

/// Render inline formatting (code, bold, italic, links).
std::string mdInline(const std::string& line);

/// Return the heading level 1..6 or 0 if not a heading.
int mdHeading(const std::string& line);

}  // namespace nextra::blog
