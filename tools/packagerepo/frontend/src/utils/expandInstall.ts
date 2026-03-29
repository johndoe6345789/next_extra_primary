/** Variables available in install templates. */
interface InstallVars {
  ns: string;
  name: string;
  version: string;
  variant: string;
}

/**
 * Expand {var} placeholders in an install template.
 * Strips markdown code fences for inline rendering.
 */
export function expandInstall(
  template: string, vars: InstallVars,
): string {
  return template
    .replace(/\{ns\}/g, vars.ns)
    .replace(/\{name\}/g, vars.name)
    .replace(/\{version\}/g, vars.version)
    .replace(/\{variant\}/g, vars.variant)
    .replace(/```\w*/g, '')
    .trim();
}
