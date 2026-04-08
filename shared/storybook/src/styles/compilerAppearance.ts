/**
 * Appearance compilation for the V2 schema
 * compiler.
 */

import type { Appearance } from './compilerTypes';
import { compileLayer } from './compilerLayers';

/** Compile a gradient definition to CSS. */
export function compileGradient(
  gradient: Record<string, unknown>,
): string {
  const { type, angle, stops } = gradient as {
    type: string;
    angle: number;
    stops: Array<{
      color: { token?: string; value?: string };
      position: number;
    }>;
  };

  const stopStrings = stops.map((stop) => {
    const color = stop.color.token
      ? `var(--color-${stop.color.token})`
      : stop.color.value;
    return `${color} ${stop.position * 100}%`;
  });

  if (type === 'linear') {
    return `linear-gradient(`
      + `${angle}deg, ${stopStrings.join(', ')})`;
  }

  return '';
}

/**
 * Compile all appearance layers to CSS
 * property declarations.
 */
export function compileAppearanceById(
  appearances: Appearance[] | undefined,
  appearanceId: string,
): string {
  const appearance = appearances?.find(
    (a) => a.id === appearanceId,
  );
  if (!appearance) return '';

  const properties: string[] = [];

  const sorted = [...appearance.layers].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  sorted.forEach((layer) => {
    compileLayer(layer, properties);
  });

  if (appearance.clip === 'text') {
    properties.push('  background-clip: text;');
    properties.push(
      '  -webkit-background-clip: text;',
    );
    properties.push(
      '  -webkit-text-fill-color: transparent;',
    );
    properties.push('  color: transparent;');
  }

  return properties.join('\n');
}
