#pragma once

/**
 * @file MarkdownRenderer.h
 * @brief Tiny Markdown -> HTML renderer.
 *
 * This is a deliberately minimal subset — enough for article
 * bodies written in the editor.  It supports:
 *
 *   - ATX headings (# .. ######)
 *   - Paragraphs (blank-line separated)
 *   - Unordered lists (leading `- `)
 *   - Fenced code blocks (```)
 *   - Inline code (`), bold (**), italic (*)
 *   - Autolinked bare URLs
 *
 * No external dependency; full cmark-gfm integration is a later
 * optimisation and is NOT required for the Phase 4.6 MVP.
 */

#include <string>

namespace nextra::blog
{

/**
 * @brief Render a Markdown source string to HTML.
 * @param md Raw Markdown input.
 * @return   Escaped, sanitised HTML ready to be written to
 *           articles.body_html.
 */
std::string renderMarkdown(const std::string& md);

}  // namespace nextra::blog
