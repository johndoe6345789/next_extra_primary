/**
 * @file Color math for WCAG contrast and
 *       HSL monochromatic harmony.
 */

/** Linearize an sRGB channel (0-255). */
export const lin = (c: number): number => {
  const s = c / 255;
  return s <= 0.04045
    ? s / 12.92
    : ((s + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2.0 relative luminance. */
export const lum = (
  r: number, g: number, b: number,
): number =>
  0.2126 * lin(r)
  + 0.7152 * lin(g)
  + 0.0722 * lin(b);

/** Parse rgb()/rgba() string to [r, g, b]. */
export const parseRgb = (
  s: string,
): [number, number, number] | null => {
  const m = s.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)/,
  );
  return m
    ? [Number(m[1]), Number(m[2]), Number(m[3])]
    : null;
};

/** WCAG contrast ratio between luminances. */
export const ratio = (
  l1: number, l2: number,
): number => {
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
};

/** Extract hue (0-360) from RGB. */
export const hue = (
  r: number, g: number, b: number,
): number => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  if (max === rn)
    h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn)
    h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return Math.round(h * 60);
};

/**
 * Convert HSL to RGB.
 * @param h - Hue 0-360.
 * @param s - Saturation 0-1.
 * @param l - Lightness 0-1.
 * @returns [r, g, b] each 0-255.
 */
export const hslToRgb = (
  h: number, s: number, l: number,
): [number, number, number] => {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5
    ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hn = h / 360;
  const ch = (t: number): number => {
    const tt = ((t % 1) + 1) % 1;
    if (tt < 1 / 6)
      return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3)
      return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return [
    Math.round(ch(hn + 1 / 3) * 255),
    Math.round(ch(hn) * 255),
    Math.round(ch(hn - 1 / 3) * 255),
  ];
};
