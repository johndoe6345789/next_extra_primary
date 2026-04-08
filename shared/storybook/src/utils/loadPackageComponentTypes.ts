/**
 * Types for the package component loader.
 */

/** A single component definition node. */
export interface ComponentDefinition {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentDefinition[];
  className?: string;
  style?: Record<string, unknown>;
  text?: string;
}

/** Loaded components for a package. */
export interface PackageComponents {
  packageId: string;
  components: Record<string, ComponentDefinition>;
}

/** Map of JSON types to HTML elements. */
export const ELEMENT_MAP: Record<string, string> = {
  Text: 'span',
  Heading: 'h1',
  Button: 'button',
  Card: 'div',
  Box: 'div',
  Section: 'section',
  Nav: 'nav',
  Input: 'input',
  Table: 'table',
  TableRow: 'tr',
  TableCell: 'td',
  Badge: 'span',
};
