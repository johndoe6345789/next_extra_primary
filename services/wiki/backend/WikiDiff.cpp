/**
 * @file WikiDiff.cpp
 * @brief Naive line-based diff. Good enough for
 *        small wiki pages; replace with Myers if
 *        performance becomes a concern.
 */

#include "WikiDiff.h"
#include <sstream>
#include <vector>

namespace services::wiki
{

static std::vector<std::string> splitLines(
    const std::string& s)
{
    std::vector<std::string> out;
    std::stringstream ss(s);
    std::string line;
    while (std::getline(ss, line)) {
        out.push_back(line);
    }
    return out;
}

json lineDiff(const std::string& oldBody,
              const std::string& newBody)
{
    auto a = splitLines(oldBody);
    auto b = splitLines(newBody);
    std::size_t pre = 0;
    while (pre < a.size() && pre < b.size()
           && a[pre] == b[pre]) {
        ++pre;
    }
    std::size_t suf = 0;
    while (suf < (a.size() - pre)
           && suf < (b.size() - pre)
           && a[a.size() - 1 - suf]
                  == b[b.size() - 1 - suf]) {
        ++suf;
    }
    auto out = json::array();
    for (std::size_t i = 0; i < pre; ++i) {
        out.push_back(
            {{"op", "="}, {"line", a[i]}});
    }
    for (std::size_t i = pre;
         i < a.size() - suf; ++i) {
        out.push_back(
            {{"op", "-"}, {"line", a[i]}});
    }
    for (std::size_t i = pre;
         i < b.size() - suf; ++i) {
        out.push_back(
            {{"op", "+"}, {"line", b[i]}});
    }
    for (std::size_t i = a.size() - suf;
         i < a.size(); ++i) {
        out.push_back(
            {{"op", "="}, {"line", a[i]}});
    }
    return out;
}

} // namespace services::wiki
