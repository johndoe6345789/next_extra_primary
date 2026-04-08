/**
 * Individual layer type compilation helpers.
 */

import type { Layer } from './compilerTypes';
import { compileGradient }
  from './compilerAppearance';
import {
  compileBorder, compileShadow,
} from './compilerBorderShadow';

type PropMap = Record<
  string, Record<string, unknown>
>;

/** Compile a single appearance layer. */
export function compileLayer(
  layer: Layer,
  properties: string[],
): void {
  const p = layer.properties as PropMap;

  if (layer.type === 'background' && p.gradient) {
    const g = compileGradient(p.gradient);
    properties.push(`  background: ${g};`);
  }

  if (layer.type === 'border' && p) {
    compileBorder(p, properties);
  }

  if (layer.type === 'shadow' && p) {
    compileShadow(p, properties);
  }

  if (layer.type === 'foreground' && p.color) {
    compileForeground(p, properties);
  }
}

/** Compile foreground color. */
function compileForeground(
  p: PropMap, properties: string[],
): void {
  const c = p.color as Record<string, unknown>;
  const cv = c.value as
    { token?: string } | string | undefined;
  const color =
    typeof cv === 'object' && cv?.token
      ? `var(--color-${cv.token})`
      : cv;
  properties.push(`  color: ${color};`);
}
