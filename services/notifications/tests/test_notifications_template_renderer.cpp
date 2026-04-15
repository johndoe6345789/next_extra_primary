/**
 * @file test_notifications_template_renderer.cpp
 * @brief {{var}} substitution with missing-var handling.
 */

#include <gtest/gtest.h>
#include <string>
#include <unordered_map>

namespace
{

std::string render(
    const std::string& tpl,
    const std::unordered_map<std::string, std::string>& v)
{
    std::string out;
    size_t i = 0;
    while (i < tpl.size())
    {
        auto open = tpl.find("{{", i);
        if (open == std::string::npos)
        {
            out.append(tpl, i, std::string::npos);
            break;
        }
        out.append(tpl, i, open - i);
        auto close = tpl.find("}}", open);
        if (close == std::string::npos) break;
        std::string key =
            tpl.substr(open + 2, close - open - 2);
        auto it = v.find(key);
        out += (it == v.end()) ? "" : it->second;
        i = close + 2;
    }
    return out;
}

} // namespace

class TemplateRendererTest : public ::testing::Test
{
};

TEST_F(TemplateRendererTest, SubstitutesVar)
{
    EXPECT_EQ(render("Hi {{name}}!", {{"name", "Ada"}}),
              "Hi Ada!");
}

TEST_F(TemplateRendererTest, MissingVarBecomesEmpty)
{
    EXPECT_EQ(render("Hi {{name}}!", {}), "Hi !");
}

TEST_F(TemplateRendererTest, MultipleVars)
{
    EXPECT_EQ(
        render("{{a}}-{{b}}", {{"a", "1"}, {"b", "2"}}),
        "1-2");
}

TEST_F(TemplateRendererTest, NoVarsPlain)
{
    EXPECT_EQ(render("plain", {}), "plain");
}
