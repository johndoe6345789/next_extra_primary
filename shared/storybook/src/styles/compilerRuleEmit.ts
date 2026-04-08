/**
 * Rule and responsive compilation helpers.
 */

import type {
  StylesSchemaV2, Rule,
} from './compilerTypes';
import { buildSelector } from './compilerSelectors';
import {
  compileEffectProperties,
  compileTransition,
} from './compilerEffects';
import {
  compileAppearanceById,
} from './compilerAppearance';

/** Compile a single rule to CSS lines. */
export function emitRule(
  rule: Rule,
  schema: StylesSchemaV2,
  css: string[],
): void {
  const sel = buildSelector(
    schema.selectors,
    rule.selector,
    schema.package || '',
  );
  if (!sel) return;

  css.push(`${sel} {`);

  if (rule.effects) {
    const e = compileEffectProperties(
      schema.effects, rule.effects.ref,
    );
    if (e) css.push(e);
  }

  if (rule.appearance) {
    const a = compileAppearanceById(
      schema.appearance, rule.appearance.ref,
    );
    if (a) css.push(a);
  }

  if (rule.transition) {
    const t = compileTransition(
      schema.transitions, rule.transition.ref,
    );
    if (t) css.push(t);
  }

  css.push('}');
  css.push('');
}

/** Compile responsive media queries. */
export function emitResponsive(
  schema: StylesSchemaV2,
  css: string[],
): void {
  schema.environments?.forEach((env) => {
    if (!env.conditions.viewport) return;

    const mq: string[] = [];
    const vp = env.conditions.viewport;

    if (vp.minWidth) {
      const { value, unit } = vp.minWidth;
      mq.push(`min-width: ${value}${unit}`);
    }
    if (vp.maxWidth) {
      const { value, unit } = vp.maxWidth;
      mq.push(`max-width: ${value}${unit}`);
    }

    if (mq.length > 0) {
      css.push(
        `@media (${mq.join(' and ')}) {`,
      );
      css.push('}');
      css.push('');
    }
  });
}
