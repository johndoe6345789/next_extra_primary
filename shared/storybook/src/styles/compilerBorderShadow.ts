/**
 * Border and shadow layer compilation helpers.
 */

type PropMap = Record<
  string, Record<string, unknown>
>;

/** Compile border layer properties. */
export function compileBorder(
  p: PropMap, properties: string[],
): void {
  if (p.width) {
    properties.push(
      `  border-width: `
      + `${p.width.value}${p.width.unit};`,
    );
  }
  if (p.style) {
    properties.push(
      `  border-style: ${p.style};`,
    );
  }
  if (p.color) {
    const tk = p.color as { token?: string };
    const c = tk.token
      ? `var(--color-${tk.token})`
      : p.color;
    properties.push(`  border-color: ${c};`);
  }
  if (p.radius) {
    properties.push(
      `  border-radius: `
      + `${p.radius.value}${p.radius.unit};`,
    );
  }
}

/** Compile shadow layer properties. */
export function compileShadow(
  p: PropMap, properties: string[],
): void {
  const shadow = [
    p.offsetX
      ? `${p.offsetX.value}${p.offsetX.unit}`
      : '0',
    p.offsetY
      ? `${p.offsetY.value}${p.offsetY.unit}`
      : '0',
    p.blur
      ? `${p.blur.value}${p.blur.unit}` : '0',
    p.spread
      ? `${p.spread.value}${p.spread.unit}` : '0',
    (p.color as { value?: string })?.value
      || 'rgba(0,0,0,0.1)',
  ].join(' ');
  properties.push(`  box-shadow: ${shadow};`);
}
