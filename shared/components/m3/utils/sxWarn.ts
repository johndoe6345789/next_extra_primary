/**
 * Dev-time warning for the static sx converter.
 *
 * The m3 `sx` util emits inline styles only and cannot
 * resolve MUI's responsive shorthand
 * `{ xs, sm, md, lg, xl }`. When such an object reaches
 * the converter the value silently becomes invalid CSS
 * (`[object Object]`) which the browser drops. This
 * helper turns that silent failure into a console
 * warning during development.
 */

const isPlainObject = (v: unknown): boolean =>
  typeof v === 'object' && v !== null
  && !Array.isArray(v)

/** Track signatures already warned to avoid log spam. */
const warned = new Set<string>()

/**
 * Log once per (key, value) pair when a plain object
 * is passed to a CSS property that the static sx
 * converter cannot handle.
 */
export const warnObjectValue = (
  key: string, value: unknown,
): void => {
  if (process.env.NODE_ENV === 'production') return
  if (!isPlainObject(value)) return
  const sig = `${key}:${JSON.stringify(value)}`
  if (warned.has(sig)) return
  warned.add(sig)
  // eslint-disable-next-line no-console
  console.warn(
    `[m3/sx] Responsive shorthand on "${key}" is not`
    + ' supported by the static sx converter. Use'
    + ' useMediaQuery to pick a value, or pass a'
    + ` concrete value. Got: ${JSON.stringify(value)}`,
  )
}
