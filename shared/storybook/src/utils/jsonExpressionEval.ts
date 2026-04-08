/**
 * Expression evaluation for JSON templates.
 * Supports {{variable}} template syntax.
 */

import type { RenderContext }
  from './jsonRendererTypes';

/** Evaluate template expressions. */
export function evaluateExpression(
  expr: unknown,
  context: RenderContext,
): unknown {
  if (typeof expr !== 'string') {
    return expr;
  }

  const match = expr.match(/^\{\{(.+)\}\}$/);
  if (match) {
    const expression = match[1].trim();
    try {
      return evaluateSimpleExpression(
        expression, context,
      );
    } catch (error) {
      console.warn(
        `Failed to evaluate: ${expression}`,
        error,
      );
      return expr;
    }
  }

  return expr;
}

/**
 * Evaluate simple expressions safely.
 * Supports property access, ternary, negation.
 */
export function evaluateSimpleExpression(
  expr: string,
  context: RenderContext,
): unknown {
  const parts = expr.split('.');
  let value: unknown = context;

  for (const part of parts) {
    if (part.includes('?')) {
      return evaluateTernary(part, context);
    }

    if (part.startsWith('!')) {
      const innerPart = part.substring(1);
      const obj = value as Record<string, unknown>;
      value = obj?.[innerPart];
      return !value;
    }

    if (
      value
      && typeof value === 'object'
    ) {
      value =
        (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/** Evaluate a ternary expression. */
function evaluateTernary(
  part: string, ctx: RenderContext,
): unknown {
  const [cond, branches] = part.split('?');
  const [tBranch, fBranch] = branches.split(':');
  const val = evaluateSimpleExpression(
    cond.trim(), ctx,
  );
  return val
    ? evaluateSimpleExpression(tBranch.trim(), ctx)
    : evaluateSimpleExpression(fBranch.trim(), ctx);
}
