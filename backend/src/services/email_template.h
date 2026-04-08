#pragma once
/**
 * @file email_template.h
 * @brief Template loading and rendering for
 *        EmailService.
 */

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <fstream>
#include <string>

namespace services
{

using json = nlohmann::json;

/**
 * @brief Load email templates from JSON file.
 * @return Parsed JSON or empty object on failure.
 */
inline auto loadEmailTemplates() -> json
{
    try {
        std::ifstream ifs(
            "src/constants/email-templates.json");
        if (!ifs.is_open()) {
            ifs.open("backend/src/constants/"
                     "email-templates.json");
        }
        if (ifs.is_open()) {
            auto tpls = json::parse(ifs);
            spdlog::info(
                "Loaded {} email template(s)",
                tpls.size());
            return tpls;
        }
        spdlog::warn(
            "email-templates.json not found");
    } catch (const std::exception& e) {
        spdlog::error(
            "Failed to load email templates: {}",
            e.what());
    }
    return json::object();
}

/**
 * @brief Render `{{key}}` placeholders in a template.
 * @param templateHtml The HTML template string.
 * @param vars         Key-value replacement map.
 * @return Rendered HTML string.
 */
inline auto renderEmailTemplate(
    const std::string& templateHtml,
    const json& vars) -> std::string
{
    std::string result = templateHtml;
    for (auto& [key, value] : vars.items()) {
        std::string ph = "{{" + key + "}}";
        std::string rep = value.is_string()
                              ? value.get<std::string>()
                              : value.dump();
        std::string::size_type pos = 0;
        while ((pos = result.find(ph, pos)) !=
               std::string::npos) {
            result.replace(pos, ph.size(), rep);
            pos += rep.size();
        }
    }
    return result;
}

} // namespace services
