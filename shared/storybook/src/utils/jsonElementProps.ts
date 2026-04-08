/**
 * Element prop builder for JSON template nodes.
 */

import type { RenderContext }
  from './jsonRendererTypes';
import { evaluateExpression }
  from './jsonExpressionEval';

/**
 * Build React element props from a template node.
 */
export function buildElementProps(
  node: Record<string, unknown>,
  context: RenderContext,
): Record<string, unknown> {
  const props: Record<string, unknown> = {
    className: node.className,
  };

  if (node.style) {
    props.style = node.style;
  }

  if (node.href) {
    props.href = evaluateExpression(
      node.href, context,
    );
  }

  if (node.src) {
    props.src = evaluateExpression(
      node.src, context,
    );
  }

  if (node.alt) {
    props.alt = evaluateExpression(
      node.alt, context,
    );
  }

  return props;
}
