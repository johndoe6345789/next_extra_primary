/**
 * Types for the JSON component renderer.
 */

/** Context object for template rendering. */
export interface RenderContext {
  [key: string]: unknown;
}

/** Map of JSON types to HTML element names. */
export const ELEMENT_TYPE_MAP: Record<
  string, string
> = {
  Box: 'div',
  Stack: 'div',
  Text: 'span',
  Button: 'button',
  Link: 'a',
  List: 'ul',
  ListItem: 'li',
  ListItemButton: 'div',
  ListItemIcon: 'div',
  ListItemText: 'div',
  Icon: 'span',
  Avatar: 'div',
  Badge: 'div',
  Divider: 'hr',
  Collapse: 'div',
  Breadcrumbs: 'nav',
};

/**
 * Get HTML element type for a JSON component type.
 */
export function getElementType(
  type: string,
): string {
  return ELEMENT_TYPE_MAP[type] || type;
}
