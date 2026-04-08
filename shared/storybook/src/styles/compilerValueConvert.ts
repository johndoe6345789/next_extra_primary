/**
 * CSS value conversion utilities for the
 * V2 schema compiler.
 */

import { compileTransformValue }
  from './compilerTransform';

/** Convert camelCase property to kebab-case. */
export function convertPropertyName(
  prop: string,
): string {
  return prop
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();
}

/** Convert typed property value to CSS string. */
export function convertPropertyValue(
  value: unknown,
): string {
  if (!value) return '';

  const v = value as Record<string, unknown>;

  if (v.token) {
    return `var(--color-${v.token})`;
  }

  if (v.value !== undefined && v.unit) {
    return `${v.value}${v.unit}`;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (v.type === 'responsive' && v.breakpoints) {
    const bp = v.breakpoints as Record<
      string, { value: number; unit: string }
    >;
    const sizes =
      Object.keys(bp).sort().reverse();
    const largest = bp[sizes[0]];
    return `${largest.value}${largest.unit}`;
  }

  if (v.type === 'transform') {
    return compileTransformValue(v);
  }

  return '';
}
