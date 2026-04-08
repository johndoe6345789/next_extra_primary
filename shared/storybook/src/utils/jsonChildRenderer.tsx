/**
 * Child rendering for JSON template nodes.
 */

import React from 'react';
import type { RenderContext }
  from './jsonRendererTypes';
import { evaluateExpression }
  from './jsonExpressionEval';

/**
 * Render children of a template node.
 *
 * @param node - The template node.
 * @param context - The render context.
 * @param renderFn - Template render function.
 */
export function renderChildren(
  node: Record<string, unknown>,
  context: RenderContext,
  renderFn: (
    n: unknown, c: RenderContext,
  ) => React.ReactElement,
): React.ReactNode {
  if (!node.children) return null;

  if (typeof node.children === 'string') {
    return evaluateExpression(
      node.children, context,
    );
  }

  if (Array.isArray(node.children)) {
    return node.children.map(
      (child: unknown, index: number) => {
        if (typeof child === 'string') {
          return evaluateExpression(
            child, context,
          );
        }
        return (
          <React.Fragment key={index}>
            {renderFn(child, context)}
          </React.Fragment>
        );
      },
    );
  }

  return renderFn(node.children, context);
}
