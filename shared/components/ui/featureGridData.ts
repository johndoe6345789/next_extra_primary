/**
 * Feature grid types and helpers.
 * @module components/ui/featureGridData
 */

/** A single feature definition. */
export interface Feature {
  /** Translation key under the features ns. */
  key: string;
  /** Material Symbol icon name. */
  icon: string;
  /** Navigation href. */
  href: string;
}

/** Extract icon names from features. */
export const iconNames = (f: Feature[]) =>
  f.map((item) => item.icon);

/** Extract keys from features. */
export const featureKeys = (f: Feature[]) =>
  f.map((item) => item.key);

/** Build href lookup from features. */
export const featureHrefs = (
  f: Feature[],
): Record<string, string> =>
  Object.fromEntries(
    f.map((item) => [item.key, item.href]),
  );
