'use client';

/**
 * Core renderer that builds a React tree from a
 * JSON page definition.
 * @module shared/components/json-renderer/JsonRenderer
 */
import { createElement, Fragment } from 'react';
import type { ReactElement } from 'react';
import type { PageDefinition } from './types';
import { useJsonPage } from './useJsonPage';
import { renderNode } from './renderHelpers';

/** Props for the JsonRenderer component. */
interface JsonRendererProps {
  /** The full page definition to render. */
  readonly definition: PageDefinition;
}

/**
 * Renders a full page from a PageDefinition.
 *
 * Executes page-level hooks via useJsonPage, then
 * recursively renders each node in the tree using
 * the component and hook registries.
 *
 * @param props - Contains the page definition.
 * @returns The rendered React tree.
 */
export default function JsonRenderer({
  definition,
}: JsonRendererProps): ReactElement {
  const state = useJsonPage(definition);

  return createElement(
    Fragment,
    null,
    ...definition.tree.map((node, idx) =>
      renderNode(node, state, idx),
    ),
  );
}
