#pragma once
/**
 * @file glob_util.h
 * @brief Glob-to-regex conversion and pattern matching.
 */

#include <regex>
#include <string>
#include <vector>

namespace cmakegen
{

/**
 * @brief Convert a glob pattern (fnmatch-style) to a
 *        std::regex pattern.
 *
 * Supports '*' (any chars) and '?' (single char).
 *
 * @param glob The glob pattern string.
 * @return std::regex The compiled regex.
 */
inline std::regex globToRegex(const std::string& glob)
{
    std::string pattern;
    pattern.reserve(glob.size() * 2);
    for (char ch : glob) {
        switch (ch) {
        case '*':
            pattern += ".*";
            break;
        case '?':
            pattern += '.';
            break;
        case '.':
        case '(':
        case ')':
        case '[':
        case ']':
        case '+':
        case '^':
        case '$':
        case '|':
        case '{':
        case '}':
            pattern += '\\';
            pattern += ch;
            break;
        case '\\':
            pattern += "\\\\";
            break;
        default:
            pattern += ch;
            break;
        }
    }
    return std::regex(pattern, std::regex::icase);
}

/**
 * @brief Check if a filename matches any pattern in a list.
 *
 * @param filename  The filename to test.
 * @param patterns  List of glob pattern strings.
 * @return true if the filename matches at least one pattern.
 */
inline bool matchesAny(
    const std::string& filename,
    const std::vector<std::string>& patterns)
{
    for (const auto& pat : patterns) {
        if (std::regex_match(filename, globToRegex(pat))) {
            return true;
        }
    }
    return false;
}

} // namespace cmakegen
