/**
 * Template rendering for JSON components.
 */

import React from 'react';
import type { RenderContext }
  from './jsonRendererTypes';
import { getElementType }
  from './jsonRendererTypes';
import { evaluateExpression }
  from './jsonExpressionEval';
import { buildElementProps }
  from './jsonElementProps';
import { renderChildren }
  from './jsonChildRenderer';

/** Render a template node to React. */
export function renderTemplate(
  node: unknown,
  context: RenderContext,
): React.ReactElement {
  if (!node || typeof node !== 'object') {
    return <>{String(node)}</>;
  }

  const n = node as Record<string, unknown>;

  if (n.type === 'conditional') {
    return renderConditional(n, context);
  }

  if (n.type === 'component') {
    return (
      <div
        className="component-placeholder"
        data-component={n.name as string}
      >
        [{n.name as string}]
      </div>
    );
  }

  const ElementType = getElementType(
    n.type as string,
  );
  const children = renderChildren(
    n, context, renderTemplate,
  );
  const elementProps = buildElementProps(
    n, context,
  );

  return (
    <ElementType {...elementProps}>
      {children}
    </ElementType>
  );
}

/** Render a conditional template node. */
function renderConditional(
  node: Record<string, unknown>,
  context: RenderContext,
): React.ReactElement {
  const condition = evaluateExpression(
    node.condition, context,
  );
  if (condition && node.then) {
    return renderTemplate(node.then, context);
  }
  if (!condition && node.else) {
    return renderTemplate(node.else, context);
  }
  return <></>;
}
