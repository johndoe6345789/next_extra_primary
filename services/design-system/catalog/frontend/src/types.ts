/**
 * Shared types for the component viewer tool.
 * @module componentviewer/types
 */

/** Allowed prop control types for the editor. */
export type PropType =
  | 'string'
  | 'boolean'
  | 'enum'
  | 'number';

/** Describes a single editable prop. */
export interface PropDef {
  /** Prop name matching the component API. */
  readonly name: string;
  /** Control type rendered in PropEditor. */
  readonly type: PropType;
  /** Default value for the prop. */
  readonly defaultValue: string | boolean | number;
  /** Allowed values when type is 'enum'. */
  readonly options?: readonly string[];
  /** Human-readable description. */
  readonly description: string;
}

/** A named variant preset for a component. */
export interface VariantDef {
  /** Display label for the variant. */
  readonly label: string;
  /** Props applied for this variant. */
  readonly props: Readonly<Record<string, unknown>>;
}

/** Component category for sidebar grouping. */
export type Category =
  | 'Inputs'
  | 'Surfaces'
  | 'Layout'
  | 'Data Display'
  | 'Feedback'
  | 'Navigation';

/** Full JSON definition for one component. */
export interface ComponentDef {
  /** Display name, e.g. 'Button'. */
  readonly name: string;
  /** Sidebar category group. */
  readonly category: Category;
  /** Short description of the component. */
  readonly description: string;
  /** Editable prop definitions. */
  readonly props: readonly PropDef[];
  /** Preset variant configurations. */
  readonly variants: readonly VariantDef[];
}
