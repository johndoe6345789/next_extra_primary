/**
 * Utility to flatten nested translation objects
 * into dot-notation rows for admin display.
 * @module hooks/flattenTranslations
 */

/** Flat row for display. */
export interface TransRow {
  ns: string;
  key: string;
  value: string;
}

/**
 * Recursively flatten a nested object into
 * dot-notation rows under a namespace.
 *
 * @param obj - Nested object to flatten.
 * @param prefix - Current key prefix.
 * @param out - Accumulator array.
 * @param ns - Namespace label.
 */
function flatten(
  obj: Record<string, unknown>,
  prefix: string,
  out: TransRow[],
  ns: string,
): void {
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix
      ? `${prefix}.${k}` : k;
    if (
      typeof v === 'object' && v !== null
    ) {
      flatten(
        v as Record<string, unknown>,
        full, out, ns,
      );
    } else if (typeof v === 'string') {
      out.push({ ns, key: full, value: v });
    }
  }
}

/**
 * Flatten locale translations to rows.
 *
 * @param data - Nested translations object.
 * @returns Array of flat translation rows.
 */
export function flattenTranslations(
  data: Record<string, unknown>,
): TransRow[] {
  const rows: TransRow[] = [];
  for (
    const [ns, block] of Object.entries(data)
  ) {
    if (typeof block === 'object' && block) {
      flatten(
        block as Record<string, unknown>,
        '', rows, ns,
      );
    }
  }
  return rows;
}
