/**
 * @file TemplateRenderer.cpp
 * @brief Implementation of the tiny {{var}} substitution engine.
 */

#include "services/notifications/TemplateRenderer.h"

namespace nextra::notifications
{

std::string TemplateRenderer::render(
    const std::string& tmpl,
    const nlohmann::json& vars)
{
    std::string out;
    out.reserve(tmpl.size());
    std::size_t i = 0;
    while (i < tmpl.size())
    {
        if (i + 1 < tmpl.size()
            && tmpl[i] == '{' && tmpl[i + 1] == '{')
        {
            auto end = tmpl.find("}}", i + 2);
            if (end == std::string::npos)
            {
                out.append(tmpl, i, std::string::npos);
                break;
            }
            std::string key = tmpl.substr(
                i + 2, end - (i + 2));
            while (!key.empty() && key.front() == ' ')
                key.erase(key.begin());
            while (!key.empty() && key.back() == ' ')
                key.pop_back();
            if (vars.is_object() && vars.contains(key))
            {
                const auto& v = vars.at(key);
                if (v.is_string())
                    out += v.get<std::string>();
                else
                    out += v.dump();
            }
            i = end + 2;
        }
        else
        {
            out += tmpl[i++];
        }
    }
    return out;
}

RenderedMessage TemplateRenderer::renderMessage(
    const std::string& subject,
    const std::string& body,
    const nlohmann::json& vars)
{
    return {render(subject, vars), render(body, vars)};
}

}  // namespace nextra::notifications
