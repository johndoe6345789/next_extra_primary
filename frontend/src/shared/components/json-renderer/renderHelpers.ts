/**
 * Helper functions for rendering JSON component
 * tree nodes into React elements.
 * @module shared/components/json-renderer/renderHelpers
 */
import { createElement, Fragment } from 'react';
import type { ReactElement } from 'react';
import type { ComponentNode } from './types';
import { getComponent } from './registry';

/** Resolve a dotted key from a state object. */
export function resolve(
  state: Record<string, unknown>,
  key: string,
): unknown {
  return key.split('.').reduce<unknown>(
    (obj, k) =>
      (obj as Record<string, unknown>)?.[k],
    state,
  );
}

/** Resolve children: string or nested nodes. */
function resolveChildren(
  node: ComponentNode,
  state: Record<string, unknown>,
): ReactElement | string | null {
  if (!node.children) return null;
  if (typeof node.children === 'string') {
    return node.children;
  }
  return createElement(
    Fragment,
    null,
    ...node.children.map((c, i) =>
      renderNode(c, state, i),
    ),
  );
}

/**
 * Render a single ComponentNode into a
 * ReactElement using the component registry.
 * @param node - The node to render.
 * @param state - Aggregated hook state.
 * @param idx - Index for the React key.
 * @returns A ReactElement or null.
 */
export function renderNode(
  node: ComponentNode,
  state: Record<string, unknown>,
  idx: number,
): ReactElement | null {
  if (node.conditional) {
    const val = resolve(state, node.conditional);
    if (!val) return null;
  }

  const Comp = getComponent(node.component);
  if (!Comp) return null;

  const merged: Record<string, unknown> = {
    ...(node.props ?? {}),
    key: idx,
  };
  if (node.hook?.bind) {
    for (const [prop, key] of Object.entries(
      node.hook.bind,
    )) {
      merged[prop] = resolve(state, key);
    }
  }

  if (node.each && node.template) {
    const arr = resolve(state, node.each);
    if (!Array.isArray(arr)) return null;
    const items = arr.map((item, i) =>
      renderNode(
        node.template as ComponentNode,
        { ...state, item },
        i,
      ),
    );
    return createElement(Comp, merged, ...items);
  }

  const kids = resolveChildren(node, state);
  return createElement(Comp, merged, kids);
}
