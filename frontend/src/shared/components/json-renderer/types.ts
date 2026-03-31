/**
 * TypeScript types for the JSON component tree
 * schema used by the declarative page renderer.
 * @module shared/components/json-renderer/types
 */

/** Binds a hook to a component or page. */
export interface HookBinding {
  /** Hook name from the registry. */
  readonly name: string;
  /** Optional arguments passed to the hook. */
  readonly args?: readonly unknown[];
  /** Maps hook return keys to component props. */
  readonly bind?: Readonly<Record<string, string>>;
}

/** A single node in the JSON component tree. */
export interface ComponentNode {
  /** M3 component name: 'Box', 'Typography', etc. */
  readonly component: string;
  /** Props forwarded to the component. */
  readonly props?: Readonly<Record<string, unknown>>;
  /** Text content or nested child nodes. */
  readonly children?: string | readonly ComponentNode[];
  /** Optional hook binding for this node. */
  readonly hook?: HookBinding;
  /** Show/hide based on a hook state key. */
  readonly conditional?: string;
  /** Map over an array from hook state. */
  readonly each?: string;
  /** Template node used when `each` is set. */
  readonly template?: ComponentNode;
}

/** Top-level JSON page definition. */
export interface PageDefinition {
  /** Layout variant identifier. */
  readonly layout?: string;
  /** Page-level hooks executed on mount. */
  readonly hooks?: readonly HookBinding[];
  /** The component tree to render. */
  readonly tree: readonly ComponentNode[];
}

/** A React hook function signature. */
export type HookFn =
  (...args: readonly unknown[]) => Record<string, unknown>;

/** Maps string names to React component types. */
export type ComponentMap =
  Record<string, React.ComponentType<Record<string, unknown>>>;

/** Maps string names to hook functions. */
export type HookMap = Record<string, HookFn>;
