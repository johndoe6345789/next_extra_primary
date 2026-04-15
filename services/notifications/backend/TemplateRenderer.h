#pragma once
/**
 * @file TemplateRenderer.h
 * @brief Minimal {{var}} substitution engine for notification
 *        templates.
 *
 * Templates are stored in `notification_templates(key, subject,
 * body)` and rendered at dispatch time.  The engine is
 * deliberately tiny — no conditionals, no loops, no partials —
 * because the template editor lives in an operator tool and power
 * users who need complex rendering should render client-side and
 * post the pre-rendered body into the `data` envelope.
 */

#include "NotificationTypes.h"

#include <string>

namespace nextra::notifications
{

class TemplateRenderer
{
  public:
    /**
     * @brief Replace every `{{name}}` occurrence in @p tmpl with
     *        the matching field in @p vars.
     * @param tmpl Template string (subject or body).
     * @param vars JSON object of variable bindings.
     * @return Rendered string with known vars substituted.
     */
    static std::string render(
        const std::string& tmpl,
        const nlohmann::json& vars);

    /**
     * @brief Render both subject and body of a template pair.
     */
    static RenderedMessage renderMessage(
        const std::string& subject,
        const std::string& body,
        const nlohmann::json& vars);
};

}  // namespace nextra::notifications
