/**
 * Typed M3 design tokens backed by CSS variables.
 *
 * Import `t` and use `t.primary` instead of
 * `'var(--mat-sys-primary)'` to get autocomplete
 * and compile-time safety.
 *
 * @module shared/theme/tokens
 */
import raw from '../constants/theme-tokens.json';

/** Wrap a CSS variable name in `var(...)`. */
const v = (name: string): string =>
  `var(${name})`;

/** Build a record of var()-wrapped tokens. */
function build<T extends Record<string, string>>(
  src: T,
): { [K in keyof T]: string } {
  const out = {} as Record<string, string>;
  for (const [k, val] of Object.entries(src)) {
    out[k] = v(val);
  }
  return out as { [K in keyof T]: string };
}

/** M3 color tokens as CSS var() strings. */
export const color = build(raw.color);

/** M3 shape tokens as CSS var() strings. */
export const shape = build(raw.shape);

/** M3 elevation tokens as CSS var() strings. */
export const elevation = build(raw.elevation);

/**
 * Shorthand — `t.primary` resolves to
 * `'var(--mat-sys-primary)'`.
 */
export const t = {
  ...color,
  ...shape,
  ...elevation,
};

export default t;
