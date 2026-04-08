/**
 * Effect and transition compilation for the
 * V2 schema compiler.
 */

import type { Effect, Transition } from './compilerTypes';
import {
  convertPropertyName,
  convertPropertyValue,
} from './compilerValueConvert';

/**
 * Compile effect properties to CSS declarations.
 */
export function compileEffectProperties(
  effects: Effect[] | undefined,
  effectId: string,
): string {
  const effect = effects?.find(
    (e) => e.id === effectId,
  );
  if (!effect) return '';

  const properties: string[] = [];

  Object.entries(effect.properties).forEach(
    ([prop, value]) => {
      const cssProperty = convertPropertyName(prop);
      const cssValue = convertPropertyValue(value);

      if (cssValue) {
        properties.push(
          `  ${cssProperty}: ${cssValue};`,
        );
      }
    },
  );

  return properties.join('\n');
}

/**
 * Compile a transition definition to CSS.
 */
export function compileTransition(
  transitions: Transition[] | undefined,
  transitionId: string,
): string {
  const transition = transitions?.find(
    (t) => t.id === transitionId,
  );
  if (!transition) return '';

  const properties = transition.properties
    .map((p) => convertPropertyName(p))
    .join(', ');
  const duration =
    `${transition.duration.value}`
    + `${transition.duration.unit}`;
  const easing = transition.easing;

  return `  transition: `
    + `${properties} ${duration} ${easing};`;
}
