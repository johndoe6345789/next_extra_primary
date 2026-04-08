/**
 * Style loading and injection utilities.
 */

import { compileToCSS } from './compiler';

/**
 * Load and compile styles from a package.
 */
export async function loadPackageStyles(
  packageId: string,
): Promise<string> {
  try {
    const response = await fetch(
      `/packages/${packageId}/seed/styles.json`,
    );
    const schema = await response.json();

    if (schema.schema_version || schema.package) {
      return compileToCSS(schema);
    }
    return schema
      .map((entry: { css?: string }) =>
        entry.css || '')
      .join('\n\n');
  } catch (error) {
    console.error(
      `Failed to load styles for `
      + `package ${packageId}:`,
      error,
    );
    return '';
  }
}

/**
 * Inject compiled CSS into the page.
 */
export function injectStyles(
  packageId: string,
  css: string,
) {
  const styleId = `styles-${packageId}`;

  let styleEl = document.getElementById(
    styleId,
  ) as HTMLStyleElement;

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.dataset.package = packageId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
}

/**
 * Load and inject package styles.
 */
export async function loadAndInjectStyles(
  packageId: string,
) {
  const css = await loadPackageStyles(packageId);
  injectStyles(packageId, css);
  return css;
}
